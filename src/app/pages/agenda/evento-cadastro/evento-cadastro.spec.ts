import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoCadastro } from './evento-cadastro';

describe('CadastroEvento', () => {
  let component: EventoCadastro;
  let fixture: ComponentFixture<EventoCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventoCadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(EventoCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
