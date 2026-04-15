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

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'funcionario',
    children: [
      { path: 'cadastro', component: FuncionarioCadastro },
      { path: 'listagem', component: FuncionarioListagem },
      { path: 'edicao/:id', component: FuncionarioEdicao },
    ],
  },
  {
    path: 'medicamento',
    children: [
      { path: 'cadastro', component: MedicamentoCadastro },
      { path: 'listagem', component: MedicamentoListagem },
      { path: 'edicao/:id', component: MedicamentoEdicao },
      { path: 'estoque/:id', component: MedicamentoEstoque },
    ],
  },
  {
    path: 'acolhido',
    children: [
      { path: 'cadastro', component: AcolhidoCadastro },
      { path: 'listagem', component: AcolhidoListagem },
      { path: 'edicao/:id', component: AcolhidoEdicao },
    ],
  },
  {
    path: 'produto',
    children: [
      { path: 'cadastro', component: ProdutoCadastro },
      { path: 'listagem', component: ProdutoListagem },
      { path: 'edicao/:id', component: ProdutoEdicao },
    ],
  },
  { path: 'login', component: Login },
  { path: '**', component: Notfound },
];
