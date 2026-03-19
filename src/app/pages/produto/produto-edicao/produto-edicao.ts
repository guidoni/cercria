import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { ProdutoService } from '../../../services/produto/produto.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Produto } from '../../../models/Produto';

@Component({
  selector: 'app-produto-edicao',
  imports: [RouterLink, FormsModule, Header, Sidebar],
  templateUrl: './produto-edicao.html',
  styleUrl: './produto-edicao.css',
})
export class ProdutoEdicao {
  produto: Produto = new Produto();

  constructor(
    private servico: ProdutoService,
    private rota: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  //Método de edição
  editar(): void {
    this.servico.editar(this.produto).subscribe(() => {
      this.toastr.success('Produto editado com sucesso!');
    });
  }

  ngOnInit() {
    const id = Number(this.rota.snapshot.paramMap.get('id'));
    this.servico.buscarPorId(id).subscribe((retorno) => {
      this.produto = retorno;
      this.cdr.detectChanges();
    });
  }
}
