// A tree visualization of Cause of Death hierarchy from the Centers for Disease Control.
// This module implements the tree visualization.
//
//
// Details of the hierarchy can be found here:
// https://github.com/curran/hierarchy/tree/gh-pages/cdc/mortality
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
// Collapsible Tree Layout
// http://mbostock.github.io/d3/talk/20111018/tree.html
//
// Curran Kelleher 2/18/2014
define(['getShortName'], function (getShortName) {

  // This function should be called once to set up the visualization.
  function init(svg, outerWidth, outerHeight, margin, hierarchy){

    hierarchy.children.forEach(toggle);

    var nodeRadius = 2,
        width = outerWidth - margin.left - margin.right,
        height = outerHeight - margin.top - margin.bottom,

        tree = d3.layout.tree()
          .size([height, width])
          .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; }),

        diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; }),
        
        g = svg.append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'),
        nodes = tree.nodes(hierarchy),
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
  }

  // Toggle children.
  // from mbostock.github.io/d3/talk/20111018/tree.html
  function toggle(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }

  return {init: init};
});
