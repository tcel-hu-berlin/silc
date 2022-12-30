
var margin = {top: 0, right: 0, bottom: 0, left: 0}
var graphDiv = document.getElementById("galvanic")

var width = graphDiv.clientWidth - margin.left - margin.right
var height = graphDiv.clientHeight - margin.top - margin.bottom

// line notation elements
var outL = document.getElementById("outL")
var midL = document.getElementById("midL")
var innL = document.getElementById("innL")
var outR = document.getElementById("outR")
var midR = document.getElementById("midR")
var innR = document.getElementById("innR")

var videoDiv = document.getElementById("molRep")
var videoScreen = document.getElementById("molRepVideo")
var noReaction = document.getElementById("noReaction")

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
    .style("stroke", "blue")

// Paths
var posL = 0.40*width,
posR = 0.60*width,
beakerBottom = 0.6*height,
circuitHeight = 0.15*height,
voltageReaderHeight = 0.03*width
beakerWidth = 0.15*width*2.3,
beakerHeight = 0.2*height,
beakerCurve = 0.01*width,
tubeCurve = 0.08*beakerWidth,
fillHeight = 0.75*beakerHeight,
beakerColor = "#585858",
magnWidth = 0.025*width, magnHeight = 0.8*magnWidth, magnTop = 0.502*height

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
stripPath.moveTo(0.47*beakerWidth, -0.1*beakerHeight)
stripPath.lineTo(0.47*beakerWidth, 0.65*beakerHeight)
stripPath.lineTo(0.53*beakerWidth, 0.65*beakerHeight)
stripPath.lineTo(0.53*beakerWidth, -0.1*beakerHeight)
stripPath.closePath()

wirePath = d3.path()
wirePath.moveTo(0.495*beakerWidth, -0.08*beakerHeight)
wirePath.lineTo(0.495*beakerWidth, 0.5*beakerHeight)
wirePath.lineTo(0.48*beakerWidth, 0.5*beakerHeight)
wirePath.lineTo(0.48*beakerWidth, 0.649*beakerHeight)
wirePath.lineTo(0.52*beakerWidth, 0.649*beakerHeight)
wirePath.lineTo(0.52*beakerWidth, 0.5*beakerHeight)
wirePath.lineTo(0.505*beakerWidth, 0.5*beakerHeight)
wirePath.lineTo(0.505*beakerWidth, -0.08*beakerHeight)
wirePath.closePath()
wirePath.moveTo(0.49*beakerWidth, 0.5*beakerHeight)
wirePath.lineTo(0.51*beakerWidth, 0.5*beakerHeight)

circuitPath = d3.path()
circuitPath.moveTo(posL, beakerBottom-beakerHeight)
circuitPath.lineTo(posL, beakerBottom-beakerHeight-circuitHeight)
circuitPath.lineTo(0.475*width, beakerBottom-beakerHeight-circuitHeight)
circuitPath.moveTo(0.525*width, beakerBottom-beakerHeight-circuitHeight)
circuitPath.lineTo(posR, beakerBottom-beakerHeight-circuitHeight)
circuitPath.lineTo(posR, beakerBottom-beakerHeight)


// magnifying functions
var showMagnL = function(){
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnSolL").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    if (Math.abs(+voltageReading) < 0.005){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
    } else {
        if (+voltageReading > 0){
            let file = leftSide["video_oxi"]
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 1.1
        } else {
            let file = leftSide["video_red"]
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 1.1
        }
        videoDiv.style.visibility = "visible"
        videoScreen.style.display = "inline-block"
        noReaction.style.display = "none"
    }
}

var showMagnR = function(){
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnSolR").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    if (Math.abs(+voltageReading) < 0.005){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
    } else {
        if (+voltageReading > 0){
            let file = rightSide["video_red"]
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 1.1
        } else {
            let file = rightSide["video_oxi"]
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 1.1
        }
        videoDiv.style.visibility = "visible"
        videoScreen.style.display = "inline-block"
        noReaction.style.display = "none"
    }
}

var showMagnCircL = function(){
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnCircL").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    if (Math.abs(+voltageReading) < 0.005){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
    } else {
        if (+voltageReading > 0){
            let file = "electronsUp.mp4"
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 0.7
        } else {
            let file = "electronsDown.mp4"
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 0.7
        }
        videoDiv.style.visibility = "visible"
        videoScreen.style.display = "inline-block"
        noReaction.style.display = "none"
    }
}

