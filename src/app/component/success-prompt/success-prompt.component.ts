import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-success-prompt',
  templateUrl: './success-prompt.component.html',
  styleUrls: ['./success-prompt.component.scss'],
})
export class SuccessPromptComponent implements OnInit {

  @Input() value:String;
  constructor() { }

  ngOnInit() {}

}
