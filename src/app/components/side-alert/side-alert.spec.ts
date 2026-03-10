import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideAlert } from './side-alert';

describe('SideAlert', () => {
  let component: SideAlert;
  let fixture: ComponentFixture<SideAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
