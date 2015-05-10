angular.module('HTServices')

    .factory('UserSource', function ($resource) {
        var sources = $resource("/api/users/:id", null, {
            current: { method: "GET", params: { id: "current" } },
            register: { method: "POST", params: { user: "@user" } }
        });

        return sources;
    });