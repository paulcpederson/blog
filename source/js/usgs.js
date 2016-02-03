// Map
var L = require('leaflet')
var Esri = require('esri-leaflet')

var map = L.map('usgs', {
    center: [35.686720682320455, -93.43391418457031],
    //center: [36.314848507137064, -112.81422615051268], grand canyon
    zoom: 14,
    maxZoom: 15,
    minZoom: 9,
    scrollWheelZoom: false,
    attributionControl: false
});

L.esri.tiledMapLayer({
    url: "//services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer"
  }).addTo(map);
