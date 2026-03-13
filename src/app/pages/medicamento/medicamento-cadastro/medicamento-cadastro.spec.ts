import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicamentoCadastro } from './medicamento-cadastro';

describe('MedicamentoCadastro', () => {
  let component: MedicamentoCadastro;
  let fixture: ComponentFixture<MedicamentoCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicamentoCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicamentoCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
