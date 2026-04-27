import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '../../../models/Evento';
import { Acolhido } from '../../../models/Acolhido';
import { Funcionario } from '../../../models/Funcionario';

import { EventoService } from '../../../services/evento/evento.service';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';

@Component({
  selector: 'app-edicao-evento',
  standalone: true,
  imports: [RouterLink, Sidebar, Header, FormsModule],
  templateUrl: './evento-edicao.html',
  styleUrl: './evento-edicao.css',
})
export class EdicaoEvento implements OnInit {
  evento: Evento = new Evento();

  acolhidos = signal<Acolhido[]>([]);
  responsaveis = signal<Funcionario[]>([]);

  filtroAcolhido: string = '';
  filtroResponsavel: string = '';

  constructor(
    private eventoService: EventoService,
    private acolhidoService: AcolhidoService,
    private funcionarioService: FuncionarioService,
    private rota: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = Number(this.rota.snapshot.paramMap.get('id'));

    // listas
    this.acolhidoService.selecionar().subscribe((res) => this.acolhidos.set(res));
    this.funcionarioService.selecionar().subscribe((res) => this.responsaveis.set(res));

    // evento
    this.eventoService.buscarPorId(id).subscribe({
      next: (retorno) => {
        console.log('EVENTO:', retorno);

        this.evento = retorno;

        this.evento.acolhidos = retorno.acolhidos ?? [];
        this.evento.responsaveis = retorno.responsaveis ?? [];

        // segurança
        this.evento.acolhidos = [...this.evento.acolhidos];
        this.evento.responsaveis = [...this.evento.responsaveis];

        if (this.evento.data) {
          const dataUTC = new Date(this.evento.data);

          // Compensa o offset para não deixar o UTC "roubar" um dia
          const dataLocal = new Date(
            dataUTC.getUTCFullYear(),
            dataUTC.getUTCMonth(),
            dataUTC.getUTCDate(),
          );

          // Formato yyyy-MM-dd que o input[type="date"] espera
          this.evento.data = dataLocal.toLocaleDateString('en-CA'); // "2025-04-22"
        }
      },
      error: (err) => console.error(err),
    });
  }

  // EDITAR
  editar(): void {
    const eventoParaEnviar = {
      ...this.evento,
      data: this.evento.data ? this.evento.data + 'T12:00:00' : this.evento.data,
    };

    this.eventoService.editar(eventoParaEnviar).subscribe({
      next: () => {
        this.toastr.success('Evento editado com sucesso!');
        this.router.navigate(['/agenda/listagem']);
      },
      error: () => {
        this.toastr.error('Erro ao editar evento');
      },
    });
  }

  // FILTROS
  filtrarAcolhidos(): Acolhido[] {
    const lista = this.acolhidos();

    return lista
      .filter((a) => !a.dataSaida)
      .filter((a) =>
        this.filtroAcolhido.trim()
          ? a.nome.toLowerCase().includes(this.filtroAcolhido.toLowerCase())
          : true,
      );
  }

  filtrarResponsaveis(): Funcionario[] {
    const lista = this.responsaveis();

    return lista
      .filter((r) => !r.dataSaida)
      .filter((r) =>
        this.filtroResponsavel.trim()
          ? r.nome.toLowerCase().includes(this.filtroResponsavel.toLowerCase())
          : true,
      );
  }

  // Seleção/Deseleção de Acolhidos

  toggleAcolhido(id: number): void {
    if (this.evento.acolhidos.includes(id)) {
      this.evento.acolhidos = this.evento.acolhidos.filter((a) => a !== id);
    } else {
      this.evento.acolhidos.push(id);
    }
  }

  // Verificar se está selecionado

  isAcolhidoSelecionado(id: number): boolean {
    return this.evento.acolhidos.includes(id);
  }

  toggleResponsavel(id: number): void {
    if (this.evento.responsaveis.includes(id)) {
      this.evento.responsaveis = this.evento.responsaveis.filter((r) => r !== id);
    } else {
      this.evento.responsaveis.push(id);
    }
  }

  isResponsavelSelecionado(id: number): boolean {
    return this.evento.responsaveis.includes(id);
  }
}
