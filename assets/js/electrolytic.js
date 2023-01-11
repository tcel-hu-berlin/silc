
// Background
var margin = {top: 0, right: 0, bottom: 0, left: 0}
var graphDiv = document.getElementById("electrolytic")
var width = graphDiv.clientWidth - margin.left - margin.right
var height = graphDiv.clientHeight - margin.top - margin.bottom
// append the svg object to the body of the page
var svg = d3.select("#electrolytic")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) 

svg.append("rect")
    .attr("x", 0).attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "white")
    // .style("stroke", "blue")

// document element selections
// var hourglass = document.getElementById("hourglass")
var videoDiv = document.getElementById("molRep")
var videoScreen = document.getElementById("molRepVideo")
var videoTitle = document.getElementById("submicroTitle")
var noReaction = document.getElementById("noReaction")
var minutesInd = document.getElementById("minutesInd")
var secondsInd = document.getElementById("secondsInd")
var voltInd = document.getElementById("voltInd")
var ampInd = document.getElementById("ampInd")
var cathDesc = document.getElementById("cathDesc")
var anDesc = document.getElementById("anDesc")
var solDesc = document.getElementById("solutionDesc")
var vLind = document.getElementById("vLval")
var vRind = document.getElementById("vRval")

// d3.js element selections
var startButton = d3.select("#startButton")
var stopButton = d3.select("#stopButton")
var resetTimeButton = d3.select("#resetTimeButton")
var upV = d3.select("#upV"), downV = d3.select("#downV"), upA = d3.select("#upA"), downA = d3.select("#downA")

// variables that are changed throughout simulation
var thresVolt, molPerElL, molPerElR
var voltage = +voltInd.innerHTML
var current = +ampInd.innerHTML
var bubbleFrames = [0, 1, 2, 3, 4], bubbleFrameL = 0, bubbleFrameR = 1
var timer
var maxVolume = 0.4 // L
var secondsPassed = 0, coulombsPassed = 0, electronMolesPassed = 0, molGasL = 0, molGasR = 0
// var massL = 0, massR = 0
var minV = -2, maxV = 5, minA = 0.5, maxA=2

// Paths
var posL = 0.40*width,
posR = 0.60*width,
beakerBottom = 0.55*height,
circuitHeight = 0.15*height,

refWidth = 0.15*width*2.3,
beakerWidth = refWidth*0.8
beakerHeight = 0.2*height,
beakerCurve = 0.01*width,
fillHeight = 0.75*beakerHeight,
beakerColor = "#585858",
magnWidth = 0.035*width, magnHeight = 0.8*magnWidth, magnTop = beakerBottom-fillHeight*0.8

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
contentPath.arcTo(beakerWidth, beakerHeight, refWidth, beakerHeight-beakerCurve, beakerCurve)
contentPath.lineTo(beakerWidth,beakerHeight-fillHeight)
contentPath.moveTo(beakerWidth,beakerHeight-fillHeight)
contentPath.lineTo(0,beakerHeight-fillHeight)

var stripWidth = 0.06*refWidth, stripHeight=0.5*beakerHeight
stripPath = d3.path()
stripPath.moveTo(-stripWidth/2, 0)
stripPath.lineTo(-stripWidth/2, stripHeight)
stripPath.lineTo(+stripWidth/2, stripHeight)
stripPath.lineTo(+stripWidth/2, 0)
stripPath.closePath()

var wireNW = 0.01*refWidth, wireNH=0.38*beakerHeight
var wireWW = 0.02*refWidth, wireWH=0.069*beakerHeight
wirePath = d3.path()
wirePath.moveTo(-wireNW/2, 0)
wirePath.lineTo(-wireNW/2, wireNH)
wirePath.lineTo(-wireWW/2, wireNH)
wirePath.lineTo(-wireWW/2, wireNH+wireWH)
wirePath.lineTo(wireWW/2, wireNH+wireWH)
wirePath.lineTo(wireWW/2, wireNH)
wirePath.lineTo(wireNW/2, wireNH)
wirePath.lineTo(wireNW/2, 0)
wirePath.closePath()
wirePath.moveTo(-wireWW/2, wireNH)
wirePath.lineTo(wireWW/2, wireNH)

