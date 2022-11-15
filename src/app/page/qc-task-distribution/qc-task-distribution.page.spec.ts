import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { QcTaskDistributionPage } from './qc-task-distribution.page';

describe('QcTaskDistributionPage', () => {
  let component: QcTaskDistributionPage;
  let fixture: ComponentFixture<QcTaskDistributionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QcTaskDistributionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(QcTaskDistributionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
