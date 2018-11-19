

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

    vis.margin = { top: 40, right: 100, bottom: 60, left: 0 };

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

    //Define quantize scale to sort data values into buckets of color
    vis.color = d3.scaleQuantize();

    // Legend
    vis.svg.append("g")
        .attr("class", "legendQuant")
        .attr("transform", "translate(800,450)");

    vis.legend = d3.legendColor()
        .labelFormat(d3.format(".2f"));


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
    console.log(d3.max(vis.displayData, function(d) { return d.casualties; })
    )

    vis.color.domain([
        d3.min(vis.displayData, function(d) { return d.casualties; }),
        d3.max(vis.displayData, function(d) { return d.casualties; })
    ]);
    vis.color.range(["#ca0020","#f4a582","#bababa", "#404040"]);

    // Update legend
    var format = d3.format("d");
    vis.legend
        .labelFormat(format)
        .labels(d3.legendHelpers.thresholdLabels)
        .scale(vis.color);

    vis.svg.select(".legendQuant")
        .call(vis.legend);


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
        .style("fill", function(d) {
            return vis.color(d.casualties);
        });

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
