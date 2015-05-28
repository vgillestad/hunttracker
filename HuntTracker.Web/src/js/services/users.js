angular.module('HTServices')

    .factory('UserSource', ["$resource", function ($resource) {
        var sources = $resource("/api/users/:id", null, {
            current: { method: "GET", params: { id: "current" } },
            register: {
                method: "POST", params: {
                    firstName: "@firstName",
                    lastName: "@lastName",
                    email: "@email",
                    password: "@password"
                }
            }
        });

        return sources;
    }]);