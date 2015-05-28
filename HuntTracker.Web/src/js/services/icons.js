angular.module('HTServices')

    .factory('IconSource', function () {
        var icons = {}
        icons["default"] = "/src/images/bing.png";
        icons["hooves"] = "/src/images/hooves.png";
        icons["scope"] = "/src/images/scope.png";
        icons["person"] = "/src/images/person.png";

        return {
            getAll: function () {
                return icons;
            }
        };
    });