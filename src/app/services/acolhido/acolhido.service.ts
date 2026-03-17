import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Acolhido } from '../../models/Acolhido';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcolhidoService {
  //URL da API
  private url: string = 'http://localhost:8080/acolhido';

  //Construtor
  constructor(private http: HttpClient) {}

  //Método de listar
  selecionar(): Observable<Acolhido[]> {
    return this.http.get<Acolhido[]>(this.url + '/listagem').pipe(
      catchError((err) => {
        console.error('Erro ao listar acolhidos', err);
        return throwError(() => err);
      }),
    );
  }

  //Método de cadastrar
  cadastrar(a: Acolhido): Observable<Acolhido> {
    return this.http.post<Acolhido>(this.url + '/cadastro', a).pipe(
      catchError((err) => {
        console.error('Erro ao cadastrar acolhido', err);
        return throwError(() => err);
      }),
    );
  }

  //Método de editar
  editar(a: Acolhido): Observable<Acolhido> {
    return this.http.put<Acolhido>(this.url + '/edicao', a).pipe(
      catchError((err) => {
        console.error('Erro ao editar acolhido', err);
        return throwError(() => err);
      }),
    );
  }

  buscarPorId(id: number): Observable<Acolhido> {
    return this.http.get<Acolhido>(this.url + '/' + id);
  }

  //Método de remover
  remover(id: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + id);
  }
}
