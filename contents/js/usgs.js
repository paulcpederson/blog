// Map
var map = L.map('map', {
    center: [45.52, -122.67],
    zoom: 13,
    scrollWheelZoom: false,
    attributionControl: false
});

L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer