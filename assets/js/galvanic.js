
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
    .style("fill", "rgb(250, 250, 250)")
    // .style("stroke", "#585858")

// Paths
var posL = 0.40*width,
posR = 0.60*width,
beakerBottom = 0.6*height,
circuitHeight = 0.15*height,
bridgeTop = 0.06*height,
bridgeDiameter = 0.025*height,
beakerWidth = 0.15*width,
beakerHeight = 0.2*height,
beakerCurve = 0.01*width,
tubeCurve = 0.08*beakerWidth,
fillHeight = 0.75*beakerHeight,
beakerColor = "#585858"

beakerPath = d3.path()
beakerPath.moveTo(0,0)
beakerPath.lineTo(0,beakerHeight-beakerCurve)
beakerPath.moveTo(0,beakerHeight-beakerCurve)
beakerPath.arc(beakerCurve, beakerHeight-beakerCurve, beakerCurve, Math.PI, 1/2*Math.PI, true)
beakerPath.moveTo(beakerCurve, beakerHeight)
beakerPath.lineTo(beakerWidth-beakerCurve, beakerHeight)
beakerPath.arc(beakerWidth-beakerCurve, beakerHeight-beakerCurve, beakerCurve, 1/2*Math.PI, 0, true)
beakerPath.moveTo(beakerWidth, beakerHeight-beakerCurve)
beakerPath.lineTo(beakerWidth,0)

contentPath = d3.path()
contentPath.moveTo(0,beakerHeight-fillHeight)
contentPath.arcTo(0, beakerHeight, beakerCurve, beakerHeight, beakerCurve)
contentPath.arcTo(beakerWidth, beakerHeight, beakerWidth, beakerHeight-beakerCurve, beakerCurve)
contentPath.lineTo(beakerWidth,beakerHeight-fillHeight)
contentPath.moveTo(beakerWidth,beakerHeight-fillHeight)
contentPath.lineTo(0,beakerHeight-fillHeight)

stripPath = d3.path()
stripPath.moveTo(0.42*beakerWidth, -0.1*beakerHeight)
stripPath.lineTo(0.42*beakerWidth, 0.6*beakerHeight)
stripPath.lineTo(0.58*beakerWidth, 0.6*beakerHeight)
stripPath.lineTo(0.58*beakerWidth, -0.1*beakerHeight)
stripPath.closePath()

tubePath = d3.path()
tubePath.moveTo(0.42*beakerWidth, -0.1*beakerHeight)
tubePath.arcTo(0.42*beakerWidth, 0.6*beakerHeight, 0.50*beakerWidth, 0.6*beakerHeight, tubeCurve*0.5)
tubePath.arcTo(0.58*beakerWidth, 0.6*beakerHeight, 0.58*beakerWidth, 0.6*beakerHeight-tubeCurve, tubeCurve*0.5)
tubePath.lineTo(0.58*beakerWidth, 0)
tubePath.lineTo(0.65*beakerWidth, 0)
tubePath.moveTo(0.65*beakerWidth, -0.06*beakerHeight)
tubePath.lineTo(0.58*beakerWidth, -0.06*beakerHeight)
tubePath.lineTo(0.58*beakerWidth, -0.1*beakerHeight)
tubePath.arcTo(0.58*beakerWidth, -0.1*beakerHeight-tubeCurve, 0, -0.1*beakerHeight-tubeCurve, tubeCurve)
tubePath.arcTo(0.42*beakerWidth, -0.1*beakerHeight-tubeCurve, 0.42*beakerWidth, -0.1*beakerHeight, tubeCurve)
tubePath.moveTo(0.46*beakerWidth, 0.56*beakerHeight)
tubePath.lineTo(0.45*beakerWidth, 0.64*beakerHeight)
tubePath.lineTo(0.55*beakerWidth, 0.64*beakerHeight)
tubePath.lineTo(0.54*beakerWidth, 0.56*beakerHeight)
tubePath.closePath()

wirePath = d3.path()
wirePath.moveTo(0.49*beakerWidth, -0.08*beakerHeight)
wirePath.lineTo(0.49*beakerWidth, 0.5*beakerHeight)
wirePath.lineTo(0.51*beakerWidth, 0.5*beakerHeight)
wirePath.lineTo(0.51*beakerWidth, -0.08*beakerHeight)
wirePath.closePath()

circuitPath = d3.path()
circuitPath.moveTo(posL, beakerBottom-beakerHeight)
circuitPath.lineTo(posL, beakerBottom-beakerHeight-circuitHeight)
circuitPath.lineTo(posR, beakerBottom-beakerHeight-circuitHeight)
circuitPath.lineTo(posR, beakerBottom-beakerHeight)

