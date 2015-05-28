angular.module('HTServices')

    .factory('AuthSource', ["$resource", function ($resource) {
        var sources = $resource("/api/auth", null, {
            login: { method: "POST", params: { email: "@email", password: "@password" } },
            logout: { method: "DELETE" }
        });

        return sources;
    }]);