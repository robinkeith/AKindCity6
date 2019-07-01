//import  from 'download-to-file';
//var download = require('download-to-file')
'use strict'

import 'fs';
import 'path';
import 'http';
import 'https';
import 'mkdirp';
import 'pump';

const bbox='52.578228,1.171761,52.693864,1.525726';
const downloadDir='./data/';

downloadOSM('(nwr[~"^toilet(s):.*$"~"."];)', downloadDir + 'toilets.geojson' );

function downloadOSM(query,file){
    let url=encodeURI(makeOverpassQuery(query));

    console.log(url)
    console.log(`Downloading to  ${file}`)
    download(url, file, function (err, filepath) {
        console.log('Download:', err)
        if (err) throw err
        console.log('Download finished:', filepath)
    })
}

function makeOverpassQuery(query){
return `http://overpass-api.de/api/interpreter?data=[bbox:${bbox}][out:json][timeout:25];${query};out;>;out skel qt;`;
}

function download(url, filepath, cb) {
  var transport = url.indexOf('https://') === 0 ? https : http
  return transport.get(url, function (res) {
    if (res.statusCode !== 200) {
      var err = new Error('Unexpected HTTP status code: ' + res.statusCode)
      err.code = res.statusCode
      cb(err)
      return
    }
    mkdirp(path.dirname(filepath), function (err) {
      if (err) return cb(err)
      var file = fs.createWriteStream(filepath)
      pump(res, file, function (err) {
        cb(err, filepath)
      })
    })
  }).on('error', cb)
}