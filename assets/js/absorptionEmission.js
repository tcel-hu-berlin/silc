//TODO: make size of graph responsive
//TODO: firefox problem
//TODO: zoom
//TODO:  set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 50}
var width = 700 - margin.left - margin.right
var height = 400 - margin.top - margin.bottom;

var beansSpilled = false

//info for legend
var legx = width*0.93
var legy = height*0.04
var legx1 = legx-17
var legx2 = width*1.05
var legy1 = 0
var legy2 = 0.16*height


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

clickRect =  svg.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", width)
    .style("fill", "red")
    .style("opacity", 0)
    .on("click", function(){
        var xval = d3.mouse(this)[0]
        var yval = d3.mouse(this)[1]
        xwithinbox = xval>legx1 && xval<legx2
        ywithinbox = yval>legy1 && yval<legy2
        withinbox = xwithinbox && ywithinbox
        console.log(withinbox)
        if (!withinbox){
            d3.select("#xCur").attr("x1", xval).attr("x2", xval)
            d3.select("#xCur").attr("y1", yval-10).attr("y2", yval+10)
            d3.select("#yCur").attr("y1", yval).attr("y2", yval)
            d3.select("#yCur").attr("x1", xval-10).attr("x2", xval+10)
            curX = x.invert(xval); curY = y.invert(yval)
            d3.select("#coord").text("λ = "+curX.toFixed(1) + " nm")
            d3.select("#coord").attr("visibility", "visible")
            
            if(xval<width/2){
                d3.select("#coord")
                    .attr("x", xval+10)
                    .attr("text-anchor", "start")}
                else{d3.select("#coord")
                                .attr("x", xval-10)
                                .attr("text-anchor", "end")}
            if(y<height/2){
                d3.select("#coord").attr("y", yval+20)}
                else{d3.select("#coord").attr("y", yval-10)}
        }
        
    })
//Add X axis
var x = d3.scaleLinear()
    .range([0, width])
    .domain([50, 1000])
var xAxis = d3.axisBottom(x)
    .tickFormat(v => `${v.toFixed(0)}`)
    .tickValues([100, 200, 300, 400, 500, 600,  700, 800, 900])
    
svg.append("g")
    .attr("transform", "translate(0," + height/2.5 + ")")
    .call(xAxis)
    .select(".domain").remove()
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .select(".domain").remove()
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height*0.4 + margin.top + 25)
    .text("Wellenlänge (nm)");  
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height + margin.top + 25)
    .text("Wellenlänge (nm)");  

// Add Y axis
var y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0.6*height])

var yEm = d3.scaleLinear()
        .domain([0, 1])
        .range([ 0.4*height, 0])
        //.nice()
// svg.append("g")
//     // .call(d3.axisLeft(yEm).tickSize(-width*1.3).ticks(7))
//     .select(".domain").remove()

// Customization
svg.selectAll(".tick line").attr("visibility", "hidden")

// Add X axis label to top graph:
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width/2 + margin.left)
    .attr("y", height*0.4 + margin.top + 25)
    .text("Wellenlänge (nm)");
// Gradient
var defs = svg.append("defs");
var wavelengthSpan = x.domain()[1]-x.domain()[0]
var minWavelength = x.domain()[0]
function colorPos(wavelength){return (wavelength-minWavelength)/wavelengthSpan}
var gradient = defs.append("linearGradient").attr("id", "rainbowGradient").attr("x1", "0%").attr("x2", "100%")

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

var absSpectrum = svg.append("g").attr("id", "absSpectrum")
absSpectrum.append("rect")
    .attr("x", 0)
    .attr("y", y(1))
    .attr("width", width)
    .attr("height", height*0.4)
    .style("fill", "black")
absSpectrum.append("rect")
    .attr("x", 0)
    .attr("y", y(0.5))
    .attr("width", width)
    .attr("height", height*0.2)
    .style("fill", "url(#rainbowGradient)")


var emSpectrum = svg.append("g").attr("id", "emSpectrum")
emSpectrum.append("rect")
    .attr("x", 0)
    .attr("y", yEm(1))
    .attr("width",width)
    .attr("height", height*0.4)
    .style("fill", "black")
    .style("opacity", 1)

// cross with x and y values
x0 = 0.05*width; y0 = 0.05*height
cursor = svg.append("g").attr("id", "cursor")
cursor.append("line")
    .style("stroke", "black")
    .style("stroke-width", 1.5)
    .attr("x1", x0+10).attr("x2", x0-10)
    .attr("y1", y0).attr("y2", y0)
    .attr("id", "yCur")
cursor.append("line")
    .style("stroke", "black")
    .style("stroke-width", 1.5)
    .attr("x1", x0).attr("x2", x0)
    .attr("y1", y0+10).attr("y2", y0-10)
    .attr("id", "xCur")
cursor.append("text")
    .style("stroke", "black")
    .attr("id", "coord")
    .attr("x", x0+10).attr("y", y0+20)
    .text("Tippe irgendwo, um die Wellenlänge anzuzeigen")
    //.attr("visibility", "hidden")



var absLines = svg.append("g")
var emLines = svg.append("g")
//Read the data
data = d3.csv("../files/hLines.csv", function(data) {
    // Color scale
    var keys = ["Lyman", "Balmer", "Paschen"]
    var bounds = [[90, 123], [369, 657], [849, 1877]]
    var color = d3.scaleLinear()
        .domain([80, 380, 415, 467.5, 492.5, 532.5, 577.5, 607.5, 687.5, 800, 1000])
        .range(["rgb(165, 150, 165", "rgb(165, 150, 165", "violet", "blue", "cyan", "green", "yellow", "orange", "red", "rgb(180, 150, 150)", "rgb(180, 150, 150)"])
    
    keys.forEach(function(ser, i){
        emLines.append("g").attr("id", ser+"_absLines").attr("selected", "false").selectAll()
        .data(data.filter(function(d) {return d.series == ser && d.nm < x.domain()[1] && d.nm > x.domain()[0]}))
        .enter().append("rect")
        .attr("fill", function(d){
            if (d.series == ser){return color(d.nm)}})
        .attr("x", function(d) {
            if (d.series == ser){return x(d.nm)-0.25}})
        .attr("y", yEm(0.5))
        .attr("width", 1)
        .attr("height", yEm(0.5))

        svg.append("rect").attr("id", ser)
        .attr("x", x(bounds[i][0])).attr("y", yEm(0.5))
        .attr("width", x(bounds[i][1])-x(bounds[i][0])).attr("height", height*0.2)
        .style("opacity", 0)
        .on("click", function(){
            g = emLines.select("#"+this.id+"_absLines")
            if  (g.attr("selected") == "false"){
                g.selectAll("rect").style("stroke", "rgba(255, 255, 100, 0.4)").style("stroke-width", 2)
                g.attr("selected", "true")
            } else {
                g.selectAll("rect").style("stroke", "none")
                g.attr("selected", "false")
            }
        
        absLines.append("g").attr("id", ser+"_emLines").attr("selected", "false").selectAll()
        .data(data.filter(function(d) {return d.series == ser && d.nm < x.domain()[1] && d.nm > x.domain()[0]}))
        .enter().append("rect")
        .attr("x", function(d) {
            if (d.series == ser){return x(d.nm)-0.25}})
        .attr("y", y(0.5))
        .attr("width", 2)
        .attr("height", y(0.5))
        .attr("fill", "black")

        })


    })
    
 });

//  clickRect.raise()
