StackedAreaChart = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.allData = _data;
    this.displayData = []; // see data wrangling
    this.dataCategories = [
        'Non-Shooting Incident', 'Shots Fired - No Injuries',
        'Accidental Shooting - Death', 'Accidental Shooting - Injury', 'Defensive Use',
        'Domestic Violence', 'Home Invasion',
        'Mass Shooting (4+ victims injured or killed excluding the subject/suspect/perpetrator, one location)'
    ];
    this.initVis();

};

StackedAreaChart.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 50, right: 60, bottom: 50, left: 100 };

    vis.width = 1200 - vis.margin.left - vis.margin.right;
    vis.height = 400 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Add scales
    vis.x = d3.scaleTime()
        .range([0, vis.width]);
    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);
    vis.colorScale = d3.scaleOrdinal(d3.schemeCategory20)
        .domain(vis.dataCategories);

    // Add axes
    vis.xAxis = d3.axisBottom()
        .scale(vis.x);
    vis.svg.append('g')
        .attr('class', 'axis x-axis')
        .attr("transform", "translate(0," + vis.height + ")");
    vis.yAxis = d3.axisLeft()
        .scale(vis.y);
    vis.svg.append('g')
        .attr('class', 'axis y-axis');

    // Add y-label
    vis.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - vis.margin.left / 3 * 2)
        .attr("x",0 - (vis.height / 2))
        .attr("dy", "1em")
        .attr('class', 'y-label')
        .style("text-anchor", "middle")
        .text('Number of Incidents');

    // Add tooltip text
    vis.svg.append("text")
        .attr("x", 30)
        .attr("y", -20)
        .attr("id", "cat-text");

    // Initialize stack layout
    vis.stack = d3.stack()
        .keys(vis.dataCategories);

    vis.wrangleData();

};

/*
 * Data wrangling
 */

StackedAreaChart.prototype.wrangleData = function(){
    var vis = this;

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
        var obj = { key: d.key };
        for (var i = 0; i < vis.dataCategories.length; i++) {
            if (vis.dataCategories[i] in d['value']) {
                obj[vis.dataCategories[i]] = d['value'][vis.dataCategories[i]];
            }
            else {
                obj[vis.dataCategories[i]] = 0;
            }
        }
        return obj;
    })

    // Set domain of x axis
    vis.x.domain([
        d3.min(vis.displayData, function(d) {return d.key}),
        d3.max(vis.displayData, function(d) {return d.key})
    ]);

    // Create stacked area chart
    vis.stackedData = vis.stack(vis.displayData);
    vis.area = d3.area()
        .curve(d3.curveCardinal)
        .x(function(d) { return vis.x(d.data.key); })
        .y0(function(d) { return vis.y(d[0]); })
        .y1(function(d) { return vis.y(d[1]); });
    vis.displayData = vis.stackedData;

    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

StackedAreaChart.prototype.updateVis = function(){
    var vis = this;

    // Set domain of y-axis
    vis.y.domain([0, d3.max(vis.displayData, function(d) {
        return d3.max(d, function(e) {
            return e[1];
        });
    })]);

    // Draw the layers
    var categories = vis.svg.selectAll(".area")
        .data(vis.displayData);

    var areas = categories.enter().append("path")
        .attr("class", "area")
        .merge(categories)
        .style("fill", function(d,i) {
            return vis.colorScale(vis.dataCategories[i]);
        })
        .attr("d", function(d) {
            return vis.area(d);
        });

    areas.on('mouseover', function(d) {
        vis.svg.select('#cat-text')
            .text(d.key);
    });

    categories.exit().remove();

    vis.svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", vis.width)
        .attr("height", vis.height);

    // Call axis functions with the new domain
    vis.svg.select('.x-axis')
        .call(vis.xAxis
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat("%b %Y")))
        .selectAll('text')
        .attr("y", 0)
        .attr("x", -50)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-65)")
        .style("text-anchor", "start");
    vis.svg.select('.y-axis')
        .call(vis.yAxis);

};