voltageReaderHeight = 0.03*width
voltmeterTop = 0.025*height; voltmeterLeft = 0.025*width; voltmeterWidth = 0.28*width; voltmeterHeight = 0.22*width
redHeight = voltmeterTop+0.43*voltmeterHeight; blueHeight = voltmeterTop+0.57*voltmeterHeight; 

circuitPath = d3.path()
circuitPath.moveTo(posL, beakerBottom-beakerHeight)
circuitPath.lineTo(posL, blueHeight)
circuitPath.lineTo(voltmeterLeft+voltmeterWidth, blueHeight)
circuitPath.moveTo(voltmeterLeft+voltmeterWidth, redHeight)
circuitPath.lineTo(posR, redHeight)
circuitPath.lineTo(posR, beakerBottom-beakerHeight)

var tubeWidth = 0.08*refWidth, tubeOffset = 0.14*refWidth, 
tubeCurve = tubeWidth/2, tubeHeight = beakerHeight*1.2, tubeBottom=0.6*beakerHeight
tubePath = d3.path()
tubePath.moveTo(0, 0)
tubePath.lineTo(0, 0.85*beakerHeight)
tubePath.lineTo(tubeOffset, 0.85*beakerHeight)
tubePath.lineTo(tubeOffset, 0.5*beakerHeight)
tubePath.moveTo(tubeOffset-0.5*tubeWidth, tubeBottom)
tubePath.lineTo(tubeOffset-0.5*tubeWidth,tubeBottom-tubeHeight)
tubePath.moveTo(tubeOffset+0.5*tubeWidth,tubeBottom-tubeHeight)
tubePath.lineTo(tubeOffset+0.5*tubeWidth, tubeBottom)

var baselineGas = 0 //0.05*beakerHeight
var stopperWidth = 0.81*tubeWidth, stopperWWidth=stopperWidth*1.4, stopperNWidth=stopperWidth*0.4
stopperBottom = beakerHeight-fillHeight-baselineGas, stopperHeight=stopperBottom-tubeBottom+tubeHeight*1.05
stopperPath = d3.path()
stopperPath.moveTo(tubeOffset-stopperWidth/2, stopperBottom)
stopperPath.lineTo(tubeOffset-stopperWidth/2, tubeBottom-tubeHeight-0.075*tubeWidth)
stopperPath.lineTo(tubeOffset-stopperWWidth/2, tubeBottom-tubeHeight-0.075*tubeWidth)
stopperPath.lineTo(tubeOffset-stopperWWidth/2, stopperBottom-stopperHeight)

stopperPath.lineTo(tubeOffset-stopperNWidth/2, stopperBottom-stopperHeight)
stopperPath.lineTo(tubeOffset-stopperNWidth/2, stopperBottom-stopperHeight-stopperNWidth)
stopperPath.lineTo(tubeOffset+stopperNWidth/2, stopperBottom-stopperHeight-stopperNWidth)
stopperPath.lineTo(tubeOffset+stopperNWidth/2, stopperBottom-stopperHeight)

stopperPath.lineTo(tubeOffset+stopperWWidth/2, stopperBottom-stopperHeight)
stopperPath.lineTo(tubeOffset+stopperWWidth/2, tubeBottom-tubeHeight-0.075*tubeWidth)
stopperPath.lineTo(tubeOffset+stopperWidth/2, tubeBottom-tubeHeight-0.075*tubeWidth)
stopperPath.lineTo(tubeOffset+stopperWidth/2, stopperBottom)
stopperPath.closePath()

