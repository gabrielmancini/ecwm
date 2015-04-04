/*
sistema de entregas

- deve popular base de dados com um WebService
- deve aceitar malha logística com o NOME DO MAPA no WebService
- deve persistir no padrao:
ponto de origem, ponto de destino e distância entre os pontos em quilômetros
- deve listar os mapas:
com nome do ponto de origem, nome do ponto de destino, autonomia do caminhão (km/l) e o valor do litro do combustivel
- deve aceitar malhas apenas com formatação correta
- deve aceitar malhas complexas e extensas
- deve buscar o menor custo

- deve criar o README.md
- deve criar um repo compartilhado com o Wallmart
*/
require('should');
var fs = require('fs');
var Promise = require("bluebird");
var app = require('../lib');
var http = require('http');
var server;

function inject (options) {
  return new Promise(function (resolve, reject) {
    server.inject(options, resolve);
  });
}

describe('api', function(){


    before(function(done) {
      app.start({'custom-ports': '6001,6003' }, function (err, _app) {
        console.log('start')
        server = _app.server;
        done();
      });
    })

    after(function() {
      //setInterval(done, 1900);
    })

    it('should have this route get', function () {
      return inject({ method: "GET", url: "/"})
        .then(function (response) {
          response.statusCode.should.eql(200);
        });
    });


    it('should have this route post', function () {
      return inject({ method: "POST", url: "/api/maps"})
        .then(function (response) {
          response.statusCode.should.eql(415);
        });
    });

    it('To popular database with a WebService', function (done) {

      var supertest = require('supertest');
      var request = supertest('127.0.0.1:6001');

      request.post('/api/maps')
        .field('parameter', '{"file": "file"}')
        .attach('file',  __dirname + '/fixture/map1.tsv')
        .end(function(err, response) {
            response.statusCode.should.eql(200);
            setTimeout(done, 1000);
        });

    });

    it('should list the maps', function () {
      this.timeout(5000);
      return inject({ method: "GET", url: "/api/maps"})
        .then(function (response) {
          response.statusCode.should.eql(200);
        });
    });

    it('should with name of the point of origin, destination point name, autonomy truck (km / l) and the value of a liter of fuel', function () {
      this.timeout(5000);
      return inject({ method: "POST", url: "/api/dijkstras", payload: {from: 'ah', to: 'hvl', value: 2.50 } })
        .then(function (response) {
          response.statusCode.should.eql(200);
        });
    });

//curl -F file=@test/fixture/map1.tsv -F parameter='{"file": "file"}'  http://localhost:6001/api/maps

/*
- Must accept logistics network with the NAME MAP in WebService
- Should persist in the standard:
point of origin, destination point and distance between points in kilometers
- Should list the maps:
with name of the point of origin, destination point name, autonomy truck (km / l) and the value of a liter of fuel
- Must accept knits only with proper formatting
- Must accept complex meshes and extensive
- Must seek the lowest cost

- Must create the README.md
- Must create a shared repo with Wallmart
*/

});
