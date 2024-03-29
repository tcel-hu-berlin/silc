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
var rMin = 0.0, rMax = 12, rStep=0.05
var rDrawMin = document.getElementById("distance").min
var rList = arange(rMin, rMax, rStep)
var rData = [{"r":0}]
for (i=1; i<rList.length; i++){
    rData.push({"r":rMin+i*rStep})
}

// color scheme
bondingColor = "rgb(150, 122, 150)"
antibondingColor = "rgb(240, 120, 0)"
atomicColor = "rgb(40, 40, 40)"
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
var graphLeft = margin.left+width*0.08
var graphWidth = width*0.5-dividerHalfWidth*4
var graphTop = margin.top + height*0.5 + dividerHalfWidth
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
    .attr("y", graphTop+graphHeight+graphLeft/2)
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


// Wavefunction pictures
var screenS1g = svg.append("g").attr("id", "screenS1g")
var orbitalScreensX = margin.left+width*0.65+dividerHalfWidth 
var orbitalScreensS1uY = margin.top+titleHeight
var orbitalScreensWidth = width*0.35-dividerHalfWidth
var orbitalScreensHeight = orbitalScreensWidth/2
var orbitalScreensS1gY = orbitalScreensS1uY+orbitalScreensHeight+2*dividerHalfWidth
var orbitalScreen1sX = orbitalScreensX+orbitalScreensWidth/4
var orbitalScreen1sY = orbitalScreensS1gY+orbitalScreensHeight+3*dividerHalfWidth+titleHeight
var strokeWidth = orbitalScreensWidth/40
// title
svg	.append("text")
    .attr("x", orbitalScreensX+orbitalScreensWidth/2)
    .attr("y", screenMOy)
    .text("MO-Wellenfunktionen")
    .attr("fill", "gray").style("font-weight", 600)
    .style("alignment-baseline", "central")
    .style("text-anchor", "middle")
// s1u orbital screen
var screenS1u = svg.append("g").attr("id", "screenS1u")
var screenS1uRect = screenS1u.append("rect").attr("id", "screen1uRect")
    .attr("x", orbitalScreensX-strokeWidth/2)
    .attr("y", orbitalScreensS1uY-strokeWidth/2)
    .attr("width", orbitalScreensWidth+strokeWidth)
    .attr("height", orbitalScreensHeight+strokeWidth)
    .style("fill", "#585858")
    .style("stroke",  antibondingColor).style("stroke-width", strokeWidth) 
svg.append("text").text("ψ (σ*)")
    .attr("x", orbitalScreensX+orbitalScreensWidth*0.05).attr("y", orbitalScreensS1uY+orbitalScreensHeight*0.2)
    .style("fill", "white").style("font-size", "1.3em").style("font-style", "italic")
    .style("font-family", "serif")

// s1g orbital screen
var screenS1gRect = screenS1g.append("rect").attr("id", "screen1gRect")
    .attr("x", orbitalScreensX-strokeWidth/2)
    .attr("y", orbitalScreensS1gY-strokeWidth/2)
    .attr("width", orbitalScreensWidth+strokeWidth)
    .attr("height", orbitalScreensHeight+strokeWidth)
    .style("fill", "#585858")
    .style("stroke", bondingColor).style("stroke-width", strokeWidth)
svg.append("text").text("ψ (σ)")
    .attr("x", orbitalScreensX+orbitalScreensWidth*0.05).attr("y", orbitalScreensS1gY+orbitalScreensHeight*0.2)
    .style("fill", "white").style("font-size", "1.3em").style("font-style", "italic")
    .style("font-family", "serif")
// AO title
svg	.append("text")
.attr("x", orbitalScreensX+orbitalScreensWidth/2)
.attr("y", orbitalScreensS1gY+orbitalScreensHeight+3*dividerHalfWidth)
.text("AO-Wellenfunktion")
.attr("fill", "gray").style("font-weight", 600)
.style("alignment-baseline", "central")
.style("text-anchor", "middle")
// 1s orbital screen
var screen1s = svg.append("g").attr("id", "screen1s")
var screen1sRect = screenS1g.append("rect").attr("id", "screen1gRect")
    .attr("x", orbitalScreen1sX-strokeWidth/2)
    .attr("y", orbitalScreen1sY-strokeWidth/2)
    .attr("width", orbitalScreensWidth/2+strokeWidth)
    .attr("height", orbitalScreensHeight+strokeWidth)
    .style("fill", "#585858")
    .style("stroke", atomicColor).style("stroke-width", strokeWidth)
