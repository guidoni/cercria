import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Evento } from '../../models/Evento';

@Injectable({
  providedIn: 'root',
})
export class EventoService {
  // URL base da API de eventos
  private url: string = 'http://localhost:8080/evento';

  // Injeta o HttpClient para realizar as requisições HTTP
  constructor(private http: HttpClient) {}

  // Cadastrar um novo evento

  cadastrar(e: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.url + '/cadastro', e).pipe(
      catchError((err) => {
        console.error('Erro ao cadastrar evento', err);
        return throwError(() => err);
      }),
    );
  }

  // Listar todos os eventos

  selecionar(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.url + '/listagem').pipe(
      catchError((err) => {
        console.error('Erro ao listar eventos', err);
        return throwError(() => err);
      }),
    );
  }

  // Editar um evento existente

  editar(e: Evento): Observable<Evento> {
    return this.http.put<Evento>(this.url + '/edicao', e).pipe(
      catchError((err) => {
        console.error('Erro ao editar evento', err);
        return throwError(() => err);
      }),
    );
  }

  // Buscar evento por ID
  buscarPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(this.url + '/' + id).pipe(
      catchError((err) => {
        console.error('Erro ao buscar evento por ID', err);
        return throwError(() => err);
      }),
    );
  }

  // Remover um evento
  remover(id: number): Observable<void> {
    return this.http.delete<void>(this.url + '/' + id).pipe(
      catchError((err) => {
        console.error('Erro ao remover evento', err);
        return throwError(() => err);
      }),
    );
  }
}
