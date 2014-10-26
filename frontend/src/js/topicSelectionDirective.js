(function (angular, app) {
    'use strict';

    var extractTopics = function(apiModel) {
        if(!apiModel) return [];

        //filter out all cubes with dimension "stag", as we can't use this attribute due to a bug in the regenesis api
        var usableCubes = apiModel.cubes.filter(function(cube) {
            return cube.dimensions.indexOf('stag') < 0;
        });

        //group by topic labels and ids (first 5 digits of the table-code)
        var topics = {};
        usableCubes.forEach(function(cube) {
            var topic = {
                label: cube.label,
                code: cube.name.substr(0, 5)
            };
            topics[topic.code] = topic;
        });

        // convert to array
        var topicList = Object.keys(topics).map(function (key) {
            return topics[key];
        });
        return topicList;
    };

    angular.module('app.explore').directive('topicSelection', function () {
        return {
            restrict: 'E',
            templateUrl: '/partials/topicSelection.html',
            replace: true,
            link: function (scope) {
                scope.$watch('apiModel', function(apiModel) {
                    scope.topics = extractTopics(apiModel);
                });
            }
        };
    });
})(angular, app);