import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcolhidoListagem } from './acolhido-listagem';

describe('AcolhidoListagem', () => {
  let component: AcolhidoListagem;
  let fixture: ComponentFixture<AcolhidoListagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcolhidoListagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcolhidoListagem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
