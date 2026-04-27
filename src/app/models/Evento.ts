export class Evento {
  id!: number;
  nome: string = '';
  data: string = '';
  hora: string = '';
  responsaveis: number[] = [];
  status: 'Em andamento' | 'Cancelado' | 'Adiado' | 'Realizado' = 'Em andamento';
  descricao: string = '';
  acolhidos: number[] = [];
}
