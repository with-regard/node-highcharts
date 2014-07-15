var jsdom = require('jsdom');
var spawn = require('child_process').spawn;
var fs = require('fs');
var jQuery = fs.readFileSync(__dirname + '../../../bower_components/jquery/dist/jquery/jquery.min.js').toString();
var ChartLib = fs.readFileSync(__dirname + '/../../../bower_components/highcharts/highcharts.src.js').toString();
var Exporting = fs.readFileSync(__dirname + '/../../../bower_components/highcharts/modules/exporting.src.js').toString();

function serverifyOptions(options) {
		options.chart.renderTo = 'container';
		options.chart.renderer = 'SVG';
		options.chart.animation = false;
		options.chart.forExport = true;
		options.exporting = { enabled: false }
		options.series.forEach(function(series) {
			series.animation = false;
		});
}

function render(options, callback) {
	serverifyOptions(options);

	jsdom.env({
    	html: '<div id="container"></div>',
    	src: [ jQuery, ChartLib, Exporting ],
    	done: function(errors, window) {
	        if (errors) 
	        {
	        	callback(errors);
	        } else {
	        	var Highcharts = window.Highcharts;
	        	
	        	var chart = new Highcharts.Chart(options);

	        	var svg = chart.getSVG();

	        	console.log(svg);
	        	callback(svg);
	        }
	    }
	});
}

exports.render = render;
