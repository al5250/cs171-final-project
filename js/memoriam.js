

/*
 * IncidentsMap - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- The entire gun violence dataset
 */

Memoriam = function(_parentElement, _data){
    this.parentElement = _parentElement;
    this.allData = _data;
    this.displayData = []; // see data wrangling

    this.initVis();
};



/*
 * Initialize visualization (static content, e.g. SVG area or axes)
 */

Memoriam.prototype.initVis = function(){
    var vis = this;

    vis.margin = { top: 0, right: 100, bottom: 60, left: 0 };

    vis.width = 1000 - vis.margin.left - vis.margin.right;
    vis.height = 700 - vis.margin.top - vis.margin.bottom;


    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

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
    console.log(vis.displayData);
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


};
