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
   //URL da API
    private url:string = 'http://localhost:8080/medicamento';
  
    //Construtor
    constructor(private http:HttpClient) {

    }

    //Método de cadastrar
    cadastrar(m: Medicamento): Observable<Medicamento> {
          return this.http.post<Medicamento>(this.url + '/cadastro', m)
            .pipe(
              catchError(err => {
                console.error('Erro ao cadastrar medicamento', err);
                return throwError(() => err);
              })
            );
      }

    //Método de listar
    selecionar(): Observable<Medicamento[]> {
      return this.http.get<Medicamento[]>(this.url + '/listagem')
        .pipe(
          catchError(err => {
            console.error('Erro ao listar medicamentos', err);
            return throwError(() => err);
          })
        );
    }

    //Método de editar
    editar(m: Medicamento): Observable<Medicamento> {
          return this.http.put<Medicamento>(this.url + '/edicao', m)
            .pipe(
              catchError(err => {
                console.error('Erro ao editar medicamento', err);
                return throwError(() => err);
              })
            );
        }
    
    buscarPorId(id:number): Observable<Medicamento>{
      return this.http.get<Medicamento>(this.url + '/' + id);
    }

    //Método de remover
    remover(id:number):Observable<void>{
      return this.http.delete<void>(this.url + '/' + id);
    }
}
