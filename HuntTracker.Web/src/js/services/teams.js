angular.module('HTServices')

    .factory('TeamSource', ["$resource", function ($resource) {
        var sources = $resource("/api/teams/:id", null, {
            getByUserId: { method: "GET", isArray: true, params: { userId: "@userId" } },
            add: { method: "POST" },
            update: { method: "PUT" },
            remove: { method: "DELETE", params: { id: "@id" } }
        });

        return sources;
    }]);