import { Component } from '@angular/core';
import {
  ESnextParser,
  ES6StaticEval,
  BasicParser,
  Parser,
  BasicEval,
  StaticEval,
  INode,
} from 'espression';
import { JsonPathParser, JsonPathStaticEval, ESPathParser } from 'espression-jsonpath';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  expression = 'a + b ';
  ast: INode | undefined;
  parser: Parser;
  eval: StaticEval;
  value: any;
  showValue = '';
  context: any = { a: 1, b: 2, foo: { x: 10, y: 20 } };
  contextStr = '{a: 1, b: 2, foo: { x:10, y:20 } }';
  builtins = true;
  preset = 'ES6';

  esParser = new ESnextParser();
  staticEval = new ES6StaticEval();

  constructor() {
    this.changePreset();
    this.updateContext();

    this.parser = this.esParser;
    this.eval = this.staticEval;
  }

  changePreset() {
    switch (this.preset) {
      case 'ES6':
        this.parser = this.esParser;
        this.eval = this.staticEval;
        break;
      case 'jsep':
        this.parser = new BasicParser();
        this.eval = new BasicEval();
        break;
      case 'jsonPath':
        this.parser = new JsonPathParser();
        this.eval = new JsonPathStaticEval();
        break;
      case 'ES5+jP':
        this.parser = new ESPathParser();
        this.eval = new JsonPathStaticEval();
        break;
    }
    this.updateExpression();
  }
  updateExpression() {
    try {
      this.ast = this.parser.parse(this.expression);
      try {
        this.value = this.eval.evaluate(this.ast, this.context);
      } catch (e) {
        this.showValue = `ERROR: "${e.message}"`;
        return;
      }
    } catch (e) {
      this.ast = e.message;
      this.showValue = '';
      return;
    }

    switch (typeof this.value) {
      case 'string':
      case 'object':
        this.showValue = JSON.stringify(this.value);
        break;
      case 'undefined':
        this.showValue = 'undefined';
        break;
      default:
        this.showValue = this.value.toString();
    }
  }

  updateContext() {
    try {
      const ast = this.esParser.parse(this.contextStr);
      this.context = this.staticEval.evaluate(ast);
      if (
        typeof this.context !== 'object' ||
        Array.isArray(this.context) ||
        this.context === null
      ) {
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
    this.updateExpression();
  }
}
