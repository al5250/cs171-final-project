

/*
 * IncidentsMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- The entire gun violence dataset
 */

IncidentsMap = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.allData = _data;
    this.displayData = []; // see data wrangling

    this.initVis();
};



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

IncidentsMap.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

    vis.width = 1000 - vis.margin.left - vis.margin.right;
    vis.height = 800 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    vis.projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2]);

    vis.path = d3.geoPath()
        .projection(vis.projection);

    vis.radius = d3.scaleLinear()
        .range([1, 15]);

    d3.json('data/us.topo.json', function(err, data) {
        vis.usData = topojson.feature(data, data.objects.states).features
        vis.wrangleData();

    });



};

/*
 * Data wrangling
 */

IncidentsMap.prototype.wrangleData = function(){
    var vis = this;

    vis.displayData = vis.allData.filter(function(d) {
        return d.latitude !== 0 && d.longitude !== 0 && d.casualties !== 0;
    });

    vis.radius.domain([d3.min(vis.displayData, function(d) {
        return d.casualties;
    }), d3.max(vis.displayData, function(d) {
        return d.casualties;
    })]);

    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

IncidentsMap.prototype.updateVis = function(){
    var vis = this;

    console.log(vis.displayData);

    vis.svg.selectAll("path")
        .data(vis.usData)
        .enter().append("path")
        .attr("class", "country-border")
        .attr("d", vis.path);

    vis.svg.selectAll("circle")
        .data(vis.displayData)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d) {
            return vis.radius(d.casualties);
        })
        .attr("transform", function(d) {
            if (vis.projection([d.longitude, d.latitude]) == null) {
                console.log(d);
            }
            return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
        })
        .style("fill", "gray")
        .style("stroke", "black");

    /* vis.svg.selectAll("circle")
        .data(vis.allData)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 2)
        .attr("transform", function(d) {
            return "translate(" + vis.projection([d.longitude, d.latitude]) + ")";
        })
        .style("fill", "black"); */

};
