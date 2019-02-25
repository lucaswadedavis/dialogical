import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

const parseCriterion = (text="") => {
  // make this better
  const [key="", operator="", value=''] = text.split(' ');
  return {key, operator, value, text};
}

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
    this.setupForm();
    this.onCriteriaChanges();
    this.onSuggestionChanges();
  }
  //////////////////////////////
  setupForm() {
    const suggestions = this.rule.suggestions.map(sug => {
      return this.createSuggestion(sug.text);
    });
    suggestions.push(this.createSuggestion());
    const criteria = this.rule.criteria.map(criteria => {
      return this.createCriterionFromJSON(criteria);
    });
    criteria.push(this.createCriterionFromString());
    this.ruleFormGroup = this.formBuilder.group({
      suggestions: this.formBuilder.array(suggestions),
      criteria: this.formBuilder.array(criteria),
    });
  }

  //////////////////////////////
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
  ///////////////////////////////////////////
  //////////////////////////////

  createCriterionFromString(rawCriterion): FormGroup {
    const {key, comparitor, value} = parseCriterion(rawCriterion);
    const criterion = this.rule.add.criterion(key, comparitor, value);
    return this.formBuilder.group(criterion);
  }


  createCriterionFromJSON(criterion): FormGroup {
    const {key, comparitor, value} = criterion;
    this.rule.add.criterion(key, comparitor, value);
    return this.formBuilder.group(criterion);
  }

  onCriteriaChanges(): void {
    const criteria = this.ruleFormGroup.get('criteria') as FormArray;
    criteria.valueChanges.subscribe((val) => {
      const numberOfEmptyCriteria = criteria.value
        .filter(criterion => !(criterion.text.trim())).length;
      if (numberOfEmptyCriteria === 0) {
        criteria.push(this.createCriterionFromString());
      }
    });
  }
  ///////////////////////////////////////////

}
