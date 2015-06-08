'use strict';

/**
 * @ngdoc function
 * @name archbrowserApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the archbrowserApp
 */
angular.module('archbrowserApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.flats = [];
    $scope.hits = 0;
    // $scope.$watch('hits', function(newValue, oldValue) {
    //   console.log('hits',$scope.hits && $scope.hits.length);
    //   if ($scope.hits) {
    //     setVisualizer($scope.hits);
    //   }
    // });

    $http.get('/chunk0.json').
    // $http.get('/sold-soder-150607.json').
      success(function(flats, status, headers, config) {
        $scope.flats = flats;
        var roomsSetValues = d3.set(flats.sold.reduce(function(ack, flat) {if (flat.rooms) {ack.push(flat.rooms)}; return ack;}, [])).values();
      }).
      error(function(data, status, headers, config) {
        console.error('read data error', status);
      });

    function selectListItem(event, ui) {
      $scope.flatDescription = formatText($scope.flats.sold[ui.selected.rowIndex], [
        'booliId:booliId',
        'street:location.address.streetAddress',
        'floor:floor',
        'area:livingArea',
        'rooms:rooms',
        'rent:rent',
        'price:soldPrice'
        ]);
      $scope.$digest();
    }

    function unselectListItem(event, ui) {
      $scope.text = '';
      $scope.$digest();
    }

    // visualize the objects in the list
    function setVisualizer(flats) {
//      d3.select('.visualizer').text(' ' + flats.sold.length);
    }

    function formatText(obj, attrSpecList) {
      return attrSpecList.map(function(attrSpec) {
        var specParts = attrSpec.split(':');
        return specParts[0] + ': ' + getAttrByPath(obj, specParts[1]);
      });
    }

    function getAttrByPath(obj, path) {
      return path.split('.').reduce(function(ack, item) {return ack[item]}, obj);
    }

    initUi();

    function initUi() {
      // set height of main view to window height, and keep it so when window resize
      function setPaperSize() {
        $('.win').outerHeight($(window).innerHeight());
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