svg.append("text").text("ψ (1s)")
    .attr("x", orbitalScreen1sX+orbitalScreensWidth*0.05).attr("y", orbitalScreen1sY+orbitalScreensHeight*0.2)
    .style("fill", "white").style("font-size", "1.3em").style("font-style", "italic")
    .style("font-family", "serif")


// drawing Orbitals
var rScaleMORight = d3.scaleLinear()
    .domain([rDrawMin, rMax])
    .range([screenMOx+screenMOWidth*0.65, screenMOx+screenMOWidth*0.8])
var rScaleMOLeft = d3.scaleLinear()
    .domain([rDrawMin, rMax])
    .range([screenMOx+screenMOWidth*0.35, screenMOx+screenMOWidth*0.2])
var eScaleMO = d3.scaleLinear()
    .domain([eScale.domain()[0], MOLvls(0.9)[1]])
    .range([screenMOy+screenMOHeight*0.9, screenMOy+screenMOHeight*0.1])

let orbitalWidth = screenMOWidth*0.1
// arrow
svg.append("line")
    .attr("x1", screenMOx+0.05*screenMOWidth)
    .attr("x2", screenMOx+0.05*screenMOWidth)
    .attr("y1", screenMOy+0.8*screenMOHeight)
    .attr("y2", screenMOy+0.2*screenMOHeight)
    .style("stroke", "black")
svg.append("line")
    .attr("x1", screenMOx+0.04*screenMOWidth)
    .attr("x2", screenMOx+0.05*screenMOWidth)
    .attr("y1", screenMOy+0.22*screenMOHeight)
    .attr("y2", screenMOy+0.2*screenMOHeight)
    .style("stroke", "black")
svg.append("line")
    .attr("x1", screenMOx+0.05*screenMOWidth)
    .attr("x2", screenMOx+0.06*screenMOWidth)
    .attr("y1", screenMOy+0.2*screenMOHeight)
    .attr("y2", screenMOy+0.22*screenMOHeight)
    .style("stroke", "black")
svg.append("text")
    .attr("x", screenMOx+0.05*screenMOWidth)
    .attr("y", screenMOy+0.18*screenMOHeight)
    .attr("text-anchor", "middle")
    .text("E").style("font-size", "1.3em")
    .style("fill", "black").style("opacity", 0.8)
    .style("font-style", "italic").style("font-weight", 700)

// wavefunction graphs
var xScaleS1u = d3.scaleLinear().domain([-rMax, rMax])
    .range([orbitalScreensX,orbitalScreensX+orbitalScreensWidth])
var yScaleS1u = d3.scaleLinear().domain([-rMax/2, rMax/2])
    .range([orbitalScreensS1uY,orbitalScreensS1uY+orbitalScreensHeight])
var xScaleS1g = xScaleS1u
var yScaleS1g = d3.scaleLinear().domain([-rMax/2, rMax/2])
    .range([orbitalScreensS1gY,orbitalScreensS1gY+orbitalScreensHeight])
var yScale1s = d3.scaleLinear().domain([-rMax/2, rMax/2])
    .range([orbitalScreen1sY, orbitalScreen1sY+orbitalScreensHeight])

var resolutionX = 50, resolutionY = 25
var blockWidth = 2*rMax/resolutionX
var blockHeight = rMax/resolutionY
var pointsXY = []

var wfColor = d3.scaleLinear()
    .domain([-2*Math.sqrt(1/(4*Math.PI)), 0, 2*Math.sqrt(1/(4*Math.PI)), 4*Math.sqrt(1/(4*Math.PI))])
    .range(["cyan", "black", "red", "rgb(255, 255, 255)"]).interpolate(d3.interpolateRgb.gamma(2.2))

for (i=0; i<resolutionY; i++){
      let y = -rMax/2 + (i)*blockHeight
      for (j=0; j<resolutionX; j++){
        let x = -rMax + (j)*blockWidth
        pointsXY.push({"x": x, "y": y})
      }
}

// CURSORS
var cursors = svg.append("g")
var cursorS1uX = cursors.append("line").attr("id", "curS1uX")
    .attr("x1", xScaleS1u(0-blockWidth/2)).attr("x2", xScaleS1u(0-blockWidth/2))
    .attr("y1", yScaleS1u.range()[0]).attr("y2", yScaleS1u.range()[1])
