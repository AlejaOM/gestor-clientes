import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCardComponent } from './cliente-card.component';

describe('ClienteCardComponent', () => {
  let component: ClienteCardComponent;
  let fixture: ComponentFixture<ClienteCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
