angular.module('HTServices')

    .factory('TeamSource', ["$resource", function ($resource) {
        var sources = $resource("/api/teams/:id", null, {
            getMyTeams: { url:"/api/me/teams", method: "GET", isArray: true, params: { activeOnly:"@activeOnly" } },
            add: { method: "POST" },
            update: { method: "PUT" },
            remove: { method: "DELETE", params: { id: "@id" } }
        });

        return sources;
    }]);