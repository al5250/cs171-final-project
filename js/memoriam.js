

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
                        'id': i
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

    vis.wrangleData();
};

/*
 * Data wrangling
 */

Memoriam.prototype.wrangleData = function(){
    var vis = this;


    // Update the visualization
    vis.updateVis();
};



/*
 * The drawing function - should use the D3 update sequence (enter, update, exit)
 */

Memoriam.prototype.updateVis = function(){
    var vis = this;


    vis.testData["children"] = vis.displayData;

    console.log(vis.testData);
    //max size of the bubbles

    vis.bubble = d3.pack(vis.testData)
        .size([vis.diameter, vis.diameter])
        .padding(1.5);

        //bubbles needs very specific format, convert data to this.

    var root = d3.hierarchy(vis.testData)
        .count(function(d) { return d.age; });

    console.log(root);
    console.log(vis.bubble(root).descendants())

    vis.node = vis.svg.selectAll(".node")
        .data(vis.bubble(root).descendants())
        .enter().filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    vis.node.append("circle")
        .attr("r", function(d) { return d.r; })
        .attr("fill", function(d) {
            return "gray";
            if (d.data.age < 15) {
                return "red";
            }
            return "black";
        })



    d3.select(self.frameElement).style("height", vis.diameter + "px");


};
