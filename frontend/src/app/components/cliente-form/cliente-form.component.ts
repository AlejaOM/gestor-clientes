import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, finalize, tap } from 'rxjs';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../core/services/api.service';
import { ClienteRead, ClienteCreate, ClienteUpdate, Ciudad } from '../../core/models/cliente.model';
import { CondicionPagoRead } from '../../core/models/condicion-pago.model';
import { MedioPagoRead } from '../../core/models/medio-pago.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatIconModule
  ],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  clienteForm: FormGroup;
  condicionesPago$!: Observable<CondicionPagoRead[]>;
  mediosPago$!: Observable<MedioPagoRead[]>;
  ciudades = Object.values(Ciudad);
  isEditMode: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;

  readonly ID_CONTADO = 1;
  readonly ID_CREDITO = 2;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ClienteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteRead | null
  ) {
    this.isEditMode = !!this.data;

    this.clienteForm = this.fb.group({
      documento: ['', [Validators.required, Validators.maxLength(12)]],
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      apellido_1: ['', [Validators.required, Validators.maxLength(50)]],
      apellido_2: ['', [Validators.maxLength(50)]],
      direccion: ['', [Validators.maxLength(100)]],
      telefono: ['', [Validators.maxLength(10), Validators.pattern('^[0-9]{10}$')]],
      correo_electronico: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      ciudad: [null, Validators.required],
      id_condicion_pago: [null, Validators.required],
      valor_cupo: [{ value: 0.00, disabled: true }, [Validators.required, Validators.min(0.01), Validators.max(99999999999.99)]],
      id_medio_pago: [{ value: null, disabled: true }, Validators.required],
      estado: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCatalogs();
    this.setupConditionalFields();

    if (this.isEditMode && this.data) {
      this.clienteForm.patchValue(this.data);
      const valorCupo = Number(this.data.valor_cupo);
      this.clienteForm.get('valor_cupo')?.setValue(isNaN(valorCupo) ? 0.00 : valorCupo);
      this.clienteForm.get('documento')?.disable();
      this.handleCondicionPagoChange(this.data.id_condicion_pago);
    } else {
       this.handleCondicionPagoChange(null);
    }
  }

  loadCatalogs(): void {
    this.condicionesPago$ = this.apiService.getCondicionesPago();
    this.mediosPago$ = this.apiService.getMediosPago();
  }

  setupConditionalFields(): void {
    this.clienteForm.get('id_condicion_pago')?.valueChanges.subscribe(idCondicion => {
      this.handleCondicionPagoChange(idCondicion);
    });
  }

  handleCondicionPagoChange(idCondicion: number | null): void {
    const valorCupoControl = this.clienteForm.get('valor_cupo');
    const medioPagoControl = this.clienteForm.get('id_medio_pago');

    if (idCondicion == this.ID_CONTADO) {
        valorCupoControl?.setValue(0.00);
        valorCupoControl?.disable();
        valorCupoControl?.clearValidators();
        medioPagoControl?.enable();
        medioPagoControl?.setValidators([Validators.required]);
    } else if (idCondicion == this.ID_CREDITO) {
        valorCupoControl?.enable();
        valorCupoControl?.setValidators([Validators.required, Validators.min(0.01)]);
        medioPagoControl?.setValue(null);
        medioPagoControl?.disable();
        medioPagoControl?.clearValidators();
    } else {
        valorCupoControl?.disable();
        medioPagoControl?.disable();
        valorCupoControl?.clearValidators();
        medioPagoControl?.clearValidators();
    }
    valorCupoControl?.updateValueAndValidity();
    medioPagoControl?.updateValueAndValidity();
  }

  guardar(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.error = "Por favor, verifique los campos en el formulario.";
      return;
    }

    this.isLoading = true;
    this.error = null;

    const formData = this.clienteForm.getRawValue();
    const tel = formData.telefono?.trim();
    let request$: Observable<ClienteRead>;

    if (this.isEditMode) {
      const updatePayload: ClienteUpdate = {
        nombre: formData.nombre,
        apellido_1: formData.apellido_1,
        apellido_2: formData.apellido_2,
        direccion: formData.direccion,
        telefono: tel ? tel : null, 
        correo_electronico: formData.correo_electronico,
        ciudad: formData.ciudad,
        id_condicion_pago: formData.id_condicion_pago,
        valor_cupo: formData.valor_cupo ? formData.valor_cupo.toString() : '0.00',
        id_medio_pago: formData.id_medio_pago,
        estado: formData.estado
      };
      request$ = this.apiService.updateCliente(this.data!.documento, updatePayload);
    } else {
       const createPayload: ClienteCreate = {
        documento: formData.documento,
        nombre: formData.nombre,
        apellido_1: formData.apellido_1,
        apellido_2: formData.apellido_2,
        direccion: formData.direccion,
        telefono: tel ? tel : null, 
        correo_electronico: formData.correo_electronico,
        ciudad: formData.ciudad,
        id_condicion_pago: formData.id_condicion_pago,
        valor_cupo: formData.valor_cupo ? formData.valor_cupo.toString() : '0.00',
        id_medio_pago: formData.id_medio_pago,
        estado: formData.estado
      };
      request$ = this.apiService.createCliente(createPayload);
    }

    request$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (clienteGuardado) => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.error = err.message || 'Ocurrió un error al guardar.';
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  get f() { return this.clienteForm.controls; }
}