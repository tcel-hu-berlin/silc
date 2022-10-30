//TODO: make size of graph responsive


var divWidth = document.getElementById("absEmSpectra").offsetWidth
var divHeight = divWidth * 3.5/7
var margin = {top: 10, right: 0, bottom: 40, left: 10}
var width = divWidth - margin.left - margin.right
var height = divHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#absEmSpectra")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    

// Add the grey background that makes ggplot2 famous
svg
    .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "white")

// Graph labels
texts = [["A", height*0.2+10], ["B", height*0.8+10]]
texts.forEach(function(t){
svg.append("text")
.attr("text-anchor", "left")
.attr("y", +t[1])
.attr("x", 0)
.text(t[0])
.style("font-size", "1.1em")
// .style("font-weight", "600")
.style("fill", "#585858")
})
//X axis label
// svg.append("text")
// .attr("text-anchor", "end")
// .attr("x", width/2 + margin.left)
// .attr("y", height*0.4 + margin.top + 22)
// .style("font-size", "0.8em")
// .text("Wellenlänge (nm)");  
svg.append("text")
.attr("text-anchor", "end")
.attr("x", width/2 + margin.left)
.attr("y", height + margin.top + 22)
.style("font-size", "0.8em")
.text("Wellenlänge (nm)");  

var x, xAxis, y, yEm, texts, tickValues, defs, line, wavelengthSpan, minWavelength, gradient, colorPos, gradient, lineGradient, absSpectrum, emSpectrum, absLines, emLines, annotations, defs, seriesNames
var tickListTop, tickListBottom
function drawSpectra(xlim){
    svg.selectAll("defs").remove()
    svg.selectAll("g").remove()
    // svg.selectAll("g").attr("visibility", "hidden").exit().remove()
    //Add X axis
    x = d3.scaleLinear()
    .range([margin.left, margin.left+width])
    .domain([80, xlim])

    // if (xlim == 150){
    //     tickValues = [50, 100, 150, 200, 250]
    // } else {
    //     tickValues = [100, 200, 300, 400, 500, 600,  700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]
    // }
    xAxis = d3.axisBottom(x)
    .tickFormat(v => `${v.toFixed(0)}`)
    
    // xAxis.tickValues(tickValues)

    svg.append("g")
    .attr("id", "topAxis")
    .attr("transform", "translate(0," + height/2.5 + ")")
    .call(xAxis)
    .select(".domain").remove()
    svg.append("g")
    .attr("id", "bottomAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .select(".domain").remove()


    // Add Y scale
    y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0.6*height])

    yEm = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0.4*height, 0])

    // Customization
    svg.selectAll(".tick line").attr("visibility", "hidden")

    line = d3.line()
                .x(function(d,i) { return x(d.x);})
                .y(function(d) { return yEm(d.y);})
                .curve(d3.curveLinear);

    // Gradients
    defs = svg.append("defs");
    wavelengthSpan = x.domain()[1]-x.domain()[0]
    minWavelength = x.domain()[0]
    colorPos = function(wavelength){return (wavelength-minWavelength)/wavelengthSpan}
    gradient = defs.append("linearGradient").attr("id", "rainbowGradient").attr("x1", "0%").attr("x2", "100%")
    // gray ending at 380 nm
    gradient.append("stop").attr("offset", colorPos(380)).attr("stop-color","rgb(165, 150, 165)")
    // violet stop at 415 nm
    gradient.append("stop").attr("offset", colorPos(415)).attr("stop-color","violet")
    // blue stop at 467.5 nm
    gradient.append("stop").attr("offset", colorPos(467.5)).attr("stop-color","blue")
    // cyan stop at 492.5 nm
    gradient.append("stop").attr("offset", colorPos(492.5)).attr("stop-color","cyan")
    // green stop at 532.5 nm
    gradient.append("stop").attr("offset", colorPos(532.5)).attr("stop-color", "green")
    // yellow stop at 577.5 nm
    gradient.append("stop").attr("offset", colorPos(577.5)).attr("stop-color", "yellow")
    // orange stop at 607.5 nm
    gradient.append("stop").attr("offset", colorPos(607.5)).attr("stop-color", "orange")
    // red stop at 740 nm
    gradient.append("stop").attr("offset", colorPos(740)).attr("stop-color", "red")
    // gray stop at 800 nm
    gradient.append("stop").attr("offset", colorPos(800)).attr("stop-color", "rgb(180, 150, 150)")

    lineGradient = defs.append("linearGradient").attr("id", "lineGradient").attr("x1", "0%").attr("x2", "100%")
    lineGradient.append("stop").attr("offset", "0%").attr("stop-color", "rgba(0,0,0,0)")
    lineGradient.append("stop").attr("offset", "49.9%").attr("stop-color", "rgba(0,0,0,1)")
    lineGradient.append("stop").attr("offset", "50.1%").attr("stop-color", "rgba(0,0,0,1)")
    lineGradient.append("stop").attr("offset", "100%").attr("stop-color", "rgba(0,0,0,0)")

    // Windows for spectra
    absSpectrum = svg.append("g").attr("id", "absSpectrum")
    absSpectrum.append("rect")
    .attr("x", margin.left)
    .attr("y", y(1))
    .attr("width", width)
    .attr("height", height*0.4)
    .style("fill", "black")
    absSpectrum.append("rect")
    .attr("x", margin.left)
    .attr("y", y(0.5))
    .attr("width", width)
    .attr("height", height*0.2)
    .style("fill", "url(#rainbowGradient)")

    emSpectrum = svg.append("g").attr("id", "emSpectrum")
    emSpectrum.append("rect")
    .attr("x", margin.left)
    .attr("y", yEm(1))
    .attr("width",width)
    .attr("height", height*0.4)
    .style("fill", "black")
    .style("opacity", 1)

    // Spectral lines
    absLines = svg.append("g")
    emLines = svg.append("g")
    seriesNames = svg.append("g")
    data = d3.csv("../../files/hLines.csv", function(data) {
        // Color scale
        var keys = ["Lyman", "Balmer", "Paschen"]
        var bounds = [[90, 123], [369, 657], [849, 1877]]

        var color = d3.scaleLinear()
            .domain([80, 380, 415, 467.5, 492.5, 532.5, 577.5, 607.5, 687.5, 800, 1000])
            .range(["rgb(165, 150, 165", "rgb(165, 150, 165", "violet", "blue", "cyan", "green", "yellow", "orange", "red", "rgb(180, 150, 150)", "rgb(180, 150, 150)"])

        keys.forEach(function(ser, i){
            emLines.append("g").attr("id", ser+"_emLines").attr("selected", "false").selectAll()
            .data(data.filter(function(d) {return d.series == ser && d.nm < x.domain()[1] && d.nm > x.domain()[0]}))
            .enter().append("rect")
            .attr("fill", function(d){return color(d.nm)})
            .attr("x", function(d) {return x(d.nm)-0.5})
            .attr("y", yEm(0.5))
            .attr("width", 1)
            .attr("height", yEm(0.5))

            svg.append("rect").attr("id", ser)
            .attr("x", x(bounds[i][0])).attr("y", yEm(0.5))
            .attr("width", x(bounds[i][1])-x(bounds[i][0])).attr("height", height*0.2)
            .style("opacity", 0)

            absLines.append("g").attr("id", ser+"_absLines").attr("selected", "false").selectAll()
                .data(data.filter(function(d) {return d.series == ser && d.nm < x.domain()[1] && d.nm > x.domain()[0]}))
                .enter().append("rect")
                .attr("x", function(d) {return x(d.nm)-1.5})
                .attr("y", y(0.5))
                .attr("width", 3)
                .attr("height", y(0)-y(0.5))
                .style("fill", "url(#lineGradient)")
                .style("opacity", 0.8)

            // brackets highlighting lines
            bracket = []
            bracket.push({"x": bounds[i][0]*0.98, "y":0.69})
            bracket.push({"x": bounds[i][0]*0.98, "y":0.76})
            bracket.push({"x": bounds[i][1]*1.02, "y":0.76})
            bracket.push({"x": bounds[i][1]*1.02, "y":0.69})
            seriesNames.append("path")
                .attr("d", line(bracket))
                .style("stroke", "white")
                .style("fill", "none")

            seriesNames.append("text")
                .attr("x", x(bounds[i][0]*0.9))
                .attr("y", yEm(0.81))
                .attr("text-anchor", "left")
                .text(ser)
                .style("fill", 'white')

            });

            // Arrow to show continuation of Paschen series
            if (xlim == 1200){
                arrow = []
                arrow.push({"x": xlim*0.989, "y":0.79})
                arrow.push({"x": xlim*0.999, "y":0.76})
                arrow.push({"x": xlim*0.989, "y":0.73})
                seriesNames.append("path")
                    .attr("d", line(arrow))
                    .style("stroke", "white")
                    .style("fill", "none")
                

                // Wavelength domains
                domains = [["UV", 230, "rgb(165, 150, 165)"], ["sichtbar", 600, "rgb(55, 200, 0)"], ["IR", 980, "rgb(180, 150, 150)"]]
                domains.forEach(function(d){
                    svg.append("text")
                        .text(d[0])
                        .attr("x", x(d[1]))
                        .attr("y", y(0.72))
                        .attr("text-anchor", "middle")
                        .style("fill", d[2])
                        .style("font-size", "1.1em")
                        .style("font-weight", "600")
                        .style('opacity', 0.6)   
                    })
                }
            
            


            // Annotated lines for exercise
            annotations = svg.append("g").attr("id", "annotations")
            annPos = [["I", 102.6, 0],["II", 656.5, 0], ["III", 486.3, 1], ["IV", 1094.1, 1]]
            annPos.forEach(function(t){
            annotations.append("text")
                .attr("text-anchor", "middle")
                .attr("y", function(){
                    if (t[2] == 0){
                        return height*0.18
                    } else {
                        return height*0.78
                    }
                })
                .attr("x", x(t[1]))
                .text(t[0])
                .style("font-size", "1em")
                .style("font-family", "serif")
                .style("font-weight", 500)
                .style("fill", "#f6f6f6")
            })

        tickListTop = svg.select("#topAxis").selectAll(".tick")._groups[0]
        tickListBottom = svg.select("#bottomAxis").selectAll(".tick")._groups[0]
        tickListTop[tickListTop.length-1].remove()
        tickListBottom[tickListBottom.length-1].remove()
        })
    
    
    }

drawSpectra(2000)