//TODO: make size of graph responsive
//TODO: zoom

var margin = {top: 20, right: 10, bottom: 15, left: 10}
var graphDiv = document.getElementById("approachH2")

var width = graphDiv.clientWidth - margin.left - margin.right
// var height = graphDiv.clientHeight - margin.top - margin.bottom;
var height = width*0.8
var dividerHalfWidth = 10
var titleHeight = height*0.06

var distanceValue = document.getElementById('distanceValue')
var distanceSlider = document.getElementById("distance")

var rSelected = 4; distanceValue.innerHTML = rSelected.toFixed(1)
var rMin = 0.1, rMax = 12, rStep=0.05
var rDrawMin = document.getElementById("distance").min
var rList = arange(rMin, rMax, rStep)
var rData = [{"r":0}]
for (i=1; i<rList.length; i++){
    rData.push({"r":rMin+i*rStep})
}

// color scheme
bondingColor = "rgb(150, 122, 150)"
antibondingColor = "rgb(240, 120, 0)"
axisColor = "rgb(120, 120, 120)"

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
    // .style("stroke", "#585858")
svg.append("text")
    .attr("x", screenMOx+screenMOWidth/2)
    .attr("y", screenMOy)
    .text("MO-Diagramm")
    .attr("fill", "gray").style("font-weight", 600)
    .style("alignment-baseline", "central")
    .style("text-anchor", "middle")

// Potential Energy Graph screen
var graphLeft = margin.left+width*0.12
var graphWidth = width*0.5-dividerHalfWidth*4
var graphTop = margin.top + height*0.55 + dividerHalfWidth
var graphHeight = height*0.38-dividerHalfWidth-margin.bottom

var screenPEG = svg.append("g").attr("id", "screenPEG")
var graphPEG = screenPEG.append("rect")
    .attr("x", graphLeft)
    .attr("y", graphTop)
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .style("fill", "white")
    // .style("stroke", "#585858")

// PEG Screen
var rScale = d3.scaleLinear()
    .domain([0, 6])
    .range([graphLeft,graphLeft+graphWidth])
var eScale = d3.scaleLinear()
    .domain([-17, -10])
    .range([graphTop+graphHeight, graphTop])
var xAxisPEG = screenPEG.append("g")
    .call(d3.axisBottom(rScale))
    .attr("transform", "translate(0, "+ (graphTop+graphHeight)+ ")")
    .attr("color", "#585858")
screenPEG.append("text").text("Abstand (Å)")
    .attr("x", graphLeft+graphWidth/2)
    .attr("y", height)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "ideographic")
    .style("font-size", "0.7em")
var yLabelX = graphLeft/2, yLabelY = graphTop+graphHeight/2
screenPEG.append("text").text("Energie (eV)")
    .attr("x", yLabelX)
    .attr("y", yLabelY)
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", "0.7em")
    .attr("transform", "rotate(-90,"+(yLabelX)+","+(yLabelY)+")")

var yAxisPEG = screenPEG.append("g")
    .call(d3.axisLeft(eScale))
    .attr("transform", "translate("+ graphLeft+ ", 0)")



// Styling axes
var axes = [xAxisPEG, yAxisPEG]
axes.forEach(function(axis){
    axis.selectAll("path").style("stroke", axisColor).style("stroke-width", "1")
    axis.selectAll("line").style("stroke", axisColor).style("stroke-width", "1")
    axis.selectAll(".tick line").style("stroke", axisColor).style("stroke-width", "1")
    axis.selectAll("text").style("fill", axisColor).style("font-size", "0.7em")
})

// Adding indicator
screenPEG.append("line").attr("id", "indPEG-line")
    .attr("x1", rScale(rSelected)).attr("x2", rScale(rSelected))
    .attr("y1", eScale(eScale.domain()[0])).attr("y2", eScale(eScale.domain()[1]))
    .style("stroke", "#74A9D8").style("stroke-width", "0.2em")
