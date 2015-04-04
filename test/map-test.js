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
var Promise = require("bluebird")
var http        = require('http');

function inject (options) {
  options.port = '6001';
  options.host = 'localhost'
  return new Promise(function (resolve, reject) {
    return http.request(options, resolve);
  });
}



describe('api', function(){

    it('should have this route get', function (done) {
        return inject({ method: "GET", url: "/"}).then(function (response) {
          console.log(response)
          response.statusCode.should.eql(200);
          done()
        });
    });


    it('should have this route post', function (done) {
        return inject({ method: "POST", url: "/api/maps"}).then(function (response) {
          response.statusCode.should.eql(500);
          done()
        });
    });

    it('To popular database with a WebService', function (done) {

      var options     = require('url').parse('/api/maps');
      options.method  = 'POST';
      options.payload = {
        parameter:'{"file": "file"}'
      }

      var req = http.request(options, function(response) {
        response.statusCode.should.eql(200);
        done();
      });

      require('fs').createReadStream('./fixture/map1.tsv').pipe(req);
    });

    it('To popular database with a WebService', function () {

        return inject({ method: "POST", url: "/api/maps", payload: fixture[0] }).then(function (response) {
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
