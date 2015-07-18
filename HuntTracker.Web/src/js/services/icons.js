angular.module('HTServices')

    .factory('IconSource', function () {
        var defaultSrc = "/src/images/animals4.png";
        var icons = {}

        icons["default"] = {
            type: "font",
            class: "icon-circles",
            text: "\uee76",
            font: "normal 25px icomoon"
        };
        icons["person"] = {
            type: "image",
            offset: [0, 0],
            size: [25, 25],
            scale: 1,
            src: "/src/images/person.png"
        };
        icons["deer"] = {
            type: "image",
            offset: [291, 301],
            size: [105, 142],
            scale: 0.30,
            src: defaultSrc
        };
        icons["moose"] = {
            type: "image",
            offset: [0, 0],
            size: [150, 143],
            scale: 0.30,
            src: defaultSrc
        };
        icons["raindeer"] = {
            type: "image",
            offset: [125, 160],
            size: [150, 163],
            scale: 0.30,
            src: defaultSrc
        };
        icons["fox"] = {
            type: "image",
            offset: [151, 0],
            size: [119, 75],
            scale: 0.30,
            src: defaultSrc
        };
        icons["wolf"] = {
            type: "image",
            offset: [152, 76],
            size: [151, 81],
            scale: 0.30,
            src: defaultSrc
        };
        icons["bird"] = {
            type: "image",
            offset: [13, 262],
            size: [93, 92],
            scale: 0.40,
            src: defaultSrc
        };
        icons["grouse"] = {
            type: "image",
            offset: [445, 0],
            size: [126, 152],
            scale: 0.20,
            src: defaultSrc
        };
        icons["wood-grouse"] = {
            type: "image",
            offset: [308, 0],
            size: [130, 134],
            scale: 0.20,
            src: defaultSrc
        };
        icons["some"] = {
            type: "font",
            class: "icon-user3",
            text: "\ueb05",
            font: "normal 25px icomoon",
        };

        return {
            getAll: function () {
                return icons;
            }
        };
    });