var showMagnCircR = function(){
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnCircR").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    if (Math.abs(+voltageReading) < 0.005){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
    } else {
        if (+voltageReading > 0){
            let file = "electronsDown.mp4"
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 0.7
        } else {
            let file = "electronsUp.mp4"
            videoScreen.src = "../../images/" + file
            videoScreen.playbackRate = 0.7
        }
        videoDiv.style.visibility = "visible"
        videoScreen.style.display = "inline-block"
        noReaction.style.display = "none"
    }
}


// Loading Data
var defaultL = 1, defaultR = 0
var leftSide, rightSide
var redoxPairs, solutionLcolor, solutionRcolor, electrodeLcolor, electrodeRcolor, stripL, stripR, tubeL, tubeR, voltageReading
var changePairL, changePairR
var rP = d3.json("../../files/redoxPairs.json", function(data){
    
    redoxPairs = data
    leftSide = redoxPairs[defaultL]
    rightSide = redoxPairs[defaultR]
    console.log(leftSide, rightSide)
    solutionLcolor = leftSide["solutionColor"]
    solutionRcolor = rightSide["solutionColor"]
    electrodeLcolor = leftSide["electrodeColor"]
    electrodeRcolor = rightSide["electrodeColor"]
    stripL = leftSide["strip"]; stripR = rightSide["strip"]
    tubeL = leftSide["tube"]; tubeR = rightSide["tube"]
    voltageReading = rightSide["E_red"]-leftSide["E_red"]


    // Drawing objects
    svg.append("g").attr("id", "circuit")
    d3.select("#circuit").append("rect")
        .attr("id", "voltmeter")
        .attr("x", 0.42*width).attr("y", beakerBottom-beakerHeight-circuitHeight-voltageReaderHeight*4.5)
        .attr("width", 0.16*width).attr("height", voltageReaderHeight*4.8)
        .style("fill", "rgb(230, 230, 230)")
        .style("stroke", "black").style("stroke-width", "0.1em")
    d3.select("#circuit").append("path")
        .attr("id", "circuitWire")
        .attr("d", circuitPath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
    d3.select("#circuit").append("rect")
        .attr("id", "voltmeterScreen")
        .attr("x", 0.46*width).attr("y", beakerBottom-beakerHeight-circuitHeight-voltageReaderHeight*3/2)
        .attr("width", 0.08*width).attr("height", voltageReaderHeight)
        .style("fill", "rgb(220, 230, 220)")
        .style("stroke", "black").style("stroke-width", "0.1em")
    d3.select("#circuit").append("text")
        .attr("id", "voltReading")
        .attr("x", 0.5*width).attr("y", beakerBottom-beakerHeight-circuitHeight-voltageReaderHeight)
        .text(d3.format("+0.2f")(voltageReading)+" V").style("font-size", voltageReaderHeight*0.55)
        .style("text-anchor", "middle").style("alignment-baseline", "middle")
        .style("font-weight", 600)
    d3.select("#circuit").append("circle")
        .attr("cx", 0.525*width).attr("cy", beakerBottom-beakerHeight-circuitHeight)
        .attr("r", 0.005*width)
        .style("fill", "rgb(255, 0,0)")
        .style("stroke", beakerColor).style("stroke-width", "0.1em")
    d3.select("#circuit").append("circle")
        .attr("cx", 0.475*width).attr("cy", beakerBottom-beakerHeight-circuitHeight)
        .attr("r", 0.005*width)
        .style("fill", "rgb(20,20,20)")
        .style("stroke", beakerColor).style("stroke-width", "0.1em")
    d3.select("#circuit").append("text")
        .attr("x", 0.475*width).attr("y", beakerBottom-beakerHeight-circuitHeight*0.8)
        .style("text-anchor", "middle").style("alignment-baseline", "middle")
        .text("–").style("font-weight", 600).style("fill", "blue")
    d3.select("#circuit").append("text")
        .attr("x", 0.525*width).attr("y", beakerBottom-beakerHeight-circuitHeight*0.8)
        .style("text-anchor", "middle").style("alignment-baseline", "middle")
        .text("+").style("font-weight", 600).style("fill", "blue")


    svg.append("g").attr("id", "LS")
        .attr("transform", "translate("+ (width/2-beakerWidth/2)+ ","+(beakerBottom-beakerHeight)+ ")")
    d3.select("#LS").append("path")
        .attr("id", "wireL")
        .attr("transform", "translate(-"+ (width/2-posL)+ ",0)")
        .attr("d", wirePath)
        .style("stroke", beakerColor).style('stroke-width', "0.03em")
        .style("fill", electrodeLcolor)
    d3.select("#LS").append("path")
        .attr("id", "stripElectrodeL")
        .attr("transform", "translate(-"+ (width/2-posL)+ ",0)")
        .attr("d", stripPath)
        .style("opacity", 1)
        .style("fill", electrodeLcolor)
        .style("stroke", "black").style("stroke-width", "0.02em")
        .style("visibility", stripL)  
    d3.select("#LS").append("path")
        .attr("id", "solutionL")
        .attr("d", contentPath)
        .style("fill", solutionLcolor)
        .style("stroke", "black").style("stroke-width", "0.02em") 
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
        .style("stroke", beakerColor).style('stroke-width', "0.03em")
        .style("fill", electrodeRcolor)
    d3.select("#RS").append("path")
        .attr("id", "stripElectrodeR")
        .attr("d", stripPath)
        .style("opacity", 1)
        .style("fill", electrodeRcolor)
        .style("stroke", "black").style("stroke-width", "0.02em")
        .style("visibility", stripR) 

    svg.append("g").attr("id", "magnPoints")
    d3.select("#magnPoints").append('image')
        .attr("id", "magnSolL")
        .attr("class", "magn")
        .attr('xlink:href', '../../images/magnGlass.svg')
        .attr("x", posL).attr("y", magnTop)
        .attr('width', magnWidth)
        .attr('height', magnWidth)
        .on("click", showMagnL)
    d3.select("#magnPoints").append('image')
        .attr("id", "magnSolR")
        .attr("class", "magn")
        .attr('xlink:href', '../../images/magnGlass.svg')
        .attr("x", posR).attr("y", magnTop)
        .attr('width', magnWidth)
        .attr('height', magnWidth)
        .on("click", showMagnR)
    d3.select("#magnPoints").append('image')
        .attr("id", "magnCircL")
        .attr("class", "magn")
        .attr('xlink:href', '../../images/magnGlass.svg')
        .attr("x", posL-magnWidth*0.4).attr("y", 0.3*height)
        .attr('width', magnWidth)
        .attr('height', magnWidth)
        .on("click", showMagnCircL)
    d3.select("#magnPoints").append('image')
        .attr("id", "magnCircR")
        .attr("class", "magn")
        .attr('xlink:href', '../../images/magnGlass.svg')
        .attr("x", posR-magnWidth*0.4).attr("y", 0.3*height)
        .attr('width', magnWidth)
        .attr('height', magnWidth)
        .on("click", showMagnCircR)


    document.getElementById("pairSelectorL").disabled = false
    document.getElementById("pairSelectorR").disabled = false
    changePairL = function(){
        let val = document.getElementById("pairSelectorL").value
        leftSide = redoxPairs[val]
        solutionLcolor = leftSide["solutionColor"]
        electrodeLcolor = leftSide["electrodeColor"]
        stripL = leftSide["strip"]
        tubeL = leftSide["tube"]
        voltageReading = rightSide["E_red"]-leftSide["E_red"]

        outL.innerHTML = leftSide["outerPhase"]
        midL.innerHTML = leftSide["middlePhase"]
        innL.innerHTML = leftSide["innerPhase"]

        d3.select("#solutionL").style("fill", solutionLcolor)
        d3.select("#stripElectrodeL").style("fill", electrodeLcolor)
        d3.select("#stripElectrodeL").style("visibility", stripL)
        d3.select("#tubeL").style("visibility", tubeL)
        d3.select("#wireL").style("fill", electrodeLcolor)
        d3.select("#voltReading").text(d3.format("+0.2f")(voltageReading)+" V")

        videoDiv.style.visibility = "hidden"
    }
    changePairR = function(){
        let val = document.getElementById("pairSelectorR").value
        rightSide = redoxPairs[val]
        solutionRcolor = rightSide["solutionColor"]
        electrodeRcolor = rightSide["electrodeColor"]
        stripR = rightSide["strip"]
        tubeR = rightSide["tube"]
        voltageReading = rightSide["E_red"]-leftSide["E_red"]

        outR.innerHTML = rightSide["outerPhase"]
        midR.innerHTML = rightSide["middlePhase"]
        innR.innerHTML = rightSide["innerPhase"]

        d3.select("#solutionR").style("fill", solutionRcolor)
        d3.select("#stripElectrodeR").style("fill", electrodeRcolor)
        d3.select("#stripElectrodeR").style("visibility", stripR)
        d3.select("#tubeR").style("visibility", tubeR)
        d3.select("#wireR").style("fill", electrodeRcolor)
        d3.select("#voltReading").text(d3.format("+0.2f")(voltageReading)+" V")

        videoDiv.style.visibility = "hidden"
    }
    
    changePairL();changePairR()
    document.getElementById("lineNotation").style.visibility = "visible"
})

