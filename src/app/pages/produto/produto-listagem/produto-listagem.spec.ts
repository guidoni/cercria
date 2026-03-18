import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoListagem } from './produto-listagem';

describe('ProdutoListagem', () => {
  let component: ProdutoListagem;
  let fixture: ComponentFixture<ProdutoListagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoListagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoListagem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
