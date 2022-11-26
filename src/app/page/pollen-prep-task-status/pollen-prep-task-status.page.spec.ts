import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PollenPrepTaskStatusPage } from './pollen-prep-task-status.page';

describe('PollenPrepTaskStatusPage', () => {
  let component: PollenPrepTaskStatusPage;
  let fixture: ComponentFixture<PollenPrepTaskStatusPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PollenPrepTaskStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PollenPrepTaskStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
