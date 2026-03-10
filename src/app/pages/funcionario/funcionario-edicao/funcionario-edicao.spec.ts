import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioEdicao } from './funcionario-edicao';

describe('FuncionarioEdicao', () => {
  let component: FuncionarioEdicao;
  let fixture: ComponentFixture<FuncionarioEdicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioEdicao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuncionarioEdicao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
