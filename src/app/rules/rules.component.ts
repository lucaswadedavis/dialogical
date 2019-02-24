import { Component, OnInit } from '@angular/core';

const Id = () => {
  return 'id-' + (Math.random() * 1000000 | 0);
}

const keys = [
  {name: 'isWelcome', kind: Boolean},
  {name: 'numberOfTurns', kind: Number},
];

interface Rule {
  criteria: any;
  responses: any;
  suggestions: any;
  updates: any;
  add: any;
}

class Rule {
  constructor() {
    const root = this;
    const criteria = this.criteria = [];
    const responses = this.responses = [];
    const suggestions = this.suggestions = [];
    const updates = this.updates = [];

    this.add = {
      criterion(key, comparitor, value) {
        const id = Id();
        const criterion = { id, key, comparitor, value};
        criteria.push(criterion);
        return criterion;
      },
      response(text) {
        const id = Id();
        const response = { id, text };
        responses.push(response);
        return response;
      },
      suggestion(text) {
        const id = Id();
        const suggestion = { id, text };
        suggestions.push(suggestion);
        return suggestion;
      },
      update(key, operator, value) {
        const id = Id();
        const update = { id, key, operator, value };
        updates.push(update);
        return update;
      },
    };

  }
}

const rule1 = new Rule();
rule1.add.criterion('isWelcome', '=', true);
rule1.add.response('Hi, hello');
rule1.add.update('isWelcome', '=', false);
rule1.add.suggestion('Hi');
const rule2 = new Rule();
rule2.add.criterion('isWelcome', '=', false);
rule2.add.response('Nice to see you again');

const rules = [
  rule1,
  rule2,
];

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  sectionTitle = 'Rules';

  rules = rules;
  keys = keys;

  constructor() { }

  ngOnInit() {
  }

}
