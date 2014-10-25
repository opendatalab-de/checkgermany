describe('HomeCtrl', function () {
    var $scope, $location;

    beforeEach(module('app.home'));
    beforeEach(inject(function ($controller, $rootScope) {
        $scope = $rootScope.$new();
        $controller('HomeCtrl', {
            '$scope': $scope
        });
    }));

    it("should set greeting on button click", function () {
        $scope.greet();
        expect($scope.greeting).toEqual('Hallo!');
    });
});