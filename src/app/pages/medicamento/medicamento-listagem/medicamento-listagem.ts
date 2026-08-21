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
import { MedicamentoEstoqueService } from '../../../services/medicamento/estoque-medicamento.service';
import { ControleMedicamentoService } from '../../../services/medicamento/medicamento-controle.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-medicamento-listagem',
  imports: [RouterLink, FormsModule, Header, CommonModule, Sidebar],
  templateUrl: './medicamento-listagem.html',
  styleUrl: './medicamento-listagem.css',
})
export class MedicamentoListagem implements OnInit {
  // Signals para armazenar listas vindas dos serviços
  medicamentos = signal<Medicamento[]>([]);
  quantidades: { [medicamentoId: number]: number } = {};

  // Injeção do serviço responsável pelas operações com medicamentos
  private servico = inject(MedicamentoService);
  private estoqueService = inject(MedicamentoEstoqueService);

  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.servico.selecionar().subscribe({
      next: (lista) => {
        this.medicamentos.set(lista);
        this.medicamentosFiltro.set(lista);
        this.medicamentosFiltrados.set(lista);

        // Busca a quantidade disponível de cada medicamento
        lista.forEach((medicamento) => {
          this.estoqueService.listarPorMedicamento(medicamento.id!).subscribe({
            next: (entradas) => {
              this.quantidades[medicamento.id!] = entradas.reduce(
                (total, entrada) => total + (entrada.quantidade_atual ?? 0),
                0,
              );
            },
            error: (err) => {
              console.error(`Erro ao buscar estoque do medicamento ${medicamento.id}:`, err);
              this.quantidades[medicamento.id!] = 0;
            },
          });
        });
      },
      error: (err) => {
        console.error('Erro ao carregar medicamentos:', err);
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
              next: (retorno) => {
                // Atualiza TODAS as listas utilizadas pela tela
                this.medicamentos.set(retorno);
                this.medicamentosFiltro.set(retorno);
                this.medicamentosFiltrados.set(retorno);

                // Volta para a primeira página se necessário
                if (this.paginaAtual > this.totalPaginas) {
                  this.paginaAtual = Math.max(1, this.totalPaginas);
                }
              },
              error: (err) => {
                console.error(err);
                this.toastr.error('Erro ao atualizar a lista.');
              },
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

  //Paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 5;

  // Total de páginas
  get totalPaginas(): number {
    return Math.ceil(this.medicamentosFiltrados().length / this.itensPorPagina);
  }

  // Medicamentos da página atual
  medicamentosPaginados(): Medicamento[] {
    const lista = this.medicamentosFiltrados();
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return lista.slice(inicio, fim);
  }

  get paginasVisiveis(): (number | string)[] {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;

    // Nenhuma página
    if (total === 0) {
      return [];
    }

    // Até 5 páginas
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Começo
    // 1 2 3 ... 10
    if (atual <= 3) {
      return [1, 2, 3, '...', total];
    }

    // Final
    // 1 ... 8 9 10
    if (atual >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }

    // Meio
    // 1 ... 4 5 6 ... 10
    return [1, '...', atual - 1, atual, atual + 1, '...', total];
  }

  irParaPagina(pagina: number | string): void {
    if (typeof pagina === 'string') {
      return;
    }

    if (pagina < 1 || pagina > this.totalPaginas) {
      return;
    }

    this.paginaAtual = pagina;
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
    }
  }
}
