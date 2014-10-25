(function (angular, app) {
    'use strict';

    var topics = [
        {
            label: 'Realsteuern',
            code: '123456',
            fields: [
                {
                    name: 'stv_06',
                    label: 'Gewerbesteuerumlage'
                },
                {
                    name: 'stv_07',
                    label: 'Gewerbesteuereinnahmen'
                }
            ]
        },
        {
            label: 'Geburtenrate',
            code: '123456',
            fields: [
                {
                    name: 'bev001',
                    label: 'Lebend Geborene'
                }
            ]
        },
        {
            label: 'Sterberate',
            code: '123456',
            fields: [
                {
                    name: 'bev001',
                    label: 'Schulden der kommunalen Krankenhäuser'
                }
            ]
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
                    scope.selection.field = null;
                }
            }
        };
    });
})(angular, app);