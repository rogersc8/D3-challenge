// @TODO: YOUR CODE HERE!
  
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 10,
  right: 40,
  bottom: 100,
  left: 150
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


var chosenXAxis = "poverty";
var chosenYAxis = "obesity";


function xScale(stateHealthData, chosenXAxis) {
  
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateHealthData, d => d[chosenXAxis]) * 0.9,
      d3.max(stateHealthData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(stateHealthData, chosenYAxis) {
  
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateHealthData, d => d[chosenYAxis]) * 0.9,
      d3.max(stateHealthData, d => d[chosenYAxis]) * 1.1
    ])
    .range([height,0]);

  return yLinearScale;

}



function renderXAxis(newXScale, xAxis) {

  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1500)
    .ease(d3.easeElastic)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1500)
    .ease(d3.easeElastic)
    .call(leftAxis);

  return yAxis;
}


function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1500)
    .attr("cx", d => newXScale(+d[chosenXAxis]));

  return circlesGroup;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1500)
    .attr("cy", d => newYScale(+d[chosenYAxis]));

  return circlesGroup;
}

function renderTexts(textsGroup, newXScale, chosenXAxis) {

  textsGroup.transition()
    .duration(1500)
    .attr("dx", d => newXScale(+d[chosenXAxis]));

  return textsGroup;
}

function renderYTexts(textsGroup, newYScale, chosenYAxis) {

  textsGroup.transition()
    .duration(1500)
    .attr("dy", d => newYScale(+d[chosenYAxis]));

  return textsGroup;
}


function updateToolTip(chosenXAxis, circlesGroup) {


  var xLabel;
  if (chosenXAxis === "poverty") {
    xLabel = "In Poverty (%)";
  } else if (chosenXAxis === "age") {
    xLabel = "Age (Median)";
  } else {
    xLabel = "Household Income (Median)";
  }
  var yLabel;
  if (chosenYAxis === "healthCare") {
    yLabel = "Lacks Healthcare (%)";
  } 
  else if (chosenYAxis === "smokes") {
    yLabel = "Smokes (%)";
  } 
  else {
    yLabel = "obesity (%)";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(d => `${d.state} <br />${xLabel}: ${d[chosenXAxis]} <br />${yLabel}: ${d[chosenYAxis]}`);

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
      toolTip.show(data, this);
    })
   
    .on("mouseout", function (data, index) {
      toolTip.hide(data, this);
    });

  return circlesGroup;
}



d3.csv("assets/data/data.csv").then(function (stateHealthData) {

  console.log(stateHealthData);
  

  
  stateHealthData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
  });

  
  var xLinearScale = xScale(stateHealthData, chosenXAxis);

  
  var yLinearScale = yScale(stateHealthData, chosenYAxis);

  
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateHealthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "lightblue")
    .attr("opacity", "1");

  var textsGroup = chartGroup.selectAll("circles")
    .data(stateHealthData)
    .enter()
    
    .append("text")
    .text(d => d.abbr)
    
    .attr("dx", function (d) {
      return xLinearScale(d[chosenXAxis]);
    })
    .attr("dy", function (d) {
      
      return yLinearScale(d[chosenYAxis]) + (10*0.33);
    })
    .attr("class", "stateText")
    .attr("font-size", 9);

  
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab 
    .classed("active", true)
    .text("In Proverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab 
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab f
    .classed("inactive", true)
    .text("Household Income (Median)");

  
var labelYGroup = chartGroup.append("g")
.attr("transform", `rotate(-90)`)
.attr("dy", "1em");

var healthLabel =   labelYGroup.append("text")
.attr("y", 0 - margin.left+ 60)
.attr("x", 0 - (height / 2))
.attr("value", "healthcare") // value to grab 
.classed("active", true)
.text("Lacks Healthcare (%)");


var smokeLabel = labelYGroup.append("text")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 1.7))
.attr("value", "smokes")
.classed("inactive", true)
.attr("data-axis-name", "Smokes (%)")
.text("Smokes (%)");



var obesityLabel = labelYGroup.append("text")
.attr("y", 0 - margin.left + 20)
.attr("x", 0 - (height / 1.7))
.attr("value", "obesity")
.classed("inactive", true)
.text("Obese (%)");

  
  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

  
  labelsGroup.selectAll("text")
    .on("click", function () {
      
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        
        chosenXAxis = value;

        

        
        
        xLinearScale = xScale(stateHealthData, chosenXAxis);

        
        xAxis = renderXAxis(xLinearScale, xAxis);

        
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        textsGroup = renderTexts(textsGroup, xLinearScale, chosenXAxis);

        
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        } else {
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

    
    labelYGroup.selectAll("text")
    .on("click", function() {
      
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        
        chosenYAxis = value;

        // console.log(chosenXAxis)

       
        yLinearScale = yScale(stateHealthData, chosenYAxis);

        
        yAxis = renderYAxis(yLinearScale, yAxis);

        
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
        textsGroup = renderYTexts(textsGroup, yLinearScale, chosenYAxis);

        
        circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

        
        if (chosenYAxis === "healthcare") {
          healthLabel
            .classed("active", true)
            .classed("inactive", false);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          smokeLabel
            .classed("active", true)
            .classed("inactive", false);
          healthLabel
            .classed("active", false)
            .classed("inactive", true);
         obesityLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
          healthLabel
            .classed("active", false)
            .classed("inactive", true);
          smokeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });  
    

});