var distance = require('turf-distance');
var featureCollection = require('turf-featurecollection');

module.exports = function (targetPoint, candidatePoints, k) {
  var results = [];
  candidatePoints.features.forEach(function (point) {
    var dist = distance(targetPoint, point, 'miles');
    point.properties._distance = dist;

    results = insert(point, results, k);
  });

  return featureCollection(results);
};

function insert(point, points, k) {
  var insertLocation = locationOf(point, points);
  points.splice(insertLocation + 1, 0, point);
  return points.slice(0, k);
}

function locationOf(point, points, start, end) {
  if (points.length === 0) {
    // error?
    return -1;
  }

  var start = start || 0;
  var end = end || points.length;
  var pivot = (start + end) >> 1

  var c = pointDistanceCompare(point, points[pivot]);
  if (end - start <= 1) 
  {
    return c === -1 ? pivot - 1 : pivot;
  }

  switch(c) {
    case -1: return locationOf(point, points, start, pivot);
    case 0: return pivot;
    case 1: return locationOf(point, points, pivot, end);
  }

}

function pointDistanceCompare(p1, p2) {
  if (p1.properties._distance < p2.properties._distance) return -1;
  if (p1.properties._distance > p2.properties._distance) return 1;
  return 0;
}