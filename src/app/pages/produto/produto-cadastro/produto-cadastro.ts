import { Component } from '@angular/core';
import { Header } from '../../../components/header/header';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/produto/produto.service';
import { Produto } from '../../../models/Produto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-produto-cadastro',
  imports: [Header, RouterLink, FormsModule],
  templateUrl: './produto-cadastro.html',
  styleUrl: './produto-cadastro.css',
})
export class ProdutoCadastro {
  //JSON de funcionario
  produtos: Produto[] = [];

  constructor(
    private servico: ProdutoService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  //Objeto do tipo funcionário
  produto = new Produto();

  //Método de cadastro
  cadastrar(form: any): void {
    this.servico.cadastrar(this.produto).subscribe((retorno) => {
      this.produtos.push(retorno);

      this.produto = new Produto();
      form.reset();

      this.toastr.success('Produto cadastrado com sucesso!');
      this.router.navigate(['/produto/listagem']);
    });
  }
}