var lineToLabel = graphWidth*0.02
screenPEG.append("text").attr("id", "indPEG-text")
    .attr("x", +d3.select("#indPEG-line").attr("x1")+lineToLabel)
    .attr("y", eScale(-16))
    .text(`r: ${rSelected.toFixed(1)} Å`)
    .style("fill", "#74A9D8").style("font-size", "0.8em")
function moveCursor(r){
    d3.select("#indPEG-line").attr("x1", function(){
        if(r<rScale.domain()[1]){
            return rScale(r)} else {return graphLeft+graphWidth}})
    .attr("x2", function(){
        if(r<rScale.domain()[1]){
            return rScale(r)} else {return graphLeft+graphWidth}})
    .attr("opacity", function(){if (r<rScale.domain()[1]){
        return 1} else { return 0.2}})
    d3.select("#indPEG-text").attr("x", function(){
        if (r<rScale.domain()[1]){ 
            return +d3.select("#indPEG-line").attr("x1")+lineToLabel
        } else {return graphLeft+graphWidth+lineToLabel}
    })
        .text(`r: ${r.toFixed(2)} Å`)
    d3.select("#es1g-label").text("E(σ) : "+(MOLvls(r)[0]).toFixed(2)+" eV")
    d3.select("#es1u-label").text("E(σ*) : "+(MOLvls(r)[1]).toFixed(2)+" eV")
}

dataEs1g = rData.filter((d)=>d.r <rScale.domain()[1] && MOLvls(d.r)[0] < eScale.domain()[1])
dataEs1u = rData.filter((d)=>d.r <rScale.domain()[1] && MOLvls(d.r)[1] < eScale.domain()[1])

screenPEG.append("path")
    .datum(dataEs1g)
    .attr("fill", "none")
    .attr("stroke", bondingColor)
    .attr("stroke-width", "0.1em")
    .attr("id", "es1g")
    .attr("d", d3.line()
        .x(function(d) { return rScale(d.r) })
        .y(function(d) { return eScale(MOLvls(d.r)[0]) })
        )
screenPEG.append("path")
    .datum(dataEs1u)
    .attr("fill", "none")
    .attr("stroke",  antibondingColor)
    .attr("stroke-width", "0.1em")
    .attr("id", "es1u_graph")
    .attr("d", d3.line()
        .x(function(d) { return rScale(d.r) })
        .y(function(d) { return eScale(MOLvls(d.r)[1]) })
        )
// Legend
var legend = screenPEG.append("g")
    .attr("transform", "translate("+(graphLeft+0.60*graphWidth) +","+(graphTop+0.03*graphWidth) +")")
legend.append("rect").attr("id", "legendBox")
    .attr("x", 0).attr("width", graphWidth*0.37)
    .attr("y", 0).attr("height", graphHeight*0.25)
    .style("fill", "white").style("stroke", "#74A9D8")
    .style("stroke-width", "0.01em")
var legendHeight  = d3.select("#legendBox").attr("height")
legend.append("circle")
    .attr("cx", legendHeight*0.45).attr("cy", legendHeight*0.25).attr("r", legendHeight*0.1).style("fill", bondingColor)
legend.append("text").attr("id", "es1g-label")
    .attr("x", legendHeight*0.62).attr("y", legendHeight*0.25)
    .style("alignment-baseline", "middle").style("font-size", "0.8em")
    .text("E(σ) : "+(MOLvls(rSelected)[0]).toFixed(2)+" eV")
legend.append("circle")
    .attr("cx", legendHeight*0.45).attr("cy", legendHeight*0.7).attr("r", legendHeight*0.1).style("fill", antibondingColor)
legend.append("text").attr("id", "es1u-label")
    .attr("x", legendHeight*0.62).attr("y", legendHeight*0.7)
    .style("alignment-baseline", "middle").style("font-size", "0.8em")
    .text("E(σ*) : "+(MOLvls(rSelected)[1]).toFixed(2)+" eV")
