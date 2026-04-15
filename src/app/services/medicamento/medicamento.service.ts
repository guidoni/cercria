import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicamento } from '../../models/Medicamento';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MedicamentoService {
  // URL base da API de medicamentos, usada como prefixo em todas as requisições
  private url: string = 'http://localhost:8080/medicamento';

  // Construtor que injeta o HttpClient, permitindo fazer requisições HTTP
  constructor(private http: HttpClient) {}

  // Método cadastrar um novo medicamento
  cadastrar(m: Medicamento): Observable<Medicamento> {
    // Faz uma requisição POST enviando o objeto medicamento no corpo da requisição
    return this.http.post<Medicamento>(this.url + '/cadastro', m).pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao cadastrar medicamento', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método buscar todos os medicamentos cadastrados
  selecionar(): Observable<Medicamento[]> {
    // Faz uma requisição GET que retorna uma lista de medicamentos
    return this.http.get<Medicamento[]>(this.url + '/listagem').pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao listar medicamentos', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método editar um medicamento existente
  editar(m: Medicamento): Observable<Medicamento> {
    // Faz uma requisição PUT enviando o objeto medicamento atualizado no corpo da requisição
    return this.http.put<Medicamento>(this.url + '/edicao', m).pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao editar medicamento', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método responsável por buscar um medicamento específico pelo seu ID
  buscarPorId(id: number): Observable<Medicamento> {
    // Faz uma requisição GET passando o ID do medicamento diretamente na URL
    return this.http.get<Medicamento>(this.url + '/' + id);
  }

  //Método de remover
  remover(id: number): Observable<void> {
    // Faz uma requisição GET passando o ID do medicamento diretamente na URL
    return this.http.delete<void>(this.url + '/' + id);
  }
}
