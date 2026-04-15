import { Component, OnInit, signal } from '@angular/core';
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
  medicamentos = signal<Medicamento[]>([]);

  constructor(
    private servico: MedicamentoService,
    private toastr: ToastrService,
  ) {}

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

  excluir(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Esse medicamento será excluído!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.servico.remover(id).subscribe({
          next: () => {
            this.medicamentos.update((lista) => lista.filter((m) => m.id !== id));
            this.medicamentosFiltro.update((lista) => lista.filter((m) => m.id !== id));
            this.medicamentosFiltrados.update((lista) => lista.filter((m) => m.id !== id));

            this.toastr.success('Medicamento excluído com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao excluir:', err);
          },
        });
      }
    });
  }

  //Configuração do card
  medicamentoSelecionado = signal<Medicamento | null>(null);

  abrirDetalhes(medicamento: Medicamento) {
    this.medicamentoSelecionado.set(medicamento);
  }

  fecharDetalhes() {
    this.medicamentoSelecionado.set(null);
  }

  //Filtro
  filtroNome: string = '';

  medicamentosFiltro = signal<Medicamento[]>([]);
  medicamentosFiltrados = signal<Medicamento[]>([]);

  filtrar() {
    const lista = this.medicamentosFiltro();

    const filtrados = lista.filter((m) =>
      m.nome.toLowerCase().includes(this.filtroNome.toLowerCase()),
    );

    this.medicamentosFiltrados.set(filtrados);
  }
}
