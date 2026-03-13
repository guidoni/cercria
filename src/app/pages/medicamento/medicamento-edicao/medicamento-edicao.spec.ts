import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoEdicao } from './medicamento-edicao';

describe('MedicamentoEdicao', () => {
  let component: MedicamentoEdicao;
  let fixture: ComponentFixture<MedicamentoEdicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoEdicao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentoEdicao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
