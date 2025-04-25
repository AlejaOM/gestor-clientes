import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClienteRead } from '../../core/models/cliente.model';
import { ApiService } from '../../core/services/api.service';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';
import { ClienteCardComponent } from '../cliente-card/cliente-card.component'; // Importación necesaria

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    ClienteCardComponent // <--- AÑADIDO AQUÍ
  ],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  clientesTodos: ClienteRead[] = [];
  clientesMostrados: ClienteRead[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  busquedaActiva: boolean = false;
  mostrarSeccionBusqueda: boolean = true;
  @ViewChild('docInput') docInputRef!: ElementRef<HTMLInputElement>;
  mensajeExito: string | null = null;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.cargarTodosClientes();
  }

  cargarTodosClientes(): void {
    this.isLoading = true;
    this.error = null;
    this.busquedaActiva = false;
    this.apiService.getClientes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.clientesTodos = data;
          this.clientesMostrados = data;
        },
        error: (err) => {
          this.error = err.message || 'Error al cargar los clientes.';
          this.clientesMostrados = [];
          this.clientesTodos = [];
        }
      });
  }

  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(ClienteFormComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarTodosClientes();
        this.mostrarMensajeExito('Cliente creado exitosamente.');
      }
    });
  }

  abrirModalEditar(cliente: ClienteRead): void {
    if (!cliente) return;
    const dialogRef = this.dialog.open(ClienteFormComponent, {
      width: '600px',
      disableClose: true,
      data: cliente
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.cargarTodosClientes();
        this.mostrarMensajeExito('Cliente actualizado exitosamente.');
      }
    });
  }

  mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.error = null;
    setTimeout(() => {
      this.mensajeExito = null;
    }, 4000);
  }

  buscarCliente(documento: string): void {
     this.mensajeExito = null;
     const docTrimmed = documento?.trim();
     if (!docTrimmed) {
       this.limpiarBusqueda();
       return;
     }
     this.isLoading = true;
     this.error = null;
     this.busquedaActiva = true;
     this.apiService.getCliente(docTrimmed)
       .pipe(finalize(() => this.isLoading = false))
       .subscribe({
         next: (clienteEncontrado) => {
           this.clientesMostrados = [clienteEncontrado];
           this.error = null;
         },
         error: (err) => {
            if (err.status === 404 || err.message?.includes('404')) {
              this.error = `No se encontró cliente con documento ${docTrimmed}.`;
              this.clientesMostrados = [];
            } else {
              this.error = err.message || 'Error al buscar el cliente.';
              this.clientesMostrados = [];
            }
         }
       });
  }

  limpiarBusqueda(): void {
     this.mensajeExito = null;
     this.clientesMostrados = this.clientesTodos;
     this.error = null;
     this.busquedaActiva = false;
     if (this.docInputRef) {
         this.docInputRef.nativeElement.value = '';
     }
  }
}