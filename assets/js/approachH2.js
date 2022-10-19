//TODO: make size of graph responsive
//TODO: zoom

var margin = {top: 10, right: 10, bottom: 10, left: 10}
var graphDiv = document.getElementById("approachH2")

var width = graphDiv.clientWidth - margin.left - margin.right
// var height = graphDiv.clientHeight - margin.top - margin.bottom;
var height = width*0.8
var dividerHalfWidth = 10
var titleHeight = height*0.06

var rSelected = 3
var rMin = 0.1, rMax = 7, rStep=0.05
var rDrawMin = document.getElementById("distance").min
var rList = arange(rMin, rMax, rStep)
var rData = [{"r":rMin}]
for (i=1; i<rList.length; i++){
    rData.push({"r":rMin+i*rStep})
}

// append the svg object to the body of the page
var svg = d3.select("#approachH2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

// MO screen
var screenMO = svg.append("g").attr("id", "screenMO")
var screenMOx = margin.left, screenMOy = margin.top
var screenMOWidth = width*0.65-dividerHalfWidth
var screenMOHeight = height*0.6-dividerHalfWidth

screenMO.append("rect")
    .attr("x", screenMOx).attr("y", screenMOy)
    .attr("width", screenMOWidth)
    .attr("height", screenMOHeight)
    .style("fill", "white")
    .style("stroke", "#585858")

// Potential Energy Graph screen
var graphWidth = width*0.65-dividerHalfWidth
var plotWidth = graphWidth*0.85
var graphHeight = height*0.4-dividerHalfWidth
var plotHeight = graphHeight*0.85

var screenPEG = svg.append("g").attr("id", "screenPEG")
var graphPEG = screenPEG.append("rect")
    .attr("x", margin.left+graphWidth-plotWidth)
    .attr("y", margin.top + height*0.6+ dividerHalfWidth)
    .attr("width", plotWidth)
    .attr("height", plotHeight)
    .style("fill", "white")
    .style("stroke", "#585858")

// PEG Screen
var rScale = d3.scaleLinear()
    .domain([0, 6])
    .range([+graphPEG.attr("x"),+graphPEG.attr("x")+(+graphPEG.attr("width"))])
var eScale = d3.scaleLinear()
    .domain([-17, -10])
    .range([+graphPEG.attr("y")+(+graphPEG.attr("height")), +graphPEG.attr("y")])
screenPEG.append("g")
    .call(d3.axisBottom(rScale))
    .attr("transform", "translate(0, "+ (+graphPEG.attr("y")+ (+graphPEG.attr("height")))+ ")")
screenPEG.append("g")
    .call(d3.axisLeft(eScale))
    .attr("transform", "translate("+ (+graphPEG.attr("x"))+ ", 0)")

dataEs1g = rData.filter((d)=>d.r <rScale.domain()[1] && MOLvls(d.r)[0] < eScale.domain()[1])
dataEs1u = rData.filter((d)=>d.r <rScale.domain()[1] && MOLvls(d.r)[1] < eScale.domain()[1])

screenPEG.append("path")
    .datum(dataEs1g)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("id", "es1g")
    .attr("d", d3.line()
        .x(function(d) { return rScale(d.r) })
        .y(function(d) { return eScale(MOLvls(d.r)[0]) })
        )
screenPEG.append("path")
    .datum(dataEs1u)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("id", "es1u_graph")
    .attr("d", d3.line()
        .x(function(d) { return rScale(d.r) })
        .y(function(d) { return eScale(MOLvls(d.r)[1]) })
        )

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


// drawing Orbitals
var rScaleMO = d3.scaleLinear()
    .domain([-rMax/2, rMax/2])
    .range([screenMOx+screenMOWidth*0.2, screenMOx+screenMOWidth*0.8])
var eScaleMO = d3.scaleLinear()
    .domain([eScale.domain()[0], MOLvls(+rDrawMin)[1]])
    .range([screenMOy+screenMOHeight*0.9, screenMOy+screenMOHeight*0.1])

function drawOrbitals(rDraw){
    let orbitalWidth = screenMOWidth*0.05
    let MOEnergies = MOLvls(rDraw)
    
    screenMO.selectAll("line").remove()

    // atomic orbitals (move left-right)
    screenMO.append("line")
            .attr("x1", rScaleMO(-rDraw/2)-orbitalWidth/2)
            .attr("x2", rScaleMO(-rDraw/2)+orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.2em")
    screenMO.append("line")
            .attr("x1", rScaleMO(rDraw/2)-orbitalWidth/2)
            .attr("x2", rScaleMO(rDraw/2)+orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.2em")
    // molecular orbitals (move up-down)
    screenMO.append("line")
            .attr("x1", rScaleMO(0)-orbitalWidth/2)
            .attr("x2", rScaleMO(0)+orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[0]))
            .attr("y2", eScaleMO(MOEnergies[0]))
            .style("stroke", "red").style("stroke-width", "0.2em")
    screenMO.append("line")
            .attr("x1", rScaleMO(0)-orbitalWidth/2)
            .attr("x2", rScaleMO(0)+orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[1]))
            .attr("y2", eScaleMO(MOEnergies[1]))
            .style("stroke", "blue").style("stroke-width", "0.2em")
    screenMO.append("line")
            .attr("x1", rScaleMO(0)+orbitalWidth/2)
            .attr("x2", rScaleMO(rDraw/2)-orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[1]))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))
    screenMO.append("line")
            .attr("x1", rScaleMO(-rDraw/2)+orbitalWidth/2 )
            .attr("x2", rScaleMO(0)-orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(MOEnergies[1]))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))
    screenMO.append("line")
            .attr("x1", rScaleMO(0)+orbitalWidth/2)
            .attr("x2", rScaleMO(rDraw/2)-orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[0]))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))
    screenMO.append("line")
            .attr("x1", rScaleMO(-rDraw/2)+orbitalWidth/2 )
            .attr("x2", rScaleMO(0)-orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(MOEnergies[0]))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))
    
}

var distanceSlider = document.getElementById("distance")
distanceSlider.oninput = function(){drawOrbitals(+distanceSlider.value); console.log(+distanceSlider.value)}

drawOrbitals(rSelected)

// Functions
function MOLvls(r){
    let ra = r/0.529
    let S = Math.exp(-ra)*(1+ra+ra**2/3)
    let J = Math.exp(-2*ra)*(1+1/ra)
    let K = Math.exp(-ra)*(1/ra-2*ra/3)
    let E1u = -0.5 + (J-K)/(1-S)
    let E1g = -0.5 + (J+K)/(1+S)
    let e1g = E1g*13.6/0.5
    let e1u = E1u*13.6/0.5
    return [e1g, e1u]
}  
function arange(start, stop, step){
    step = step || 1;
    var arr = [];
    for (var i=start;i<stop+step;i+=step){
       arr.push(i);
    }
    return arr;
};