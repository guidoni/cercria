import { Component, signal, inject } from '@angular/core';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';
import { Acolhido } from '../../../models/Acolhido';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acolhido-cadastro',
  imports: [RouterLink, FormsModule, Header, NgxMaskDirective, Sidebar],
  templateUrl: './acolhido-cadastro.html',
  styleUrl: './acolhido-cadastro.css',
})
export class AcolhidoCadastro {
  //Lista para cadastro dos acolhidos, do tipo Acolhido
  acolhidos: Acolhido[] = [];

  // Injeção do serviço responsável pelas operações com acolhidos
  private servico = inject(AcolhidoService);

  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {}

  //Objeto do tipo acolhido
  acolhido = new Acolhido();

  //Método de cadastro
  cadastrar(form: NgForm): void {
    // Impede o cadastro se houver qualquer erro no formulário
    if (form.invalid) {
      form.control.markAllAsTouched();

      this.toastr.error(
        'Preencha corretamente todos os campos obrigatórios.',
        'Formulário inválido',
      );

      return;
    }

    // Define se o acolhido está ativo
    this.acolhido.ativo = !this.acolhido.dataSaida;

    this.servico.cadastrar(this.acolhido).subscribe({
      next: (retorno) => {
        this.acolhidos.push(retorno);
        this.acolhido = new Acolhido();
        form.resetForm();
        this.toastr.success('Acolhido cadastrado com sucesso!');
        this.router.navigate(['/acolhido/listagem']);
      },

      error: (err) => {
        console.error('Erro ao cadastrar acolhido:', err);

        this.toastr.error(err.error?.message || 'Erro ao cadastrar acolhido.', 'Erro');
      },
    });
  }

  @ViewChild('form')
  formulario!: NgForm;

  //Método para criar mensagem de formulário não salvo ao sair
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
