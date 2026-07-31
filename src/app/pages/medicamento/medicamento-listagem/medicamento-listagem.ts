import { Component, OnInit, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Medicamento } from '../../../models/Medicamento';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento-listagem',
  imports: [RouterLink, FormsModule, Header, CommonModule, Sidebar],
  templateUrl: './medicamento-listagem.html',
  styleUrl: './medicamento-listagem.css',
})
export class MedicamentoListagem implements OnInit {
  // Signals para armazenar listas vindas dos serviços
  medicamentos = signal<Medicamento[]>([]);

  // Injeção do serviço responsável pelas operações com medicamentos
  private servico = inject(MedicamentoService);
  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    this.servico.selecionar().subscribe({
      next: (lista) => {
        this.medicamentos.set(lista);
        this.medicamentosFiltro.set(lista);
        this.medicamentosFiltrados.set(lista);
      },
      error: (err) => {
        console.error('erro:', err);
      },
    });
  }

  // Configuração do card
  medicamentoSelecionado = signal<Medicamento | null>(null);

  abrirDetalhes(medicamento: Medicamento) {
    this.medicamentoSelecionado.set(medicamento);
  }

  fecharDetalhes() {
    this.medicamentoSelecionado.set(null);
  }

  // Filtro
  filtroNome: string = '';

  // Signals para armazenar listas vindas dos serviços
  medicamentosFiltro = signal<Medicamento[]>([]);
  medicamentosFiltrados = signal<Medicamento[]>([]);

  filtrar() {
    const lista = this.medicamentosFiltro();

    const filtrados = lista.filter((m) =>
      m.nome.toLowerCase().includes(this.filtroNome.toLowerCase()),
    );

    this.medicamentosFiltrados.set(filtrados);
  }

  //Método excluir
  excluir(id: number): void {
    Swal.fire({
      title: 'Excluir medicamento?',
      text: 'Essa ação não poderá ser revertida.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servico.remover(id).subscribe({
          next: () => {
            this.servico.selecionar().subscribe({
              next: (retorno) => this.medicamentos.set(retorno),
            });

            this.toastr.success('Medicamento excluído com sucesso!');
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Erro ao remover medicamento.');
          },
        });
      }
    });
  }
}