// s1u orbital screen
var screenS1u = svg.append("g").attr("id", "screenS1u")
var screenS1uRect = screenS1u.append("rect").attr("id", "screen1uRect")
    .attr("x", margin.left+width*0.65+dividerHalfWidth)
    .attr("y", margin.top+titleHeight)
    .attr("width", width*0.35-dividerHalfWidth)
    .attr("height", width*0.35-dividerHalfWidth)
    .style("fill", "#585858")
    .style("stroke",  antibondingColor).style("stroke-width", "1em")

// Wavefunction pictures    
// s1g orbital screen
var screenS1g = svg.append("g").attr("id", "screenS1g")
var screenS1gRect = screenS1g.append("rect").attr("id", "screen1gRect")
    .attr("x", margin.left+width*0.65+dividerHalfWidth)
    .attr("y", margin.top+2*titleHeight+height*0.4+dividerHalfWidth)
    .attr("width", width*0.35-dividerHalfWidth)
    .attr("height", width*0.35-dividerHalfWidth)
    .style("fill", "#585858")
    .style("stroke", bondingColor).style("stroke-width", "1em")

var orbitalScreensX = +screenS1uRect.attr("x") 
var orbitalScreensS1uY = +screenS1uRect.attr("y")
var orbitalScreensS1gY = +screenS1gRect.attr("y")
var orbitalScreensSide = +screenS1uRect.attr("width")
svg.append("text").text("ψ (σ*)")
    .attr("x", orbitalScreensX+orbitalScreensSide*0.1).attr("y", orbitalScreensS1uY+orbitalScreensSide*0.1)
    .style("fill", "white").style("font-size", "1.7em").style("font-style", "italic")
    .style("font-family", "serif")
svg.append("text").text("ψ (σ)")
    .attr("x", orbitalScreensX+orbitalScreensSide*0.1).attr("y", orbitalScreensS1gY+orbitalScreensSide*0.1)
    .style("fill", "white").style("font-size", "1.7em").style("font-style", "italic")
    .style("font-family", "serif")
svg	.append("text")
    .attr("x", orbitalScreensX+orbitalScreensSide/2)
    .attr("y", screenMOy)
    .text("MO-Wellenfunktionen")
    .attr("fill", "gray").style("font-weight", 600)
    .style("alignment-baseline", "central")
    .style("text-anchor", "middle")

// drawing Orbitals
var rScaleMORight = d3.scaleLinear()
    .domain([rDrawMin, rMax])
    .range([screenMOx+screenMOWidth*0.65, screenMOx+screenMOWidth*0.8])
var rScaleMOLeft = d3.scaleLinear()
    .domain([rDrawMin, rMax])
    .range([screenMOx+screenMOWidth*0.35, screenMOx+screenMOWidth*0.2])
var eScaleMO = d3.scaleLinear()
    .domain([eScale.domain()[0], MOLvls(+rDrawMin)[1]])
    .range([screenMOy+screenMOHeight*0.9, screenMOy+screenMOHeight*0.1])

let orbitalWidth = screenMOWidth*0.1
// arrow
svg.append("line")
    .attr("x1", rScaleMOLeft(rMax*1.3)-orbitalWidth/2)
    .attr("x2", rScaleMOLeft(rMax*1.3)-orbitalWidth/2)
    .attr("y1", eScaleMO(-16))
    .attr("y2", eScaleMO(-2))
    .style("stroke", "black")
svg.append("line")
    .attr("x1", rScaleMOLeft(rMax*1.3)-orbitalWidth/2-orbitalWidth/10)
    .attr("x2", rScaleMOLeft(rMax*1.3)-orbitalWidth/2)
    .attr("y1", eScaleMO(-2.4))
    .attr("y2", eScaleMO(-2))
    .style("stroke", "black")
