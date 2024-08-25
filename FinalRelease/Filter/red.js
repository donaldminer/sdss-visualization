const margin3 = {top: 50, right: 30, bottom: 50, left: 70},
    width3 = 800 - margin3.left - margin3.right,
    height3 = 300 - margin3.top - margin3.bottom;
const svg3 = d3.select("#red_area")
    .attr("width", width3 + margin3.left + margin3.right)
    .attr("height", height3 + margin3.bottom + margin3.top)
    .append("g")
    .attr("transform", `translate(${margin3.left}, ${margin3.top})`);
d3.csv("https://gist.githubusercontent.com/donaldminer/fecaa1cfc4f7d1776132281b3d855fbd/raw/b1ef4f8b43e6415f804b97a1182c2db016071e8f/redFilter.csv").then(function (data) {
    let red_X = d3.scaleLinear()
        .domain(d3.extent(data, d => parseFloat(d.r)))
        .range([0, width3]);
    let y_Scale = d3.scaleBand()
        .domain(data.map(d => d.class))
        .range([0, height3])
        .padding(-.3);
    svg3.append("g")
        .call(d3.axisLeft(y_Scale));
    svg3.append("g")
        .attr("transform", `translate(${0}, ${height3})`)
        .call(d3.axisBottom(red_X));

    var r_Color = d3.scaleLinear()
        .domain([0, 2])
        .range(["white", "#de1414"]);

    var r_density = d3.contourDensity()
        .x(d => red_X(parseFloat(d.r)))
        .y(d => y_Scale(d.class) + margin3.top)
        .size([width3, height3])
        .weight(0.5)
        .bandwidth(8)
        (data);
    svg3.insert("g", "g")
        .selectAll("path")
        .data(r_density)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", function (d) {
            return r_Color(d.value);
        })
});
svg3.append("text")
    .text("Petrosian magnitude")
    .attr("x", width3/2)
    .attr("y", height3+30)
    .style("font-size", 15)
    .attr('text-anchor', 'middle');
svg3.append("text")
    .text("Red Filter")
    .attr("x", 100)
    .attr("y", 0)
    .style("font-size", 20)
    .attr('text-anchor', 'middle');
