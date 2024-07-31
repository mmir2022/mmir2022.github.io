async function init() {

  const data = await d3.csv("https://flunky.github.io/cars2017.csv", d3.autoType);
  const fuelTypes = ['Gasoline', 'Diesel', 'Electricity']

  var svg = d3.select('body')
    .append('svg')
    .attr('width', 650)
    .attr('height', 650)

  const margin = {
    top: 50,
    right: 100,
    bottom: 60,
    left: 80
  }
  const width = svg.attr("width") - margin.left - margin.right;
  const height = svg.attr("height") - margin.top - margin.bottom;

  const xScale = d3.scaleLog().domain([10, 150]).range([0, width]).base(10);
  const yScale = d3.scaleLog().domain([10, 150]).range([width, 0]).base(10);
  const colorScale = d3.scaleOrdinal(fuelTypes, d3.schemeCategory10)
  const ticks = [10, 20, 50, 100];

  const circleRad = 5
  const animationDur = 50

  const format = d3.format(".0f");

  const checkbox = document.querySelector("#tooltipCb")

  svg.append('g')
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    // Listener for mouse event
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .attr('cx', function (d, i) { return xScale(d.AverageCityMPG) })
    .attr('cy', function (d, i) { return yScale(d.AverageHighwayMPG) })
    .attr('r', function (d, i) { return circleRad })
    .style('fill', function (d, i) { return colorScale(d.Fuel); })
    .attr('fill-opacity', 0.4);

  // Y-Axis
  svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(
      d3.axisLeft(yScale)
        .tickValues(ticks)
        .tickFormat(d3.format("~s")))
    .append('text')
    .attr('class', 'axis-label')
    .text('Avg Hwy Mpg')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(margin.top + (height - margin.top - margin.bottom) / 2))
    .attr('y', -50); // Relative to the y axis.

  // X-Axis
  svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")")
    .call(
      d3.axisBottom(xScale)
        .tickValues(ticks)
        .tickFormat(d3.format("~s")))
    .append('text')
    .attr('class', 'axis-label')
    .text('Avg City Mpg')
    .attr('x', margin.left + (width - margin.left - margin.right) / 2)
    .attr('y', 50); // Relative to the x axis.

  // Legends
  svg.selectAll("dots")
    .data(fuelTypes)
    .enter()
    .append("circle")
    .attr("cx", margin.left + width + 20)
    .attr("cy", function (d, i) { return (height + margin.top) / 2 + i * 25 })
    .attr("r", circleRad)
    .style('fill', function (d, i) { return colorScale(d) })
    .attr('fill-opacity', 0.4);

  svg.selectAll("labels")
    .data(fuelTypes)
    .enter()
    .append("text")
    .attr("x", margin.left + width + 30)
    .attr("y", function (d, i) { return (height + margin.top) / 2 + i * 25 + 3 })
    .text(function (d) { return d })
    .attr('class', 'legend-label')

  // Event handler for mouse event
  function onMouseOver(d, i) {
    if (checkbox.checked) {
      var xPos = xScale.invert(Number(d3.select(this).attr('cx')));
      var yPos = yScale.invert(Number(d3.select(this).attr('cy')));

      d3.select('#tooltip').classed('hidden', false);

      d3.select('#tooltip')
        .style('left', d.pageX + 5 + 'px')
        .style('top', d.pageY + 5 + 'px')
        .style('opacity', 1)
        .select('#value').text('CityMpg: ' + format(xPos) + ' HwyMpg: ' + format(yPos))

      // Animation to highlight data point.
      d3.select(this)
        .transition()
        .duration(animationDur)
        .attr('r', circleRad + 10)
    }
  }

  function onMouseOut(d, i) {
    if (checkbox.checked) {
      d3.select('#tooltip').classed('hidden', true);
      d3.select(this)
        .transition()
        .duration(animationDur)
        .attr('r', circleRad)
    }
  }

}