svg.append("line")
    .attr("x1", rScaleMOLeft(rMax*1.3)-orbitalWidth/2)
    .attr("x2", rScaleMOLeft(rMax*1.3)-orbitalWidth/2+orbitalWidth/10)
    .attr("y1", eScaleMO(-2))
    .attr("y2", eScaleMO(-2.4))
    .style("stroke", "black")
svg.append("text")
    .attr("x", rScaleMOLeft(rMax*1.3)-orbitalWidth/2)
    .attr("y", eScaleMO(-1.5))
    .attr("text-anchor", "middle")
    .text("E").style("font-size", "1.3em")
    .style("fill", "black").style("opacity", 0.8)
    .style("font-style", "italic").style("font-weight", 700)

// wavefunction graphs

var xScaleS1u = d3.scaleLinear().domain([-rMax, rMax])
    .range([+screenS1uRect.attr("x"),+screenS1uRect.attr("x")+(+screenS1uRect.attr("width"))])
var yScaleS1u = d3.scaleLinear().domain([-rMax, rMax])
    .range([+screenS1uRect.attr("y"),+screenS1uRect.attr("y")+(+screenS1uRect.attr("height"))])
var xScaleS1g = d3.scaleLinear().domain([-rMax, rMax])
    .range([+screenS1gRect.attr("x"),+screenS1gRect.attr("x")+(+screenS1gRect.attr("width"))])
var yScaleS1g = d3.scaleLinear().domain([-rMax, rMax])
    .range([+screenS1gRect.attr("y"),+screenS1gRect.attr("y")+(+screenS1gRect.attr("height"))])
var resolutionX = 40, resolutionY = 30
var blockWidth = 2*rMax/resolutionX
var blockHeight = 2*rMax/resolutionY
var pointsXY = []

var wfColor = d3.scaleLinear()
    .domain([-2*Math.sqrt(1/(4*Math.PI)), 0, 2*Math.sqrt(1/(4*Math.PI)), 4*Math.sqrt(1/(4*Math.PI))])
    .range(["blue", "black", "red", "rgb(255, 120, 120)"]).interpolate(d3.interpolateRgb.gamma(2.2))

for (i=0; i<resolutionY; i++){
      let y = -rMax + (i)*blockHeight
      for (j=0; j<resolutionX; j++){
        let x = -rMax + (j)*blockWidth
        pointsXY.push({"x": x, "y": y})
      }
}

screenS1u.selectAll("myPoints")
    .data(pointsXY).enter()
    .append("rect")
    .attr("x", function(d){return xScaleS1u(d.x)})
    .attr("y", function(d){return yScaleS1u(d.y)})
    .attr("width", xScaleS1u(blockWidth)-xScaleS1u(0)).attr("height", yScaleS1u(blockHeight)-yScaleS1u(0))
    .style("fill", function(d){
        let value = subtractWavefunctions([d.x, d.y], [-rSelected/2, 0], [rSelected/2, 0])
        this.value  = value
        return wfColor(value)
    })
    .on("click", function(){
        console.log(this.value)
    })

screenS1g.selectAll("myPoints")
    .data(pointsXY).enter()
    .append("rect")
    .attr("x", function(d){return xScaleS1g(d.x)})
    .attr("y", function(d){return yScaleS1g(d.y)})
    .attr("width", xScaleS1g(blockWidth)-xScaleS1g(0)).attr("height", yScaleS1g(blockHeight)-yScaleS1g(0))
    .style("fill", function(d){
        let value = addWavefunctions([d.x, d.y], [-rSelected/2, 0], [rSelected/2, 0])
        this.value = value
        return wfColor(value)
    })
    .on("click", function(){
        console.log(this.value)
    })

