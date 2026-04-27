import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Funcionario } from '../../../models/Funcionario';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-funcionario-cadastro',
  imports: [RouterLink, FormsModule, Header, NgxMaskDirective, Sidebar],
  templateUrl: './funcionario-cadastro.html',
  styleUrl: './funcionario-cadastro.css',
})
export class FuncionarioCadastro {
  //JSON de funcionario
  funcionarios: Funcionario[] = [];

  constructor(
    private servico: FuncionarioService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.confirmarSenha = '';
  }

  //Objeto do tipo funcionário
  funcionario = new Funcionario();

  confirmarSenha: string = '';

  //Método de cadastro
  cadastrar(form: any): void {
    if (this.funcionario.senha !== this.confirmarSenha) {
      this.toastr.error('As senhas não coincidem!');
      return;
    }

    this.funcionario.ativo = !this.funcionario.dataSaida;

    this.servico.cadastrar(this.funcionario).subscribe((retorno) => {
      this.funcionarios.push(retorno);

      this.funcionario = new Funcionario();
      this.confirmarSenha = '';
      form.reset();

      this.toastr.success('Funcionário cadastrado com sucesso!');
      this.router.navigate(['/funcionario/listagem']);
    });
  }
}
