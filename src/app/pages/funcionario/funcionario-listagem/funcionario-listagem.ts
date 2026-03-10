import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header'; 
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Funcionario } from '../../../models/Funcionario'; 
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-funcionario-listagem',
  imports: [RouterLink, FormsModule, Header, Sidebar, CommonModule],
  templateUrl: './funcionario-listagem.html',
  styleUrl: './funcionario-listagem.css',
})

export class FuncionarioListagem implements OnInit {
    filtroStatus: string = 'todos';
    funcionarios = signal<Funcionario[]>([]); 

    constructor(private servico: FuncionarioService) {} 

    ngOnInit(): void {
        this.servico.selecionar().subscribe({
            next: (retorno) => {
                this.funcionarios.set(retorno); 
            },
            error: (err) => {
                console.error('erro:', err);
            }
        });
    }

    excluir(id:number){
        const confirmar = confirm("Tem certeza que deseja excluir este funcionário?");
        if(!confirmar){
            return; 
        }
        this.servico.remover(id).subscribe({
            next: () => {
            this.funcionarios.update(lista =>
                lista.filter(f => f.id !== id)
            );
            },
            error: (err) => {
            console.error("Erro ao excluir:", err);
            }
        });

    }
}