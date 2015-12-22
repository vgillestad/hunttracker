/* global angular */
angular.module("HTLogin", ["gettext", "HTServices"])
    .controller("LoginCtrl", ["$scope", "AuthSource", "UserSource", function ($scope, AuthSource, UserSource) {
        $scope.view = "login";
        $scope.loading = false;

        $scope.submitBtnLbl = "Login";

        $scope.login = function () {
            $scope.errorMessage = "";
            $scope.view = "login";
        };

        $scope.loginSubmit = function () {
            $scope.errorMessage = "";
            $scope.loading = true;
            AuthSource.login({ email: $scope.email, password: $scope.password }).$promise
                .then(function (auth) {
                    localStorage.token = auth.token;
                    ht.env.hostedInCordova ? document.location.href = "index.html" : document.location.href = "";
                }, function (reason) {
                    $scope.password = "";
                    $scope.loading = false;
                    if (reason.status === 401) {
                        $scope.errorMessage = "Invalid username/password.";
                    }
                    else {
                        $scope.errorMessage = "We are sorry, but an unexpected error occured.";
                    }
                });
        }

        $scope.register = function () {
            $scope.errorMessage = "";
            $scope.view = "register";
        }

        $scope.registerSubmit = function () {
            $scope.errorMessage = "";
            $scope.loading = true;
            var newUser = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email,
                password: $scope.password
            }

            UserSource.register(newUser).$promise
                .then(function () {
                    $scope.loginSubmit();
                }, function (reason) {
                    if (reason.status === 409) {
                        $scope.errorMessage = "Already an existing user with that email address."
                        $scope.loading = false;
                    }
                    else {
                        $scope.errorMessage = "We are sorry, but an unexpected error occured."
                        $scope.loading = false;
                    }
                });
        }

        $scope.forgot = function () {
            $scope.errorMessage = "Sorry, but this functionality is not ready yet.";
            $scope.view = "forgot";
        }
    }])

.config(["$httpProvider", function ($httpProvider) {
    //interceptor that adds random argument to GET-requests to prevent caching in IE.
    $httpProvider.interceptors.push(["$q", function ($q) {

        var apiUrl = window.selfHostedApi ? "" : "http://192.168.1.177:8081/api";

        return {
            'request': function (config) {

                if (!window.selfHostedApi && config.url.indexOf("/api") > -1) {
                    config.url = config.url.replace("/api", apiUrl);
                }
                return config || $q.when(config);
            }
        };
    }]);
}])