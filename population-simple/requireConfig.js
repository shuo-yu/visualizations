(function () {
  var libDir = '../lib/';
  require.config({
    paths: {
      'd3': libDir + 'd3.min',
      'underscore': libDir + 'underscore-min',
      'backbone': libDir + 'backbone-min'
    },
    shim: {
      'd3': {
        exports: 'd3'
      },
      'underscore': {
        exports: '_'
      },
      'backbone': {
        exports: 'Backbone',
        deps: ['underscore']
      }
    }
  });
}());
