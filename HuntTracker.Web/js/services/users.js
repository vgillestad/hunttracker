angular.module('HTServices')

    .factory('UserSource', function ($resource) {
        var sources = $resource("/api/users/:id", null, {
            current: { method: "GET", params: { id: "current" } }
        });

        return sources;
    });