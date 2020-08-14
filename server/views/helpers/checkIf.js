// from: https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional

/* Handler to check multiple conditions
   */
  const Handlebars = require( 'handlebars');

  Handlebars.registerHelper('checkIf', function (v1, o1, v2, mainOperator, v3, o2, v4, options) {
  var operators = {
    '==': function (a, b) { return a == b },
    '===': function (a, b) { return a === b },
    '!=': function (a, b) { return a != b },
    '!==': function (a, b) { return a !== b },
    '<': function (a, b) { return a < b },
    '<=': function (a, b) { return a <= b },
    '>': function (a, b) { return a > b },
    '>=': function (a, b) { return a >= b },
    '&&': function (a, b) { return a && b },
    '||': function (a, b) { return a || b },
  }
  var a1 = operators[o1](v1, v2);
  var a2 = operators[o2](v3, v4);
  var isTrue = operators[mainOperator](a1, a2);
  return isTrue ? options.fn(this) : options.inverse(this);
});