import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Patrimonio } from '../../models/Patrimonio';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatrimonioService {
  // URL base da API de patrimônio
  private url: string = `${environment.apiUrl}/patrimonio`;

  // Injeta o HttpClient para realizar as requisições HTTP
  constructor(private http: HttpClient) {}

  // Cadastrar um novo patrimônio

  cadastrar(p: Patrimonio): Observable<Patrimonio> {
    return this.http.post<Patrimonio>(this.url + '/cadastro', p).pipe(
      catchError((err) => {
        console.error('Erro ao cadastrar patrimônio', err);
        return throwError(() => err);
      }),
    );
  }

  // Listar todos os patrimônio

  selecionar(): Observable<Patrimonio[]> {
    return this.http.get<Patrimonio[]>(this.url + '/listagem').pipe(
      catchError((err) => {
        console.error('Erro ao listar patrimônio', err);
        return throwError(() => err);
      }),
    );
  }

  // Editar um patrimônio existente

  editar(p: Patrimonio): Observable<Patrimonio> {
    return this.http.put<Patrimonio>(this.url + '/edicao', p).pipe(
      catchError((err) => {
        console.error('Erro ao editar patrimônio', err);
        return throwError(() => err);
      }),
    );
  }

  // Buscar patrimônio por ID
  buscarPorId(id: number): Observable<Patrimonio> {
    return this.http.get<Patrimonio>(this.url + '/' + id).pipe(
      catchError((err) => {
        console.error('Erro ao buscar patrimônio por ID', err);
        return throwError(() => err);
      }),
    );
  }

  // Método de remover (exclusão lógica)
  remover(id: number): Observable<any> {
    return this.http.put<any>(this.url + '/excluir/' + id, {});
  }
}
