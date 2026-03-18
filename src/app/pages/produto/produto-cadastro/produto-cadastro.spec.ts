import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoCadastro } from './produto-cadastro';

describe('ProdutoCadastro', () => {
  let component: ProdutoCadastro;
  let fixture: ComponentFixture<ProdutoCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
