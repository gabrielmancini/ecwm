


Install couchdb
http://couchdb.apache.org/
you dont need start couchdb, the project start him with some others configurations


clone the repo in some where
```
git clone git@github.com:gabrielmancini/ecwm.git && cd ecwm
```

```
npm install && bower install
```


to run:

```
npm start
```
open the browser on www and upload the tsv file

or

```
npm test
```
will populate the data base

or

```
npm start
```
in other terminal but same path

```
curl -F file=@test/fixture/map1.tsv -F parameter='{"file": "file"}'  http://localhost:6001/api/maps
```


