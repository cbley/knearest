var distance = require('turf-distance');

module.exports = function (targetPoint, candidatePoints, k) {
  var results = [];
  candidatePoints.features.forEach(function (point) {
    var dist = distance(targetPoint, point, 'miles');
    point.properties._distance = dist;

    if (results.length < k) {
      results.push(point);
      results.sort();
    } else {
      var last = results[results.length - 1];
      if (point.properties._distance < last.properties._distance) {
        results.push(point);
        results.sort(pointDistanceCompare);
        results = results.slice(0, k);
      }
    }
  });

  return results;
};

function pointDistanceCompare(p1, p2) {
  return p1.properties._distance - p2.properties._distance;
}