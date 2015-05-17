angular.module("HTLogin", ["gettext", "HTServices"])
    .controller("LoginCtrl", function ($scope, AuthSource, UserSource) {
        $scope.view = "login";

        $scope.submitBtnLbl = "Login";

        $scope.login = function () {
            $scope.errorMessage = "";
            $scope.view = "login";
        };

        $scope.loginSubmit = function () {
            $scope.errorMessage = "";
            AuthSource.login({ email: $scope.email, password: $scope.password }).$promise
                .then(function () {
                    document.location.href = "/";
                }, function () {
                    $scope.password = "";
                    $scope.errorMessage = "Invalid username/password.";
                });
        }

        $scope.register = function () {
            $scope.errorMessage = "";
            $scope.view = "register";
        }

        $scope.registerSubmit = function () {
            $scope.errorMessage = "";
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
                    }
                    else {
                        $scope.errorMessage = "We are sorry, but an unexpected error occured."
                    }
                });
        }

        $scope.forgot = function () {
            $scope.errorMessage = "Sorry, but this functionality is not ready yet.";
            $scope.view = "forgot";
        }
    })