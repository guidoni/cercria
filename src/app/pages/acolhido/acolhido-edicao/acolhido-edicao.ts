import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Acolhido } from '../../../models/Acolhido';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { NgxMaskDirective } from 'ngx-mask';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { signal } from '@angular/core';
import { Medicamento } from '../../../models/Medicamento';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';

@Component({
  selector: 'app-acolhido-edicao',
  imports: [RouterLink, FormsModule, Header, NgxMaskDirective, CommonModule, Sidebar],
  templateUrl: './acolhido-edicao.html',
  styleUrl: './acolhido-edicao.css',
})
export class AcolhidoEdicao implements OnInit {
  acolhido: Acolhido = new Acolhido();
  carregado = false;

  constructor(
    private servico: AcolhidoService,
    private servicoMedicamento: MedicamentoService,
    private rota: ActivatedRoute,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  //Método de edição
  editar(): void {
    this.servico.editar(this.acolhido).subscribe(() => {
      this.toastr.success('Acolhido editado com sucesso!');
    });
  }

  ngOnInit(): void {
    const id = Number(this.rota.snapshot.paramMap.get('id'));

    // carregar medicamentos
    this.servicoMedicamento.selecionar().subscribe((lista) => {
      console.log('Medicamentos:', lista); // teste
      this.medicamentos.set(lista);
    });

    //carregar acolhido
    this.servico.buscarPorId(id).subscribe({
      next: (retorno) => {
        console.log('RETORNO:', retorno);

        this.acolhido = retorno;

        if (!this.acolhido.medicamentos) {
          this.acolhido.medicamentos = [];
        }

        this.carregado = true;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('ERRO:', erro);
      },
    });
  }

  ////////////////
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
