// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// // function used for updating x-scale var upon click on axis label
function renderXAxis(newXScale, xAxis) {
    const bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}
// function xScale(hairData, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(hairData, d => d[chosenXAxis]) * 0.8,
//       d3.max(hairData, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }

// // function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    const leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}
// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating circles group with a transition to
// // new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

   circlesGroup.transition()
     .duration(1000)
     .attr("cx", d => newXScale(d[chosenXAxis]))
     .attr("Cy", d => newYScale(d[chosenYAxis]));

   return circlesGroup;
}
function renderTexts(txtGroup, newXScale, chosenXAxis, chose) {

    txtGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));
    return txtGroup;

}

// // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
    var xLabel= ""
    var yLabel= ""

   if (chosenXAxis === "poverty") {
     xLabel = "Poverty: ";
   }
   else if (chosenXAxis === "age"){
       xLabel = "Age: ";
   }
   else{
       xLabel = "Income: $";
   }
   if (chosenYAxis === "healthcare") {
       yLabel = "Healthcare: ";
   }
   else if (chosenYAxis === "smokes") {
       yLabel = "Smokes: ";
   }
   else{
       yLabel = "Obesity: ";
   }
   const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d){
            if (chosenYAxis === "smokes" || chosenYAxis === "obesity") {
                if (chosenXAxis === "poverty"){
                    return("${d.state},${d.abbr}<br>${Label}$d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}%")
                }
                return("${d.state},${d.abbr}<br>${Label}$d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}%")
            }
            else if (chosenXAxis === "poverty"){
                return("${d.state},${d.abbr}<br>${Label}$d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}%")
            }
            else{
                return("${d.state},${d.abbr}<br>${Label}$d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}%")
            }
        })
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data){
        toolTip.show(data, this);
        d3.select(this).style("stroke", "black");

    })
    circlesGroup.on("mouseout", function(data, index){
    toolTip.hide(daata, this)
    d3.select(this).style("stroke", "white");
})
        return circlesGroup;
}

// // Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(healthData, err) {
    if (err) throw err;
// d3.csv("hairData.csv").then(function(hairData, err) {
//   if (err) throw err;

//   // parse data
    healthData.forEach(function(data) {
     data.poverty = +data.poverty;
     data.healthcare = +data.healthcare;
     data.age = +data.age;
     data.income = +data.income;
     data.smokes = +data.smokes;
     data.obesity = + data.obesity;
    })

//   // xLinearScale function above csv import
   var xLinearScale = xScale(healthData, chosenXAxis);

//   // Create y scale function
   var yLinearScale = yScale(healthData, chosenYAxis);
//     .domain([0, d3.max(hairData, d => d.num_hits)])
//     .range([height, 0]);

//   // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

//   // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
    
    var cirTextGroup = chartGroup.selectAll("myCircles")
        .data(healthData)
        .enter()
        .append("g")   

//   // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
//     .data(hairData)
//     .enter()
//     .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .classed("stateCircle", true)
        .attr("r", 10)
        .attr("fill", "gray")
        .attr("opacity", ".5");

    textGroup = cirTextGroup.append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+3)
        .classed("stateText", true)
        .style("font-size", "8px")
        .style("font-weight", "600")

//   // Create group for three x-axis labels
    var labelsGroupX = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    // Creat group for three y-axix labels
    var labelsGroupY = chartGroup.append("g")
        .attr("transform", `translate(${0-margin.left/4}, ${height/2})`);

    var povertyLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var incomeLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    var healthcareLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");

    var smokeLabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .classed("axis-text", true)
        .text("Smokes (%)");

    var  obesitylabel = labelsGroupY.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .classed("axis-text", true)
        .text("Obese (%)");        
    
//   var albumsLabel = labelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "num_albums") // value to grab for event listener
//     .classed("inactive", true)
//     .text("# of Albums Released");

//   // append y axis
//   chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Number of Billboard 500 Hits");

//   // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//   // x axis labels event listener
    labelsGroupX.selectAll("text")
        .on("click", function() {
//       // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

//         // replaces chosenXAxis with value
            chosenXAxis = value;
            console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
            xLinearScale = xScale(healthData, chosenXAxis);

//         // updates x axis with transition
            xAxis = renderAxes(xLinearScale, xAxis);

//         // updates circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, chosenYAxis);

//         // updates tooltips with new info
            textGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true)
            }
            else if (chosenXAxis === "age"){
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false)
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            circlesGroup = updateToolTip(chosenYAxis, chosenXAxis, circlesGroup);
        }})

        labelsGroupY.selectALl("text")
            .on("click"), function() {
            var value = d3.select(this).attr("value");

            if(value !== chosenYAxis)
                chosenYAxis = value;
                console.log(chosenXAxis)

                yLinearScale = yScale(healthData, chosenYAxis);

                yAxis = renderYAxes(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                textGroup = renderTexts(textGroup, xLinearScale, yLinearScale, chosenYAxis, chosenXAxis);

                if (chosenYAxis === "healthcare") {
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesitylabel 
                        .classed("active", false)
                        .cassed("inactive", true);
                }
                else if (chosenYAxis === "smokes"){
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesitylabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else {
                    healthcareLabel 
                        .classed("active", false)
                        .classed("inactive", true);
                    smokeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesitylabel
                        .classed("active",  true)
                        .classed("inactive", false);
                }
                
            }
        });  
// }).catch(function(error) {
//   console.log(error);
// })