var cursorS1uY = cursors.append("line").attr("id", "curS1uY")
    .attr("x1", xScaleS1u.range()[0]).attr("x2", xScaleS1u.range()[1])
    .attr("y1", yScaleS1u(0)).attr("y2", yScaleS1u(0))
var cursorS1gX = cursors.append("line").attr("id", "curS1gX")
    .attr("x1", xScaleS1g(0-blockWidth/2)).attr("x2", xScaleS1g(0-blockWidth/2))
    .attr("y1", yScaleS1g.range()[0]).attr("y2", yScaleS1g.range()[1])
var cursorS1gY = cursors.append("line").attr("id", "curS1gY")
    .attr("x1", xScaleS1g.range()[0]).attr("x2", xScaleS1g.range()[1])
    .attr("y1", yScaleS1g(0)).attr("y2", yScaleS1g(0))
var cursor1sX = cursors.append("line").attr("id", "cur1sX")
    .attr("x1", xScaleS1g(0-blockWidth/2)).attr("x2", xScaleS1g(0-blockWidth/2))
    .attr("y1", yScale1s.range()[0]).attr("y2", yScale1s.range()[1])
var cursor1sY = cursors.append("line").attr("id", "cur1sY")
    .attr("x1", orbitalScreen1sX).attr("x2", orbitalScreen1sX+orbitalScreensWidth/2)
    .attr("y1", yScale1s(0)).attr("y2", yScale1s(0))
cursors.selectAll("line").style("stroke", "white").style("opacity", 0.6).style("stroke-dasharray", (4, 2))    

// Readings
var readings = svg.append("g")
var readingS1u = readings.append("text").text("- - - -")
    .attr("x", orbitalScreensX+orbitalScreensWidth*0.95).attr("y", orbitalScreensS1uY+orbitalScreensHeight*0.2)
var readingS1g = readings.append("text").text("- - - -")
.attr("x", orbitalScreensX+orbitalScreensWidth*0.95)
.attr("y", orbitalScreensS1gY+orbitalScreensHeight*0.2)
var reading1s = readings.append("text").text("- - - -")
.attr("x", orbitalScreen1sX+orbitalScreensWidth*0.475).attr("y", orbitalScreen1sY+orbitalScreensHeight*0.2)
readings.selectAll("text").attr("fill", "white").style("text-anchor", "end").style("font-size", "1.2em")

screenS1u.selectAll("myPoints")
    .data(pointsXY).enter()
    .append("rect").attr("id", function(d, i ){return "pS1u"+i})
    .attr("x", function(d){return xScaleS1u(d.x)})
    .attr("y", function(d){return yScaleS1u(d.y)})
    .attr("width", xScaleS1u(blockWidth)-xScaleS1u(0)).attr("height", yScaleS1u(blockHeight)-yScaleS1u(0))

    .on("click", function(){
        screenS1u.selectAll(".selected").attr("class", "none").style("stroke", "none")
        let point = screenS1u.select("#"+this.id)
        point.attr("class", "selected").style("stroke", "white")
        let x = +point.attr("x")+(+point.attr("width"))/2, y= +point.attr("y")+(+point.attr("height"))/2
        cursorS1uX.attr("x1", x).attr("x2", x)
        cursorS1uY.attr("y1", y).attr("y2", y)
        readingS1u.text(this.value.toFixed(3))
    })

screenS1g.selectAll("myPoints")
    .data(pointsXY).enter()
    .append("rect").attr("id", function(d, i ){return "pS1g"+i})
    .attr("x", function(d){return xScaleS1g(d.x)})
    .attr("y", function(d){return yScaleS1g(d.y)})
    .attr("width", xScaleS1g(blockWidth)-xScaleS1g(0)).attr("height", yScaleS1g(blockHeight)-yScaleS1g(0))
    .on("click", function(){
        screenS1g.selectAll(".selected").attr("class", "none").style("stroke", "none")
        let point = screenS1g.select("#"+this.id)
        point.attr("class", "selected").style("stroke", "white")
        // d3.select("#"+this.id).style("stroke", "yellow")
        let x = +point.attr("x")+(+point.attr("width"))/2, y= +point.attr("y")+(+point.attr("height"))/2
        cursorS1gX.attr("x1", x).attr("x2", x)
        cursorS1gY.attr("y1", y).attr("y2", y)
        readingS1g.text(this.value.toFixed(3))
    })

