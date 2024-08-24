    const margin1 = {top: 50, right: 30, bottom: 50, left: 70},
        width1 = 800 - margin1.left - margin1.right,
        height1 = 300 - margin1.top - margin1.bottom;
    const svg1 = d3.select("#ultraviolet_area")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.bottom + margin1.top)
        .append("g")
        .attr("transform", `translate(${margin1.left}, ${margin1.top})`);
    d3.csv("https://gist.githubusercontent.com/donaldminer/bf4fde116fd651799a5ab4b02a5519db/raw/d05dcd6f5aacd8f0b18b12ac11f39cab5c3ae2e1/uvFilter.csv").then(function (data){
       let ultraX = d3.scaleLinear()
          .domain(d3.extent(data, d => parseFloat(d.u)))
           .range([0, width1]);
        let y_Scale = d3.scaleBand()
            .domain(data.map(d=>d.class))
            .range([0, height1])
            .padding(-.3);
       svg1.append("g")
           .call(d3.axisLeft(y_Scale));
       svg1.append("g")
           .attr("transform", `translate(${0}, ${height1})`)
           .call(d3.axisBottom(ultraX));

        var uv_Color = d3.scaleLinear()
            .domain([0, 2])
            .range(["white", "#b462de"]);

        var uv_density = d3.contourDensity()
            .x(d => ultraX(parseFloat(d.u)))
            .y(d => y_Scale(d.class)+margin1.top)
            .size([width1, height1])
            .weight(0.5)
            .bandwidth(8)
            (data);
        svg1.insert("g", "g")
            .selectAll("path")
            .data(uv_density)
            .enter().append("path")
            .attr("d", d3.geoPath())
            .attr("fill", function(d) { return uv_Color(d.value); })
    });
    svg1.append("text")
        .text("Petrosian magnitude")
        .attr("x", width1/2)
        .attr("y", height1 +30)
        .style("font-size", 15)
        .attr('text-anchor', 'middle');
    svg1.append("text")
        .text("Ultra-Violet Filter")
        .attr("x", 100)
        .attr("y", 0)
        .style("font-size", 20)
        .attr('text-anchor', 'middle');