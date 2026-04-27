import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { ChangeDetectorRef } from '@angular/core';
import { EventoService } from '../../../services/evento/evento.service';
import { Evento } from '../../../models/Evento';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';

@Component({
  selector: 'app-calendario-inicial',
  standalone: true,
  imports: [CommonModule, RouterLink, Header, Sidebar, FullCalendarModule],
  templateUrl: './evento-listagem.html',
  styleUrls: ['./evento-listagem.css'],
})
export class EventoListagem implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  eventoSelecionado: Evento | null = null;
  mostrarPopup: boolean = false;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      day: 'Dia',
    },
    height: 'auto',
    events: [],
    eventClick: (info) => {
      const id = Number(info.event.id);
      this.abrirPopup(id);
    },
  };

  constructor(
    private eventoService: EventoService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private acolhidoService: AcolhidoService,
    private funcionarioService: FuncionarioService,
  ) {}

  ngOnInit(): void {
    this.carregarEventos();

    this.acolhidoService.selecionar().subscribe((res) => {
      this.acolhidosLista = res;
    });

    this.funcionarioService.selecionar().subscribe((res) => {
      this.responsaveisLista = res;
    });
  }

  ngAfterViewInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.eventoService.selecionar().subscribe({
      next: (eventos) => {
        const calendarApi = this.calendarComponent.getApi();

        const eventosFormatados = eventos.map((evento) => ({
          id: String(evento.id),
          title: `${evento.nome} - ${evento.hora}`,
          start: this.formatarData(evento.data, evento.hora),
          color: this.getCorStatus(this.getStatusEvento(evento.data, evento.hora)),
        }));

        console.log('Eventos formatados:', eventosFormatados);

        calendarApi.removeAllEvents();
        calendarApi.addEventSource(eventosFormatados);
      },
      error: (err) => console.error(err),
    });
  }

  formatarData(data: string, hora: string): string {
    const d = new Date(data);

    const [h, m, s] = hora.split(':');

    d.setHours(Number(h));
    d.setMinutes(Number(m));
    d.setSeconds(Number(s || 0));

    return d.toISOString();
  }

  abrirPopup(id: number): void {
    this.eventoService.buscarPorId(id).subscribe({
      next: (evento: Evento) => {
        this.eventoSelecionado = evento;
        this.mostrarPopup = true;

        this.cd.detectChanges();
      },
      error: (err) => console.error('Erro ao buscar evento', err),
    });
  }

  fecharPopup(): void {
    this.mostrarPopup = false;
    this.eventoSelecionado = null;
  }

  getCorStatus(status: string): string {
    switch (status) {
      case 'Em andamento':
        return '#1e3b8ae5';
      case 'Finalizado':
        return '#28a745';
      default:
        return '#3788d8';
    }
  }

  getStatusEvento(data: string, hora: string): string {
    const dataEvento = new Date(data);

    const [h, m, s] = hora.split(':');
    dataEvento.setHours(Number(h));
    dataEvento.setMinutes(Number(m));
    dataEvento.setSeconds(Number(s || 0));

    const agora = new Date();

    return agora < dataEvento ? 'Em andamento' : 'Finalizado';
  }

  acolhidosLista: any[] = [];
  responsaveisLista: any[] = [];

  getNomeAcolhido(id: number): string {
    const a = this.acolhidosLista.find((x) => x.id === id);
    return a ? a.nome : 'Desconhecido';
  }

  getNomeResponsavel(id: number): string {
    const r = this.responsaveisLista.find((x) => x.id === id);
    return r ? r.nome : 'Desconhecido';
  }
}
