allData = [];

var incidentsMap;

// Load data
loadData();

// Date parser to convert strings to date objects
var parseDate = d3.timeParse("%m/%d/%Y");

function loadData() {
    d3.csv("data/stage3.csv", function(error, data){
        data.forEach(function(d) {
            d.latitude = +d.latitude;
            d.longitude = +d.longitude;
            d.n_injured = +d.n_injured;
            d.n_killed = +d.n_killed;
            d.casualties =  d.n_killed;
            d.date = parseDate(d.date);
        });
        createVis(data);
    });
}

function createVis(data) {

    // TO-DO: Instantiate visualization objects here

    incidentsMap = new IncidentsMap("incidents-map", data);
    timeplot = new TimePlot("timeplot", data);

}