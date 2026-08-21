import { Component, inject } from '@angular/core';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/produto/produto.service';
import { Produto } from '../../../models/Produto';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produto-cadastro',
  imports: [Header, RouterLink, FormsModule, Sidebar],
  templateUrl: './produto-cadastro.html',
  styleUrl: './produto-cadastro.css',
})
export class ProdutoCadastro {
  //Lista para cadastro de produto
  produtos: Produto[] = [];

  // Injeção do serviço responsável pelas operações com produto
  private servico = inject(ProdutoService);
  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {}

  //Objeto do tipo produto
  produto = new Produto();

  //Método de cadastro
  cadastrar(form: any): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.toastr.error('Preencha todos os campos obrigatórios corretamente!');
      return;
    }

    this.servico.cadastrar(this.produto).subscribe({
      next: (retorno) => {
        this.produtos.push(retorno);

        this.produto = new Produto();
        form.reset();

        this.toastr.success('Produto cadastrado com sucesso!');
        this.router.navigate(['/produto/listagem']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erro ao cadastrar produto!');
      },
    });
  }

  @ViewChild('form')
  formulario!: NgForm;

  canDeactivate(): Promise<boolean> | boolean {
    console.log(this.formulario?.dirty);

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
