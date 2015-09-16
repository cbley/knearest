var L = require('leaflet');
var _ = require('leaflet-ajax');
var request = require('request');
var knearest = require('knearest');
var Spinner = require('spin');

var spinner = new Spinner().spin(document.getElementById('spin'));

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images';

var clickPointMarker, nearestLayer, points;
var center = L.latLng(38.9508, -76.8775);
var map = L.map('map');
map.setView(center, 11);

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var pointsUrl = 'https://s3.amazonaws.com/cbley.com/dc-baltimore_maryland_places.geojson.gz';
var pointsLayer = L.geoJson.ajax(pointsUrl, {
  middleware: function(data) {
    return points = data;
  },
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 5,
      fillColor: "#e31a1c",
      weight: 0,
      opacity: 1,
      fillOpacity: 0.5
    });
  }
}).addTo(map);

pointsLayer.on('data:loaded', function(e) {
  map.on('mousemove', highlightNearest);

  clickPointMarker = L.marker(center).addTo(map);

  highLightNearPoints(center);
  spinner.stop();
});

function latlngToPoint(latlng) {
  return {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": [
        latlng.lng,
        latlng.lat
      ]
    }
  };
}

function addClickPoint(latlng) {
  if (!clickPointMarker) {
    clickPointMarker = L.marker(latlng).addTo(map);
  } else {
    clickPointMarker.setLatLng(latlng);
    clickPointMarker.update();
  }
}

function highLightNearPoints(latlng) {
  var point = latlngToPoint(latlng);
  var nearest = knearest(point, points, 50);

  if (!nearestLayer) {
    nearestLayer = L.geoJson(nearest, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#1f78b4",
          weight: 0,
          opacity: 1,
          fillOpacity: 1
        });
      }
    }).addTo(map);
  } else {
    nearestLayer.clearLayers();
    nearestLayer.addData(nearest);
  }
}

function highlightNearest(e) {
  addClickPoint(e.latlng);
  highLightNearPoints(e.latlng);
}