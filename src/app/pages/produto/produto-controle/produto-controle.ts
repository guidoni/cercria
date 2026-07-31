import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { ControleProdutoService } from '../../../services/produto/controle-produto.service';
import { EntradaProduto } from '../../../models/EntradaProduto';
import { SaidaProduto } from '../../../models/SaidaProduto';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { ProdutoService } from '../../../services/produto/produto.service';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produto-controle',
  imports: [Header, Sidebar, CommonModule, RouterLink, FormsModule],
  templateUrl: './produto-controle.html',
  styleUrl: './produto-controle.css',
})
export class ProdutoControle implements OnInit {
  constructor(
    //private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  // Injeção do serviço responsável pelas operações com produto
  private funcionarioService = inject(FuncionarioService);
  private controleService = inject(ControleProdutoService);
  private produtoService = inject(ProdutoService);

  abaSelecionada: 'entrada' | 'saida' = 'entrada';
  funcionarios: any[] = [];
  produtos: any[] = [];
  usuarioLogado: number | null = null;

  // Objetos de entrada e saída
  entrada = new EntradaProduto();
  saida = new SaidaProduto();

  ngOnInit(): void {
    const usuarioRaw = sessionStorage.getItem('usuario');
    if (usuarioRaw) {
      const usuario = JSON.parse(usuarioRaw);
      this.usuarioLogado = usuario?.id ?? null;
    }

    this.entrada.dataEntrada = new Date().toISOString().split('T')[0];
    this.saida.dataSaida = new Date().toISOString().split('T')[0];

    this.limparEntrada();
    this.limparSaida();
    this.carregarFuncionarios();
    this.carregarProdutos();
  }

  // Carregar funcionários do banco no combobox
  carregarFuncionarios(): void {
    this.funcionarioService.selecionar().subscribe({
      next: (lista) => {
        this.funcionarios = lista;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  // Carregar produtos do banco no combobox
  carregarProdutos(): void {
    this.produtoService.selecionar().subscribe({
      next: (lista) => {
        this.produtos = lista;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
      },
    });
  }

  limparEntrada(): void {
    this.entrada.id = undefined;
    this.entrada.quantidade = 1;
    this.entrada.dataEntrada = '';
    this.entrada.dataValidade = '';
    this.entrada.origem = '';
    this.entrada.observacao = '';
    this.entrada.produtoId = null;
    this.entrada.funcionarioId = this.usuarioLogado;
  }

  limparSaida(): void {
    this.saida.id = undefined;
    this.saida.quantidade = 1;
    this.saida.dataSaida = '';
    this.saida.motivo = '';
    this.saida.produtoId = null;
    this.saida.funcionarioId = this.usuarioLogado;
  }

  private montarPayloadEntrada() {
    return {
      ...this.entrada,
      produto: { id: this.entrada.produtoId },
      funcionario: { id: this.entrada.funcionarioId },
    };
  }

  private montarPayloadSaida() {
    return {
      ...this.saida,
      produto: { id: this.saida.produtoId },
      funcionario: { id: this.saida.funcionarioId },
    };
  }

  // Método de salvar entrada
  salvarEntrada(form: NgForm): void {
    const payload = this.montarPayloadEntrada();
    //console.log('ENTRADA:', payload);

    this.controleService.cadastrarEntrada(payload).subscribe({
      next: () => {
        this.toastr.success('Entrada cadastrada com sucesso!');
        form.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erro ao cadastrar entrada.');
      },
    });
  }

  //Método de salvar saída
  salvarSaida(form: NgForm): void {
    const payload = this.montarPayloadSaida();
    //console.log('SAÍDA:', payload);

    this.controleService.cadastrarSaida(payload).subscribe({
      next: () => {
        this.toastr.success('Saída cadastrada com sucesso!');
        form.resetForm();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erro ao cadastrar saída.');
      },
    });
  }

  @ViewChild('form')
  formulario!: NgForm;

  canDeactivate(): Promise<boolean> | boolean {
    //console.log(this.formulario?.dirty);

    if (!this.formulario?.dirty) {
      return true;
    }

    return Swal.fire({
      title: 'Existem alterações não salvas',
      text: 'Deseja realmente sair desta página?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Continuar editando',
    }).then((result) => result.isConfirmed);
  }
}
