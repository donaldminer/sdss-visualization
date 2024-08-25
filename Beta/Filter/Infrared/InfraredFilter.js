var margin5 = {top: 50, right: 30, bottom: 20, left: 70},
    width5 = 800 - margin5.left - margin5.right,
    height5 = 300 - margin5.top - margin5.bottom;
var svg5 = d3.select("#infrared_area")
    .attr("width", width5 + margin5.left + margin5.right)
    .attr("height", height5 + margin5.bottom + margin5.top)
    .append("g")
    .attr("transform", `translate(${margin5.left}, ${margin5.top})`);
d3.csv("https://gist.githubusercontent.com/donaldminer/744183e4398afbd9144ed3a3e76d97ba/raw/ac88358ecf7c56d3612e8cb64f189b1e02dd02f7/infraredFilter.csv").then(function (data){
     let infra_X = d3.scaleLinear()
       .domain(d3.extent(data, d => parseFloat(d.z)))
       .range([0, width5]);
     let y_Scale = d3.scaleBand()
         .domain(data.map(d=>d.class))
         .range([0, height5])
         .padding(-.3);
     svg5.append("g")
         .call(d3.axisLeft(y_Scale));
     svg5.append("g")
         .attr("transform", `translate(${0}, ${height5})`)
         .call(d3.axisBottom(infra_X));

     var ir_Color = d3.scaleLinear()
         .domain([0, 2])
         .range(["#ff0000", "#fce549"]);

     var ir_density = d3.contourDensity()
         .x(d => infra_X(parseFloat(d.z)))
         .y(d => y_Scale(d.class)+margin5.top)
         .size([width5, height5])
         .weight(0.5)
         .bandwidth(8)
         (data);
     svg5.insert("g", "g")
         .selectAll("path")
         .data(ir_density)
         .enter().append("path")
         .attr("d", d3.geoPath())
         .attr("fill", function(d) { return ir_Color(d.value); })
});