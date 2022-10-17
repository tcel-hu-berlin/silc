//TODO: make size of graph responsive
//TODO: zoom

var margin = {top: 10, right: 10, bottom: 10, left: 10}
var graphDiv = document.getElementById("approachH2")

var width = graphDiv.clientWidth - margin.left - margin.right
// var height = graphDiv.clientHeight - margin.top - margin.bottom;
var height = width*0.8
var dividerHalfWidth = 20
var titleHeight = height*0.06

// append the svg object to the body of the page
var svg = d3.select("#approachH2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

// MO screen
var screenMO = svg.append("g").attr("id", "screenMO")
screenMO.append("rect")
    .attr("x", margin.left).attr("y", margin.top)
    .attr("width", width*0.65-dividerHalfWidth)
    .attr("height", height*0.4-dividerHalfWidth)
    .style("fill", "white")
    .style("stroke", "#585858")

// Potential Energy Graph screen
var graphWidth = width*0.65-dividerHalfWidth
var plotWidth = graphWidth*0.85
var graphHeight = height*0.6-dividerHalfWidth
var plotHeight = graphHeight*0.85

var screenPEG = svg.append("g").attr("id", "screenPEG")
screenPEG.append("rect")
    .attr("x", margin.left)
    .attr("y", margin.top + height*0.4+ dividerHalfWidth)
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .style("fill", "white")

var graphPEG = screenPEG.append("rect")
    .attr("x", margin.left+graphWidth-plotWidth)
    .attr("y", margin.top + height*0.4+ dividerHalfWidth)
    .attr("width", plotWidth)
    .attr("height", plotHeight)
    .style("fill", "white")
    .style("stroke", "#585858")

rScale = d3.scaleLinear()
    .domain([0, 7])
    .range([+graphPEG.attr("x"),+graphPEG.attr("x")+(+graphPEG.attr("width"))])

eScale = d3.scaleLinear()
    .domain(-17, 0)
    .range([+graphPEG.attr("y"),+graphPEG.attr("y")+(+graphPEG.attr("height"))])

screenPEG.append("g")
    .call(d3.axisBottom(rScale))
    .attr("transform", "translate(0, "+ (+graphPEG.attr("y")+ (+graphPEG.attr("height")))+ ")")

screenPEG.append("g")
    .call(d3.axisLeft(eScale))
    .attr("transform", "translate("+ (+graphPEG.attr("x"))+ ", 0)")

// s1u orbital screen
var screenS1u = svg.append("g").attr("id", "screenS1u")
screenS1u.append("rect")
    .attr("x", margin.left+width*0.65+dividerHalfWidth)
    .attr("y", margin.top+titleHeight)
    .attr("width", width*0.35-dividerHalfWidth)
    .attr("height", height*0.4-dividerHalfWidth)
    .style("fill", "#585858")
    .style("stroke", "blue").style("stroke-width", "0.5em")

// s1g orbital screen
var screenS1g = svg.append("g").attr("id", "screenS1g")
screenS1g.append("rect")
    .attr("x", margin.left+width*0.65+dividerHalfWidth)
    .attr("y", margin.top+2*titleHeight+height*0.4+dividerHalfWidth)
    .attr("width", width*0.35-dividerHalfWidth)
    .attr("height", height*0.4-dividerHalfWidth)
    .style("fill", "#585858")
    .style("stroke", "red").style("stroke-width", "0.5em")

