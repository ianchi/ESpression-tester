import { Component } from '@angular/core';
import {
  es5ParserFactory, es5EvalFactory,
  jsepParserFactory,
  jsonPathEvalFactory, jsonPathParserFactory,
  es5PathParserFactory
} from 'espression';
import { JsonPath } from 'espression/dist/src/eval/jsonPath';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  expression = 'a + b * c';
  ast: any;
  parser;
  eval;
  value: any;
  context: any = {a: 1, b: 2, c: 3};
  contextStr = '{"a": 1, "b": 2, "c": 3}';
  builtins = true;
  preset = 'ES5';

  constructor() {
    this.changePreset();
    this.updateContext(null);
  }

  changePreset() {
    switch (this.preset) {
      case 'ES5':
        this.parser = es5ParserFactory();
        this.eval = es5EvalFactory();
        break;
      case 'jsep':
        this.parser = jsepParserFactory();
        this.eval = es5EvalFactory();
        break;
      case 'jsonPath':
        this.parser = jsonPathParserFactory();
        this.eval = jsonPathEvalFactory();
        break;
      case 'ES5+jP':
        this.parser = es5PathParserFactory();
        this.eval = jsonPathEvalFactory();
        break;
    }
    this.updateExpression(null);
  }
  updateExpression(event?) {
    try {
      this.ast = this.parser.parse(this.expression);
      this.value = this.eval.eval(this.ast, this.context);
    } catch (e) {
      this.ast = e.message;
      this.value = undefined;
    }

    if (typeof this.value === 'undefined') { this.value = 'undefined'; }
  }

  updateContext(event?) {
    try {
      this.context = JSON.parse(this.contextStr);
      if (typeof this.context !== 'object') { this.context = {}; }

    } catch (e) {
      this.context = {};
    }
    if (this.builtins) {
      this.context = {
        ... this.context, ...{
          Object: Object,
          Array: Array,
          Math: Math,
          Date: Date,
          Number: Number,
          String: String,
          RegExp: RegExp,
          Boolean: Boolean,

          Infinity: Infinity,
          undefined: undefined,
          NaN: NaN,

          isFinite: isFinite,
          isNaN: isNaN,
          parseFloat: parseFloat,
          parseInt: parseInt
        }
      };
    }
    this.updateExpression(null);
  }
}
