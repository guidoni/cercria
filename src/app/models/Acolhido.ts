export class Acolhido {
  id?: number;

  nome: string = '';
  cpf: string = '';
  dataNascimento: string = '';

  escola: string = '';
  localFamiliar?: string;

  numeroProcesso?: string;
  vara?: string;

  dataEntrada: string = '';
  corPele: string = '';

  dataSaida?: string;

  deficiencia?: string;
  ppcaam?: string;

  medicamentos: number[] = [];

  tamanhoCamiseta: string = '';
  tamanhoBermudaCalca: string = '';
  tamanhoCalcado!: number;
  tamanhoRoupaIntima: string = '';
  ativo: boolean = true;
}