tsPath = d3.path() // offset, smaller strip
var tsWidth=0.5*tubeWidth, tsBottom = 0.5*beakerHeight, tsHeight = 0.6*(tsBottom-stopperBottom)
tsPath.moveTo(tubeOffset-tsWidth/2, tsBottom)
tsPath.lineTo(tubeOffset-tsWidth/2, tsBottom-tsHeight)
tsPath.lineTo(tubeOffset+tsWidth/2, tsBottom-tsHeight)
tsPath.lineTo(tubeOffset+tsWidth/2, tsBottom)
tsPath.closePath()

// measuring lines on tube
var maxVolumeHeight = stopperHeight*0.8
for (i=0; i<11; i++){
    let y = beakerHeight-fillHeight-baselineGas-i*(maxVolumeHeight)/10
    tubePath.moveTo(tubeOffset+0.5*tubeWidth,y)
    tubePath.lineTo(tubeOffset+0.5*tubeWidth-0.2*tubeWidth, y)   
}

// magnifying functions
var showMagnL = function(){
    let status = closeViewIfOpen("magnSolL")
    if (status == "was open"){
        return
    }
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnSolL").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    let sw = d3.select("#switchImg")
    if (voltage <= thresVolt || sw.attr("status") == "open"){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
        videoTitle.style.display = "none"
    } else {
        let file = leftSide["video_red"]
        videoScreen.src = "../../images/" + file
        videoScreen.playbackRate = 1.4
        videoDiv.style.visibility = "visible"
        videoScreen.style.display = "inline-block"
        videoTitle.style.display = "block"
        noReaction.style.display = "none"
    }
    }


var showMagnR = function(){
    let status = closeViewIfOpen("magnSolR")
    if (status == "was open"){
        return
    }
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnSolR").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    let sw = d3.select("#switchImg")
    if (voltage <= thresVolt || sw.attr("status") == "open"){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
        videoTitle.style.display = "none"
    } else {
        let file = rightSide["video_oxi"]
        videoScreen.src = "../../images/" + file
        videoScreen.playbackRate = 1.4
        videoDiv.style.visibility = "visible"
        videoTitle.style.display = "block"
        videoScreen.style.display = "inline-block"
        noReaction.style.display = "none"
        }
}

var showMagnCircL = function(){
    let status = closeViewIfOpen("magnCircL")
    if (status == "was open"){
        return
    }
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnCircL").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    let sw = d3.select("#switchImg")
    if (voltage <= thresVolt || sw.attr("status") == "open"){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
        videoTitle.style.display = "none"
    } else {
        let file = "electronsDown.mp4"
        videoScreen.src = "../../images/" + file
        videoScreen.playbackRate = 0.7
        videoDiv.style.visibility = "visible"
        videoScreen.style.display = "inline-block"
        videoTitle.style.display = "block"
        noReaction.style.display = "none"
    }
}

var showMagnCircR = function(){
    let status = closeViewIfOpen("magnCircR")
    if (status == "was open"){
        return
    }
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
    d3.select("#magnCircR").style("filter", "hue-rotate(120deg)").style("opacity", 0.8)
    let sw = d3.select("#switchImg")
    if (voltage <= thresVolt || sw.attr("status") == "open" ){
        videoScreen.src = ""
        videoDiv.style.visibility = "visible"
        noReaction.style.display = "block"
        videoScreen.style.display = "none"
        videoTitle.style.display = "none"
    } else {
        let file = "electronsUp.mp4"
        videoScreen.src = "../../images/" + file
        videoScreen.playbackRate = 0.7
        videoDiv.style.visibility = "visible"
        videoScreen.style.display = "inline-block"
        noReaction.style.display = "none"
        videoTitle.style.display = "block"
        }

}

