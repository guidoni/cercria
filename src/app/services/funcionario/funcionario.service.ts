import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcionario } from '../../models/Funcionario';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  // URL base da API de funcionarios, usada como prefixo em todas as requisições
  private url: string = 'http://localhost:8080/funcionario';

  // Construtor que injeta o HttpClient, permitindo fazer requisições HTTP
  constructor(private http: HttpClient) {}

  // Método cadastrar um novo funcionario
  cadastrar(f: Funcionario): Observable<Funcionario> {
    // Faz uma requisição POST enviando o objeto funcionario no corpo da requisição
    return this.http.post<Funcionario>(this.url + '/cadastro', f).pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao cadastrar funcionario', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método buscar todos os funcionarios cadastrados
  selecionar(): Observable<Funcionario[]> {
    // Faz uma requisição GET que retorna uma lista de funcionarios
    return this.http.get<Funcionario[]>(this.url + '/listagem').pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao listar funcionarios', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método editar um funcionario existente
  editar(f: Funcionario): Observable<Funcionario> {
    // Faz uma requisição PUT enviando o objeto funcionario atualizado no corpo da requisição
    return this.http.put<Funcionario>(this.url + '/edicao', f).pipe(
      catchError((err) => {
        // Intercepta erros da requisição
        console.error('Erro ao editar funcionario', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método responsável por buscar um funcionario específico pelo seu ID
  buscarPorId(id: number): Observable<Funcionario> {
    // Faz uma requisição GET passando o ID do funcionario diretamente na URL
    return this.http.get<Funcionario>(this.url + '/' + id);
  }

  //Método de remover
  remover(id: number): Observable<void> {
    // Faz uma requisição GET passando o ID do funcionario diretamente na URL
    return this.http.delete<void>(this.url + '/' + id);
  }
}
