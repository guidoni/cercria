import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoHistorico } from './produto-historico';

describe('ProdutoHistorico', () => {
  let component: ProdutoHistorico;
  let fixture: ComponentFixture<ProdutoHistorico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoHistorico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoHistorico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
