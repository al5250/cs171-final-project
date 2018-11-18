

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

    var projection = d3.geoAlbersUsa()
        .translate([vis.width / 2, vis.height / 2]);

    vis.path = d3.geoPath()
        .projection(projection);

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

    vis.displayData = vis.usData;

    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

IncidentsMap.prototype.updateVis = function(){
    var vis = this;

    // Render the U.S. by using the path generator
    vis.svg.selectAll("path")
        .data(vis.displayData)
        .enter().append("path")
        .attr("class", "country-border")
        .attr("d", vis.path);

};
