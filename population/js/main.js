/**
 * A line chart of UN Population data.
 * See D3 line chart example http://bl.ocks.org/mbostock/3883245
 *
 * Curran Kelleher 9/9/2013
 */

/*global require, window */
/*jslint indent: 2 */
/*jslint nomen: true */ // this causes JSLint to tolerate "_"
require(['d3', 'underscore', 'getterSetters', 'unPopulationData'], function (d3, _, getterSetters, unPopulationData) {
  "use strict";
  var my = getterSetters({
    width: 0,
    height: 0,
    margin: {top: 20, right: 20, bottom: 30, left: 30},
  }),
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
    line = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.population); }),
    div = d3.select('#vis'),
    svg = div.append('svg'),
    g = svg.append('g'),
    xAxisGroup = g.append('g'),
    yAxisGroup = g.append('g'),
    linePath = g.append('path'),
    frameRect = svg.append('rect'),
    title = g.append('text')
    .attr('y', 20)
    .attr('class', 'title')
    .text('World Population'),
    updateFrameRect = _.debounce(function () {
      frameRect
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', my.width())
        .attr('height', my.height())
        .attr('stroke-width', 1.5)
        .attr('stroke', 'black')
        .attr('fill-opacity', 0)
        .style('shape-rendering', 'crispEdges');
    }),
    updatePlotLine = _.debounce(function () {
      unPopulationData.get(function (err, data) {
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.population; })]);

        linePath.datum(data)
          .attr('class', 'line')
          .attr('d', line);

        xAxisGroup
          .attr('class', 'x axis')
          .call(xAxis);

        yAxisGroup
          .attr('class', 'y axis')
          .call(yAxis);
      });
    });

  yAxisGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Population (billions)');

  function width() {
    return my.width() - my.margin().left - my.margin().right;
  }

  function height() {
    return my.height() - my.margin().top - my.margin().bottom;
  }

  function updateSize() {
    g.attr('transform', 'translate(' + my.margin().left + ',' + my.margin().top + ')');
    xAxisGroup.attr('transform', 'translate(0,' + height() + ')');
    title.attr('x', my.width() / 2);
    x.range([0, width()]);
    y.range([height(), 0]);
    updateFrameRect();
    updatePlotLine();
  }

  my.width.on('change', updateSize);
  my.height.on('change', updateSize);
  my.margin.on('change', updateSize);

  function setSizeFromDiv() {
    var dom = div.node();
    my.width(dom.clientWidth);
    my.height(dom.clientHeight);
  }
  setSizeFromDiv();
  window.addEventListener('resize', setSizeFromDiv);
});
