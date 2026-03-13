import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header'; 
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Medicamento } from '../../../models/Medicamento';

@Component({
  selector: 'app-medicamento-edicao',
  imports: [RouterLink, FormsModule, Header],
  templateUrl: './medicamento-edicao.html',
  styleUrl: './medicamento-edicao.css',
})
export class MedicamentoEdicao {
    medicamento: Medicamento = new Medicamento();

      constructor(
          private servico: MedicamentoService,
          private rota: ActivatedRoute,
          private cdr: ChangeDetectorRef, 
          private toastr: ToastrService
      ) {}

      //Método de edição
      editar(): void {
          this.servico.editar(this.medicamento).subscribe(() => {
              this.toastr.success("Funcionário editado com sucesso!");
          });
      }

      ngOnInit() {
          const id = Number(this.rota.snapshot.paramMap.get('id'));
          this.servico.buscarPorId(id).subscribe(retorno => {
              this.medicamento = retorno;
              this.cdr.detectChanges();
          });
      }
}
