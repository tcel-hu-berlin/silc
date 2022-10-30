//TODO: make size of graph responsive
//TODO: zoom

var marginP = {top: 10, right: 30, bottom: 40, left: 50}
var graphDiv = document.getElementById("simulationA")

var widthP = graphDiv.clientWidth - marginP.left - marginP.right
// var height = graphDiv.clientHeight - marginP.top - marginP.bottom;
var heightP = widthP*0.6

//info for legend
var legx = widthP*0.93
var legy = heightP*0.24
var legx1 = legx-17
var legx2 = marginP.left+widthP-20
var legy1 = legy-0.04*heightP
var legy2 = heightP*0.91

// append the svg object to the body of the page
var svgP = d3.select("#simulationA")
    .append("svg")
    .attr("width", widthP + marginP.left + marginP.right)
    .attr("height", heightP + marginP.top + marginP.bottom)
    .append("g")
    .attr("transform",
        "translate(" + marginP.left + "," + marginP.top + ")")
    

// Add the background
svgP
    .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", heightP)
    .attr("width", widthP)
    .style("fill", "white")
    

// for clicking
clickRect= svgP.append("rect")
    .attr("x",0)
        .attr("y",0)
        .attr("height", heightP)
        .attr("width", widthP)
        .attr("fill", "red") 
        .attr("opacity", 0)
        .on("click", function(){
            var xval = d3.mouse(this)[0]
            var yval = d3.mouse(this)[1]
            // xwithinbox = xval>legx1 && xval<legx2
            // ywithinbox = yval>legy1 && yval<legy2
            // withinbox = xwithinbox && ywithinbox
            // console.log(withinbox)
            // if (!withinbox){
            d3.select("#xCur").attr("x1", xval).attr("x2", xval)
            d3.select("#xCur").attr("y1", yval-10).attr("y2", yval+10)
            d3.select("#yCur").attr("y1", yval).attr("y2", yval)
            d3.select("#yCur").attr("x1", xval-10).attr("x2", xval+10)
            curX = xP.invert(xval); curY = yP.invert(yval)
            d3.select("#coord").text("IE: "+curX.toFixed(1) + " eV  | Intensität: "+curY.toFixed(1))
            d3.select("#coord").attr("visibility", "visible")
            
            if(xval<widthP/2){
                d3.select("#coord")
                    .attr("x", xval+10)
                    .attr("text-anchor", "start")}
                else{d3.select("#coord")
                                .attr("x", xval-10)
                                .attr("text-anchor", "end")}
            if(y<heightP/2){
                d3.select("#coord").attr("y", yval+20)}
                else{d3.select("#coord").attr("y", yval-10)}
            // }
        })

//Add X axis
var xP = d3.scaleLog()
    .domain([40000, 0.9])
    .range([ 0, widthP ])
var xAxisP = d3.axisBottom(xP)
    .tickValues([1, 10, 100, 1000, 10000])
    .tickFormat((d, i) => ['1', '10', '100', '1000', '10000'][i])
svgP.append("g")
    .attr("transform", "translate(0," + heightP + ")")
    .call(xAxisP)
    .select(".domain").remove()

// Add Y axis
var yP = d3.scaleLinear()
        .domain([-0.05, 11.5])
        .range([ heightP, 0])
        //.nice()
svgP.append("g")
    .call(d3.axisLeft(yP).tickSize(-widthP*1.3).ticks(7))
    .select(".domain").remove()

// Customization
svgP.selectAll(".tick line").attr("stroke", "lightgray")

// Add X axis label:
svgP.append("text")
    .attr("text-anchor", "end")
    .attr("x", widthP/2 + marginP.left)
    .attr("y", heightP + marginP.top + 25)
    .text("Ionisierungsenergie (eV)");

// Y axis label:
svgP.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -marginP.left + 20)
    .attr("x", -marginP.top - heightP/2 + 20)
    .text("Intensität")

// Cursor-cross with x and y values
x0 = 0.05*widthP; y0 = 0.05*heightP
cursor = svgP.append("g").attr("id", "cursor")
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
    .text("Tippe irgendwo, um X und Y anzuzeigen")
    //.attr("visibility", "hidden")

//Read the data
d3.csv("../../files/plotPES.csv", function(data) {
    // Color scale
    var keysP = ["H", "He", "Li", "U1", "U2", "U3", "U4", "U5"]
    var color = d3.scaleOrdinal()
        .domain(keysP)
        .range(["#619CFF", "orange", "blue", "#F8766D", "#00BA38", "brown", "violet", "gray"]);

// Add plots
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("H"))
    .attr("stroke-width", 1.5)
    .attr("id", "H_line")
    .attr("visibility", "visible")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.H) })
        )
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("He"))
    .attr("stroke-width", 1.5)
    .attr("id", "He_line")
    .attr("visibility", "hidden")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.He) })
        )
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("Li"))
    .attr("stroke-width", 1.5)
    .attr("id", "Li_line")
    .attr("visibility", "hidden")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.Li) })
        )
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("U1"))
    .attr("stroke-width", 1.5)
    .attr("id", "U1_line")
    .attr("visibility", "hidden")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.U1) })
        )
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("U2"))
    .attr("stroke-width", 1.5)
    .attr("id", "U2_line")
    .attr("visibility", "hidden")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.U2) })
        )
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("U3"))
    .attr("stroke-width", 1.5)
    .attr("id", "U3_line")
    .attr("visibility", "hidden")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.U3) })
        )
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("U4"))
    .attr("stroke-width", 1.5)
    .attr("id", "U4_line")
    .attr("visibility", "hidden")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.U4) })
        )
svgP.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color("U5"))
    .attr("stroke-width", 1.5)
    .attr("id", "U5_line")
    .attr("visibility", "hidden")
    .attr("d", d3.line()
        .x(function(d) { return xP(d.eV) })
        .y(function(d) { return yP(d.U5) })
        )

// Legend
var legend = svgP.append("g")
    .attr("id", "legend")
legend.append("rect")
    .attr("x",legx1)
    .attr("y",legy1)
    .attr("height", legy2-legy1)
    .attr("width", legx2-legx1)
    .style("fill", "white")
    .style("stroke", "black")
legend.selectAll("mydots")
    .data(keysP)
    .enter()
    .append("circle")
        .attr("cx", legx)
        .attr("cy", function(d,i){ return legy + i*25}) // legy is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .attr("id", function(d, i){return keysP[i]+"_dot"})
        .style("fill", function(d, i){
            if (keysP[i] != "H"){return "white"}else{return color("H")}})
        .style("stroke", function(d){ return color(d)})
        .on("click", function(d, i){
            lineID = "#"+keysP[i]+"_line"
            dotID = "#"+this.id
            var active = d3.select(lineID).style("visibility")
            if (active == "visible"){
                d3.select(lineID).style("visibility", "hidden")
                d3.select(dotID).style("fill", "white")
            } else {
                d3.select(lineID).style("visibility", "visible")
                d3.select(dotID).style("fill", color(d))
            }
        })


// Add one dot in the legend for each name.
legend.selectAll("mylabels")
    .data(keysP)
    .enter()
    .append("text")
        .attr("x", legx+20)
        .attr("y", function(d,i){ return legy + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "black")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

cursor.raise()
clickRect.raise()
legend.raise()
    });


