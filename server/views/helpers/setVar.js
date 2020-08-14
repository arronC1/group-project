// from https://stackoverflow.com/questions/45241022/assign-a-variable-in-handlebars

const handlebars = require('handlebars');
handlebars.registerHelper('setVar', function(varName, varValue, options) {
  options.data.root[varName] = varValue;
});