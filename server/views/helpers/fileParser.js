const csv = require("fast-csv")
const fs = require("fs");
var Promise = require("bluebird");

//const students = require("../../models/schemaSQL/studentsSQL");
module.exports = {
    readCSVFile: async function(path) {
        try {
            var datatoreturn = [
                ["temp", "temp", "temp", "temp"]
            ];
            datatoreturn.pop();

            csv
            .fromPath(path) // path/to/file.csv
            .on("data", function(data){
                console.log(data);
                datatoreturn.push(data);
            })
            .on("end", function(){
                console.log("Data to return: ");
                console.log(datatoreturn);
                return datatoreturn;

                //console.log("done");
            });            
        } catch(err) {
            return console.log(err);
        }
    },

    readCSVFilePromise: Promise.method(function(path) {
        return new Promise(function(resolve, reject) {
            try {
                var datatoreturn = [
                    ["temp", "temp", "temp", "temp"]
                ];
                datatoreturn.pop();
    
                csv
                .fromPath(path) // path/to/file.csv
                .on("data", function(data){
                    datatoreturn.push(data);
                })
                .on("end", function(){
                    resolve(datatoreturn)
                });            
            } catch(err) {
                return console.log(err);
            }
        });
    })
}