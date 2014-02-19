// This module implements the stacked area visualization.
//
// Curran Kelleher 2/18/2014
define(['getShortName'], function (getShortName) {

  // This function should be called once to set up the visualization.
  function init(svg, outerWidth, outerHeight, margin, data){

    // The following code draws from
    // http://bl.ocks.org/mbostock/3885211
    var width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom,
        x = d3.time.scale()
          .range([0, width]),
        y = d3.scale.linear()
          .range([height, 0]),
        color = d3.scale.ordinal()
          // Colors hand-picked from http://www.w3schools.com/tags/ref_colorpicker.asp
          .range(['#006699','#00CC99','#009933','#CC6699','#99CC00','#CC9900','#CC3300','#FFCC00','#FF0000','#990033','#FF6699','#CC3399','#9900FF','#6666FF','#3333CC','#66CCFF','#0000FF','#00FFFF','#99FFCC','#CCFF99','#FFCC99','#FF99CC','#CC99FF','#CCCCFF','#333300']);
        xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom'),
        area = d3.svg.area()
          .x(function(d) { return x(d.date); })
          .y0(function(d) { return y(d.y0); })
          .y1(function(d) { return y(d.y0 + d.y); }),
        stack = d3.layout.stack()
          .values(function(d) { return d.values; })
          .offset('expand'),
        g = svg.append('g')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Set the color domain so each color is a cause of death.
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== 'year'; }));

    // Parse years into Date objects for use with D3 time scale.
    data.forEach(function(d) {
      d.date = new Date(d.year, 0);
    });

    // Transform the data for D3's stack layout.
    // see https://github.com/mbostock/d3/wiki/Stack-Layout
    var causes = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, y: clean(d[name])};
        })
      };
    })

    // Remove the "all causes" entry.
    causes = _.filter(causes, function (cause) {
      return cause.name !== 'All causes';
    });

    // Sort the layers by the most recent value.
    causes = _.sortBy(causes, function(cause) {
      return cause.values[cause.values.length - 1].y;
    });

    var layers = stack(causes);

    x.domain(d3.extent(data, function(d) { return d.date; }));

    var cause = g.selectAll('.cause')
      .data(layers)
      .enter().append('g')
      .attr('class', 'cause');

    // Add the stacked areas.
    cause.append('path')
      .attr('class', 'area')
      .attr('d', function(d) { return area(d.values); })
      .style('fill', function(d) { return color(d.name); });

    // Add the legend.
    // See http://bl.ocks.org/mbostock/3888852
    var legend = g
      .selectAll('.legend')
        // Use sorted causes for legend.
        .data(causes.map(function(d){ return d.name; }).reverse())
      .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          return 'translate(' + (width + 3) + ',' + i * 20 + ')'; 
        });

    legend.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', color);

    legend.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('dy', '.35em')
        .text(getShortName);

    // Add the X axis (years).
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);


  }

  // Replace missing data with 0 and parse strings into numbers.
  function clean(value){
    return value === '~' ? 0 : parseFloat(value);
  }

  return {init: init};
});
