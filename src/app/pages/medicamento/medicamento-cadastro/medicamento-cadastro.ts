import { Component, inject } from '@angular/core';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { Medicamento } from '../../../models/Medicamento';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicamento-cadastro',
  imports: [Header, RouterLink, FormsModule, Sidebar],
  templateUrl: './medicamento-cadastro.html',
  styleUrl: './medicamento-cadastro.css',
})
export class MedicamentoCadastro {
  //Lista para o cadastro de medicamentos
  medicamentos: Medicamento[] = [];

  // Injeção do serviço responsável pelas operações com medicamentos
  private servico = inject(MedicamentoService);
  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {}

  //Objeto do tipo funcionário
  medicamento = new Medicamento();

  //Método de cadastro
  cadastrar(form: NgForm): void {
    // Verifica se o formulário possui erros
    if (form.invalid) {
      form.control.markAllAsTouched();

      this.toastr.error(
        'Preencha corretamente todos os campos obrigatórios.',
        'Formulário inválido',
      );

      return;
    }

    this.servico.cadastrar(this.medicamento).subscribe({
      next: (retorno) => {
        this.medicamentos.push(retorno);
        this.medicamento = new Medicamento();
        form.resetForm();

        this.toastr.success('Medicamento cadastrado com sucesso!', 'Sucesso');
        this.router.navigate(['/medicamento/listagem']);
      },

      error: (err) => {
        console.error('Erro ao cadastrar medicamento:', err);

        this.toastr.error(err.error?.message || 'Erro ao cadastrar medicamento.', 'Erro');
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
