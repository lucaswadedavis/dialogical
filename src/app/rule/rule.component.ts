import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css']
})
export class RuleComponent implements OnInit {

  suggestions = new FormControl("");
  @Input() rule: any;
  @Input() keys: any;

  constructor() { }

  ngOnInit() {
    this.onChanges();
  }

  onChanges(): void {
    this.suggestions.valueChanges.subscribe(val => {
      const { suggestions } = this.rule;
      const numberOfEmptySuggestions= suggestions.filter(suggestion => {
        return !suggestion.text;
      }).length;
      if (numberOfEmptySuggestions === 0) {
        this.rule.add.suggestion('');
      }
    });
  }
}