// Button functions
var raiseV = function(){
    downV.attr("disabled", null)
    voltage += 0.05
    let sign = "+"
    if (voltage<0){sign="-"}
    voltInd.innerHTML = sign+Math.abs(voltage).toFixed(3)
    if (voltage >= maxV){
        upV.attr("disabled", true)
    }
}
var dropV = function(){
    upV.attr("disabled", null)
    voltage -= 0.05
    let sign = "+"
    if (voltage<0){sign="-"}
    voltInd.innerHTML = sign+Math.abs(voltage).toFixed(3)
    if (voltage <= minV){
        downV.attr("disabled", true)
    }
}
var raiseA = function(){
    downA.attr("disabled", null)
    current += 0.5
    ampInd.innerHTML = current.toFixed(3)
    if (current >= maxA){
        upA.attr("disabled", true)
    }
}
var dropA = function(){
    upA.attr("disabled", null)
    current -= 0.5
    ampInd.innerHTML = current.toFixed(3)
    if (current <= minA){
        downA.attr("disabled", true)
    }
}

var disablePowerVar = function(){
    upV.attr("disabled", true)
    downV.attr("disabled", true)
    upA.attr("disabled", true)
    downA.attr("disabled", true)
}

var enablePowerVar = function(){
    if (voltage < maxV){
        upV.attr("disabled", null)
    }
    if (voltage > minV){
        downV.attr("disabled", null)
    }
    if (current < maxA){
        upA.attr("disabled", null)
    }
    if (current > minA){
        downA.attr("disabled", null)
    }
}

var openSwitch = function(){
    d3.select("#switchImg").attr("xlink:href","../../images/switchOpenVert.png")
    d3.select("#switchImg").attr("status", "open")
    enablePowerVar()
}
var closeSwitch = function(){
    d3.select("#switchImg").attr("xlink:href", "../../images/switchClosedVert.png")
    d3.select("#switchImg").attr("status","closed")
    disablePowerVar()
}

var toggleSwitch = function(){
    let sw = d3.select("#switchImg")
    let st = sw.attr("status")
    if (st == "open"){closeSwitch()} else {openSwitch()}
}

var hideSubmicro = function(){
    videoDiv.style.visibility = "hidden"
    d3.selectAll(".magn").style("filter", "hue-rotate(0deg)").style("opacity", 0.4)
}
var closeViewIfOpen = function(view){
    if (d3.select("#"+view).style("filter") == "hue-rotate(120deg)"){
        hideSubmicro()
        return "was open"
    } else {
        return "was closed"
    }
}

var writeTime = function(tsec){
    let secondsPassedStr = (tsec%60).toString()
    let minutesPassedStr = Math.trunc(tsec/60).toString()
    secondsInd.innerHTML = String(secondsPassedStr).padStart(2, "0")
    minutesInd.innerHTML = String(minutesPassedStr).padStart(2, "0")
}
var advanceTimerOnce = function(){
    secondsPassed += 1
    coulombsPassed += current
    electronMolesPassed = coulombsPassed/96485
    writeTime(secondsPassed)
}
var visualizeBubbles = function(){
    if (secondsPassed>30){
        if (leftSide["gas"]==true){
            let m = Math.max(leftSide["electronsPerMolecule"], 1)
            d3.select("#bubblesL").style("visibility", "visible")
            if (secondsPassed%(15*m) == 0){
                let otherBubbleFrames = bubbleFrames.filter(frame => frame != bubbleFrameL)
                bubbleFrameL = otherBubbleFrames[Math.floor(Math.random() * otherBubbleFrames.length)]
                let bubbleFile = '../../images/bubbles' + bubbleFrameL.toString() + '.svg'
                d3.select("#bubblesL").attr('xlink:href', bubbleFile)
            }
        }

        if (rightSide["gas"]==true){
            d3.select("#bubblesR").style("visibility", "visible")
            let m = Math.max(rightSide["electronsPerMolecule"], 1)
            if (secondsPassed%(15*m) == 8){
                let otherBubbleFrames = bubbleFrames.filter(frame => frame != bubbleFrameR)
                bubbleFrameR = otherBubbleFrames[Math.floor(Math.random() * otherBubbleFrames.length)]
                let bubbleFile = '../../images/bubbles' + bubbleFrameR.toString() + '.svg'
                d3.select("#bubblesR").attr('xlink:href', bubbleFile)
            }
        }
    }
}
var gasProductionL = function(){
    molGasL = electronMolesPassed / leftSide["electronsPerMolecule"]
    let gasVolumeL = molGasL * 22.4
    let gasHeightL = gasVolumeL/maxVolume*maxVolumeHeight
    d3.select("#stopperL").attr("transform", "translate(0,-"+(gasHeightL)+ ")")
    let mLProd = (gasVolumeL*1000).toFixed(1)
    vLind.innerHTML = mLProd+ " mL"
}
var gasProductionR = function(){
    molGasR = electronMolesPassed / rightSide["electronsPerMolecule"]
    let gasVolumeR = molGasR * 22.4
    let gasHeightR = gasVolumeR/maxVolume*maxVolumeHeight
    d3.select("#stopperR").attr("transform", "scale(-1,1), translate(0,-"+(gasHeightR)+ ")")
    let mLProd = (gasVolumeR*1000).toFixed(1)
    vRind.innerHTML = mLProd + " mL"
}


