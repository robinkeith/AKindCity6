/*export function cli(args) {
    console.log(args);

    //require = require('esm')(module /*, options* /);
    //require('../src/cli').cli(process.argv);
}*/
https=require('https');

var data="";
var url="https://robinkeith.github.io/AKindCity6/data/safePlaces.geojson"

var request = https.get(url, function(response) {
    response
        .on("data",append=>data+=append)
        .on("finish",()=>console.log(data));;
});
/*
var
  datapumps = require('datapumps'),
  Pump = datapumps.Pump,
  MongodbMixin = datapumps.mixin.MongodbMixin,
  ExcelWriterMixin = datapumps.mixin.ExcelWriterMixin,
  pump = new Pump();

pump
  .mixin(MongodbMixin('mongodb://localhost/marketing'))
  .useCollection('Contact')
  .from(pump.find({ country: "US" }))

  .mixin(ExcelWriterMixin())
  .createWorkbook('/tmp/ContactsInUs.xlsx')
  .createWorksheet('Contacts')
  .writeHeaders(['Name', 'Email'])

  .process(function(contact) {
    return pump.writeRow([ contact.name, contact.email ]);
  })
  .logErrorsToConsole()
  .run()
    .then(function() {
      console.log("Done writing contacts to file");
    });*/