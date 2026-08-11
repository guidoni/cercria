import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Produto } from '../../../models/Produto';
import { EntradaProduto } from '../../../models/EntradaProduto';
import { ProdutoService } from '../../../services/produto/produto.service';
import { ControleProdutoService } from '../../../services/produto/controle-produto.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'produto-historico',
  imports: [CommonModule, RouterLink, FormsModule, Header, Sidebar],
  templateUrl: './produto-historico.html',
  styleUrl: './produto-historico.css',
})
export class ProdutoHistorico implements OnInit {
  private servico = inject(ProdutoService);
  private controleService = inject(ControleProdutoService);

  constructor(private toastr: ToastrService) {}

  //Produto
  produtos: Produto[] = [];
  produtosFiltro: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  quantidades: { [produtoId: number]: number } = {};

  produtoSelecionado: Produto | null = null;

  abaSelecionada: 'entradas' | 'saidas' = 'entradas';

  carregandoHistorico = false;

  entradas: EntradaProduto[] = [];
  saidas: any[] = [];

  produtoId!: number;

  ngOnInit(): void {}

  carregarProdutos(): void {
    this.servico.selecionar().subscribe({
      next: (lista) => {
        this.produtos = lista;
        this.produtosFiltro = lista;
        this.produtosFiltrados = lista;

        // Carrega a quantidade atual de cada produto
        lista.forEach((produto) => {
          this.carregarQuantidade(produto.id);
        });
      },

      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.toastr.error('Erro ao carregar produtos.');
      },
    });
  }

  carregarQuantidade(produtoId: number): void {
    this.controleService.listarPorProduto(produtoId).subscribe({
      next: (entradas) => {
        const quantidade = entradas.reduce(
          (total, entrada) => total + (entrada.quantidadeAtual ?? 0),
          0,
        );
        this.quantidades[produtoId] = quantidade;
      },

      error: (err) => {
        console.error(`Erro ao carregar estoque do produto ${produtoId}:`, err);
        this.quantidades[produtoId] = 0;
      },
    });
  }

  abrirHistorico(produto: Produto): void {
    console.log('CLIQUEI NO PRODUTO:', produto);
    console.log('ID DO PRODUTO:', produto.id);

    this.produtoSelecionado = produto;
    this.abaSelecionada = 'entradas';

    this.entradas = [];
    this.saidas = [];

    this.carregarEntradas(produto.id);
    this.carregarSaidas(produto.id);
  }

  fecharHistorico(): void {
    this.produtoSelecionado = null;

    this.entradas = [];
    this.saidas = [];
  }

  abrirAbaEntradas(): void {
    this.abaSelecionada = 'entradas';
  }

  abrirAbaSaidas(): void {
    this.abaSelecionada = 'saidas';
  }

  carregarEntradas(produtoId: number): void {
    this.carregandoHistorico = true;

    console.log('Buscando entradas do produto:', produtoId);

    this.controleService.listarPorProduto(produtoId).subscribe({
      next: (lista) => {
        console.log('ENTRADAS RECEBIDAS:', lista);

        this.entradas = lista;
        this.carregandoHistorico = false;
      },

      error: (err) => {
        console.error('ERRO AO CARREGAR ENTRADAS:', err);

        this.toastr.error('Erro ao carregar histórico de entradas.');
        this.carregandoHistorico = false;
      },
    });
  }

  carregarSaidas(produtoId: number): void {
    console.log('Buscando saídas do produto:', produtoId);

    this.controleService.listarSaidasPorProduto(produtoId).subscribe({
      next: (lista) => {
        console.log('SAÍDAS RECEBIDAS:', lista);

        this.saidas = lista;
      },

      error: (err) => {
        console.error('ERRO AO CARREGAR SAÍDAS:', err);

        this.toastr.error('Erro ao carregar histórico de saídas.');
      },
    });
  }

  excluirEntrada(entrada: EntradaProduto): void {
    if (!entrada.id) {
      return;
    }

    Swal.fire({
      title: 'Excluir entrada?',
      text: 'Essa ocorrência será removida do histórico.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.controleService.excluirEntrada(entrada.id!).subscribe({
        next: () => {
          // Remove da tabela imediatamente
          this.entradas = this.entradas.filter((e) => e.id !== entrada.id);

          // Atualiza a quantidade do produto
          if (this.produtoSelecionado) {
            this.carregarQuantidade(this.produtoSelecionado.id);
          }

          this.toastr.success('Entrada excluída com sucesso!');
        },

        error: (err) => {
          console.error('Erro ao excluir entrada:', err);

          this.toastr.error('Erro ao excluir entrada.');
        },
      });
    });
  }

  excluirSaida(saida: any): void {
    if (!saida.id) {
      return;
    }

    Swal.fire({
      title: 'Excluir saída?',
      text: 'Essa ocorrência será removida do histórico.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }
      this.controleService.excluirSaida(saida.id!).subscribe({
        next: () => {
          this.saidas = this.saidas.filter((s) => s.id !== saida.id);
          if (this.produtoSelecionado) {
            this.carregarQuantidade(this.produtoSelecionado.id);
          }
          this.toastr.success('Saída excluída com sucesso!');
        },

        error: (err) => {
          console.error('Erro ao excluir saída:', err);

          this.toastr.error('Erro ao excluir saída.');
        },
      });
    });
  }

  excluirProduto(id: number): void {
    Swal.fire({
      title: 'Excluir produto?',
      text: 'O produto não será mais exibido na listagem.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.servico.remover(id).subscribe({
        next: () => {
          this.produtos = this.produtos.filter((p) => p.id !== id);
          this.produtosFiltro = this.produtosFiltro.filter((p) => p.id !== id);
          this.produtosFiltrados = this.produtosFiltrados.filter((p) => p.id !== id);
          this.toastr.success('Produto excluído com sucesso!');
        },

        error: (err) => {
          console.error('Erro ao excluir produto:', err);
          this.toastr.error('Erro ao excluir produto.');
        },
      });
    });
  }
}
