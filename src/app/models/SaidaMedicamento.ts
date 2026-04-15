import { Acolhido } from './Acolhido';

export class SaidaMedicamento {
  id?: number;
  quantidade: number = 0;
  dataSaida: string = '';
  motivo: string = '';
  horaSaida: number = 0;
  responsavel: string = '';
  acolhidoId?: { id: number };
  medicamento?: { id: number };
  acolhido?: Acolhido;
}
