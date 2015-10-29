// ----------------------------------------------------------
// 
// SmartVISU widget for database plots with highcharts
// (c) Tobias Geier 2015
// 
// Version: 0.1
// License: GNU General Public License v2.0
// 
// Manual: 
// 
// ----------------------------------------------------------
$(document).delegate('div[data-widget="dbPlot.linePlot"]', {

	// Get the data via POST Request from the php DB Handler
	'init': function (event) {
		
		// Set unit for y Axis
		var unit = $(this).attr('data-unit-y-axis');
			
		// Check if y Axis Options are set. If not use default setting with values from widget data fields
		var yAxisOptions = JSON.parse($(this).attr('data-y-axis-options'));
		if (yAxisOptions != '') {
			// Set custom yAxisData
			var yAxisData = yAxisOptions;
		} else {
			// Set default yAxisData
			var yAxisData = {
				title: {
					text: $(this).attr('data-text-y-axis')
				},
				labels: {
					format: '{value} '+$(this).attr('data-unit-y-axis')
				}
			};
		}
		
		// Check if y Axis Options are set. If not use default setting with values from widget data fields
		var legendOptions = JSON.parse($(this).attr('data-legend-options'));
		if (legendOptions != '') {
			// Set custom legendOptions
			var legendData = legendOptions;
		} else {
			// Set default legendOptions
			var legendData = {
				align: 'right',
				verticalAlign: 'top',
				borderWidth: 0
			};
		}
		
		var options = {
			// Options for chart
			chart: {
				renderTo: $(this).attr('id'),
				type: $(this).attr('data-type'),
				zoomType: 'x'
			},
			// Options for plot title
			title: {
				text: $(this).attr('data-title'),
				align: 'left'
			},
			// Options for xAxis
			xAxis: { 
				type: 'datetime'
			},
			// Options for yAxis
			yAxis: yAxisData,
			// Options for legend
			legend: legendData,
			series: [],
			// Tooltip for SmartVISU Style
			tooltip: {
				formatter: function () {
					if (this.series.options.unit != null) {
						// If unit is set in the series data use this
						return this.series.name + ' <b>' + this.y + ' ' + this.series.options.unit +'</b>';
					} else {
						// If unit is not set use the unit value from data fields
						return this.series.name + ' <b>' + this.y + ' ' + unit +'</b>';
					}
				}
			}
		};
		
		// Get Query for POST-Request
		var postData = {
			query: $(this).attr('data-query'),
			maxRows: $(this).attr('data-max-rows'),
			range: $(this).attr('data-range')
		}
		
		// Make POST-Request to get the data series for the plot
		$.post( "widgets/widget_dbplot.php", postData)
		  .done(function( data ) {
			options.series = data;
			var chart = new Highcharts.Chart(options);
			
		 });		
	},
	
	// Update event is called when a GAD changes
	'update': function (event, response) {
		
		// The chart which will be updated
		var chart = $('#' + this.id).highcharts();
		
		// Get Query for POST-Request
		var postData = {
			query: $(this).attr('data-query'),
			range: $(this).attr('data-range'),
			update: true
		}
		
		// Make POST-Request and update the Plot
		$.post( "widgets/widget_dbplot.php", postData).done(function( data ) {
				for (i = 0; i < data.length; i++) {
						chart.series[i].addPoint(data[i].data[0], false);
				}
				// Redraw chart
				chart.redraw();
		 });
		 
		 // Fix for display problems with too wide Chart container
		 $(window).resize();
	}
	
});