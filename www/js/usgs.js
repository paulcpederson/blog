// Map
var map = L.map('map', {
    center: [35.686720682320455, -93.43391418457031],
    //center: [36.314848507137064, -112.81422615051268], grand canyon
    zoom: 14,
    maxZoom: 15,
    minZoom: 9,
    scrollWheelZoom: false,
    attributionControl: false
});

L.esri.tiledMapLayer("http://server.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer", {
  opacity : 1
}).addTo(map);