angular.module('HTServices')

    .factory('UserSource', ["$resource", function ($resource) {
        var sources = $resource("/api/users/:id", null, {
            me: { url: "/api/me", method: "GET", },
            updateMe: { url: "/api/me", method: "PUT" },
            getById: { method: "GET", params: { id: "@id" } },
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