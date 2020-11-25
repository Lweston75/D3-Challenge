// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(healthData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "gray")
    .attr("opacity", ".5")

    var circlesGroup = chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("font-size", "14px")
    .style("text-anchor", "middle")
    .style("fill", "white")
    .text(d => (d.abbr));

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lackes Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  }).catch(function(error) {
    console.log(error);
  });

//   // could not get the bonus to work
// // Initial Params
// var chosenXAxis = "poverty";
// var chosenYAxis = "healthcare";

// // // function used for updating x-scale var upon click on axis label

// function xScale(healthData, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
//       d3.max(healthData, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }
// function yScale(healthData, chosenXAxis) {
//     // create scales
//     var yLinearScale = d3.scaleLinear()
//       .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
//         d3.max(healthData, d => d[chosenYAxis]) * 1.2
//       ])
//       .range([0, width]);
  
//     return yLinearScale;
// }
// // // function used for updating xAxis var upon click on axis label

// function renderAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }
// function renderYAxes(newYScale, yAxis) {
//     var leftAxis = d3.axisLeft(newYScale);
    
//      yAxis.transition()
//        .duration(1000)
//        .call(leftAxis);
    
//    return yAxis;
// }

// // // function used for updating circles group with a transition to
// // // new circles
// function renderCircles(circlesGroup, newXScale, chosenXAxis) {

//    circlesGroup.transition()
//      .duration(1000)
//      .attr("cx", d => newXScale(d[chosenXAxis]))
//      .attr("cy", d => newYScale(d[chosenYAxis]));

//    return circlesGroup;
// }
// function renderTexts(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
//     textGroup.transition()
//         .duration(1000)
//         .attr("x", d => newXScale(d[chosenXAxis]))
//         .attr("y", d => newYScale(d[chosenYAxis]))
//     return textGroup;
// }


// // // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
//     var xLabel;
//     var yLabel;

//    if (chosenXAxis === "poverty") {
//      xLabel = "Poverty: ";
//    }
//    else if (chosenXAxis === "age"){
//        xLabel = "Age: ";
//    }
//    else{
//        xLabel = "Income: $";
//    }
//    if (chosenYAxis === "healthcare") {
//        yLabel = "Healthcare: ";
//    }
//    else if (chosenYAxis === "smokes") {
//        yLabel = "Smokes: ";
//    }
//    else{
//        yLabel = "Obesity: ";
//    }
//    var toolTip = d3.tip()
//         .attr("class", "tooltip")
//         .offset([80, -60])
//         .html(function(d){
//             if(chosenYAxis === "smokes" || chosenYAxis === "obesity"){
//                 if(chosenXAxis === "poverty"){
                       
//                     return (`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}`)
//                 }
//                 return (`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}`)
//             }
//             else if(chosenXAxis === "poverty") {
//                 return (`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}`)
//             }
//             else{
//                 return (`${d.state},${d.abbr}<br>${xLabel}${d[chosenXAxis]}%<br>${yLabel}${d[chosenYAxis]}`)
//             }
                
//         });

//     circlesGroup.call(toolTip);
//     circlesGroup.on("mouseover", function(data){
//         toolTip.show(data);


//     })
//         .on("mouseout", function(data, index){
//         toolTip.hide(data);

//         });
//         return circlesGroup;
// }

// // // Retrieve data from the CSV file and execute everything below
// d3.csv("assets/data/data.csv").then(function(healthData, err) {
//     if (err) throw err;
// // d3.csv("hairData.csv").then(function(hairData, err) {
// //   if (err) throw err;

// //   // parse data
//     healthData.forEach(function(data) {
//      data.poverty = +data.poverty;
//      data.healthcare = +data.healthcare;
//      data.age = +data.age;
//      data.income = +data.income;
//      data.smokes = +data.smokes;
//      data.obesity = + data.obesity;
//     })

// //   // xLinearScale function above csv import
//    var xLinearScale = xScale(healthData, chosenXAxis);

// //   // Create y scale function
//    var yLinearScale = yScale(healthData, chosenYAxis);


// //   // Create initial axis functions
//     var bottomAxis = d3.axisBottom(xLinearScale);
//     var leftAxis = d3.axisLeft(yLinearScale);

// //   var bottomAxis = d3.axisBottom(xLinearScale);
// //   var leftAxis = d3.axisLeft(yLinearScale);

// //   // append x axis
//     var xAxis = chartGroup.append("g")
//         .classed("x-axis", true)
//         .attr("transform", `translate(0, ${height})`)
//         .call(bottomAxis);

// //   // append y axis
//     var yAxis = chartGroup.append("g")
//         .classed("y-axis", true)
//         .call(leftAxis);
    
//     var cirTextGroup = chartGroup.selectAll("myCircles")
//         .data(healthData)
//         .enter()
//         .append("g")   

// //   // append initial circles
//     var circlesGroup = chartGroup.selectAll("circle")

//         .attr("cx", d => xLinearScale(d[chosenXAxis]))
//         .attr("cy", d => yLinearScale(d[chosenYAxis]))
//         .classed("stateCircle", true)
//         .attr("r", 10)
//         .attr("fill", "gray")
//         .attr("opacity", ".5");

//     textGroup = cirTextGroup.append("text")
//         .text(d => d.abbr)
//         .attr("x", d => xLinearScale(d[chosenXAxis]))
//         .attr("y", d => yLinearScale(d[chosenYAxis])+3)
//         .classed("stateText", true)
//         .style("font-size", "8px")
//         .style("font-weight", "600")

