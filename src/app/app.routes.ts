import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { FuncionarioListagem } from './pages/funcionario/funcionario-listagem/funcionario-listagem';
import { FuncionarioCadastro } from './pages/funcionario/funcionario-cadastro/funcionario-cadastro';
import { FuncionarioEdicao } from './pages/funcionario/funcionario-edicao/funcionario-edicao';
import { Notfound } from './pages/notfound/notfound';
import { MedicamentoCadastro } from './pages/medicamento/medicamento-cadastro/medicamento-cadastro';
import { MedicamentoListagem } from './pages/medicamento/medicamento-listagem/medicamento-listagem';
import { MedicamentoEdicao } from './pages/medicamento/medicamento-edicao/medicamento-edicao';
import { AcolhidoCadastro } from './pages/acolhido/acolhido-cadastro/acolhido-cadastro';
import { AcolhidoListagem } from './pages/acolhido/acolhido-listagem/acolhido-listagem';
import { AcolhidoEdicao } from './pages/acolhido/acolhido-edicao/acolhido-edicao';
import { ProdutoCadastro } from './pages/produto/produto-cadastro/produto-cadastro';
import { ProdutoListagem } from './pages/produto/produto-listagem/produto-listagem';
import { ProdutoEdicao } from './pages/produto/produto-edicao/produto-edicao';
import { MedicamentoEstoque } from './pages/medicamento/medicamento-estoque/medicamento-estoque';
import { EventoCadastro } from './pages/agenda/evento-cadastro/evento-cadastro';
import { EdicaoEvento } from './pages/agenda/evento-edicao/evento-edicao';
import { EventoListagem } from './pages/agenda/evento-listagem/evento-listagem';
import { authGuard } from './guards/auth-guard';
import { AlterarSenha } from './pages/alterar-senha/alterar-senha';
import { MedicamentoControle } from './pages/medicamento/medicamento-controle/medicamento-controle';
import { ProdutoControle } from './pages/produto/produto-controle/produto-controle';
import { PatrimonioListagem } from './pages/patrimonio/patrimonio-listagem/patrimonio-listagem';
import { PatrimonioEdicao } from './pages/patrimonio/patrimonio-edicao/patrimonio-edicao';
import { PatrimonioCadastro } from './pages/patrimonio/patrimonio-cadastro/patrimonio-cadastro';
import { canDeactivateGuard } from './guards/can-deactivate-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'funcionario',
    children: [
      {
        path: 'cadastro',
        component: FuncionarioCadastro,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      { path: 'listagem', component: FuncionarioListagem, canActivate: [authGuard] },
      {
        path: 'edicao/:id',
        component: FuncionarioEdicao,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  {
    path: 'medicamento',
    children: [
      {
        path: 'cadastro',
        component: MedicamentoCadastro,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      { path: 'listagem', component: MedicamentoListagem, canActivate: [authGuard] },
      {
        path: 'edicao/:id',
        component: MedicamentoEdicao,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'estoque/:id',
        component: MedicamentoEstoque,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  {
    path: 'acolhido',
    children: [
      {
        path: 'cadastro',
        component: AcolhidoCadastro,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      { path: 'listagem', component: AcolhidoListagem, canActivate: [authGuard] },
      {
        path: 'edicao/:id',
        component: AcolhidoEdicao,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'controle-medicamento/:id',
        component: MedicamentoControle,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  {
    path: 'produto',
    children: [
      { path: 'cadastro', component: ProdutoCadastro, canActivate: [authGuard] },
      {
        path: 'listagem',
        component: ProdutoListagem,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'edicao/:id',
        component: ProdutoEdicao,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'controle',
        component: ProdutoControle,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  {
    path: 'agenda',
    children: [
      { path: 'listagem', component: EventoListagem, canActivate: [authGuard] },
      {
        path: 'evento-edicao/:id',
        component: EdicaoEvento,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'evento-cadastro',
        component: EventoCadastro,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  {
    path: 'patrimonio',
    children: [
      { path: 'listagem', component: PatrimonioListagem, canActivate: [authGuard] },
      {
        path: 'edicao/:id',
        component: PatrimonioEdicao,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'cadastro',
        component: PatrimonioCadastro,
        canActivate: [authGuard],
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  { path: 'alterar-senha', component: AlterarSenha },
  { path: 'login', component: Login },
  { path: '**', component: Notfound },
];
