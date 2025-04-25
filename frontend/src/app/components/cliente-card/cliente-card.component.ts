import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClienteRead } from '../../core/models/cliente.model';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-cliente-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './cliente-card.component.html',
  styleUrls: ['./cliente-card.component.css']
})
export class ClienteCardComponent {

  @Input() cliente!: ClienteRead;
  @Output() editar = new EventEmitter<ClienteRead>();
  @Output() estadoActualizado = new EventEmitter<void>();

  isUpdatingEstado: boolean = false;
  errorEstado: string | null = null;

  constructor(private apiService: ApiService) {}

  lanzarEdicion(): void {
    this.editar.emit(this.cliente);
  }

  onEstadoChange(event: MatSlideToggleChange): void {
    const nuevoEstado = event.checked;
    this.isUpdatingEstado = true;
    this.errorEstado = null;

    this.apiService.updateEstadoCliente(this.cliente.documento, { estado: nuevoEstado })
      .pipe(finalize(() => this.isUpdatingEstado = false))
      .subscribe({
        next: (clienteActualizado) => {
          this.cliente.estado = clienteActualizado.estado;
        },
        error: (err) => {
          this.errorEstado = err.message || 'Error al cambiar estado.';
          event.source.checked = !nuevoEstado;
        }
      });
  }
}