// //   // Create group for three x-axis labels
//     var labelsGroupX = chartGroup.append("g")
//         .attr("transform", `translate(${width / 2}, ${height + 20})`);

//     // Creat group for three y-axix labels
//     var labelsGroupY = chartGroup.append("g")
//         .attr("transform", `translate(${0-margin.left/4}, ${height/2})`);

//     var povertyLabel = labelsGroupX.append("text")
//         .attr("x", 0)
//         .attr("y", 10)
//         .attr("value", "poverty") // value to grab for event listener
//         .classed("active", true)
//         .text("In Poverty (%)");

//     var ageLabel = labelsGroupX.append("text")
//         .attr("x", 0)
//         .attr("y", 30)
//         .attr("value", "age") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Age (Median)");

//     var incomeLabel = labelsGroupX.append("text")
//         .attr("x", 0)
//         .attr("y", 50)
//         .attr("value", "income") // value to grab for event listener
//         .classed("inactive", true)
//         .text("Household Income (Median)");

//     var healthcareLabel = labelsGroupY.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 20 - 35)
//         .attr("x", 20 )
//         .attr("dy", "1em")
//         .attr("value", "healthcare") // value to grab for event listener
//         .classed("active", true)
//         .classed("axis-text", true)
//         .text("Lacks Healthcare (%)");

//     var smokeLabel = labelsGroupY.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 20 - 55)
//         .attr("x", 0 )
//         .attr("dy", "1em")
//         .attr("value", "smokes") // value to grab for event listener
//         .classed("inactive", true)
//         .classed("axis-text", true)
//         .text("Smokes (%)");

//     var  obesitylabel = labelsGroupY.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 20 - 75)
//         .attr("x", 0 )
//         .attr("dy", "1em")
//         .attr("value", "obesity") // value to grab for event listener
//         .classed("inactive", true)
//         .classed("axis-text", true)
//         .text("Obese (%)");        
    
// //   var albumsLabel = labelsGroup.append("text")
// //     .attr("x", 0)
// //     .attr("y", 40)
// //     .attr("value", "num_albums") // value to grab for event listener
// //     .classed("inactive", true)
// //     .text("# of Albums Released");

// //   // append y axis
// //   chartGroup.append("text")
// //     .attr("transform", "rotate(-90)")
// //     .attr("y", 0 - margin.left)
// //     .attr("x", 0 - (height / 2))
// //     .attr("dy", "1em")
// //     .classed("axis-text", true)
// //     .text("Number of Billboard 500 Hits");

// //   // updateToolTip function above csv import
//     var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// //   // x axis labels event listener
//     labelsGroupX.selectAll("text")
//         .on("click", function() {
// //       // get value of selection
//         var value = d3.select(this).attr("value");
//         if (value !== chosenXAxis) {

// //         // replaces chosenXAxis with value
//             chosenXAxis = value;
//             console.log(chosenXAxis)

// //         // functions here found above csv import
// //         // updates x scale for new data
//             xLinearScale = xScale(healthData, chosenXAxis);

// //         // updates x axis with transition
//             xAxis = renderAxes(xLinearScale, xAxis);

// //         // updates circles with new x values
//             circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

// //         // updates tooltips with new info
//             textGroup = updateToolTip(chosenXAxis, chosenYAxis, yLinearScale, xLinearScale, circlesGroup);

// //         // changes classes to change bold text
//             if (chosenXAxis === "poverty") {
//                 povertyLabel
//                     .classed("active", true)
//                     .classed("inactive", false);
//                 ageLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 incomeLabel
//                     .classed("active", false)
//                     .classed("inactive", true)
//             }
//             else if (chosenXAxis === "age"){
//                 povertyLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 ageLabel
//                     .classed("active", true)
//                     .classed("inactive", false)
//                 incomeLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//             }
//             else  {
//                 povertyLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 ageLabel
//                     .classed("active", false)
//                     .classed("inactive", true);
//                 incomeLabel
//                     .classed("active", true)
//                     .classed("inactive", false);
//             }
//             circlesGroup = updateToolTip(chosenYAxis, chosenXAxis, circlesGroup);
//         }})

//         labelsGroupY.selectAll("text")
//             .on("click", function() {
//             var value = d3.select(this).attr("value");

//             if(value !== chosenYAxis)
//                 chosenYAxis = value;
//                 console.log(chosenYAxis)

//                 yLinearScale = yScale(healthData, chosenYAxis);

//                 yAxis = renderYAxes(yLinearScale, yAxis);

//                 circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

//                 textGroup = renderTexts(textGroup, xLinearScale, yLinearScale, chosenYAxis, chosenXAxis);

//                 if (chosenYAxis === "healthcare") {
//                     healthcareLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     smokeLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     obesitylabel 
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 }
//                 else if (chosenYAxis === "smokes"){
//                     healthcareLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokeLabel
//                         .classed("active", true)
//                         .classed("inactive", false);
//                     obesitylabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                 }
//                 else {
//                     healthcareLabel 
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     smokeLabel
//                         .classed("active", false)
//                         .classed("inactive", true);
//                     obesitylabel
//                         .classed("active",  true)
//                         .classed("inactive", false);
//                 }
             
//             })
          
// }).catch(function(error) {
//   console.log(error);
// });