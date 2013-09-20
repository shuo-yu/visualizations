/**
 * A stacked area chart of UN Population data showing population of
 * world continents.
 *
 * Inspired by:
 *
 *  * D3 line chart example http://bl.ocks.org/mbostock/3883245
 *  * Towards Reusable Charts http://bost.ocks.org/mike/chart/
 *  * Stacked Area Chart http://bl.ocks.org/mbostock/3885211
 *
 * By Curran Kelleher
 * Last updated 9/20/2013
 */
require(['d3', 'underscore', 'getterSetters', 'unPopulationData'], function (d3, _, getterSetters, unPopulationData) {
  "use strict";

  // `my` holds the model of the visualization.
  var my = getterSetters({
        width: 0,
        height: 0,
        margin: {top: 20, right: 20, bottom: 30, left: 30},
      }),

      // Scales and Axes
      x = d3.time.scale(),
      y = d3.scale.linear(),
      xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .outerTickSize(0),
      yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .outerTickSize(0),
      xPixelsPerTick = 70,
      yPixelsPerTick = 30,
      yMaxNumTicks = 6,
      color = d3.scale.category20(),

      // `area` and `stack` compute the geometry of the colored areas
      area = d3.svg.area()
        .x(function(d) { return x(d.date); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); }),
      stack = d3.layout.stack()
        .values(function(d) { return d.values; }),

      // Create the visualization DOM tree.
      div = d3.select('#vis'),
      svg = div.append('svg'),
      g = svg.append('g'),
      xAxisGroup = g.append('g'),
      yAxisGroup = g.append('g'),
      frameRect = svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'frameRect'),

      // Add the "World Population" title.
      title = g.append('text')
        .attr('y', 20)
        .attr('class', 'title')
        .text('World Population');

  // Add the "Population (billions)" label to the Y axis.
  yAxisGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Population (billions)');

  // Computes the visualization.
  function computeVisualization() {
    
    // Translate the SVG <g> element that contains the visualization.
    var m = my.margin();
    g.attr('transform', 'translate(' + m.left + ',' + m.top + ')');

    // Translate the X axis to be at the bottom.
    xAxisGroup.attr('transform', 'translate(0,' + height() + ')');

    // Update the title to be horizontally centered.
    title.attr('x', my.width() / 2);

    // Set the scale ranges from the visualization size.
    x.range([0, width()]);
    y.range([height(), 0]);

    // Set the number of tick marks so that tick density
    // is consistent after resizing the visualization.
    xAxis.ticks(width() / xPixelsPerTick);
    yAxis.ticks(Math.min(height() / yPixelsPerTick, yMaxNumTicks));

    // Updates the box around the visualization.
    frameRect
      .attr('width', my.width())
      .attr('height', my.height());

    // Updates all data-driven aspects of the visualization.
    plotData();
  }

  // Debounce computeVisualization() so multiple model changes
  // only cause a single recalculation. For example, when
  // the user resizes the browser, both my.x and my.y change,
  // but computeVisualization should only be called once for
  // both changes, not once for my.x and again for my.y.
  computeVisualization = _.debounce(computeVisualization);

  // Draws the plot line and updates the axes based on the data.
  function plotData() {

    // Get the data from the data cache.
    unPopulationData.get(function (err, data) {
      var world = _.first(data),
          continents = _.rest(data),
          layers = stack(continents),
          layerGroups = g.selectAll('g')
            .data(layers)
            .enter().append('g');

      // Set the scale domains based on the data.
      color.domain(_.pluck(data, 'name'));
      x.domain(d3.extent(world.values, function (d) {
        return d.date;
      }));
      y.domain([0, d3.max(world.values, function (d) {
        return d.y;
      })]);

      // Draw the stacked areas from the data.
      layerGroups.append('path')
        .attr('d', function(d) { return area(d.values); })
        .style('fill', function(d) { return color(d.name); });

      // Update the axes to fit the data.
      xAxisGroup
        .attr('class', 'x axis')
        .call(xAxis);
      yAxisGroup
        .attr('class', 'y axis')
        .call(yAxis);
    });
  }

  // `width()` and `height()` compute the dimensions of the 
  // rectangle inside the margin where the plot goes.
  function width() {
    return my.width() - my.margin().left - my.margin().right;
  }
  function height() {
    return my.height() - my.margin().top - my.margin().bottom;
  }

  // Update the visualization whenever
  // my.width, my.height, or my.margin change.
  my.width.on('change', computeVisualization);
  my.height.on('change', computeVisualization);
  my.margin.on('change', computeVisualization);

  // Sets (my.width, my.height) based on the size
  // of the DOM element that contains the visualization.
  function setSizeFromDiv() {
    var dom = div.node();
    my.width(dom.clientWidth);
    my.height(dom.clientHeight);
  }

  // Compute the visualization for the first time.
  setSizeFromDiv();

  // Recompute the visualization when the user resizes the browser.
  window.addEventListener('resize', setSizeFromDiv);
});
