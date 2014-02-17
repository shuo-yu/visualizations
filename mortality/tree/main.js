// A tree visualization of Cause of Death data from the Centers for Disease Control.
//
// Details of the data can be found here:
// https://github.com/curran/data/tree/gh-pages/cdc/mortality
//
// Draws from:
//
// Radial Tree
// http://bl.ocks.org/mbostock/4063550
//
// Linear Tree
// http://bl.ocks.org/mbostock/4063570
//
// Margin Convention
// http://bl.ocks.org/mbostock/3019563
//
// Curran Kelleher
// 2/17/2014
//
var dataModuleURL = 'http://curran.github.io/data/cdc/mortality/hierarchy/hierarchy.js';
require([dataModuleURL], function(data){
  
  var outerWidth = 1100,
      outerHeight = 700,
      nodeRadius = 2,
      margin = {top: 0, right: 180, bottom: 0, left: 8},
      width = outerWidth - margin.left - margin.right,
      height = outerHeight - margin.top - margin.bottom,

      tree = d3.layout.tree()
        .size([height, width])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; }),

      //diagonal = d3.svg.diagonal.radial()
      //  .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; }),
      diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; }),

      svg = d3.select('body').append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight),
      
      g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),

      shortNames = {
        'Major cardiovascular diseases': 'Cardiovascular diseases',
        'Symptoms, signs, and abnormal clinical and laboratory findings, not elsewhere classified': 'Unclassified conditions',
        'Chronic lower respiratory diseases': 'Respiratory diseases',
        'Pneumonitis due to solids and liquids': 'Pneumonitis',
        'Chronic liver disease and cirrhosis': 'Liver disease',
        'Complications of medical and surgical care': 'Complications of care',
        'Benign/other neoplasms': 'Neoplasms'
      };

  var nodes = tree.nodes(data),
      links = tree.links(nodes);

  var link = g.selectAll('.link')
      .data(links)
    .enter().append('path')
      .attr('class', 'link')
      .attr('d', diagonal);

  var node = g.selectAll('.node')
      .data(nodes)
    .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })

  node.append('circle')
      .attr('r', nodeRadius);

  node.append('text')
      .attr('dy', '.31em')
      .attr('dx', '.31em')
      .attr('text-anchor', function(d) { return 'start'; })
      .text(function(d) { return getShortName(d.name); });

  // Gets a short version of a given cause of disease
  // for use as labels.
  function getShortName(name) {
    var shortName = shortNames[name];
    return shortName ? shortName : name;
  }

  // Add the title of the plot.
  svg.append('text')
    .attr('x', outerWidth / 2 + 120)
    .attr('y', 20)
    .attr('class', 'title')
    .text('Causes of Death in the US');

}, function(err){
  // If we are here, the data failed to load.
  console.log(err);
});
