/*
	Author: William Verhaeghe
	Email: william.verhaeghe@student.howest.be
	Email2: ikbendewilliam@hotmail.com
	Date 26th January 2017
	Enjoy!
 */

// Initialize some variables
var immigrantsData, populationData, ratioData = {},
    currentData = "immigrants";
var year = 0,
    minYear = 2005,
    maxYear = 2014;
var yrs = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014];

$.each(yrs, function(key, value) {
    ratioData[value] = {};
});

// Start the script
$(document).ready(function() {
    year = $('.slider').val();

    $('#range').change(function() {
        changeValue();
    });

    //reset radio button
    $("#optioni").prop("checked", true);
    $("#optionp").prop("checked", false);
    $("#optionr").prop("checked", false);

    $('input[type=radio][name=Currentdata]').change(function() {
        //console.log(this.value);
        switch (this.value) {
            case "population":
                currentData = "population";
                break;
            case "ratio":
                currentData = "ratio";
                break;
            default:
                currentData = "immigrants";
                break;
        }
        CreateMap(year);
    });
    LoadData();
});

function LoadData() {
    console.log("Starting to load data");
    $.getJSON('./Data/population-converted.json', function(data) {
        $.each(data, function(key, yr) {
            $.each(yr, function(cc, value) {
                if (value === 0)
                    delete yr[cc];
            });
        });

        populationData = data;
        //console.log(populationData);
    });
    $.getJSON('./Data/imigration-converted.json', function(data) {
        $.each(data, function(key, yr) {
            $.each(yr, function(cc, value) {
                if (value === 0)
                    delete yr[cc];
                else if (key in populationData) {
                    //console.log(cc);
                    //console.log(populationData[key]);
                    if (cc in populationData[key]) {
                        //console.log(key);
                        ratioData[key][cc] = Math.round(value / populationData[key][cc] * 10000, -2);
                    }
                }
            });
        });

        console.log("data loaded");
        immigrantsData = data;
        //console.log(immigrantsData);
        //console.log(ratioData);
        CreateMap(year);
    });
}

$(".slider").slider({
    value: minYear,
    min: minYear,
    max: maxYear,
    step: 1,
    slide: function(event, ui) {
        year = ui.value;
        $('#value').text(year);
        CreateMap(year);
    }
});

function CreateMap(year) {
    if (currentData == "immigrants") {
        data = immigrantsData;
    } else if (currentData == "population") {
        data = populationData;
    } else {
        data = ratioData;
    }

    if (year < minYear)
        year = minYear;
    else if (year > maxYear)
        year = maxYear;

    $('.map').html('');
    $('.map').vectorMap({
        map: 'europe_mill',
        series: {
            regions: [{
                values: data[year],
                scale: ['#144721', '#29fb4c'],
                attribute: 'fill',
                min: jvm.min(data[year]),
                max: jvm.max(data[year])
            }]
        },
        onRegionTipShow: function(e, el, code) {
            if (data[year][code] == null)
                el.html(el.html() + ' (not known in ' + year + ')');
            else if (currentData != "ratio")
                el.html(el.html() + ' (' + currentData + ' in ' + year + ': ' + data[year][code] + ')');
            else
                el.html(el.html() + ' (in ' + year + ': ' + data[year][code] + ' immigrants per 10 000)');
        }
    });
}
