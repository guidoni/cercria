import { Component, inject } from '@angular/core';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Patrimonio } from '../../../models/Patrimonio';
import { ToastrService } from 'ngx-toastr';
import { PatrimonioService } from '../../../services/patrimonio/patrimonio.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patrimonio-cadastro',
  imports: [Header, Sidebar, FormsModule, RouterLink],
  templateUrl: './patrimonio-cadastro.html',
  styleUrl: './patrimonio-cadastro.css',
})
export class PatrimonioCadastro {
  //Lista para cadastro de patrimônio
  patrimonios: Patrimonio[] = [];

  private servico = inject(PatrimonioService);
  constructor(
    private toastr: ToastrService,
    private router: Router,
  ) {}

  //Objeto do tipo patrimônio
  patrimonio = new Patrimonio();

  //Método de cadastro
  cadastrar(form: any): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.toastr.error('Preencha todos os campos obrigatórios corretamente!');
      return;
    }

    this.servico.cadastrar(this.patrimonio).subscribe({
      next: (retorno) => {
        this.patrimonios.push(retorno);

        this.patrimonio = new Patrimonio();
        form.reset();

        this.toastr.success('Patrimônio cadastrado com sucesso!');
        this.router.navigate(['/patrimonio/listagem']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erro ao cadastrar patrimônio!');
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
