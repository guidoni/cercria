import { Component, OnInit, signal, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Produto } from '../../../models/Produto';
import { ProdutoService } from '../../../services/produto/produto.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ControleProdutoService } from '../../../services/produto/controle-produto.service';

@Component({
  selector: 'app-produto-listagem',
  imports: [RouterLink, FormsModule, Header, CommonModule, Sidebar],
  templateUrl: './produto-listagem.html',
  styleUrl: './produto-listagem.css',
})
export class ProdutoListagem implements OnInit {
  // Signal para armazenar lista vinda dos serviço
  produtos = signal<Produto[]>([]);

  // Injeção do serviço responsável pelas operações com produto
  private servico = inject(ProdutoService);
  private controleService = inject(ControleProdutoService);
  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}
  quantidades: { [produtoId: number]: number } = {};

  ngOnInit(): void {
    this.servico.selecionar().subscribe({
      next: (lista) => {
        this.produtos.set(lista);
        this.produtosFiltro.set(lista);
        this.produtosFiltrados.set(lista);

        lista.forEach((produto) => {
          this.controleService.listarPorProduto(produto.id).subscribe({
            next: (entradas) => {
              //entradas.forEach((e) => console.log(e.quantidadeAtual));
              this.quantidades[produto.id] = entradas.reduce(
                (total, e) => total + (e.quantidadeAtual ?? 0),
                0,
              );
              this.cdr.detectChanges();
            },
          });
        });
      },
    });
  }

  // Configuração do card
  produtoSelecionado = signal<Produto | null>(null);

  abrirDetalhes(produto: Produto) {
    this.produtoSelecionado.set(produto);
  }

  fecharDetalhes() {
    this.produtoSelecionado.set(null);
  }

  // Filtros
  filtroNome: string = '';
  filtroCategoria: string = '';

  produtosFiltro = signal<Produto[]>([]);
  produtosFiltrados = signal<Produto[]>([]);

  filtrar() {
    const filtrados = this.produtosFiltro().filter((p) => {
      const nomeOk = p.nome.toLowerCase().includes(this.filtroNome.toLowerCase());

      const categoriaOk = !this.filtroCategoria || p.categoria === this.filtroCategoria;

      return nomeOk && categoriaOk;
    });

    this.produtosFiltrados.set(filtrados);
  }

  //Método excluir
  excluir(id: number): void {
    Swal.fire({
      title: 'Excluir produto?',
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
              next: (retorno) => this.produtos.set(retorno),
            });

            this.toastr.success('Produto excluído com sucesso!');
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Erro ao remover produto.');
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
    return Math.ceil(this.produtosFiltrados().length / this.itensPorPagina);
  }

  // Produtos que aparecem na página atual
  produtosPaginados(): Produto[] {
    const lista = this.produtosFiltrados();
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    return lista.slice(inicio, fim);
  }

  get paginasVisiveis(): (number | string)[] {
    const total = this.totalPaginas;
    const atual = this.paginaAtual;

    // Nenhum produto
    if (total === 0) {
      return [];
    }

    // Até 5 páginas
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    // No começo
    // 1 2 3 ... 10
    if (atual <= 3) {
      return [1, 2, 3, '...', total];
    }

    // No final
    // 1 ... 8 9 10
    if (atual >= total - 2) {
      return [1, '...', total - 2, total - 1, total];
    }

    // No meio
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
