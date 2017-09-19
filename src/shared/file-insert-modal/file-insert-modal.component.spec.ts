import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInsertModalComponent } from './file-insert-modal.component';

describe('FileInsertModalComponent', () => {
  let component: FileInsertModalComponent;
  let fixture: ComponentFixture<FileInsertModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileInsertModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileInsertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
