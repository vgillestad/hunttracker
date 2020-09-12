angular.module('HTServices')
    .factory('UserSource', ["$resource", function ($resource) {
        var sources = $resource("/api/users/:id", null, {
            me: {
                method: "GET",
                url: "/api/me",
            },
            updateMe: {
                method: "PUT",
                url: "/api/me"
            },
            getById: {
                method: "GET",
                params: {
                    id: "@id"
                }
            },
            register: {
                method: "POST", params: {
                    firstName: "@firstName",
                    lastName: "@lastName",
                    email: "@email",
                    password: "@password"
                }
            },
            resetPassword: {
                method: "POST",
                url: '/api/users/reset-password',
                params: {
                    token: "@token",
                    password: "@password",
                    confirmPassword: "@confirmPassword"
                }
            },
            sendResetPasswordEmail: {
                method: "POST",
                url: '/api/users/send-reset-password-email',
                params: {
                    email: "@email"
                }
            }
        });

        return sources;
    }]);