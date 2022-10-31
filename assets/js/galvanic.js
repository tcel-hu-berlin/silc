
var margin = {top: 20, right: 10, bottom: 15, left: 10}
var graphDiv = document.getElementById("galvanic")

var width = graphDiv.clientWidth - margin.left - margin.right
// var height = graphDiv.clientHeight - margin.top - margin.bottom;
var height = width*0.8

// append the svg object to the body of the page
var svg = d3.select("#galvanic")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    

svg.append("rect")
    .attr("x", 0).attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "white")
    .style("stroke", "#585858")
