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

    //URL da API
    private url:string = 'http://localhost:8080/funcionario';
  
    //Construtor
    constructor(private http:HttpClient) {

    }

    //Método de listar
    selecionar(): Observable<Funcionario[]> {
      return this.http.get<Funcionario[]>(this.url + '/listagem')
        .pipe(
          catchError(err => {
            console.error('Erro ao listar funcionários', err);
            return throwError(() => err);
          })
        );
    }

    //Método de cadastrar
    cadastrar(f: Funcionario): Observable<Funcionario> {
      return this.http.post<Funcionario>(this.url + '/cadastro', f)
        .pipe(
          catchError(err => {
            console.error('Erro ao cadastrar funcionário', err);
            return throwError(() => err);
          })
        );
    }

    //Método de editar
    editar(f: Funcionario): Observable<Funcionario> {
      return this.http.put<Funcionario>(this.url + '/edicao', f)
        .pipe(
          catchError(err => {
            console.error('Erro ao editar funcionário', err);
            return throwError(() => err);
          })
        );
    }

    buscarPorId(id:number): Observable<Funcionario>{
      return this.http.get<Funcionario>(this.url + '/' + id);
    }

    //Método de remover
    remover(id:number):Observable<void>{
      return this.http.delete<void>(this.url + '/' + id);
    }
}
