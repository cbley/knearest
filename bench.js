var knearest = require('./');
var Benchmark = require('benchmark');
var fs = require('fs');

var pt = JSON.parse(fs.readFileSync(__dirname + '/geojson/target.geojson'));
var _100 = JSON.parse(fs.readFileSync(__dirname + '/geojson/100.geojson'));
var _10000 = JSON.parse(fs.readFileSync(__dirname + '/geojson/10000.geojson'));
/*var _1000000 = JSON.parse(fs.readFileSync(__dirname + '/geojson/1000000.geojson'));*/


var suite = new Benchmark.Suite('knearest');
suite
  .add('knearest 5 from 100', function () {
    knearest(pt, _100, 5);
  })
  .add('knearest 5 from 10k', function () {
    knearest(pt, _10000, 5);
  })
  .add('knearest 1k from 10k', function () {
    knearest(pt, _10000, 1000);
  })
  /*.add('knearest 5 from 1m', function () {
    knearest(pt, _1000000, 5);
  })
  .add('knearest 1k from 1m', function  () {
    knearest(pt, _1000000, 1000);
  })
  .add('knearest 100k from 1m', function () {
    knearest(pt, _1000000, 100000);
  })*/
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
      
  })
  .run();
