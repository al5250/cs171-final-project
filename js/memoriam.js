

/*
 * IncidentsMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- The entire gun violence dataset
 */

Memoriam = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.allData = _data;
    this.displayData = [];// see data wrangling
    this.testData = {};

    this.initVis();
};



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

Memoriam.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 0, right: 100, bottom: 60, left: 0 };

    vis.diameter = 550;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.diameter)
        .attr("height", vis.diameter)
        .attr("class", "bubble")
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")")
        .attr("class", "bubble");

    this.allData.forEach(function(d, i) {
        if (d.n_killed > 0) {
            for (var k in d.participant_status_dict) {
                if (d.participant_status_dict[k] === "Killed") {
                    var age = k in d.participant_age_dict ? d.participant_age_dict[k] : 0;
                    vis.displayData.push({
                        'age': age,
                        'id': i,
                        'incident_id': +d.incident_id
                    });
                }
            }
        }
    });

    vis.displayData = vis.displayData.filter(function(d) {
        return d.age > 0;
    });
    console.log(d3.max(vis.displayData, function(d) { return d.age; }));
    console.log(vis.displayData);

    vis.userval = 0;

    vis.slider2 = d3.sliderHorizontal()
        .width(400)
        .on('onchange', val => {
            d3.select('p#value2').text(parseInt(val));
            vis.userval = parseInt(val);
            vis.deadcircles.attr("fill", function(d) {
                if (d.data.age <= vis.userval) {
                    return "red";
                }
            })
        });

    vis.wrangleData();
};

/*
 * Data wrangling
 */

Memoriam.prototype.wrangleData = function(){
    var vis = this;
    
    vis.slider2.min(0).max(d3.max(vis.displayData, function(d) { return d.age})).default(0);

    vis.group2 = d3.select('div#slider2').append('svg')
        .attr('width', 500)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(30,30)');

    vis.group2.call(vis.slider2);

    d3.select('p#value2').text(vis.slider2.value());
    d3.select('a#setValue2').on('click', () => { vis.slider2.value(0.015); d3.event.preventDefault(); });


    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

Memoriam.prototype.updateVis = function(){
    var vis = this;


    vis.testData["children"] = vis.displayData;

    //max size of the bubbles

    vis.bubble = d3.pack(vis.testData)
        .size([vis.diameter, vis.diameter])
        .padding(1.5);

        //bubbles needs very specific format, convert data to this.

    var root = d3.hierarchy(vis.testData)
        .sum(function(d) { return d.age; });


    vis.node = vis.svg.selectAll(".node")
        .data(vis.bubble(root).descendants())
        .enter().filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })


    vis.deadcircles = vis.node.append("circle")
        .attr("r", function(d) {
            return d.r; })
        .attr("fill", "black");

    d3.select(self.frameElement).style("height", vis.diameter + "px");


};
