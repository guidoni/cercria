import { Component, signal } from '@angular/core';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Evento } from '../../../models/Evento';
import { Acolhido } from '../../../models/Acolhido';
import { Funcionario } from '../../../models/Funcionario';

import { EventoService } from '../../../services/evento/evento.service';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';

@Component({
  selector: 'app-evento-cadastro',
  standalone: true,
  imports: [RouterLink, FormsModule, Header, Sidebar],
  templateUrl: './evento-cadastro.html',
  styleUrl: './evento-cadastro.css',
})
export class EventoCadastro {
  // Lista de eventos cadastrados
  eventos: Evento[] = [];

  // Objeto do tipo Evento
  evento = new Evento();

  // Signals para armazenar listas vindas dos serviços
  acolhidos = signal<Acolhido[]>([]);
  responsaveis = signal<Funcionario[]>([]);

  // Lista de status permitidos
  statusList: string[] = ['Em andamento', 'Cancelado', 'Adiado', 'Realizado'];

  constructor(
    private eventoService: EventoService,
    private acolhidoService: AcolhidoService,
    private funcionarioService: FuncionarioService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Carregar acolhidos
    this.acolhidoService.selecionar().subscribe({
      next: (retorno) => {
        this.acolhidos.set(retorno);
      },
      error: (err) => {
        console.error('Erro ao carregar acolhidos', err);
        this.toastr.error('Erro ao carregar acolhidos.');
      },
    });

    // Carregar responsáveis (funcionários)
    this.funcionarioService.selecionar().subscribe({
      next: (retorno) => {
        this.responsaveis.set(retorno);
      },
      error: (err) => {
        console.error('Erro ao carregar responsáveis', err);
        this.toastr.error('Erro ao carregar responsáveis.');
      },
    });
  }

  // Método de Cadastro

  cadastrar(form: any): void {
    if (
      !this.evento.nome ||
      !this.evento.data ||
      !this.evento.hora ||
      !this.evento.status ||
      !this.evento.descricao ||
      this.evento.responsaveis.length === 0
    ) {
      this.toastr.error('Preencha todos os campos obrigatórios.');
      return;
    }

    this.eventoService.cadastrar(this.evento).subscribe({
      next: (retorno) => {
        this.eventos.push(retorno);
        this.evento = new Evento();
        form.reset();
        this.toastr.success('Evento cadastrado com sucesso!');
        this.router.navigate(['/agenda/listagem']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar evento', err);
        this.toastr.error('Erro ao cadastrar evento.');
      },
    });
  }

  // Filtro de busca de acolhidos
  filtroAcolhido: string = '';

  //  Filtro de Acolhidos
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

  //  Filtro de Responsáveis
  filtroResponsavel: string = '';

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
