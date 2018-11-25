allData = [];

var incidentsMap, timeplot;
var dataset = "data/stage3-min.csv";

// Load data
loadData();

// Date parser to convert strings to date objects
var parseDate = (dataset === "data/stage3-min.csv")? d3.timeParse("%m/%d/%Y") : d3.timeParse("%Y-%m-%d");

function loadData() {
    d3.csv(dataset, function(error, data){
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