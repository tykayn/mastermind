'use strict';
/**
 * Created by tykayn on 14/05/15.
 */
console.log('test for app.js');
describe("A suite", function () {
    it("contains spec with an expectation", function () {
        expect(true).toBe(true);
    });
});



describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('myApp'));

    var MainCtrl, scope, iaService;
    scope = 1;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _AnalysePions_) {
        scope = $rootScope.$new();
        iaService = _AnalysePions_;
        MainCtrl = $controller('MainCtrl', {
            $scope: scope,
            IA : iaService
        });
    }));

    it('should have modules working', function () {
        expect(module).toBeTruthy();
    });
    it('should have a main controller existing', function () {
        expect(MainCtrl).toBeTruthy();
    });
    it('should have a scope existing', function () {
        expect(scope).toBeTruthy();
    });
    xit('should have an IA service existing', function () {
        expect(iaService).toBeTruthy();
    });

});