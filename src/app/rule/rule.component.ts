import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css']
})
export class RuleComponent implements OnInit {

  ruleFormGroup: FormGroup;
  @Input() rule: any;
  @Input() keys: any;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.setupSuggestions();
    this.onSuggestionChanges();
  }

  setupSuggestions() {
    const sugs = this.rule.suggestions.map(sug => {
      return this.createSuggestion(sug.text);
    });
    sugs.push(this.createSuggestion());
    this.ruleFormGroup = this.formBuilder.group({
      suggestions: this.formBuilder.array(sugs),
    });
  }

  createSuggestion(text=""): FormGroup {
    const suggestion = this.rule.add.suggestion(text);
    return this.formBuilder.group(suggestion);
  }

  onSuggestionChanges(): void {
    const suggestions = this.ruleFormGroup.get('suggestions') as FormArray;
    suggestions.valueChanges.subscribe((val) => {
      const numberOfEmptySuggestions = suggestions.value
        .filter(sug => !sug.text).length;
      if (numberOfEmptySuggestions === 0) {
        suggestions.push(this.createSuggestion());
      }
    });
  }

}
