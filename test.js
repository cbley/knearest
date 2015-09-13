var fs = require('fs');
var test = require('tape');
var geojsonhint = require('geojsonhint');
var knearest = require('./');

test('n nearest', function(t) {
  var pt = JSON.parse(fs.readFileSync(__dirname + '/geojson/target.geojson'));
  var pts = JSON.parse(fs.readFileSync(__dirname + '/geojson/100.geojson'));
  var k = 15;

  var closestPoints = knearest(pt, pts, k);

  var errors = geojsonhint.hint(closestPoints);
  if (errors.length) {
    t.fail('should return valid geojson ' + JSON.stringify(errors));
  } else {
    t.pass('should return valid geojson');
  }

  t.ok(Array.isArray(closestPoints.features), 'should return an array of points');
  t.equal(closestPoints.features.length, k, 'should return k number of points');
  
  t.end();
});

test('finds nearest', function(t) {
  var pt = JSON.parse(fs.readFileSync(__dirname + '/geojson/target.geojson'));
  var pts = JSON.parse(fs.readFileSync(__dirname + '/geojson/5.geojson'));
  var k = 1;

  var closestPoints = knearest(pt, pts, k);

  t.equal(closestPoints.features[0].geometry.coordinates[0], -75.161590, 'should find sentinel point longitude');
  t.equal(closestPoints.features[0].geometry.coordinates[1], 39.9513325, 'should find sentinel point latitude');

  t.end();
});

test('k greater than n', function(t) {
  var pt = JSON.parse(fs.readFileSync(__dirname + '/geojson/target.geojson'));
  var pts = JSON.parse(fs.readFileSync(__dirname + '/geojson/5.geojson'));
  var k = 6;

  var closestPoints = knearest(pt, pts, 6);

  t.ok(Array.isArray(closestPoints.features), 'should return an array of points');
  t.ok(k > pts.features.length, 'k is greater than n');
  t.equal(closestPoints.features.length, pts.features.length, 'should return n number of points');
  t.end();
});