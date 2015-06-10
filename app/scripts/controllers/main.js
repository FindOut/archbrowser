'use strict';

/**
 * @ngdoc function
 * @name archbrowserApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the archbrowserApp
 */
angular.module('archbrowserApp')
  .controller('MainCtrl', function ($scope, $http, flatDotViewer) {
    initUi();

    $scope.flats = [];
    $scope.hits = 0;

    $http.get('/chunk0.json').
    //$http.get('/sold-soder-150607.json').
      success(function(flats, status, headers, config) {
        $scope.flats = flats;
        var roomsSetValues = d3.set(flats.sold.reduce(function(ack, flat) {if (flat.rooms) {ack.push(flat.rooms)}; return ack;}, [])).values();
      }).
      error(function(data, status, headers, config) {
        console.error('read data error', status);
      });

    function selectListItem(event, ui) {
      var flat = $scope.flats.sold[ui.selected.rowIndex];
      showFlat(flat);
    }

    function showFlat(flat) {
      if (flat) {
        $scope.flatDescription = formatText(flat, [
          'booliId:booliId',
          'street:location.address.streetAddress',
          'floor:floor',
          'area:livingArea',
          'rooms:rooms',
          'rent:rent',
          'price:soldPrice'
          ]);
      } else {
        $scope.flatDescription = '';
      }
      $scope.$digest();
    }

    // update visualizer when flat hit table changes
    $scope.$watch(function(newValue, oldValue) {
      visualize($scope.hits);
    });

    // create or update flat dot map
    function visualize(flats) {
      if (flats) {
        d3.select(".visualizer")
            .datum(flats)
          .call(flatDotViewer()
            .width($('.visualizer').innerWidth())
            .height($('.visualizer').innerHeight())
            .x(function(d) { return +d.location.position.longitude; })
            .y(function(d) { return +d.location.position.latitude; })
            .key(function(d) { return +d.booliId; })
            .click(function(id) {showFlat(getFlatById(+id))})
          );
      }
    }

    function unselectListItem(event, ui) {
      showFlat(null);
    }

    // return flat by booliID or false if not found
    function getFlatById(booliId) {
      var i = _.findIndex($scope.flats.sold, function(flat) {return flat.booliId === booliId});
      return i != -1 && $scope.flats.sold[i];
    }

    // returns array of attribute values in obj with titles
    // attrSpecList is an array of label:attrPath -
    // example: ['booliId:booliId', 'street:location.address.streetAddress']
    function formatText(obj, attrSpecList) {
      return attrSpecList.map(function(attrSpec) {
        var specParts = attrSpec.split(':');
        return specParts[0] + ': ' + getAttrByPath(obj, specParts[1]);
      });
    }

    // returns obj attribute specified by path like location.address.streetAddress
    function getAttrByPath(obj, path) {
      return path.split('.').reduce(function(ack, item) {return ack[item]}, obj);
    }

    // initialize UI widgets
    function initUi() {
      // set height of main view to window height, and keep it so when window resize
      function setPaperSize() {
        $('.win').outerHeight($(window).innerHeight());
        visualize($scope.hits);
      }
      setPaperSize();
      $(window).bind('resize', setPaperSize);

      // set adjustable width
      $('.eresizable').resizable({
        handles: 'e'
      });

      // set adjustable height
      $('.sresizable').resizable({
        handles: 's'
      });

      // $('.tree div').jstree();
      $('.selectable').selectable({
        filter:'tbody tr',
        selected: selectListItem,
        unselected: unselectListItem
      });

    }
  });