function drawOrbitals(rDraw){
    let MOEnergies = MOLvls(rDraw)
    let orbitalToLabel = graphHeight*0.1
    screenMO.selectAll("line").remove()
    screenMO.selectAll("text").remove()

    // atomic orbitals (move left-right)
    screenMO.append("line") // left AO
            .attr("x1", rScaleMOLeft(rDraw)-orbitalWidth/2)
            .attr("x2", rScaleMOLeft(rDraw)+orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.2em")
    screenMO.append("text")
            .attr("x", rScaleMOLeft(rDraw))
            .attr("y", eScaleMO(-13.6)+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("1s").style("font-weight", 700)
    screenMO.append("line") // right AO
            .attr("x1", rScaleMORight(rDraw)-orbitalWidth/2)
            .attr("x2", rScaleMORight(rDraw)+orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.2em")
    screenMO.append("text")
            .attr("x", rScaleMORight(rDraw))
            .attr("y", eScaleMO(-13.6)+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("1s").style("font-weight", 700)
    // molecular orbitals (move up-down)
    screenMO.append("line")
            .attr("x1", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("x2", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[0]))
            .attr("y2", eScaleMO(MOEnergies[0]))
            .style("stroke", bondingColor).style("stroke-width", "0.2em")
            .style("opacity", 0.8)
    screenMO.append("line")
            .attr("x1", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("x2", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[1]))
            .attr("y2", eScaleMO(MOEnergies[1]))
            .style("stroke", antibondingColor).style("stroke-width", "0.2em")
            .style("opacity", 0.8)
    screenMO.append("text")
            .attr("x", screenMOx+screenMOWidth/2)
            .attr("y", eScaleMO(MOEnergies[1])+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("σ*").style("font-weight", 700).style("font-style", "italic")
            .style("font-family", "serif").style("font-size", "1.2em")
            .style("fill",  antibondingColor).style("opacity", 0.8)
    screenMO.append("text")
            .attr("x", screenMOx+screenMOWidth/2)
            .attr("y", eScaleMO(MOEnergies[0])+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("σ").style("font-weight", 700).style("font-style", "italic")
            .style("font-family", "serif").style("font-size", "1.2em")
            .style("fill", bondingColor).style("opacity", 0.8)

    // connecting lines
    screenMO.append("line") // right to antibonding
            .attr("x1", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("x2", rScaleMORight(rDraw)-orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[1]))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))
    screenMO.append("line") // left to antibonding
            .attr("x1", rScaleMOLeft(rDraw)+orbitalWidth/2 )
            .attr("x2", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(MOEnergies[1]))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))
    screenMO.append("line") // left to bonding
            .attr("x1", rScaleMOLeft(rDraw)+orbitalWidth/2)
            .attr("x2", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(MOEnergies[0]))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))
    screenMO.append("line") // right to bonding
            .attr("x1", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("x2", rScaleMORight(rDraw)-orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[0]))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.1em")
            .style("stroke-dasharray", ("3, 3"))

    screenS1u.selectAll("rect").data(pointsXY)
        .style("fill", function(){
        let x = this.__data__.x, y = this.__data__.y
        let value = subtractWavefunctions([x,y], [-rDraw/2, 0], [rDraw/2, 0])
        return wfColor(value)
    })
    screenS1g.selectAll("rect").data(pointsXY)
    .style("fill", function(){
    let x = this.__data__.x, y = this.__data__.y
    let value = addWavefunctions([x,y], [-rDraw/2, 0], [rDraw/2, 0])
    return wfColor(value)
})
}

distanceSlider.oninput = function(){
    distanceValue.innerHTML = (+distanceSlider.value).toFixed(1)
    drawOrbitals(+distanceSlider.value)
    moveCursor(+distanceSlider.value)
    }

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

function wavefunction1s(xy, xy_ref){
    let r = Math.sqrt((xy[0]-xy_ref[0])**2 + (xy[1]-xy_ref[1])**2) 
    return 2*Math.exp(-r)*Math.sqrt(1/(4*Math.PI))
}

function addWavefunctions(xy, ref1, ref2){
    return wavefunction1s(xy, ref1) + wavefunction1s(xy, ref2)
}

function subtractWavefunctions(xy, ref1, ref2){
    return wavefunction1s(xy, ref1) - wavefunction1s(xy, ref2)
}

