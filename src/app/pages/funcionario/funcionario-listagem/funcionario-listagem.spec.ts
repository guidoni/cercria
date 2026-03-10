import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioListagem } from './funcionario-listagem';

describe('FuncionarioListagem', () => {
  let component: FuncionarioListagem;
  let fixture: ComponentFixture<FuncionarioListagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioListagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioListagem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
