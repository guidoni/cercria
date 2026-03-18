import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoEdicao } from './produto-edicao';

describe('ProdutoEdicao', () => {
  let component: ProdutoEdicao;
  let fixture: ComponentFixture<ProdutoEdicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoEdicao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoEdicao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
