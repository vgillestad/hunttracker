angular.module('HTServices')

    .factory('AuthSource', function ($resource) {
        var sources = $resource("/api/auth", null, {
            login: { method: "POST", params: { email: "@email", password: "@password" } },
            logout: { method: "DELETE" }
        });

        return sources;
    });