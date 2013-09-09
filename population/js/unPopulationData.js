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
    var world = data[0], years = _.range(1950, 2010);
    return _.map(years, function (year) {
      return {
        date: parseDate(year),
        population: parsePopulation(world[year])
      };
    });
  }

  return {
    get: function (callback) {
      if (cachedData) {
        callback(null, cachedData);
      } else {
        require([dataURL], function (data) {
          cachedData = process(data);
          callback(null, cachedData);
        });
      }
    }
  };
});
