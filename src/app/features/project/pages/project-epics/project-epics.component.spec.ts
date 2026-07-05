import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEpicsComponent } from './project-epics.component';

describe('ProjectEpicsComponent', () => {
  let component: ProjectEpicsComponent;
  let fixture: ComponentFixture<ProjectEpicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEpicsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectEpicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
