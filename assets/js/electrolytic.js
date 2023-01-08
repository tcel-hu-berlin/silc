
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
var videoDiv = document.getElementById("molRep")
var videoScreen = document.getElementById("molRepVideo")
var noReaction = document.getElementById("noReaction")
var minutesInd = document.getElementById("minutesInd")
var secondsInd = document.getElementById("secondsInd")
var voltInd = document.getElementById("voltInd")
var ampInd = document.getElementById("ampInd")
var cathDesc = document.getElementById("cathDesc")
var anDesc = document.getElementById("anDesc")

// d3.js element selections
var startButton = d3.select("#startButton")
var stopButton = d3.select("#stopButton")
var resetTimeButton = d3.select("#resetTimeButton")
var upV = d3.select("#upV"), downV = d3.select("#downV"), upA = d3.select("#upA"), downA = d3.select("#downA")

// variables that are changed throughout simulation
var voltage = +voltInd.innerHTML
var current = +ampInd.innerHTML
console.log({voltage}, {current})
var timer
var secondsPassed = 0
var minV = -2, maxV = 2, minA = 0.5, maxA=5

// Paths
var posL = 0.40*width,
posR = 0.60*width,
beakerBottom = 0.6*height,
circuitHeight = 0.15*height,

beakerWidth = 0.15*width*2.3,
beakerHeight = 0.2*height,
beakerCurve = 0.01*width,
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

var stripWidth = 0.06*beakerWidth, stripHeight=0.75*beakerHeight
stripPath = d3.path()
stripPath.moveTo(-stripWidth/2, 0)
stripPath.lineTo(-stripWidth/2, stripHeight)
stripPath.lineTo(+stripWidth/2, stripHeight)
stripPath.lineTo(+stripWidth/2, 0)
stripPath.closePath()

var wireNW = 0.01*beakerWidth, wireNH=0.58*beakerHeight
var wireWW = 0.02*beakerWidth, wireWH=0.069*beakerHeight
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
voltmeterTop = 0.025*height; voltmeterLeft = 0.025*width; voltmeterWidth = 0.28*width; voltmeterHeight = 0.24*width
redHeight = voltmeterTop+0.43*voltmeterHeight; blueHeight = voltmeterTop+0.57*voltmeterHeight; 

circuitPath = d3.path()
circuitPath.moveTo(posL, beakerBottom-beakerHeight)
circuitPath.lineTo(posL, blueHeight)
circuitPath.lineTo(voltmeterLeft+voltmeterWidth, blueHeight)
circuitPath.moveTo(voltmeterLeft+voltmeterWidth, redHeight)
circuitPath.lineTo(posR, redHeight)
circuitPath.lineTo(posR, beakerBottom-beakerHeight)

var tubeWidth = 0.08*beakerWidth, tubeOffset = 0.14*beakerWidth, 
tubeCurve = tubeWidth/2, tubeHeight = beakerHeight, tubeBottom=0.6*beakerHeight
tubePath = d3.path()
tubePath.moveTo(0, 0)
tubePath.lineTo(0, 0.85*beakerHeight)
tubePath.lineTo(tubeOffset, 0.85*beakerHeight)
tubePath.lineTo(tubeOffset, 0.5*beakerHeight)
tubePath.moveTo(tubeOffset-0.5*tubeWidth, tubeBottom)
tubePath.lineTo(tubeOffset-0.5*tubeWidth,tubeBottom-tubeHeight)
tubePath.moveTo(tubeOffset+0.5*tubeWidth,tubeBottom-tubeHeight)
tubePath.lineTo(tubeOffset+0.5*tubeWidth, tubeBottom)

var stopperWidth = 0.81*tubeWidth, stopperWWidth=stopperWidth*1.4, stopperNWidth=stopperWidth*0.4
stopperBottom = beakerHeight-fillHeight, stopperHeight=stopperBottom-tubeBottom+tubeHeight*1.05
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
for (i=0; i<10; i++){
    let y = beakerHeight-fillHeight-i*(stopperHeight*0.8)/10
    tubePath.moveTo(tubeOffset+0.5*tubeWidth,y)
    tubePath.lineTo(tubeOffset+0.5*tubeWidth-0.2*tubeWidth, y)   
}

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

var closeSwitch = function(){
    d3.select("#switchImg").attr("xlink:href", "../../images/switchClosedVert.png")
    d3.select("#switchImg").attr("status","closed")
}

var openSwitch = function(){
    d3.select("#switchImg").attr("xlink:href","../../images/switchOpenVert.png")
    d3.select("#switchImg").attr("status", "open")
}

var toggleSwitch = function(){
    let sw = d3.select("#switchImg")
    let st = sw.attr("status")
    if (st == "open"){closeSwitch()} else {openSwitch()}
}

var writeTime = function(tsec){
    let secondsPassedStr = (tsec%60).toString()
    let minutesPassedStr = Math.trunc(tsec/60).toString()
    secondsInd.innerHTML = String(secondsPassedStr).padStart(2, "0")
    minutesInd.innerHTML = String(minutesPassedStr).padStart(2, "0")
}
var advanceTimerOnce = function(){
    secondsPassed += 1
    writeTime(secondsPassed)
}



// Loading Data
var defaultCombo = "waterH2SO4"
var combo, leftSide, rightSide
var redoxPairs, redoxCombos, solutionColor, electrodeLcolor, electrodeRcolor, stripL, stripR, tubeL, tubeR, voltageReading
var changePairL, changePairR
var rP = d3.json("../../files/redoxPairs.json", function(data){
    
    redoxPairs = data["halfCells"]
    redoxCombos = data["combos"]
    combo = redoxCombos[defaultCombo]
    leftSide = redoxPairs[combo["left"]]
    rightSide = redoxPairs[combo["right"]]
    console.log(combo, leftSide, rightSide)
    cathDesc.innerHTML = redoxCombos[defaultCombo]["cathDescr"]+ ", "
    anDesc.innerHTML = redoxCombos[defaultCombo]["anDescr"]+ ", "

    solutionColor = combo["solutionColor"]
    electrodeLcolor = leftSide["electrodeColor"]
    electrodeRcolor = rightSide["electrodeColor"]
    stripL = leftSide["strip"]; stripR = rightSide["strip"]
    tubeL = leftSide["tube"]; tubeR = rightSide["tube"]
    voltageReading = rightSide["E_red"]-leftSide["E_red"]


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
        .style("visibility", "visible") 

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
    
    // changePairL();changePairR()
})


// assigning each button their function
startButton.on("click", function(){
    stopButton.attr("disabled", null)
    startButton.attr("disabled", true)
    resetTimeButton.attr("disabled", null)
    closeSwitch()
    timer = setInterval(
        function(){
            advanceTimerOnce();
        }, 10
    )

})

stopButton.on("click", function(){
    stopButton.attr("disabled", true)
    startButton.attr("disabled", null)
    openSwitch()
    clearInterval(timer)
    resetTimeButton.attr("disabled", null)
    })

resetTimeButton.on("click", function(){
    secondsPassed = 0
    writeTime(secondsPassed)
    resetTimeButton.attr("disabled", true)
    stopButton.attr("disabled", true)
    startButton.attr("disabled", null)
    openSwitch()
    clearInterval(timer)
})

upV.on("click", raiseV)
downV.on("click", dropV)
upA.on("click", raiseA)
downA.on("click", dropA)