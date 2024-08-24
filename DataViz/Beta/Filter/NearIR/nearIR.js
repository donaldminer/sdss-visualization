const margin4 = {top: 50, right: 30, bottom: 20, left: 70},
    width4 = 800 - margin4.left - margin4.right,
    height4 = 300 - margin4.top - margin4.bottom;
const svg4 = d3.select("#nearIR_area")
    .attr("width", width4 + margin4.left + margin4.right)
    .attr("height", height4 + margin4.bottom + margin4.top)
    .append("g")
    .attr("transform", `translate(${margin4.left}, ${margin4.top})`);
d3.csv("https://gist.githubusercontent.com/donaldminer/7718ab8ee82d6ac08246fce1e2d2a3b1/raw/c91585dfda74763a6e96a074d84739824d781902/nearIRFilter.csv").then(function (data) {
    let nearIR_X = d3.scaleLinear()
        .domain(d3.extent(data, d => parseFloat(d.i)))
        .range([0, width4]);
    let y_Scale = d3.scaleBand()
        .domain(data.map(d => d.class))
        .range([0, height4])
        .padding(-.3);
    svg4.append("g")
        .call(d3.axisLeft(y_Scale));
    svg4.append("g")
        .attr("transform", `translate(${0}, ${height4})`)
        .call(d3.axisBottom(nearIR_X));

    var nearIR_Color = d3.scaleLinear()
        .domain([0, 2])
        .range(["#ff0000", "#ff6969"]);

    var nearIR_density = d3.contourDensity()
        .x(d => nearIR_X(parseFloat(d.i)))
        .y(d => y_Scale(d.class) + margin4.top)
        .size([width4, height4])
        .weight(0.5)
        .bandwidth(8)
        (data);
    svg4.insert("g", "g")
        .selectAll("path")
        .data(nearIR_density)
        .enter().append("path")
        .attr("d", d3.geoPath())
        .attr("fill", function (d) {
            return nearIR_Color(d.value);
        })
});