allData = [];

var incidentsMap;

// Load data
loadData();

function loadData() {
    d3.csv("data/stage3-min.csv", function(error, data){
        allData = data;
        createVis();
    });
}

function createVis() {

    // TO-DO: Instantiate visualization objects here

    incidentsMap = new IncidentsMap("incidents-map", allData)

}