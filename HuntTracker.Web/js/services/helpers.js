angular.module('HTServices')

    .factory('Helpers', function () {
        var helpers = {};

        helpers.markerIcons = {};
        helpers.markerIcons["default"] = "/images/bing.png";
        helpers.markerIcons["hooves"] = "/images/hooves.png";
        helpers.markerIcons["you"] = "/images/you.png";

        return helpers;
    });