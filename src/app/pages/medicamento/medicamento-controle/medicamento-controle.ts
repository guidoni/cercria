import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AcolhidoService } from '../../../services/acolhido/acolhido.service';
import { Acolhido } from '../../../models/Acolhido';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { FuncionarioService } from '../../../services/funcionario/funcionario.service';
import { ToastrService } from 'ngx-toastr';
import { ControleUsoMedicamento } from '../../../models/ControleUsoMedicamento';
import { SaidaEsporadica } from '../../../models/SaidaEsporadica';
import { ControleMedicamentoService } from '../../../services/medicamento/medicamento-controle.service';
import { Header } from '../../../components/header/header';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { RouterLink } from '@angular/router';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-controle-medicamento',
  imports: [CommonModule, FormsModule, Header, Sidebar, RouterLink],
  templateUrl: './medicamento-controle.html',
  styleUrl: './medicamento-controle.css',
})
export class MedicamentoControle implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  abaAtiva: 'programado' | 'esporadico' = 'programado';
  usuarioLogado!: number;

  //Listas
  funcionarios: any[] = [];
  medicamentos: { id: number; nome: string }[] = [];

  // Injeção do serviço responsável pelas operações com acolhidos, medicamentos e funcionários
  private route = inject(ActivatedRoute);
  private acolhidoService = inject(AcolhidoService);
  private medicamentoService = inject(MedicamentoService);
  private funcionarioService = inject(FuncionarioService);
  private controleService = inject(ControleMedicamentoService);

  acolhido?: Acolhido;
  acolhidoId!: number;

  ngOnInit(): void {
    //Pega o usuário logado
    const usuario = JSON.parse(sessionStorage.getItem('usuario')!);
    this.usuarioLogado = usuario.id;

    this.novaSaidaEsporadica.responsavel = {
      id: this.usuarioLogado,
    };

    this.acolhidoId = Number(this.route.snapshot.paramMap.get('id'));

    this.novaProgramacao.acolhido = {
      id: this.acolhidoId,
    };

    this.carregarAcolhido();
    this.carregarMedicamentos();
    this.carregarFuncionarios();
  }

  // Objetos do tipo controleUso e Saída Esporádica
  novaProgramacao = new ControleUsoMedicamento();
  novaSaidaEsporadica = new SaidaEsporadica();

  diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  trocarAba(aba: 'programado' | 'esporadico'): void {
    this.abaAtiva = aba;
  }

  toggleUsoContinuo(): void {
    this.novaProgramacao.usoContinuo = !this.novaProgramacao.usoContinuo;

    if (this.novaProgramacao.usoContinuo) {
      this.novaProgramacao.dataFim = '';
    }
  }

  toggleDia(dia: string): void {
    const index = this.novaProgramacao.diasSemana.indexOf(dia);

    if (index >= 0) {
      this.novaProgramacao.diasSemana.splice(index, 1);
    } else {
      this.novaProgramacao.diasSemana.push(dia);
    }
  }

  // Método de cadastro de medicamentos periódicos
  salvarProgramacao(form: NgForm): void {
    const usuarioStorage = sessionStorage.getItem('usuario');

    if (!usuarioStorage) {
      this.toastr.error('Usuário não encontrado.');
      return;
    }

    const usuario = JSON.parse(usuarioStorage);

    //console.log('USUÁRIO DO SESSION STORAGE:', usuario);

    const funcionarioId = usuario.id;

    if (!funcionarioId) {
      this.toastr.error('Funcionário logado não encontrado.');
      console.error('ID do funcionário não encontrado:', usuario);
      return;
    }

    if (!this.novaProgramacao.dataInicio) {
      this.toastr.error('Informe a data de início.');
      return;
    }

    if (!this.novaProgramacao.usoContinuo && !this.novaProgramacao.dataFim) {
      this.toastr.error('Marque "Uso contínuo" ou informe uma data de fim.');
      return;
    }

    this.novaProgramacao.acolhido = {
      id: this.acolhidoId,
    };

    this.novaProgramacao.funcionarioCadastro = {
      id: funcionarioId,
    };

    this.novaProgramacao.diasSemana = Array.isArray(this.novaProgramacao.diasSemana)
      ? this.novaProgramacao.diasSemana
      : [];

    if (this.novaProgramacao.usoContinuo) {
      this.novaProgramacao.dataFim = undefined;
    }

    if (!this.novaProgramacao.medicamento?.id) {
      this.toastr.error('Selecione um medicamento.');
      return;
    }

    const dados = {
      ...this.novaProgramacao,
      diasSemana: this.novaProgramacao.diasSemana.join(','),
    };

    this.controleService.cadastrar(dados).subscribe({
      next: () => {
        this.toastr.success('Medicamento programado com sucesso!');

        form.resetForm();
      },

      error: (err) => {
        console.error('Erro:', err);

        this.toastr.error(err.error?.message || 'Erro ao cadastrar programação.');
      },
    });
  }

  // Método para salvar saída esporádica
  salvarSaidaEsporadica(form: NgForm): void {
    const dados = {
      data: this.novaSaidaEsporadica.dataSaida,
      horario: this.novaSaidaEsporadica.horario,
      dose: this.novaSaidaEsporadica.dose,
      motivo: this.novaSaidaEsporadica.motivo,
      status: 'DADO',
      acolhido: {
        id: this.acolhidoId,
      },
      medicamento: {
        id: this.novaSaidaEsporadica.medicamentoId,
      },
      funcionarioResponsavel: this.novaSaidaEsporadica.responsavel,
    };

    //console.log('ESPORADICO →', dados);

    this.controleService.salvarSaidaEsporadica(dados).subscribe({
      next: () => {
        this.toastr.success('Saída registrada!');
        form.resetForm();
      },
      error: (err) => {
        console.error(err);

        if (typeof err.error === 'string') {
          this.toastr.error(err.error);
        } else if (err.error?.message) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error('Erro ao registrar saída.');
        }
      },
    });
  }

  //Limpar os campos da saída programada
  limparProgramacao(): void {
    this.novaProgramacao = new ControleUsoMedicamento();
    this.novaProgramacao.acolhido = { id: this.acolhidoId };
    this.novaProgramacao.dose = 1;
  }

  //Limpar campos da saída esporádica
  limparSaidaEsporadica(): void {
    this.novaSaidaEsporadica = new SaidaEsporadica();
    this.novaSaidaEsporadica.responsavel = {
      id: this.usuarioLogado,
    };
    this.cdr.detectChanges();
  }

  // Carregar os acolhidos do banco no combobox
  carregarAcolhido(): void {
    this.acolhidoService.buscarPorId(this.acolhidoId).subscribe({
      next: (a) => {
        this.acolhido = a;
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Erro ao carregar acolhido', err);
      },
    });
  }

  // Carregar os medicamentos do banco no combobox
  carregarMedicamentos(): void {
    this.medicamentoService.selecionar().subscribe({
      next: (lista) => {
        this.medicamentos = lista;
      },

      error: (err) => {
        console.error('Erro ao carregar medicamentos', err);
      },
    });
  }

  // Carregar os funcionários do banco no combobox
  carregarFuncionarios(): void {
    this.funcionarioService.selecionar().subscribe({
      next: (lista) => {
        this.funcionarios = lista;
      },

      error: (err) => {
        console.error('Erro ao carregar funcionários', err);
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
