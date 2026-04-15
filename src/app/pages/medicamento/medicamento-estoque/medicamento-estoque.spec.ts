import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoEstoque } from './medicamento-estoque';

describe('MedicamentoEstoque', () => {
  let component: MedicamentoEstoque;
  let fixture: ComponentFixture<MedicamentoEstoque>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoEstoque]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentoEstoque);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
