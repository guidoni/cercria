import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntradaMedicamento } from '../../models/EntradaMedicamento';

@Injectable({ providedIn: 'root' })
export class EntradaMedicamentoService {
  private url = 'http://localhost:8080/entrada-medicamento';
  private http = inject(HttpClient);

  cadastrar(e: EntradaMedicamento): Observable<EntradaMedicamento> {
    return this.http.post<EntradaMedicamento>(this.url + '/cadastro', e).pipe(
      catchError((err) => {
        console.error('Erro ao cadastrar entrada', err);
        return throwError(() => err);
      }),
    );
  }

  listarPorMedicamento(medicamentoId: number): Observable<EntradaMedicamento[]> {
    return this.http.get<EntradaMedicamento[]>(`${this.url}/medicamento/${medicamentoId}`);
  }

  buscarPorId(id: number): Observable<EntradaMedicamento> {
    return this.http.get<EntradaMedicamento>(`${this.url}/${id}`);
  }

  editar(e: EntradaMedicamento): Observable<EntradaMedicamento> {
    return this.http.put<EntradaMedicamento>(this.url + '/edicao', e).pipe(
      catchError((err) => {
        console.error('Erro ao editar entrada', err);
        return throwError(() => err);
      }),
    );
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
