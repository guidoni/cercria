import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcolhidoCadastro } from './acolhido-cadastro';

describe('AcolhidoCadastro', () => {
  let component: AcolhidoCadastro;
  let fixture: ComponentFixture<AcolhidoCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcolhidoCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcolhidoCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
