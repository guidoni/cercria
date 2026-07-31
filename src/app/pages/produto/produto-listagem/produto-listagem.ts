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
              entradas.forEach((e) => console.log(e.quantidadeAtual));
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
}
