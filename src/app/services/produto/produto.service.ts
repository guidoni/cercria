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
  // URL base da API de produtos, usada como prefixo em todas as requisições
  private url: string = 'http://localhost:8080/produto';

  // Construtor que injeta o HttpClient, permitindo fazer requisições HTTP
  constructor(private http: HttpClient) {}

  // Método cadastrar um novo produto
  cadastrar(p: Produto): Observable<Produto> {
    // Faz uma requisição POST enviando o objeto produto no corpo da requisição
    return this.http.post<Produto>(this.url + '/cadastro', p).pipe(
      // Intercepta erros da requisição
      catchError((err) => {
        console.error('Erro ao cadastrar produto', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método buscar todos os produtos cadastrados
  selecionar(): Observable<Produto[]> {
    // Faz uma requisição GET que retorna uma lista de produtos
    return this.http.get<Produto[]>(this.url + '/listagem').pipe(
      // Intercepta erros da requisição
      catchError((err) => {
        console.error('Erro ao listar produtos', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método editar um produto existente
  editar(p: Produto): Observable<Produto> {
    // Faz uma requisição PUT enviando o objeto produto atualizado no corpo da requisição
    return this.http.put<Produto>(this.url + '/edicao', p).pipe(
      // Intercepta erros da requisição
      catchError((err) => {
        console.error('Erro ao editar produto', err);
        // Relança o erro para que o componente que chamou o método possa tratá-lo
        return throwError(() => err);
      }),
    );
  }

  // Método responsável por buscar um produto específico pelo seu ID
  buscarPorId(id: number): Observable<Produto> {
    // Faz uma requisição GET passando o ID do produto diretamente na URL
    return this.http.get<Produto>(this.url + '/' + id);
  }

  // Método responsável por remover um produto pelo seu ID
  remover(id: number): Observable<void> {
    // Faz uma requisição DELETE passando o ID do produto diretamente na URL
    return this.http.delete<void>(this.url + '/' + id);
  }
}
