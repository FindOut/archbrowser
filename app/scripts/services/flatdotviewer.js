'use strict';

/**
 * @ngdoc service
 * @name archbrowserApp.flatDotViewer
 * @description
 * # flatDotViewer
 * Service in the archbrowserApp.
 */
angular.module('archbrowserApp')
  .service('flatDotViewer', function () {
      /*
      usage:
        d3.csv("sp500.csv", function(data) {
          var formatDate = d3.time.format("%b %Y");

          d3.select("#example")
              .datum(data)
            .call(timeSeriesChart()
              .x(function(d) { return formatDate.parse(d.date); })
              .y(function(d) { return +d.price; }));
        });
      */
      return function() {
        var margin = {top: 20, right: 20, bottom: 20, left: 20},
            width = 760,
            height = 120,
            xValue = function(d) { return d[0]; },
            yValue = function(d) { return d[1]; },
            keyValue = function(d) { return d[2]; },
            clickHandler = function(id) {console.log(id);},
            xScale = d3.scale.linear(),
            yScale = d3.scale.linear();

        function chart(selection) {
          selection.each(function(origData) {
            // Convert data to standard representation greedily;
            // this is needed for nondeterministic accessors.
            var data = origData.map(function(d, i) {
              return [xValue.call(origData, d, i), yValue.call(origData, d, i), keyValue.call(origData, d, i)];
            });

            // Update the x-scale.
            xScale
                .domain(d3.extent(data, function(d) { return d[0]; }))
                .range([0, width - margin.left - margin.right]);

            // Update the y-scale.
            yScale
                .domain(d3.extent(data, function(d) { return d[1]; }))
                .range([height - margin.top - margin.bottom, 0]);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
            // Update the outer dimensions.
            svg
                .attr("width", width)
                .attr("height", height);

            // Update the inner offset
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var bullet = g.selectAll('.bullet')
              .data(data);
            bullet.exit().remove();
            bullet.enter().append('circle')
                .attr('class', 'bullet')
                .attr('r', 3)
                .attr('id', function(d) {return d[2]})
                .on('click', function(d) {clickHandler(d[2])});
            bullet
                .attr('cx', function(d) {return xScale(d[0])})
                .attr('cy', function(d) {return yScale(d[1])});

          });
        }

        chart.margin = function(_) {
          if (!arguments.length) return margin;
          margin = _;
          return chart;
        };

        chart.width = function(_) {
          if (!arguments.length) return width;
          width = _;
          return chart;
        };

        chart.height = function(_) {
          if (!arguments.length) return height;
          height = _;
          return chart;
        };

        chart.x = function(_) {
          if (!arguments.length) return xValue;
          xValue = _;
          return chart;
        };

        chart.y = function(_) {
          if (!arguments.length) return yValue;
          yValue = _;
          return chart;
        };

        chart.key = function(_) {
          if (!arguments.length) return keyValue;
          keyValue = _;
          return chart;
        };

        chart.click = function(_) {
          if (!arguments.length) return clickHandler;
          clickHandler = _;
          return chart;
        };

        chart.selectedId = function(_) {
          if (!arguments.length) return selId;
          selId = _;
          return chart;
        };

        return chart;
      }
});
