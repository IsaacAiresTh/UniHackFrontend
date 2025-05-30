import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesafioDetalheComponent } from './desafio-detalhe.component';

describe('DesafioDetalheComponent', () => {
  let component: DesafioDetalheComponent;
  let fixture: ComponentFixture<DesafioDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesafioDetalheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesafioDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
