import { Component } from '@angular/core';
import { Header } from '../../../components/header/header'; 
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MedicamentoService } from '../../../services/medicamento/medicamento.service';
import { Medicamento } from '../../../models/Medicamento';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medicamento-cadastro',
  imports: [Header, RouterLink, FormsModule],
  templateUrl: './medicamento-cadastro.html',
  styleUrl: './medicamento-cadastro.css',
})
export class MedicamentoCadastro {
    //JSON de funcionario
    medicamentos:Medicamento[] = [];
  
    constructor(private servico:MedicamentoService, private toastr: ToastrService){
  
    }
    
    //Objeto do tipo funcionário
    medicamento = new Medicamento();

    //Método de cadastro
    cadastrar(form:any):void{

      this.servico.cadastrar(this.medicamento).subscribe(retorno => {this.medicamentos.push(retorno);

        this.medicamento = new Medicamento();
        form.reset();

        this.toastr.success("Medicamento cadastrado com sucesso!");
        //this.router.navigate(['/medicamento/listagem']);
      });
    }
}
