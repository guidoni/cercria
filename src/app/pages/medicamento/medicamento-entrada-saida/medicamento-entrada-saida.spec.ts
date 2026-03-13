import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoEntradaSaida } from './medicamento-entrada-saida';

describe('MedicamentoEntradaSaida', () => {
  let component: MedicamentoEntradaSaida;
  let fixture: ComponentFixture<MedicamentoEntradaSaida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoEntradaSaida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentoEntradaSaida);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
