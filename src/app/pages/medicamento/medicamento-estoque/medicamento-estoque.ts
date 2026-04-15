import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { SaidaMedicamentoService } from '../../../services/medicamento/saida-medicamento.service';
import { EntradaMedicamentoService } from '../../../services/medicamento/entrada-medicamento.service';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { EntradaMedicamento } from '../../../models/EntradaMedicamento';
import { SaidaMedicamento } from '../../../models/SaidaMedicamento';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { Acolhido } from '../../../models/Acolhido';
import { Medicamento } from '../../../models/Medicamento';
import { Funcionario } from '../../../models/Funcionario';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-medicamento-estoque',
  imports: [CommonModule, FormsModule, RouterModule, Header, Sidebar],
  templateUrl: './medicamento-estoque.html',
  styleUrl: './medicamento-estoque.css',
})
export class MedicamentoEstoque implements OnInit {
  constructor(
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  private route = inject(ActivatedRoute);
  private medicamentoService = inject(MedicamentoService);
  private entradaService = inject(EntradaMedicamentoService);
  private saidaService = inject(SaidaMedicamentoService);
  private acolhidoService = inject(AcolhidoService);
  private funcionarioService = inject(FuncionarioService);

  acolhidoSelecionadoId: number | null = null;

  medicamento: Medicamento = {} as Medicamento;
  medicamentoId!: number;

  abaAtiva: 'entrada' | 'saida' = 'entrada';

  entradas: EntradaMedicamento[] = [];
  saidas: SaidaMedicamento[] = [];
  acolhidos: Acolhido[] = [];
  funcionarios: Funcionario[] = [];

  totalEntradas = 0;
  totalSaidas = 0;

  get estoqueAtual(): number {
    return this.totalEntradas - this.totalSaidas;
  }

  novaEntrada: EntradaMedicamento = {
    quantidade: 0,
    dataEntrada: '',
    origem: '',
    responsavel: '',
    dataValidade: '',
    medicamento: { id: 0 },
  };

  novaSaida: SaidaMedicamento = {
    quantidade: 0,
    dataSaida: '',
    motivo: '',
    responsavel: '',
    horaSaida: 0,
    medicamento: { id: 0 },
    acolhidoId: { id: 0 },
  };

  alertaEstoque = false;

  ngOnInit(): void {
    this.medicamentoId = Number(this.route.snapshot.paramMap.get('id'));

    this.carregarMedicamento();
    this.carregarEntradas();
    this.carregarSaidas();
    this.carregarAcolhidos();
    this.carregarResponsavel();
  }

  carregarMedicamento(): void {
    this.medicamentoService.buscarPorId(this.medicamentoId).subscribe({
      next: (m) => {
        this.medicamento = m;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar medicamento', err),
    });
  }

  carregarEntradas(): void {
    this.entradaService.listarPorMedicamento(this.medicamentoId).subscribe({
      next: (lista) => {
        this.entradas = lista ?? [];
        this.totalEntradas = this.entradas.reduce((acc, e) => acc + e.quantidade, 0);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar entradas', err),
    });
  }

  carregarSaidas(): void {
    this.saidaService.listarPorMedicamento(this.medicamentoId).subscribe({
      next: (lista) => {
        this.saidas = lista || [];
        this.totalSaidas = this.saidas.reduce((acc, s) => acc + s.quantidade, 0);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar saídas', err);
        this.saidas = [];
      },
    });
  }

  carregarAcolhidos(): void {
    this.acolhidoService.selecionar().subscribe({
      next: (lista) => (this.acolhidos = lista),
      error: (err) => console.error('Erro ao carregar acolhidos', err),
    });
  }

  carregarResponsavel(): void {
    this.funcionarioService.selecionar().subscribe({
      next: (lista) => {
        this.funcionarios = lista;
      },
      error: (err) => console.error('Erro ao carregar funcionarios', err),
    });
  }

  trocarAba(aba: 'entrada' | 'saida'): void {
    this.abaAtiva = aba;
    this.alertaEstoque = false;
  }

  salvarEntrada(): void {
    this.novaEntrada.medicamento = { id: this.medicamentoId };

    const operacao = this.editandoEntradaId
      ? this.entradaService.editar(this.novaEntrada)
      : this.entradaService.cadastrar(this.novaEntrada);

    operacao.subscribe({
      next: () => {
        this.carregarEntradas();
        this.limparFormEntrada();
        this.editandoEntradaId = null;
        this.toastr.success(this.editandoEntradaId ? 'Entrada atualizada!' : 'Entrada cadastrada!');
      },
      error: (err) => console.error('Erro ao salvar entrada', err),
    });
  }

  salvarSaida(): void {
    if (this.novaSaida.quantidade > this.estoqueAtual) {
      this.alertaEstoque = true;
      return;
    }

    this.alertaEstoque = false;

    this.novaSaida.medicamento = { id: this.medicamentoId! };
    this.novaSaida.acolhidoId = { id: this.acolhidoSelecionadoId! };

    this.saidaService.cadastrar(this.novaSaida).subscribe({
      next: () => {
        this.toastr.success('Saída cadastrada com sucesso!');
        this.carregarSaidas();
        this.limparFormSaida();
      },
      error: (err) => {
        console.error('Erro ao cadastrar saída:', err);
        this.toastr.error('Erro ao cadastrar a saída.');
      },
    });
  }

  limparFormEntrada(): void {
    this.novaEntrada = {
      quantidade: 0,
      dataEntrada: '',
      origem: '',
      responsavel: '',
      dataValidade: '',
      medicamento: { id: this.medicamentoId },
    };
  }

  limparFormSaida(): void {
    this.acolhidoSelecionadoId = null;
    this.novaSaida = {
      quantidade: 0,
      dataSaida: '',
      motivo: '',
      responsavel: '',
      horaSaida: '' as any,
      medicamento: { id: this.medicamentoId },
      acolhido: undefined,
    };
  }

  //ENTRADA TABELA

  entradaSelecionada: EntradaMedicamento | null = null;
  editandoEntradaId: number | null = null;

  editarEntrada(e: EntradaMedicamento): void {
    this.editandoEntradaId = e.id!;
    this.novaEntrada = { ...e };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  abrirDetalhesEntrada(e: EntradaMedicamento): void {
    this.entradaSelecionada = e;
  }

  fecharDetalhes(): void {
    this.entradaSelecionada = null;
  }

  //SAÍDA TABELA

  saidaSelecionada: SaidaMedicamento | null = null;
  editandoSaidaId: number | null = null;

  editarSaida(s: SaidaMedicamento): void {
    this.editandoSaidaId = s.id!;
    this.novaSaida = { ...s };
    this.acolhidoSelecionadoId = s.acolhido?.id ?? null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  abrirDetalhesSaida(s: SaidaMedicamento): void {
    this.saidaSelecionada = s;
  }

  fecharDetalhesSaida(): void {
    this.saidaSelecionada = null;
  }
}
