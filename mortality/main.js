// A visualization of Cause of Death data from the Centers for Disease Control.
//
// Details of the data can be found here:
// https://github.com/curran/data/tree/gh-pages/cdc/mortality
//
// Curran Kelleher
// 2/18/2014
require(['tree', 'stackedArea'], function (tree, stackedArea) {

  // Fetch the data as an AMD module.
  var tableURL = 'http://curran.github.io/data/cdc/mortality/mortality_full.js',
      hierarchyURL =  'http://curran.github.io/data/cdc/mortality/hierarchy/hierarchy.js';
  require([tableURL, hierarchyURL], function(table, hierarchy){

    // The dimensionsions of the SVG shared by both visualizations.
    var outerWidth = 1100,
        outerHeight = 600,

        // The number of pixels from the left where the
        // two visualizations meet.
        horizontalSplit = 350,

        // The margins for each visualization.
        margins = {
          tree: {
            top: 0,
            right: outerWidth - horizontalSplit + 160,
            bottom: 0,
            left: 8
          },
          stackedArea: {
            top: 27,
            right: 170,
            bottom: 30,
            left: horizontalSplit
          }
        },

        // Create the SVG element that will contain both visualizations.
        svg = d3.select('body').append('svg')
          .attr('width', outerWidth)
          .attr('height', outerHeight);

    // Initialize the tree visualization.
    tree.init(svg, outerWidth, outerHeight, margins.tree, hierarchy);

    // Initialize the stacked area visualizaiton.
    stackedArea.init(svg, outerWidth, outerHeight, margins.stackedArea, table);

    // Set up the stacked area to respond to tree navigations.
    // Called with the cause of death names to show.
    tree.onNavigate(function (names){
      console.log(names);
      stackedArea.update(names);
    });

    // Add the title of the plot.
    svg.append('text')
      .attr('x', outerWidth / 2 )
      .attr('y', 20)
      .attr('class', 'title')
      .text('Causes of Death in the US');
    
  }, function(err){
    // If we are here, the data failed to load.
    console.log(err);
  });
});
