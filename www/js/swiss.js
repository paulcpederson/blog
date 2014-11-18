// Map
var map = L.map('map', {
    center: [85.04832243813787, -179.98105086386204],
    zoom: 22,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    touchZoom: true,
    zoomControl: true,
    tap: false,
    attributionControl: false
});

L.control.attribution({
  prefix: '<a href="http://www.swisstopo.ch/">swisstopo.ch</a>'
}).addTo(map);

L.tileLayer('http://wmts{s}.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20130213/21781/{z}/{y}/{x}.jpeg', {
  subdomains: '0123',
  maxZoom: 22,
  minZoom: 19
}).addTo(map);

if (isTouch) {
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
}