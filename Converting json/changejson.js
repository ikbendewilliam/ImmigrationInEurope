// population
var years = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2016];
var newData = {};
$.each(years, function(keyYear, year) {
    newData[year] = {};
});

$.getJSON('./Data/population.json', function(data) {
    console.log(data);
    $.each(data, function(key, value) {
        $.each(years, function(keyYear, year) {
            var countrycode = value["indic_de,geo\\\\time"].replace("JAN,", "");
            newData[year][countrycode] = parseInt(value[year]);
        });
    });
    console.log(newData);
    var str = JSON.stringify(newData, null, 4);
    document.write(str);
});
console.log("loaded");
/*
// imigration
var years = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];
var newData = {};
$.each(years, function(keyYear, year) {
	newData[year] = {};
});

$.getJSON('./Data/imigration.json', function(data) {
	console.log(data);
	$.each(data, function(key, value){
		$.each(years, function(keyYear, year) {
			newData[year][value["geo\\time"]] = parseInt(value[year]);
		});
	});
	console.log(newData);
	var str = JSON.stringify(newData, null, 4);
	document.write(str);
});
console.log("loaded");
*/
