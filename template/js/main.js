require(['d3', 'getterSetters'], function (d3, getterSetters) {

  var my = getterSetters({
        width: 0,
        height: 0
      }),
      div = d3.select('#vis'),
      svg = div.append('svg'),
      frameRect = svg.append('rect');

  frameRect.update = _.debounce(function () {
    frameRect
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', my.width())
      .attr('height', my.height())
      .attr('stroke-width', 3)
      .attr('stroke', 'black')
      .attr('fill-opacity', 0);
  });

  my.width.on('change', frameRect.update);
  my.height.on('change', frameRect.update);

  function updateSize() {
    var dom = div.node();
    my.width(dom.clientWidth),
    my.height(dom.clientHeight);
  }
  updateSize();
  window.addEventListener('resize', updateSize);
  
});
