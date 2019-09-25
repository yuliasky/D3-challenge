// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 800;

// Margin
var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an svg that will hold our chart and shift the latter by left and top margins
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
   
// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
        d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }
// function used for updating Y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
        d3.max(data, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

// function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXAxis, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
     // .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

function renderTextX(TextGroup, newXScale, chosenXAxis, chosenYAxis) {

    TextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
     // .attr("y", d => newYScale(d[chosenYAxis]));
  
    return  TextGroup;
  }

// function used for updating circles group with a transition to
// new circles in Y
function renderCirclesY(circlesGroup, newYScale, chosenYAxis, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis])) 
     // .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }

function renderTextY(TextGroup, newYScale, chosenYAxis, chosenXAxis) {

    TextGroup.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis]))
      //.attr("x", d => newXScale(d[chosenXAxis]));
  
    return  TextGroup;
  }
 // function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "In Poverty(%): ";
    }
    else if (chosenXAxis === "age") {
      var label = "Age: ";
    } 
    else {
        var label = "Income: ";
    }

    if (chosenYAxis === "obesity") {
        var labely = "Obesity: ";
      }
    else if (chosenYAxis === "smokes") {
        var labely = "Smokes: ";
      } 
    else {
          var labely = "Lacks Healthcare: ";
      }
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state} <br>${label} ${d[chosenXAxis]}
            <br>${labely}${d[chosenYAxis]}`);
    });
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
    // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
    });
    
      return circlesGroup;
    }

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv", function(err, data) {
    if (err) throw err;
    // copy data into global dataset
    dataset = data;
    console.log(dataset);

    // parse data
    data.forEach(function(data) {
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
    });

    // Initial Params
    var chosenXAxis = "poverty";
    var chosenYAxis = "obesity";

 // xLinearScale function above csv import
var xLinearScale = xScale(data, chosenXAxis);

// Create y scale function
var yLinearScale = yScale(data, chosenYAxis);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
    //.classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

 // append y axis
var yAxis = chartGroup.append("g")
    //.classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d[chosenXAxis]))
   .attr("cy", d => yLinearScale(d[chosenYAxis]))
   .attr("r", 20)
   .attr("class", "stateCircle")
   .attr("opacity", 0.5);

// append initial text abbreviation
var TextGroup = chartGroup.append("text")
   .style("text-anchor", "middle")
   .selectAll("tspan")
   .data(data)
   .enter()
   .append("tspan")
   .text(d => d.abbr)
   .attr("x", d => xLinearScale(d[chosenXAxis]))
   .attr("y", d => yLinearScale(d[chosenYAxis]))
   //.attr("font-size", "10px")
   //.attr("text-anchor", "middle")
   .attr("class","stateText")
  

  
 // Create group for  3 x- axis labels
 var labelsGroup = chartGroup.append("g")
 .attr("transform", `translate(${width / 2}, ${height + 20})`);

 var InPorvertyLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 20)
 .attr("value", "poverty") // value to grab for event listener
 .classed("active", true)
 .text("Poverty(%): ");

var AgeLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 40)
 .attr("value", "age") // value to grab for event listener
 .classed("inactive", true)
 .text("Age: ");
 
 var IncomeLabel = labelsGroup.append("text")
 .attr("x", 0)
 .attr("y", 60)
 .attr("value", "income") // value to grab for event listener
 .classed("inactive", true)
 .text("Household Income: ");

// append y axis

var labelsGroupY = chartGroup.append("g")
      .attr("transform", "rotate(-90)");

var ObseseLabel = labelsGroupY.append("text")
 .attr("y", 0 - 50)
 .attr("x", 0 - (height / 2))
 .attr("dy", "1em")
 .attr("value", "obesity") // value to grab for event listener
 .classed("active", true)
 .text("Obesity(%): ");

var SmokeLabel = labelsGroupY.append("text")
 .attr("y", 0 - 70)
 .attr("x", 0 - (height / 2))
 .attr("dy", "1em")
 .attr("value", "smokes") // value to grab for event listener
 .classed("inactive", true)
 .text("Smokes(%): ");
 
var HealthcareLabel = labelsGroupY.append("text")
 .attr("y", 0 - 90)
 .attr("x", 0 - (height / 2))
 .attr("dy", "1em")
 .attr("value", "healthcare") // value to grab for event listener
 .classed("inactive", true)
 .text("Lacks Healthcare(%): ");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;
        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(data, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
    
        // updates circles with new x values
        circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
        TextGroup = renderTextX(TextGroup, xLinearScale, chosenXAxis, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
                    InPorvertyLabel
                      .classed("active", true)
                      .classed("inactive", false);
                    AgeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                    IncomeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
        else if (chosenXAxis === "age") {
            InPorvertyLabel
              .classed("active", false)
              .classed("inactive", true);
            AgeLabel
              .classed("active", true)
              .classed("inactive", false);
            IncomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        else {
            InPorvertyLabel
            .classed("active", false)
            .classed("inactive", true);
          AgeLabel
            .classed("active", false)
            .classed("inactive", true);
          IncomeLabel
            .classed("active", true)
            .classed("inactive", false);
            }
                
    };
});
// y axis labels event listener
labelsGroupY.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenYAxis) {
        // replaces chosenYAxis with value
        chosenYAxis = value;
        console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(data, chosenYAxis);

        // updates y axis with transition
        yAxis = renderAxesY(yLinearScale, yAxis);
    
        // updates circles with new y values
        circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
        TextGroup = renderTextY(TextGroup, yLinearScale, chosenYAxis, chosenXAxis);
        
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,  chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenYAxis === "obesity") {
                ObseseLabel
                      .classed("active", true)
                      .classed("inactive", false);
                SmokeLabel
                      .classed("active", false)
                      .classed("inactive", true);
                HealthcareLabel
                      .classed("active", false)
                      .classed("inactive", true);
                  }
        else if (chosenYAxis === "smokes") {
                ObseseLabel
                    .classed("active",false)
                     .classed("inactive", true);
                SmokeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                HealthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
        }
        else {
                ObseseLabel
                    .classed("active", false)
                    .classed("inactive", true);
                SmokeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                HealthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
        }
                
    };
});
});
          