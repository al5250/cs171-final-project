
/*
 * Timeline - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the
 */

Timeline = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.allData = _data;
    this.dataCategories = [
        'Non-Shooting Incident', 'Shots Fired - No Injuries',
        'Accidental Shooting - Death', 'Accidental Shooting - Injury', 'Defensive Use',
        'Domestic Violence', 'Home Invasion',
        'Mass Shooting (4+ victims injured or killed excluding the subject/suspect/perpetrator, one location)'
    ];

    this.initVis();
}


/*
 * Initialize area chart with brushing component
 */

Timeline.prototype.initVis = function(){
    var vis = this; // read about the this

    vis.margin = {top: 30, right: 60, bottom: 30, left: 100};

    vis.width = 1200 - vis.margin.left - vis.margin.right,
        vis.height = 150 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Collect all data into incident type categories
    vis.allData.forEach(function(d) {
        var arr = d.incident_characteristics.split('||');
        for (var i = 0; i < vis.dataCategories.length; i++) {
            if (arr.includes(vis.dataCategories[i])) {
                d.incident_type = vis.dataCategories[i];
            }
        }
    });

    // Assemble data into counts by category per month
    vis.displayData = d3.nest()
        .key(function(d){ return d3.timeMonth(d.date); })
        .rollup(function(d) {
            var obj = {};
            d.map(function(g) {
                if (g.incident_type in obj) {
                    obj[g.incident_type] += 1;
                }
                else {
                    obj[g.incident_type] = 1;
                }
            });
            return obj;
        })
        .entries(vis.allData);
    vis.displayData.forEach(function(d){
        d.key = new Date(d.key);
    });
    vis.displayData = vis.displayData.map(function(d) {
        var obj = { key: d.key , value: 0};
        for (var i = 0; i < vis.dataCategories.length; i++) {
            if (vis.dataCategories[i] in d['value']) {
                obj.value += d['value'][vis.dataCategories[i]];
            }
        }
        return obj;
    });

    // Scales and axes
    vis.x = d3.scaleTime()
        .range([0, vis.width])
        .domain(d3.extent(vis.displayData, function(d) { return d.key; }));

    vis.y = d3.scaleLinear()
        .range([vis.height, 0])
        .domain([0, d3.max(vis.displayData, function(d) { return d.value; })]);

    vis.xAxis = d3.axisBottom()
        .scale(vis.x);

    // SVG area path generator
    vis.area = d3.area()
        .x(function(d) { return vis.x(d.key); })
        .y0(vis.height)
        .y1(function(d) { return vis.y(d.value); });

    // Draw area by using the path generator
    vis.svg.append("path")
        .datum(vis.displayData)
        .attr("fill", "#ccc")
        .attr("d", vis.area);


    // TO-DO: Initialize brush component
    vis.brush = d3.brushX()
        .extent([[0, 0], [vis.width, vis.height]])
        .on("brush", brushed);

    // TO-DO: Append brush component here
    vis.svg.append("g")
        .attr("id", "timeline-brush")
        .call(vis.brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", vis.height + 7);

    vis.svg.append("g")
        .attr("class", "x-axis axis")
        .attr("transform", "translate(0," + vis.height + ")")
        .call(vis.xAxis.ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b %Y")));
}

