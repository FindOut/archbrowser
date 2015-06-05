'use strict';

/**
 * @ngdoc function
 * @name archbrowserApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the archbrowserApp
 */
angular.module('archbrowserApp')
  .controller('MainCtrl', function ($scope) {
    // set height of main view to window height, and keep it so when window resize
    function setPaperSize() {
      $('.win').outerHeight($(window).innerHeight()-3);
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

    $('.tree div').jstree();
    $('.selectable').selectable();
  });
