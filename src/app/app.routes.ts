import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { FuncionarioListagem } from './pages/funcionario/funcionario-listagem/funcionario-listagem';
import { FuncionarioCadastro } from './pages/funcionario/funcionario-cadastro/funcionario-cadastro';
import { FuncionarioEdicao } from './pages/funcionario/funcionario-edicao/funcionario-edicao';
import { Notfound } from './pages/notfound/notfound';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  {
    path: 'funcionario',
      children: [
        { path: 'cadastro', component: FuncionarioCadastro },
        { path: 'listagem', component: FuncionarioListagem },
        { path: 'edicao/:id', component: FuncionarioEdicao }
    ]
  },
  { path: 'login', component: Login},
  { path: '**', component: Notfound }
];
