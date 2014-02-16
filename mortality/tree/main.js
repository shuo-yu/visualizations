// A tree visualization of Cause of Death data from the Centers for Disease Control.
//
// Details of the data can be found here:
// https://github.com/curran/data/tree/gh-pages/cdc/mortality
//
// Curran Kelleher
// 2/15/2014
//
var dataModuleURL = 'http://curran.github.io/data/cdc/mortality/hierarchy/hierarchy.js';
require([dataModuleURL], function(data){

  console.log(data);
  
  // The following code draws from
  // http://bl.ocks.org/mbostock/4063550
  var diameter = 1300,

      tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; }),

      diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; }),

      svg = d3.select('body').append('svg')
        .attr('width', diameter)
        .attr('height', diameter - 150),
      
      g = svg.append('g')
        .attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')'),

      shortNames = {
        'Major cardiovascular diseases': 'Heart disease',
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
      .attr('transform', function(d) { return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')'; })

  node.append('circle')
      .attr('r', 4.5);

  node.append('text')
      .attr('dy', '.31em')
      .attr('text-anchor', function(d) { return d.x < 180 ? 'start' : 'end'; })
      .attr('transform', function(d) { return d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)'; })
      .text(function(d) { return d.name; });

  // Gets a short version of a given cause of disease
  // for use as labels.
  function getShortName(name) {
    var shortName = shortNames[name];
    return shortName ? shortName : name;
  }


  // Add the title of the plot.
  svg.append('text')
    .attr('x', diameter / 2 )
    .attr('y', -3)
    .attr('class', 'title')
    .text('Causes of Death in the US');

}, function(err){
  // If we are here, the data failed to load.
  console.log(err);
});
