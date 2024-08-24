const margin2 = {top: 50, right: 30, bottom: 50, left: 70},
    width2 = 800 - margin2.left - margin2.right,
    height2 = 300 - margin2.top - margin2.bottom;
const padding = 10;
const svg2 = d3.select("#green_area")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.bottom + margin2.top)
    .append("g")
    .attr("transform", `translate(${margin2.left}, ${margin2.top})`);
d3.csv("https://gist.githubusercontent.com/donaldminer/8213ab03542feda2fa70afe6ff5772e6/raw/8bc320d4aa30ca1e09c34138773debac1a7d1848/greenFilter.csv").then(function (data) {
    let green_X = d3.scaleLinear()
        .domain(d3.extent(data, d => parseFloat(d.g)))
        .range([0, width2]);
    let y_Scale = d3.scaleBand()
        .domain(data.map(d => d.class))
        .range([0, height2])
        .padding(-.3);
    svg2.append("g")
        .call(d3.axisLeft(y_Scale));
    svg2.append("g")
        .attr("transform", `translate(${0}, ${height2})`)
        .call(d3.axisBottom(green_X));

    var green_Color = d3.scaleLinear()
        .domain([0, 2])
        .range(["white", "#36d165"]);

    var green_density = d3.contourDensity()
        .x(d => green_X(parseFloat(d.g)))
        .y(d => y_Scale(d.class) + margin2.top)
        .size([width2, height2])
        .weight(0.5)
        .bandwidth(8)
        (data);
    svg2.insert("g", "g")
        .selectAll("path")
        .data(green_density)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", function (d) {
            return green_Color(d.value);
        });
});
svg2.append("text")
    .text("Petrosian magnitude")
    .attr("x", width2/2)
    .attr("y", height2+30)
    .style("font-size", 15)
    .attr('text-anchor', 'middle');
svg2.append("text")
    .text("Green Filter")
    .attr("x", 100)
    .attr("y", 0)
    .style("font-size", 20)
    .attr('text-anchor', 'middle');
