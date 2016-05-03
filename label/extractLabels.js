/**
 * @param  {Excel Workbook}
 * @return {object {french{}, english{}}}
 */
var _ = require('lodash');
var Promise=require('bluebird');
module.exports = function(workbook){
	return new Promise(function(resolve,reject){
		if(extractLabels(workbook)){
			resolve(extractLabels(workbook));
		}
		else{
			reject(Error("extractLabels(workbook))"));
		}
	});
};
var extractLabels = function(workbook){
			var worksheet = workbook.getWorksheet('LABELS');//get the LABELS sheet

			//Set the column contained in the file 
			worksheet.columns =[
				{header:'Label',key:'Label',width:32},//A
				{header:'English',key:'English',width:32},//B
				{header:'French',key:'French',width:32},//C
			];

			//TODO try to define those variables dynamically
			var labelIdCol = worksheet.getColumn('Label');
			var englishLabelCol=worksheet.getColumn('English');
			var frenchLabelCol = worksheet.getColumn('French');
			var labelId=[];
			var englishLabel=[];
			var frenchLabel=[];
			var label ={};

			//get the data contained in each columns of the sheet
			labelIdCol.eachCell(function(cell, rowNumber){
				if(rowNumber){
						labelId[rowNumber-1]=cell.value;
				}

			});
			englishLabelCol.eachCell(function(cell,rowNumber){
				if(rowNumber){
							englishLabel[rowNumber-1]=cell.value;
				}
			});
			frenchLabelCol.eachCell(function(cell,rowNumber){
				if(rowNumber){
							frenchLabel[rowNumber-1]=cell.value;
				}
			});
			//Discarding the hearder column (the first row of each column)
			labelId=_.without(labelId,labelIdCol.header);
			frenchLabel =_.without(frenchLabel, frenchLabelCol.header);
			englishLabel =_.without(englishLabel, englishLabelCol.header);

			//turn the array containing the label into a object
			label.french = _.reduce(labelId, function(result, elt,index){
					result[elt]=frenchLabel[index];
					return result;
			},{});

			label.english = _.reduce(labelId, function(result, elt,index){
					result[elt]=englishLabel[index];
					return result;
			},{});
			return label;
		
};

