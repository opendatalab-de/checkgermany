(function (angular, app) {
    'use strict';

    var topics = [
        {
            label: 'Realsteuern',
            code: '123456'
        },
        {
            label: 'Geburtenrate',
            code: '123456'
        },
        {
            label: 'Sterberate',
            code: '123456'
        }
    ];

    angular.module('app.explore').directive('topicSelection', function () {
        return {
            restrict: 'E',
            templateUrl: '/partials/topicSelection.html',
            replace: true,
            link: function (scope) {
                scope.topics = topics;
                scope.selectTopic = function(topic) {
                    scope.selection.topic = topic;
                }
            }
        };
    });
})(angular, app);