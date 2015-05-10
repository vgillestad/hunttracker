angular.module("HTLogin", ["gettext", "HTServices"])
    .controller("LoginCtrl", function ($scope, AuthSource, UserSource) {
        $scope.view = "login";

        $scope.submitBtnLbl = "Login";

        $scope.login = function () {
            $scope.view = "login";
        };

        $scope.loginSubmit = function () {
            AuthSource.login({ email: $scope.email, password: $scope.password })
                .then(function () {
                    document.location.href = "";
                }, function () {
                    $scope.password = "";
                    $scope.errorMessage = "Invalid username/password";
                });
        }

        $scope.register = function () {
            $scope.view = "register";
        }

        $scope.registerSubmit = function () {
            var newUser = {
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                email: $scope.email,
                password: $scope.password
            }

            UserSource.register({ user: newUser })
                .then(function () {
                    document.location.href = "";
                }, function () {
                console.log("An exception occured");
            });
        }

        $scope.forgot = function () {
            $scope.view = "forgot";
        }
    })