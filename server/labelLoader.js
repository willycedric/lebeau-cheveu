/**
 * [loader description]
 * simple script to laod xlsx label file and 
 * turn it into a javascript object
 * @type {[type]}
 */
var options = require('./config/config'); //Label file option obj
var Excel = require('exceljs');
var extractLabels = require('./extractLabels');
var labelWorkbook = new Excel.Workbook();
module.exports =labelWorkbook.xlsx.readFile(options.informations.filePath+options.informations.fileName)
.then(function(workbook){
	return extractLabels(workbook);
});


// label.then(function(data){
//         console.log(data.french.L_W_TERMS_OF_USE);
//     })
//     .catch(function(error){
//       console.error(error);
//     });



