const width6 = 900, height6 = 475;

const svg6 = d3.select("#starMap_area")
    .attr("width", width6)
    .attr("height", height6)
    .append("g");
var rotate = {x: 0, y: 45};
d3.json("https://gist.githubusercontent.com/donaldminer/83ae867158d97d66deb1f819fc64c903/raw/d104eaf47a4d45fc6bc1993c564a941401e75005/skyMap.json").then(function(data){
    
    var projection = d3.geoStereographic()
        .scale(.75 * height6/Math.PI)
        .translate([width6/2, height6/2])
        .clipAngle(150)
        .rotate([rotate.x, -rotate.y]);

    var path = d3.geoPath()
        .projection(projection)
        .pointRadius(0.8);

    svg6.append('path')
        .datum({type: 'Sphere'})
        .attr('class', 'cellestial-globe')
        .attr('d', path);

    var graticule = d3.geoGraticule();

    svg6.selectAll('path.graticule')
        .data([graticule()])
        .enter().append('path')
        .attr('class', 'graticule-black')
        .attr('d', path);

    const colorScale = d3.scaleOrdinal()
        .domain(["GALAXY","QSO","STAR"])
        .range(d3.schemeSet2);

    svg6.selectAll('path.star')
        .data(data.features)
        .enter().append('path')
        .attr('d', path)
        .attr('fill', d=> colorScale(d.properties.class));

    var dragBehave = d3.drag()
        .on("start", dragStart)
        .on("drag", dragging);

    d3.selectAll("svg").call(dragBehave);
    function dragStart(d) {
        //
    }
    function dragging(d) {
        d.x = 180 * d3.pointer(this)/width6;
        d.y = -180 * d3.pointer(this)/height6;
        projection.rotate([d.x, d.y]);
        svg6.selectAll("path").attr("d", path);
    }
    const legend = d3.legendColor()
        .titleWidth(100)
        .shapeWidth(50)
        .orient('Vertical')
        .cells(10)
        .scale(colorScale);

    svg6.append("g")
        .attr("transform", "translate(780, 20)")
        .call(legend);
});