bridgePath = d3.path()
bridgePath.moveTo(posL+0.20*beakerWidth, beakerBottom-0.5*beakerHeight)
bridgePath.arcTo(posL+0.20*beakerWidth, beakerBottom-beakerHeight-bridgeTop, posL+0.5*beakerWidth, beakerBottom-beakerHeight-bridgeTop, beakerCurve)
bridgePath.arcTo(posR-0.20*beakerWidth, beakerBottom-beakerHeight-bridgeTop, posR-0.2*beakerWidth, beakerBottom-beakerHeight, beakerCurve)
bridgePath.lineTo(posR-0.20*beakerWidth, beakerBottom-0.5*beakerHeight)
bridgePath.moveTo(posR-0.20*beakerWidth-bridgeDiameter, beakerBottom-0.5*beakerHeight)
bridgePath.arcTo(posR-0.20*beakerWidth-bridgeDiameter, beakerBottom-beakerHeight-bridgeTop+bridgeDiameter, posR-0.5*beakerWidth, beakerBottom-beakerHeight-bridgeTop+bridgeDiameter, beakerCurve/bridgeDiameter*2)
bridgePath.arcTo(posL+0.20*beakerWidth+bridgeDiameter, beakerBottom-beakerHeight-bridgeTop+bridgeDiameter, posL+0.2*beakerWidth+bridgeDiameter, beakerBottom-beakerHeight, beakerCurve/bridgeDiameter*2)
bridgePath.lineTo(posL+0.2*beakerWidth+bridgeDiameter, beakerBottom-0.5*beakerHeight)

// Loading Data
var defaultL = 2, defaultR = 0
var leftSide, rightSide
var redoxPairs, solutionLcolor, solutionRcolor, electrodeLcolor, electrodeRcolor, wireLcolor, wireRcolor, stripL, stripR, tubeL, tubeR
var rP = d3.json("../../files/redoxPairs.json", function(data){
    
    redoxPairs = data
    leftSide = redoxPairs[defaultL]
    rightSide = redoxPairs[defaultR]
    console.log(leftSide, rightSide)
    solutionLcolor = leftSide["solutionColor"]
    solutionRcolor = rightSide["solutionColor"]
    electrodeLcolor = leftSide["electrodeColor"]
    electrodeRcolor = rightSide["electrodeColor"]
    wireLcolor = electrodeLcolor; wireRcolor = electrodeRcolor
    stripL = leftSide["strip"]; stripR = rightSide["strip"]
    tubeL = leftSide["tube"]; tubeR = rightSide["tube"]

    // Drawing objects
    svg.append("g").attr("id", "circuit")
    d3.select("#circuit").append("path")
        .attr("id", "circuitWire")
        .attr("d", circuitPath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
    svg.append("g").attr("id", "saltbridge")
    d3.select("#circuit").append("path")
        .attr("id", "saltbridgeFrame")
        .attr("d", bridgePath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")

    svg.append("g").attr("id", "LS")
        .attr("transform", "translate("+ (posL-beakerWidth/2)+ ","+(beakerBottom-beakerHeight)+ ")")
    d3.select("#LS").append("path")
        .attr("id", "wireL")
        .attr("d", wirePath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", electrodeLcolor)
    d3.select("#LS").append("path")
        .attr("id", "stripElectrodeL")
        .attr("d", stripPath)
        .style("opacity", 1)
        .style("fill", electrodeLcolor)
        .style("visibility", stripL)  
    d3.select("#LS").append("path")
        .attr("id", "solutionL")
        .attr("d", contentPath)
        .style("fill", solutionLcolor)
    d3.select("#LS").append("path")
        .attr("id", "tubeL")
        .attr("d", tubePath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
        .style("visibility", tubeL)  
    d3.select("#LS").append("path")
        .attr("id", "beakerL")
        .attr("d", beakerPath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")

    svg.append("g").attr("id", "RS")
        .attr("transform", "translate("+ (posR-beakerWidth/2)+ ","+(beakerBottom-beakerHeight)+ ")")
    d3.select("#RS").append("path")
        .attr("id", "wireR")
        .attr("d", wirePath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", electrodeRcolor)
    d3.select("#RS").append("path")
        .attr("id", "stripElectrodeR")
        .attr("d", stripPath)
        .style("opacity", 1)
        .style("fill", electrodeRcolor)
        .style("visibility", stripR)  
    d3.select("#RS").append("path")
        .attr("id", "solutionR")
        .attr("d", contentPath)
        .style("fill", solutionRcolor)
    d3.select("#RS").append("path")
        .attr("id", "tubeR")
        .attr("d", tubePath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
        .style("visibility", tubeR)  
    d3.select("#RS").append("path")
        .attr("id", "beakerR")
        .attr("d", beakerPath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
})