var runElectrolysis = function(){
    if (secondsPassed >= 1800){
        clearInterval(timer)
        openSwitch()
        disablePowerVar()
        videoDiv.style.visibility = "hidden"
        stopButton.attr("disabled", true)
        startButton.attr("disabled", true)
        setTimeout(function(){
            d3.select("#bubblesL").style("visibility", "hidden")
            d3.select("#bubblesR").style("visibility", "hidden")
        }, 1000)
        resetTimeButton.attr("disabled", null)
    } else {
        advanceTimerOnce();
        if (voltage >= thresVolt){
            visualizeBubbles();
            if (leftSide["gas"]==true && leftSide["electronsPerMolecule"] != 0){
                gasProductionL();
            }
            if (rightSide["gas"]==true && rightSide["electronsPerMolecule"] != 0){
                gasProductionR();
            }
        }
       
    }

}

var resetEl = function(){
    secondsPassed = 0
    coulombsPassed = 0
    electronMolesPassed = 0
    molGasL = 0; molGasR = 0
    vLind.innerHTML = "-- mL"
    vRind.innerHTML = "-- mL"
    d3.select("#stopperL").attr("transform", null)
    d3.select("#stopperR").attr("transform", "scale(-1,1)")
    d3.select("#bubblesL").style("visibility", "hidden")
    d3.select("#bubblesR").style("visibility", "hidden")
    writeTime(secondsPassed)
    resetTimeButton.attr("disabled", true)
    stopButton.attr("disabled", true)
    startButton.attr("disabled", null)
    hideSubmicro()
    videoScreen.src = ""
    openSwitch()
    clearInterval(timer)
}

