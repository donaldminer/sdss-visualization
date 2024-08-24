const margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 900,
    height = 900,
    radius = Math.min(width, height) / 2 - 80;
const svg = d3.select("#redShift_area")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.bottom + margin.top)
    .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);
svg.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 450)
    .attr("fill", "black");
d3.csv("https://gist.githubusercontent.com/donaldminer/bec71bae5cc7f663f6e121ee2eb6356f/raw/93ca54026c90324ecfa8ff18089ce8d485ef4f99/redshift_info.csv").then(function (data){

    var classes = d3.group(data, d => d.class);
    console.log(classes.get("QSO"));
    var r = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, d => +d.redshift)
        ])
        .range([0,radius]);

    var gr = svg.append("g")
        .attr("class", "r axis")
        .selectAll("g")
        .data(r.ticks(7).slice(1))
        .enter().append("g")
        .attr("stroke", "white")
        .attr("fill", "none");

    gr.append("circle")
        .attr("r", r)
        .attr("stroke", "white")
        .attr("opacity", 0.2)
        .attr("fill", "none");

    gr.append("text")
        .attr("y", function(d) { return -r(d) - 4; })
        .attr("transform", "rotate(15)")
        .style("font-size", 10)
        .style("text-anchor", "middle")
        .text(function(d) { return d; });

    var ga = svg.append("g")
        .attr("class", "a axis")
        .selectAll("g")
        .data(d3.range(0, 360, 30))
        .enter().append("g")
        .style("font-size", 14)
        .attr("transform", function(d) {
            return "rotate(" + -d + ")";
        })
        .attr("stroke-opacity", 0.2)
        .attr("stroke", "white")
        .attr("fill", "white");

    ga.append("line")
        .attr("x2", radius);


    var line = d3.lineRadial()
        .radius(function(d) {
            return r(d[1]);
        })
        .angle(function(d) {
            return -d[0] + Math.PI / 2;
        });

    ga.append("text")
        .attr("x", radius + 6)
        .attr("dy", ".35em")
        .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
        .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
        .text(function(d) { return d + "°"; });
    const colorScale = d3.scaleOrdinal()
        .domain(d3.map(data, d => d.class))
        .range(d3.schemeSet2);

    svg.selectAll("QUASAR")
        .data(classes.get("QSO"))
        .join("circle")
        .attr("transform", function(d) {
            let an = +d.alpha;
            let ra = r(+d.redshift);
            x = ra * Math.cos(an * Math.PI / 180),
                y = ra * Math.sin(an * Math.PI/180);
            return "translate(" + [x,y] +")";
        })
        .attr("r", 0.5)
        .attr("fill", d => colorScale(d.class));

    svg.selectAll("GALAXY")
        .data(classes.get("GALAXY"))
        .join("circle")
        .attr("transform", function(d) {
            let an = +d.alpha;
            let ra = r(+d.redshift);
            x = ra * Math.cos(an * Math.PI / 180),
                y = ra * Math.sin(an * Math.PI/180);
            return "translate(" + [x,y] +")";
        })
        .attr("r", 0.5)
        .attr("fill", d => colorScale(d.class));

    const legend = d3.legendColor()
        .titleWidth(100)
        .shapeWidth(50)
        .orient('vertical')
        .cells(2)
        .scale(colorScale);

    svg.append("g")
        .attr("transform", "translate(300,-380)")
        .call(legend);
});