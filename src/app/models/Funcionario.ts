export class Funcionario {

    id?: number;

    nome: string = '';
    telefone: string = '';
    dataNascimento: string = '';
    email: string = '';

    cpf: string = '';
    rg: string = '';
    orgaoEmissor: string = '';
    uf: string = '';

    cargo: string = '';
    escolaridade: string = '';

    cargaHoraria: string = '';
    sexo: string = '';

    dataAdmissao: string = '';
    dataSaida?: string;

    ativo: boolean = true;
    
    senha: string = '';

}