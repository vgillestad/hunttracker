angular.module("HuntTracker", ["gettext", "ui.bootstrap", "HTControllers", "HTDirectives", "HTServices"])

.config(["$httpProvider", function ($httpProvider) {
    //interceptor that adds random argument to GET-requests to prevent caching in IE.
    $httpProvider.interceptors.push(function ($q) {
        var whitelist = [
            "widget.modal.html",
            "template/modal/backdrop.html",
            "template/modal/window.html"
        ];

        return {
            'request': function (config) {

                if (config.method === "GET" && whitelist.indexOf(config.url) < 0) {
                    var rand = new Date().getTime();

                    if (config.url.indexOf('?') === -1) {
                        config.url += "?rand=" + rand;
                    } else {
                        config.url.replace("?", "?rand=" + rand + "&");
                    }
                }
                return config || $q.when(config);
            },
            'response': function (response) {
                return response || $q.when(response);
            },
            'responseError': function (rejection) {
                if (rejection && rejection.status === 401) {
                    document.location.href = "/login.html";
                }

                return $q.reject(rejection);
            }
        };
    });
}])