import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcolhidoEdicao } from './acolhido-edicao';

describe('AcolhidoEdicao', () => {
  let component: AcolhidoEdicao;
  let fixture: ComponentFixture<AcolhidoEdicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcolhidoEdicao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcolhidoEdicao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
