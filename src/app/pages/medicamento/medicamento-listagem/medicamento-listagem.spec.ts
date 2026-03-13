import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoListagem } from './medicamento-listagem';

describe('MedicamentoListagem', () => {
  let component: MedicamentoListagem;
  let fixture: ComponentFixture<MedicamentoListagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoListagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentoListagem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
