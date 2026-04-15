export class EntradaMedicamento {
  id?: number;
  quantidade: number = 0;
  dataValidade: string = '';
  origem: string = '';
  responsavel: string = '';
  dataEntrada: string = '';
  medicamento?: { id: number };
}
