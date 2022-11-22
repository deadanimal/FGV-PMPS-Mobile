import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HarvestTaskDistributionPage } from './harvest-task-distribution.page';

describe('HarvestTaskDistributionPage', () => {
  let component: HarvestTaskDistributionPage;
  let fixture: ComponentFixture<HarvestTaskDistributionPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvestTaskDistributionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HarvestTaskDistributionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
