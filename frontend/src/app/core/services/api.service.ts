import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'; 
import { Observable, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators'; 
import { environment } from '../../../environments/environmen';
import { ClienteRead, ClienteCreate, ClienteUpdate, EstadoUpdate } from '../models/cliente.model'; 
import { CondicionPagoRead } from '../models/condicion-pago.model'; 
import { MedioPagoRead } from '../models/medio-pago.model'; 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  getClientes(): Observable<ClienteRead[]> {
    return this.http.get<ClienteRead[]>(`${this.apiUrl}/clientes/`)
      .pipe(catchError(this.handleError)); 
  }

  getCliente(documento: string): Observable<ClienteRead> {
    return this.http.get<ClienteRead>(`${this.apiUrl}/clientes/${documento}`)
      .pipe(catchError(this.handleError));
  }

  createCliente(cliente: ClienteCreate): Observable<ClienteRead> {
    return this.http.post<ClienteRead>(`${this.apiUrl}/clientes/`, cliente, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateCliente(documento: string, cliente: ClienteUpdate): Observable<ClienteRead> {
    // Asegúrate que el payload coincida con ClienteUpdate
    return this.http.put<ClienteRead>(`${this.apiUrl}/clientes/${documento}`, cliente, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateEstadoCliente(documento: string, estadoUpdate: EstadoUpdate): Observable<ClienteRead> {
    // Asegúrate que el payload coincida con EstadoUpdate ({ estado: boolean })
    return this.http.patch<ClienteRead>(`${this.apiUrl}/clientes/${documento}/estado`, estadoUpdate, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // --- Métodos para Catálogos ---

  getCondicionesPago(): Observable<CondicionPagoRead[]> {
    return this.http.get<CondicionPagoRead[]>(`${this.apiUrl}/condiciones`)
      .pipe(catchError(this.handleError));
  }

  getMediosPago(): Observable<MedioPagoRead[]> {
    return this.http.get<MedioPagoRead[]>(`${this.apiUrl}/medios-pago`)
      .pipe(catchError(this.handleError));
  }


  // --- Manejador de Errores Privado ---
  private handleError(error: HttpErrorResponse): Observable<never> {
    // 'never' indica que esta función nunca emitirá un valor exitoso

    let errorMessage = 'Ocurrió un error desconocido.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red
      console.error('Error de red o cliente:', error.error.message);
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      // El backend devolvió un código de error
      console.error(
        `Backend devolvió código ${error.status}, ` +
        `body era: ${JSON.stringify(error.error)}`);

      // Intenta extraer el mensaje de detalle de FastAPI (errores 4xx)
      if (error.status >= 400 && error.status < 500 && error.error && error.error.detail) {
         // Para errores 422 de validación Pydantic, 'detail' puede ser un array
         if (Array.isArray(error.error.detail)) {
            const validationErrors = error.error.detail.map((e: any) => `${e.loc.join(' -> ')}: ${e.msg}`).join('; ');
            errorMessage = `Error de validación: ${validationErrors}`;
         } else {
            // Para otros errores 4xx con 'detail' como string
            errorMessage = `Error ${error.status}: ${error.error.detail}`;
         }
      } else {
        // Errores 5xx u otros
         errorMessage = `Error ${error.status}: ${error.statusText}. ${error.message}`;
      }
    }

    // Devuelve un observable que emite el error para que el componente lo maneje
    // Se usa una función factory para throwError según la versión de RxJS
    return throwError(() => new Error(errorMessage));
  }
}