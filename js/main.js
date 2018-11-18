allData = [];

var incidentsMap;

// Load data
loadData();

function loadData() {
    d3.csv("data/stage3-min.csv", function(error, data){
        data.forEach(function(d) {
            d.latitude = +d.latitude;
            d.longitude = +d.longitude;
            d.n_injured = +d.n_injured;
            d.n_killed = +d.n_killed;
            d.casualties =  d.n_killed;
        });
        allData = data;
        createVis();
    });
}

function createVis() {

    // TO-DO: Instantiate visualization objects here

    incidentsMap = new IncidentsMap("incidents-map", allData)

}