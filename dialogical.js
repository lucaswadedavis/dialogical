const { Suggestions } = require('actions-on-google');
const selectRandom = (arr) => arr[arr.length * Math.random() | 0];
const Handlebars = require('handlebars');

const interpolate = (res, context) => {
  const template = Handlebars.compile(res);
  return template(context);
};

/*
 * TODOs
 * - support string interpolation in the response strings
 * - build a demo that shows how to disambiguate affirmations
*/

const states = {
  isWelcome: Boolean,
  partyCount: Number
};

class Dialogical{

  // in addition to the rules, we need to track all the possible states too
  constructor(rules) {
    // If I wanted to be really clever, I'd sort this by number of criteria
    this.dialogState = null;
    this.rules = rules;
    return (nextState, params={}) => {
      // maybe I should return not just the response, but the updated kv
      this.dialogState = nextState;
      console.log('dialogState: \n', nextState, '\n');
      this.updateStateBeforeQuery(params);
      const rule = this.pickRule();
      let response;
      if (!rule) {
        return ['Bad news: no rule matched.'];
      }
      response = [interpolate(selectRandom(rule.responses), nextState)];
      if (rule.suggestions.length) {
        response.push(new Suggestions(rule.suggestions));
      }
      console.log('response: ', response);
      if (rule.updates.length) {
        this.updateStateAfterQuery(rule.updates);
      }
      return response;
    }
  }

  updateStateBeforeQuery(params) {
    for (let key in params) {
      let [token, name, operator] = key.split('-');
      if (token !== 'dialogical') continue;
      if (!operator) this.dialogState[name] = params[key];
      if (operator === 'set') this.dialogState[name] = params[key];
      if (operator === 'equal') this.dialogState[name] = params[key];
      if (operator === 'add') this.dialogState[name] += parseInt(params[key]);
      if (operator === 'subtract') this.dialogState[name] -= parseInt(params[key]);
    }
  }

  updateStateAfterQuery(updates) {
    console.log('updates: \n', updates, '\n');
    const { dialogState } = this;
    for (let i = 0; i < updates.length; i++) {
      let { state, operator, value } = updates[i];
      if (operator === '+') {
        if (dialogState[state] === undefined) dialogState[state] = 0;
        dialogState[state] += parseInt(value);
        console.log('incremented!', parseInt(value), dialogState[state]);
      }
      if (operator === '-') {
        if (dialogState[state] === undefined) dialogState[state] = 0;
        dialogState[state] -= parseInt(value);
        console.log('incremented!', parseInt(value), dialogState[state]);
      }
      if (operator === '=') {
        // will also have to check state types here eventually
        if (dialogState[state] === undefined) dialogState[state] = value;
        dialogState[state] = value;
      }
    }
    console.log('dialogState: ', dialogState);
  }

  pickRule() {
    const { dialogState, rules } = this;
    const bestMatch = rules.map(rule => {
        // all of these need to pass
        let count = 0;
        for (let i = 0; i < rule.criteria.length; i++) {
          let criterion = rule.criteria[i];
          let matched = false;
          let { comparitor, state, value } = criterion;
          if (comparitor === '=') {
            if (dialogState[state] === value) {
              count++;
              matched = true;
            }
          } else if (comparitor === '>') {
            if (dialogState[state] > value) {
              count++;
              matched = true;
            }
          } else if (comparitor === '<') {
            if (dialogState[state] < value) {
              count++;
              matched = true;
            }
          } else if (comparitor === 'exists') {
            if (dialogState[state]) {
              count++;
              matched = true;
            }
          }
          // if ANY of the criteria don't match, this rule should not match
          if (!matched) {
            console.log('no match found for ', rule.name);
            count = 0;
            break;
          }
        };
      console.log('rule name: ', rule.name, 'count: ', count);
      return { count, rule };
    }).sort((a, b) => b.count - a.count)[0];
    return bestMatch.count ? bestMatch.rule : null;
  }

}

exports.Dialogical = Dialogical;
