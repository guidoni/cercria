import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Acolhido } from '../../models/Acolhido';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AcolhidoService {
  // URL base da API de acolhidos, usada como prefixo em todas as requisições
  private url: string = `${environment.apiUrl}/acolhido`;

  // Construtor que injeta o HttpClient, permitindo fazer requisições HTTP
  constructor(private http: HttpClient) {}

  // Método cadastrar um novo acolhido
  cadastrar(a: Acolhido): Observable<Acolhido> {
    // Faz uma requisição POST enviando o objeto acolhido no corpo da requisição
    return this.http.post<Acolhido>(this.url + '/cadastro', a).pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao cadastrar acolhido', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método buscar todos os acolhidos cadastrados
  selecionar(): Observable<Acolhido[]> {
    // Faz uma requisição GET que retorna uma lista de acolhidos
    return this.http.get<Acolhido[]>(this.url + '/listagem').pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao listar acolhidos', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método editar um acolhido existente
  editar(a: Acolhido): Observable<Acolhido> {
    // Faz uma requisição PUT enviando o objeto acolhido atualizado no corpo da requisição
    return this.http.put<Acolhido>(this.url + '/edicao', a).pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao editar acolhido', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método responsável por buscar um acolhido específico pelo seu ID
  buscarPorId(id: number): Observable<Acolhido> {
    // Faz uma requisição GET passando o ID do acolhido diretamente na URL
    return this.http.get<Acolhido>(this.url + '/' + id);
  }

  // Método de remover (exclusão lógica)
  remover(id: number): Observable<any> {
    return this.http.put<any>(this.url + '/excluir/' + id, {});
  }
}
