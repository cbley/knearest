var fs = require('fs');
var test = require('tape');
var knearest = require('./');

test('n nearest', function(t) {
  var pt = JSON.parse(fs.readFileSync(__dirname + '/geojson/target.geojson'));
  var pts = JSON.parse(fs.readFileSync(__dirname + '/geojson/10000.geojson'));
  var k = 15;

  var closestPoints = knearest(pt, pts, k);

  t.ok(Array.isArray(closestPoints), 'should return an array of points');
  t.equal(closestPoints.length, k, 'should return k number of points');
  
  t.end();
});

test('finds nearest', function(t) {
  var pt = JSON.parse(fs.readFileSync(__dirname + '/geojson/target.geojson'));
  var pts = JSON.parse(fs.readFileSync(__dirname + '/geojson/5.geojson'));
  var k = 1;

  var closestPoints = knearest(pt, pts, k);

  t.equal(closestPoints[0].geometry.coordinates[0], -75.161590, 'should find sentinel point longitude');
  t.equal(closestPoints[0].geometry.coordinates[1], 39.9513325, 'should find sentinel point latitude');

  t.end();
});

test('k greater than n', function(t) {
  var pt = JSON.parse(fs.readFileSync(__dirname + '/geojson/target.geojson'));
  var pts = JSON.parse(fs.readFileSync(__dirname + '/geojson/5.geojson'));
  var k = 6;

  var closestPoints = knearest(pt, pts, 6);

  t.ok(Array.isArray(closestPoints), 'should return an array of points');
  t.ok(k > pts.features.length, 'k is greater than n');
  t.equal(closestPoints.length, pts.features.length, 'should return n number of points');
  t.end();
});