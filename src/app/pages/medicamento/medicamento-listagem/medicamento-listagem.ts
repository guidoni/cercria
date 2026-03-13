import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header'; 
import { Medicamento } from '../../../models/Medicamento';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medicamento-listagem',
  imports: [RouterLink, FormsModule, Header, CommonModule],
  templateUrl: './medicamento-listagem.html',
  styleUrl: './medicamento-listagem.css',
})
export class MedicamentoListagem implements OnInit{
    medicamentos = signal<Medicamento[]>([]); 

    constructor(private servico: MedicamentoService, private toastr: ToastrService) {} 

    ngOnInit(): void {
        this.servico.selecionar().subscribe({
            next: (retorno) => {
                this.medicamentos.set(retorno); 
            },
            error: (err) => {
                console.error('erro:', err);
            }
        });
    }

    excluir(id:number){
        const confirmar = confirm("Tem certeza que deseja excluir este medicamento?");
        if(!confirmar){
            return; 
        }
        this.servico.remover(id).subscribe({
            next: () => {
            this.medicamentos.update(lista =>
                lista.filter(m => m.id !== id)
            );
            this.toastr.success("Medicamento excluído com sucesso!");
            },
            error: (err) => {
                console.error("Erro ao excluir:", err);
            }
        });

    }

    //Configuração do card
    medicamentoSelecionado = signal<Medicamento | null>(null);

    abrirDetalhes(medicamento: Medicamento){
        this.medicamentoSelecionado.set(medicamento);
    }

    fecharDetalhes(){
        this.medicamentoSelecionado.set(null);
    }

    //Filtro
   
}
