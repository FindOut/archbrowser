'use strict';

describe('Service: flatDotViewer', function () {

  // load the service's module
  beforeEach(module('archbrowserApp'));

  // instantiate service
  var flatDotViewer;
  beforeEach(inject(function (_flatDotViewer_) {
    flatDotViewer = _flatDotViewer_;
  }));

  it('should do something', function () {
    expect(!!flatDotViewer).toBe(true);
  });

});
