import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDocumentComponent } from './createdocument.component';

describe('CreatedocumentComponent', () => {
  let component: CreateDocumentComponent;
  let fixture: ComponentFixture<CreateDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
