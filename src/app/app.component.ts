import { Component } from '@angular/core';
import { ES5Parser, ES5StaticEval, BasicParser, Parser, StaticEval, INode } from 'espression';
import { JsonPathParser, JsonPathStaticEval, ES5PathParser } from 'espression-jsonpath';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  expression = 'a + b * c';
  ast: INode;
  parser: Parser;
  eval: StaticEval;
  value: any;
  context: any = { a: 1, b: 2, c: 3 };
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
        this.parser = new ES5Parser();
        this.eval = new ES5StaticEval();
        break;
      case 'jsep':
        this.parser = new BasicParser();
        this.eval = new ES5StaticEval();
        break;
      case 'jsonPath':
        this.parser = new JsonPathParser();
        this.eval = new JsonPathStaticEval();
        break;
      case 'ES5+jP':
        this.parser = new ES5PathParser();
        this.eval = new JsonPathStaticEval();
        break;
    }
    this.updateExpression(null);
  }
  updateExpression(_event?) {
    try {
      this.ast = this.parser.parse(this.expression);
      this.value = this.eval.evaluate(this.ast, this.context);
    } catch (e) {
      this.ast = e.message;
      this.value = undefined;
    }

    if (typeof this.value === 'undefined') {
      this.value = 'undefined';
    }
  }

  updateContext(_event?) {
    try {
      this.context = JSON.parse(this.contextStr);
      if (typeof this.context !== 'object') {
        this.context = {};
      }
    } catch (e) {
      this.context = {};
    }
    if (this.builtins) {
      this.context = {
        ...this.context,
        ...{
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
          parseInt: parseInt,
        },
      };
    }
    this.updateExpression(null);
  }
}