screen1s.selectAll("myPoints")
    .data(pointsXY.filter((obj)=>obj.x>-rMax/2 && obj.x < rMax/2-blockWidth)).enter()
    .append("rect").attr("id", function(d, i ){return "p1s"+i})
    .attr("x", function(d){return xScaleS1g(d.x)})
    .attr("y", function(d){return yScale1s(d.y)})
    .attr("width", xScaleS1g(blockWidth)-xScaleS1g(0)).attr("height", yScale1s(blockHeight)-yScale1s(0))
    .style("fill", function(d){
        let value = wavefunction1s([d.x+blockWidth, d.y], [0, 0])
        this.value = value
        return wfColor(value)
    })
    .on("click", function(){
        screen1s.selectAll(".selected").attr("class", "none").style("stroke", "none")
        let point = screen1s.select("#"+this.id)
        point.attr("class", "selected").style("stroke", "white")
        // d3.select("#"+this.id).style("stroke", "yellow")
        let x = +point.attr("x")+(+point.attr("width"))/2, y= +point.attr("y")+(+point.attr("height"))/2
        cursor1sX.attr("x1", x).attr("x2", x)
        cursor1sY.attr("y1", y).attr("y2", y)
        reading1s.text(this.value.toFixed(3))
    })


function drawOrbitals(rDraw){
    let MOEnergies = MOLvls(rDraw)
    if (!isFinite(MOEnergies[0])){MOEnergies[0]=-1}
    if (!isFinite(MOEnergies[1])){MOEnergies[1]=-1}
    let S1uOpacity, S1gOpacity, arrowS1u, arrowS1g, xOffset
    if (MOEnergies[1]>-1.1){MOEnergies[1]=-1.1; S1uOpacity=0.2; arrowS1u="↑"; xOffset = orbitalWidth/2
    } else {S1uOpacity=0.8; arrowS1u=""; xOffset = 0}
    if (MOEnergies[0]>-1.1){MOEnergies[0]=-1.1; S1gOpacity=0.2; electronOpacity=0; arrowS1g="↑"; xOffset = orbitalWidth/2
    } else {arrowS1g=""; xOffset = 0;
    if (MOEnergies[0]>-13.6){S1gOpacity=0.2} else {S1gOpacity=0.8}
    electronOpacity=S1gOpacity}

    let orbitalToLabel = graphHeight*0.1
    screenMO.selectAll("line").remove()
    screenMO.selectAll("text").remove()
    screenMO.selectAll("path").remove()

    // atomic orbitals (move left-right)
    screenMO.append("line") // left AO
            .attr("x1", rScaleMOLeft(rDraw)-orbitalWidth/2)
            .attr("x2", rScaleMOLeft(rDraw)+orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", atomicColor).style("stroke-width", "0.2em")
    screenMO.append("text")
            .attr("x", rScaleMOLeft(rDraw))
            .attr("y", eScaleMO(-13.6)+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("1s").style("font-weight", 700).style("fill", atomicColor)
    screenMO.append("line") // right AO
            .attr("x1", rScaleMORight(rDraw)-orbitalWidth/2)
            .attr("x2", rScaleMORight(rDraw)+orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", atomicColor).style("stroke-width", "0.2em")
    screenMO.append("text")
            .attr("x", rScaleMORight(rDraw))
            .attr("y", eScaleMO(-13.6)+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("1s").style("font-weight", 700).style("fill", atomicColor)
    // molecular orbitals (move up-down)
    screenMO.append("line")
            .attr("x1", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("x2", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[0]))
            .attr("y2", eScaleMO(MOEnergies[0]))
            .style("stroke", bondingColor).style("stroke-width", "0.2em")
            .style("opacity", S1gOpacity)
    screenMO.append("line")
            .attr("x1", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("x2", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[1]))
            .attr("y2", eScaleMO(MOEnergies[1]))
            .style("stroke", antibondingColor).style("stroke-width", "0.2em")
            .style("opacity", S1uOpacity)
    screenMO.append("text")
            .attr("x", screenMOx+screenMOWidth/2+xOffset)
            .attr("y", eScaleMO(MOEnergies[1])+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("σ*"+arrowS1u).style("font-weight", 700).style("font-style", "italic")
            .style("font-family", "serif").style("font-size", "1.2em")
            .style("fill",  antibondingColor).style("opacity", 0.8)
    screenMO.append("text")
            .attr("x", screenMOx+screenMOWidth/2-xOffset)
            .attr("y", eScaleMO(MOEnergies[0])+orbitalToLabel)
            .attr("text-anchor", "middle")
            .text("σ"+arrowS1g).style("font-weight", 700).style("font-style", "italic")
            .style("font-family", "serif").style("font-size", "1.2em")
            .style("fill", bondingColor).style("opacity", 0.8)
    // electron
    screenMO.append("path")
            .datum([{"x": screenMOx+screenMOWidth/2, "y": eScaleMO(MOEnergies[0])+orbitalWidth/6},
                    {"x": screenMOx+screenMOWidth/2, "y": eScaleMO(MOEnergies[0])-orbitalWidth/6},
                    {"x": screenMOx+screenMOWidth/2-orbitalWidth/10,  "y": eScaleMO(MOEnergies[0])-orbitalWidth/6+orbitalWidth/10 }])
            .style("fill", "none").style("stroke-width", "0.15em").style("stroke", bondingColor).style("opacity", electronOpacity)
            .attr("d", d3.line().x(function(d) { return d.x }).y(function(d) { return d.y })
            )
    // screenMO.append("line")
    //         .attr("x1", screenMOx+screenMOWidth/2).attr("x2", screenMOx+screenMOWidth/2)
    //         .attr("y1", eScaleMO(MOEnergies[0])-orbitalWidth/5).attr("y2", eScaleMO(MOEnergies[0])+orbitalWidth/5)
    //         .style("stroke", "black").style("stroke-width", "0.15em").style("opacity", electronOpacity)
    // screenMO.append("line")
    //         .attr("x1", screenMOx+screenMOWidth/2-orbitalWidth/7).attr("x2", screenMOx+screenMOWidth/2)
    //         .attr("y1", eScaleMO(MOEnergies[0])-orbitalWidth/5+orbitalWidth/7).attr("y2", eScaleMO(MOEnergies[0])-orbitalWidth/5)
    //         .style("stroke", "black").style("stroke-width", "0.15em").style("opacity", electronOpacity)
    // connecting lines
    screenMO.append("line") // right to antibonding
            .attr("x1", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("x2", rScaleMORight(rDraw)-orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[1]))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.05em")
            .style("stroke-dasharray", ("3, 3")).style("opacity", S1uOpacity*1.1)
    screenMO.append("line") // left to antibonding
            .attr("x1", rScaleMOLeft(rDraw)+orbitalWidth/2 )
            .attr("x2", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(MOEnergies[1]))
            .style("stroke", "black").style("stroke-width", "0.05em")
            .style("stroke-dasharray", ("3, 3")).style("opacity", S1uOpacity*1.1)
    screenMO.append("line") // left to bonding
            .attr("x1", rScaleMOLeft(rDraw)+orbitalWidth/2)
            .attr("x2", screenMOx+screenMOWidth/2-orbitalWidth/2)
            .attr("y1", eScaleMO(-13.6))
            .attr("y2", eScaleMO(MOEnergies[0]))
            .style("stroke", "black").style("stroke-width", "0.05em")
            .style("stroke-dasharray", ("3, 3")).style("opacity", S1gOpacity*1.1)
    screenMO.append("line") // right to bonding
            .attr("x1", screenMOx+screenMOWidth/2+orbitalWidth/2)
            .attr("x2", rScaleMORight(rDraw)-orbitalWidth/2)
            .attr("y1", eScaleMO(MOEnergies[0]))
            .attr("y2", eScaleMO(-13.6))
            .style("stroke", "black").style("stroke-width", "0.05em")
            .style("stroke-dasharray", ("3, 3")).style("opacity", S1gOpacity*1.1)

    // modifying wavefunction graphs
    screenS1u.selectAll("rect").data(pointsXY)
        .style("fill", function(){
        let x = this.__data__.x, y = this.__data__.y
        let value = subtractWavefunctions([x,y], [-rDraw/2, 0], [rDraw/2, 0])
        this.value = value
        return wfColor(value)
    })
    screenS1u.selectAll(".selected").attr("class", "none").style("stroke", "none")
    screenS1g.selectAll(".selected").attr("class", "none").style("stroke", "none")
    readingS1u.text("- - - -"); readingS1g.text("- - - -")
    screenS1g.selectAll("rect").data(pointsXY)
    .style("fill", function(){
    let x = this.__data__.x, y = this.__data__.y
    let value = addWavefunctions([x-blockWidth,y], [-rDraw/2, 0], [rDraw/2, 0])
    this.value = value
    return wfColor(value)
    })

    cursors.raise()
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

