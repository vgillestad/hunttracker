angular.module('HTServices')

    .factory('AuthSource', function ($resource) {
        var sources = $resource("/api/auth", null, {
            current: { method: "GET"},
            login: { method: "POST" },
            logout: { method: "DELETE"}
        });

        return sources;
    });