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
    this.onResponseChanges();
    this.onSuggestionChanges();
  }

  setupForm() {
    const criteria = this.rule.criteria.map(criteria => {
      return this.createCriterionFromJSON(criteria);
    });
    criteria.push(this.createCriterionFromString());
    const responses = this.rule.responses.map(res => {
      return this.createResponse(res.text);
    });
    responses.push(this.createResponse());
    const suggestions = this.rule.suggestions.map(sug => {
      return this.createSuggestion(sug.text);
    });
    suggestions.push(this.createSuggestion());
    this.ruleFormGroup = this.formBuilder.group({
      criteria: this.formBuilder.array(criteria),
      responses: this.formBuilder.array(responses),
      suggestions: this.formBuilder.array(suggestions),
    });
  }

  //////////////////////////////
  createResponse(text=""): FormGroup {
    const response = this.rule.add.response(text);
    return this.formBuilder.group(response);
  }

  onResponseChanges(): void {
    const responses = this.ruleFormGroup.get('responses') as FormArray;
    responses.valueChanges.subscribe((val) => {
      const numberOfEmptyResponses = responses.value
        .filter(res => !res.text).length;
      if (numberOfEmptyResponses === 0) {
        responses.push(this.createResponse());
      }
    });
  }
  ///////////////////////////////////////////

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
