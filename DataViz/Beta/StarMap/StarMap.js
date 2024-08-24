const margin7 = {top: 20, right: 20, bottom: 20, left: 20},
    width7 = 900,
    height7 = 900,
    radius2 = Math.min(width7, height7) / 2 - 80;

const svg7 = d3.select("#starMap_area")
    .append("g")
    .attr("width", width7)
    .attr("height", height7);
var rotate = {x: 0, y: 45};

var projection = d3.geoStereographic()
    .scale(.75 * height7/Math.PI)
    .translate([width7/2, height7/2])
    .clipAngle(125)
    .rotate([rotate.x, -rotate.y]);

var path = d3.geoPath()
    .projection(projection)
    .pointRadius(0.7);
d3.json("https://gist.githubusercontent.com/donaldminer/7424b394c161f191910ae2981ba1fb71/raw/9c06e08efdb20803f00b4e26652eae10563b3a17/stellarObj.json").then(function(data){

    svg7.append('path')
        .datum({type: 'Sphere'})
        .attr('class', 'cellestial-globe')
        .attr('d', path);

    var graticule = d3.geoGraticule();

    svg7.selectAll('path.graticule')
        .data([graticule()])
        .enter().append('path')
        .attr('class', 'graticule-black')
        .attr('d', path);

    svg7.selectAll('path.star')
        .data(data.features)
        .enter().append('path')
        .attr('class', 'star')
        .attr('d', path)
        .attr('fill', "white");

    var dragBehave = d3.drag()
        .on("start", dragStart)
        .on("drag", dragging);

    d3.selectAll("svg").call(dragBehave);
    function dragStart(d) {
        // svg.selectAll("path").attr("d", path);
    }
    function dragging(d) {
        d.x = 180 * d3.pointer(this)/width7;
        d.y = -180 * d3.pointer(this)/height7;
        projection.rotate([d.x, d.y]);
        svg7.selectAll("path").attr("d", path);
    }
});