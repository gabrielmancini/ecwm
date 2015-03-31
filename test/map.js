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
var Promise = require("bluebird"),
    app = require('../lib');
var server;
app.start({'custom-ports': '6001,6003' }, function (err, _app) {
  server = _app.server;
});

var fixture = []

fs.readdir(__dirname + '/fixture', function (err, files) {

  files.forEach(function (file) {
    fs.readFile(__dirname + '/fixture/' + file, 'utf8', function (err, data) {
      if (err) throw err;
      fixture.push({name: file, routes: data});
    });
  })

})

console.log(fixture)

function inject (options) {
    return new Promise(function (resolve, reject) {
        server.inject(options, resolve);
    });
}



describe('api', function(){


    it('should have this route get', function () {
        return inject({ method: "GET", url: "/api/maps"}).then(function (response) {
          response.statusCode.should.eql(200);
        });
    });


    it('should have this route post', function () {
        return inject({ method: "POST", url: "/api/maps"}).then(function (response) {
          response.statusCode.should.eql(500);
        });
    });

    it('To popular database with a WebService', function () {
        return inject({ method: "POST", url: "/api/maps", payload: fixture[0] }).then(function (response) {
            response.statusCode.should.eql(200);
        });
    });


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


