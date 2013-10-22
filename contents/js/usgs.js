// Map
var map = L.map('map', {
    center: [45.52, -122.67],
    zoom: 13,
    scrollWheelZoom: false,
    attributionControl: false
});

L.esri.dynamicMapLayer("http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer", {
  opacity : 1
}).addTo(map);