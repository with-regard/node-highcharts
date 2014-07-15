var fs = require('fs');
var phantom = require('node-phantom-simple');

var jqfile = __dirname + '/../../../bower_components/jquery/dist/jquery.min.js';
var cfile = __dirname + '/../../../bower_components/highcharts/highcharts.src.js';
var hfile = __dirname + '/../../../bower_components/highcharts/modules/exporting.src.js';

function serverifyOptions(options) {
		options.chart.renderTo = 'container';
		options.chart.animation = false;
		options.chart.forExport = true;
		options.exporting = { enabled: false }
		options.series.forEach(function(series) {
			series.animation = false;
		});
}

function render(options, callback) {
	serverifyOptions(options);
	phantom.create(function(err, ph) {
	  ph.createPage(function(err, page) {
	  	page.open('about:blank', function(status) {
		    page.injectJs(jqfile);
		    page.injectJs(cfile);
		    page.injectJs(hfile);

			setTimeout(function() {
				page.evaluate(function(opt) {
			      	$('body').prepend('<div id="container"></div>');

			      	var chart = new Highcharts.Chart(opt);

				  	var svg = chart.getSVG();

		        	return svg;
			    }, function(err, res) {
			      	callback(err, res);
			      	ph.exit();
			      }, options);
			}, 1000);
	  	});
	   });
	});
}

exports.render = render;
