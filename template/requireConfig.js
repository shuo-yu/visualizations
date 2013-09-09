(function () {
  var libDir = '../bower_components/';
  require.config({
    paths: {
      'd3': libDir + 'd3/d3.min',
      'underscore': libDir + 'underscore/underscore-min',
      'backbone': libDir + 'backbone/backbone-min'
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
