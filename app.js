var L = require('leaflet');
var request = require('request');
var knearest = require('knearest');

L.Icon.Default.imagePath = 'node_modules/leaflet/dist/images';

var center = L.latLng(39.952385, -75.097389);
var map = L.map('map');
map.setView(center, 11);
map.on('click', highlightNearest);

var clickPointMarker, nearestLayer, points;
clickPointMarker = L.marker(center).addTo(map);
clickPointMarker.bindPopup("Click anywhere on the map to highlight the 10 nearest points.").openPopup();

var pointsUrl = 'https://gist.githubusercontent.com/cbley/803099ab3ecf8cb84c97/raw/44bdde9c5b8d94652adb6e7a766f6ef4fe3c2405/gistfile1.json';
request(pointsUrl, function(error, response, body) {
  points = JSON.parse(body);
  var pointsLayers = L.geoJson(points, {
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
});

L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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
  var nearest = knearest(point, points, 10);

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