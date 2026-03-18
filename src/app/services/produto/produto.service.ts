import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../../models/Produto';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  //URL da API
  private url: string = 'http://localhost:8080/produto';

  //Construtor
  constructor(private http: HttpClient) {}

  //Método de cadastrar
  cadastrar(p: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.url + '/cadastro', p).pipe(
      catchError((err) => {
        console.error('Erro ao cadastrar produto', err);
        return throwError(() => err);
      }),
    );
  }

  //Método de listar
  selecionar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url + '/listagem').pipe(
      catchError((err) => {
        console.error('Erro ao listar medicamentos', err);
        return throwError(() => err);
      }),
    );
  }

  //Método de editar
  editar(p: Produto): Observable<Produto> {
    return this.http.put<Produto>(this.url + '/edicao', p).pipe(
      catchError((err) => {
        console.error('Erro ao editar produto', err);
        return throwError(() => err);
      }),
    );
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(this.url + '/' + id);
  }

  //Método de remover
  remover(id: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + id);
  }
}
