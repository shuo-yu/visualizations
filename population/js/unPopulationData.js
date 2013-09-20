/*global define */
/*jslint indent: 2, plusplus: true */
/*jslint nomen: true */ // this causes JSLint to tolerate "_"
define(['underscore'], function (_) {
  "use strict";
  var dataURL = 'http://curran.github.io/data/un/population/populationEstimates.js',
    cachedData;

  function parseDate(year) {
    return new Date(year, 0);
  }

  function parsePopulation(populationStr) {
    return parseInt(populationStr.replace(/ /g, ''), 10) / 1000000;
  }

  function process(data) {
    var years = _.range(1950, 2010),
        nameField = 'Major area, region, country or area';

    // keys: country names
    // values: arrays of objects with 'date' and 'population' values.
    return _.filter(
      // Format the data as it is expected by D3 stack layout.
      // See http://bl.ocks.org/mbostock/3885211
      _.map(data, function (entry) {
        return {
          name: entry[nameField],
          values: _.map(years, function (year) {
            return {
              date: parseDate(year),
              y: parsePopulation(entry[year])
            };
          })
        };
      // Filter by entries whose name are all upper case,
      // because these are the continent categories and 
      // the whole world aggregate. 
      }), function (d) {
        return _.every(d.name, function (character) {
          var isUpperCase = character == character.toUpperCase(),
              isSpace = character == ' ';
          return isUpperCase || isSpace;
        });
      });
  }

  return {
    get: function (callback) {
      if (cachedData) {
        callback(null, cachedData);
      } else {
        // Load the data dynamically as an AMD module.
        require([dataURL], function (data) {
          cachedData = process(data);
          callback(null, cachedData);
        });
      }
    }
  };
});
