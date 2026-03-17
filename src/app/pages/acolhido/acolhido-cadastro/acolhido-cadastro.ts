import { Component, signal } from '@angular/core';
import { Header } from '../../../components/header/header';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';
import { Acolhido } from '../../../models/Acolhido';
import { Medicamento } from '../../../models/Medicamento';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';

@Component({
  selector: 'app-acolhido-cadastro',
  imports: [RouterLink, FormsModule, Header, NgxMaskDirective],
  templateUrl: './acolhido-cadastro.html',
  styleUrl: './acolhido-cadastro.css',
})
export class AcolhidoCadastro {
  //JSON de Acolhidos
  acolhidos: Acolhido[] = [];

  constructor(
    private servico: AcolhidoService,
    private toastr: ToastrService,
    private router: Router,
    private servicoMedicamento: MedicamentoService,
  ) {}

  ngOnInit(): void {
    this.servicoMedicamento.selecionar().subscribe({
      next: (retorno) => {
        this.medicamentos.set(retorno);
      },
      error: (err) => {
        console.error('Erro ao carregar medicamentos', err);
      },
    });
  }

  //Objeto do tipo funcionário
  acolhido = new Acolhido();

  //Método de cadastro
  cadastrar(form: any): void {
    this.servico.cadastrar(this.acolhido).subscribe((retorno) => {
      this.acolhidos.push(retorno);

      this.acolhido = new Acolhido();
      form.reset();

      this.toastr.success('Acolhido cadastrado com sucesso!');
      this.router.navigate(['/acolhido/listagem']);
    });
  }

  /////
  medicamentos = signal<Medicamento[]>([]);

  filtroMedicamento: string = '';

  medicamentosSelecionados: Medicamento[] = [];

  filtrarMedicamentos() {
    const lista = this.medicamentos();

    if (!this.filtroMedicamento.trim()) {
      return [];
    }

    return lista.filter((m) => m.nome.toLowerCase().includes(this.filtroMedicamento.toLowerCase()));
  }

  toggleMedicamento(id: number) {
    if (this.acolhido.medicamentos.includes(id)) {
      this.acolhido.medicamentos = this.acolhido.medicamentos.filter((m) => m !== id);
    } else {
      this.acolhido.medicamentos.push(id);
    }
  }
}
