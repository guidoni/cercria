import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioCadastro } from './funcionario-cadastro';

describe('FuncionarioCadastro', () => {
  let component: FuncionarioCadastro;
  let fixture: ComponentFixture<FuncionarioCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