// Loading Data
var defaultCombo = "waterH2SO4"
var combo, leftSide, rightSide
var redoxPairs, redoxCombos, solutionColor, electrodeLcolor, electrodeRcolor, stripL, stripR, tubeL, tubeR, voltageReading
var changeCombo, changePairL, changePairR
var rP = d3.json("../../files/redoxPairs.json", function(data){
    
    redoxPairs = data["halfCells"]
    redoxCombos = data["combos"]
    combo = redoxCombos[defaultCombo]
    leftSide = redoxPairs[combo["left"]]
    rightSide = redoxPairs[combo["right"]]
    cathDesc.innerHTML = redoxCombos[defaultCombo]["cathDescr"]+ ", "
    anDesc.innerHTML = redoxCombos[defaultCombo]["anDescr"]+ ", "

    solutionColor = combo["solutionColor"]
    electrodeLcolor = leftSide["electrodeColor"]
    electrodeRcolor = rightSide["electrodeColor"]
    stripL = leftSide["strip"]; stripR = rightSide["strip"]
    tubeL = leftSide["tube"]; tubeR = rightSide["tube"]
    thresVolt = rightSide["E_red"]-leftSide["E_red"]


    // Drawing objects
    svg.append("g").attr("id", "circuit")
    d3.select("#circuit").append("rect")
        .attr("id", "voltmeter")
        .attr("rx", 7)
        .attr("x", voltmeterLeft).attr("y", voltmeterTop)
        .attr("width", voltmeterWidth).attr("height", voltmeterHeight)
        .style("fill", "rgb(230, 230, 230)")
        .style("stroke", "rgb(130, 130, 130)").style("stroke-width", "0.1em")
    d3.select("#circuit").append("path")
        .attr("id", "circuitWire")
        .attr("d", circuitPath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
    // red and blue outputs of power supply
    d3.select("#circuit").append("circle")
        .attr("cx", voltmeterLeft+voltmeterWidth-0.015*width).attr("cy", redHeight)
        .attr("r", 0.0055*width)
        .style("fill", "rgb(255, 0,0)")
        .style("stroke", beakerColor).style("stroke-width", "0.1em")
    d3.select("#circuit").append("circle")
        .attr("cx", voltmeterLeft+voltmeterWidth-0.015*width).attr("cy", blueHeight)
        .attr("r", 0.0055*width)
        .style("fill", "rgb(0,0,255)")
        .style("stroke", beakerColor).style("stroke-width", "0.1em")
     // plus and minus signs
     d3.select("#circuit").append("text")
        .attr("x", voltmeterLeft+voltmeterWidth-0.03*width).attr("y", redHeight)
        .style("text-anchor", "middle").style("alignment-baseline", "middle")
        .text("+").style("font-weight", 500).style("font-size", "1.3em").style("fill", "black")
    d3.select("#circuit").append("text")
        .attr("x", voltmeterLeft+voltmeterWidth-0.03*width).attr("y", blueHeight)
        .style("text-anchor", "middle").style("alignment-baseline", "middle")
        .text("–").style("font-weight", 500).style("font-size", "1.3em").style("fill", "black")   
    
    //switch
    svg.append("g").attr("id", "switch")
    var imgWidth =  0.032*width; var imgHeight = imgWidth*345/242
    d3.select("#switch").append("svg:image")
    .attr("id", "switchImg")
    .attr('x', posR-imgWidth/2)
    .attr('y', 0.2*height)
    .attr('width', imgWidth)
    .attr('height', imgHeight)
    .attr('status', "open")
    .attr("xlink:href", "../../images/switchOpenVert.png")
 
    
    svg.append("g").attr("id", "beakerSol")
        .attr("transform", "translate("+ (width/2-beakerWidth/2)+ ","+(beakerBottom-beakerHeight)+ ")")
    d3.select("#beakerSol").append("path")
        .attr("id", "beaker")
        .attr("d", beakerPath)
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
    d3.select("#beakerSol").append("path")
        .attr("id", "solution")
        .attr("d", contentPath)
        .style("fill", solutionColor)
        .style("stroke", "black").style("stroke-width", "0") 



    svg.append("g").attr("id", "LS")
        .attr("transform", "translate("+ (posL)+ ","+(beakerBottom-beakerHeight)+ ")")
    // d3.select("#LS").append("path")
    //     .attr("id", "wireL")
    //     .attr("transform", "translate(-"+ (width/2-posL)+ ",0)")
    //     .attr("d", wirePath)
    //     .style("stroke", beakerColor).style('stroke-width', "0.03em")
    //     .style("fill", electrodeLcolor)
    d3.select("#LS").append("path")
        .attr("id", "stopperL")
        .attr("d", stopperPath)
        .style("stroke", "rgb(120,150,165)").style('stroke-width', "0.1em")
        .style("fill", "rgb(160,200,220)")
        .style("visibility", tubeL)
    d3.select("#LS").append("path")
        .attr("id", "tubeL")
        .attr("d", tubePath)
        // .attr("transform", "translate("+posL+",0)")
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
    d3.select("#LS").append("path")
        .attr("id", "stripElectrodeL")
        // .attr("transform", "translate(-"+ (width/2-posL)+ ",0)")
        .attr("d", tsPath)
        .style("opacity", 1)
        .style("fill", electrodeLcolor)
        .style("stroke", "black").style("stroke-width", "0.02em")
        .style("visibility", "visible")
    d3.select("#LS").append("image")
        .attr("id", "bubblesL")
        .attr('xlink:href', '../../images/bubbles0.svg')
        .attr("x", tubeOffset-tubeWidth*0.48).attr("y", beakerHeight-fillHeight+0.03*beakerHeight)
        .attr('width', tubeWidth*0.96)
        .attr('height', tubeWidth*0.96*1.5)
        .style("visibility", "hidden")

    svg.append("g").attr("id", "RS")
        .attr("transform", "translate("+ (posR)+ ","+(beakerBottom-beakerHeight)+ ")")
    d3.select("#RS").append("path")
        .attr("id", "wireR")
        .attr("d", wirePath)
        .style("stroke", beakerColor).style('stroke-width', "0.03em")
        .style("fill", electrodeRcolor)
        .style("visibility", "hidden") 
    d3.select("#RS").append("path")
        .attr("id", "stopperR")
        .attr("transform", "scale(-1,1)")
        .attr("d", stopperPath)
        .style("stroke", "rgb(120,150,165)").style('stroke-width', "0.1em")
        .style("fill", "rgb(160,200,220)")
    d3.select("#RS").append("path")
        .attr("id", "tubeR")
        .attr("d", tubePath)
        .attr("transform", "scale(-1,1)")
        .style("stroke", beakerColor).style('stroke-width', "0.1em")
        .style("fill", "none")
    d3.select("#RS").append("path")
        .attr("id", "stripElectrodeR")
        .attr("transform", "scale(-1,1)")
        .attr("d", tsPath)
        .style("opacity", 1)
        .style("fill", electrodeLcolor)
        .style("stroke", "black").style("stroke-width", "0.02em")
        .style("visibility", tubeR)
    d3.select("#RS").append("image")
        .attr("id", "bubblesR")
        .attr('xlink:href', '../../images/bubbles1.svg')
        .attr("x", -tubeOffset-tubeWidth*0.48).attr("y", beakerHeight-fillHeight+0.03*beakerHeight)
        .attr('width', tubeWidth*0.96)
        .attr('height', tubeWidth*0.96*1.5)
        .style("visibility", "hidden")

    svg.append("g").attr("id", "magnPoints")
    d3.select("#magnPoints").append('image')
        .attr("id", "magnSolL")
        .attr("class", "magn")
        .attr('xlink:href', '../../images/magnGlass.svg')
        .attr("x", posL+tubeOffset).attr("y", magnTop)
        .attr('width', magnWidth)
        .attr('height', magnWidth)
        .on("click", showMagnL)
    d3.select("#magnPoints").append('image')
        .attr("id", "magnSolR")
        .attr("class", "magn")
        .attr('xlink:href', '../../images/magnGlass.svg')
        .attr("x", posR-tubeOffset).attr("y", magnTop)
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

    changeCombo = function(){
        let val = document.getElementById("systemSelector").value
        combo = redoxCombos[val]
        leftSide = redoxPairs[combo["left"]]
        rightSide = redoxPairs[combo["right"]]
        electrodeLcolor = leftSide["electrodeColor"]
        stripL = leftSide["strip"]
        tubeL = leftSide["tube"]
        electrodeRcolor = rightSide["electrodeColor"]
        stripR = rightSide["strip"]
        tubeR = rightSide["tube"]
        thresVolt = rightSide["E_red"]-leftSide["E_red"]
        
        solDesc.innerHTML = combo["solutionDesc"]
        cathDesc.innerHTML = combo["cathDescr"]+ ", "
        anDesc.innerHTML = combo["anDescr"]+ ", "

        if (tubeL == "visible"){
            d3.select("#stripElectrodeL").attr("d", tsPath)
            d3.select("#wireL").style("visibility", "hidden")
            d3.select("#magnSolL").attr("x", posL+tubeOffset)
            d3.select("#bubblesL").attr("x", tubeOffset-tubeWidth*0.48)
        } else{
            if (leftSide["gas"]==true){
                d3.select("#bubblesL").attr("x", -tubeWidth*0.48)
            }
            d3.select("#stripElectrodeL").attr("d", stripPath)
            d3.select("#wireL").style("visibility", "visible")
            d3.select("#magnSolL").attr("x", posL)
        }

        d3.select("#stripElectrodeL").style("fill", electrodeLcolor)
        d3.select("#stripElectrodeL").style("visibility", stripL)
        d3.select("#tubeL").style("visibility", tubeL)
        d3.select("#stopperL").style("visibility", tubeL)
        d3.select("#wireL").style("fill", electrodeLcolor)


        if (tubeR == "visible"){
            d3.select("#stripElectrodeR").attr("d", tsPath)
            d3.select("#wireR").style("visibility", "hidden")
            d3.select("#magnSolR").attr("x", posR-tubeOffset)
            d3.select("#bubblesR").attr("x", -tubeOffset-tubeWidth*0.48)
        } else{
            if (rightSide["gas"]==true){
                d3.select("#bubblesR").attr("x", -tubeWidth*0.48)
            }
            d3.select("#stripElectrodeR").attr("d", stripPath)
            d3.select("#wireR").style("visibility", "visible")
            d3.select("#magnSolR").attr("x", posR)
        }

        d3.select("#stripElectrodeR").style("fill", electrodeRcolor)
        d3.select("#stripElectrodeR").style("visibility", stripR)
        d3.select("#tubeR").style("visibility", tubeR)
        d3.select("#stopperR").style("visibility", tubeR)
        d3.select("#wireR").style("fill", electrodeRcolor)

        d3.select("#bubblesL").style("visibility", "hidden")
        
        resetEl()
        // videoDiv.style.visibility = "hidden"
        
    }

    changePairL = function(){
        let system = document.getElementById("systemSelector").value
        val = redoxPairs[system]["ls"]
        leftSide = redoxPairs[val]
        electrodeLcolor = leftSide["electrodeColor"]
        stripL = leftSide["strip"]
        tubeL = leftSide["tube"]
        voltageReading = rightSide["E_red"]-leftSide["E_red"]

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
        electrodeRcolor = rightSide["electrodeColor"]
        stripR = rightSide["strip"]
        tubeR = rightSide["tube"]
        voltageReading = rightSide["E_red"]-leftSide["E_red"]

        d3.select("#stripElectrodeR").style("fill", electrodeRcolor)
        d3.select("#stripElectrodeR").style("visibility", stripR)
        d3.select("#tubeR").style("visibility", tubeR)
        d3.select("#wireR").style("fill", electrodeRcolor)
        d3.select("#voltReading").text(d3.format("+0.2f")(voltageReading)+" V")

        videoDiv.style.visibility = "hidden"
    }
    
    changeCombo()
})


// assigning each button their function
startButton.on("click", function(){
    stopButton.attr("disabled", null)
    startButton.attr("disabled", true)
    resetTimeButton.attr("disabled", null)
    noReaction.style.display = "none"
    closeSwitch()
    timer = setInterval(runElectrolysis, 20)
    if (voltage < thresVolt){
        noReaction.style.display="block"
        videoScreen.style.display="none"
        videoDiv.style.visibility="visible"
    }
})

stopButton.on("click", function(){
    stopButton.attr("disabled", true)
    startButton.attr("disabled", null)
    clearInterval(timer)
    // hourglass.style.opacity=0.5
    // hourglass.pause()
    resetTimeButton.attr("disabled", null)
    })

resetTimeButton.on("click", resetEl)

upV.on("click", raiseV)
downV.on("click", dropV)
upA.on("click", raiseA)
downA.on("click", dropA)