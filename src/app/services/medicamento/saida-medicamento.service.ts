import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SaidaMedicamento } from '../../models/SaidaMedicamento';

@Injectable({ providedIn: 'root' })
export class SaidaMedicamentoService {
  private url = 'http://localhost:8080/saida-medicamento';
  private http = inject(HttpClient);

  cadastrar(s: SaidaMedicamento): Observable<SaidaMedicamento> {
    return this.http.post<SaidaMedicamento>(`${this.url}/cadastro`, s).pipe(
      catchError((err) => {
        console.error('Erro ao cadastrar saída', err);
        return throwError(() => err);
      }),
    );
  }

  listarPorMedicamento(medicamentoId: number): Observable<SaidaMedicamento[]> {
    return this.http.get<SaidaMedicamento[]>(`${this.url}/medicamento/${medicamentoId}`).pipe(
      catchError((err) => {
        console.error('Erro ao listar saídas', err);
        return throwError(() => err);
      }),
    );
  }

  buscarPorId(id: number): Observable<SaidaMedicamento> {
    return this.http.get<SaidaMedicamento>(`${this.url}/${id}`);
  }

  editar(s: SaidaMedicamento): Observable<SaidaMedicamento> {
    return this.http.put<SaidaMedicamento>(`${this.url}/edicao`, s).pipe(
      catchError((err) => {
        console.error('Erro ao editar saída', err);
        return throwError(() => err);
      }),
    );
  }
}
