import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderFileComponent } from './uploader-file.component';

describe('UploaderFileComponent', () => {
  let component: UploaderFileComponent;
  let fixture: ComponentFixture<UploaderFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploaderFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
