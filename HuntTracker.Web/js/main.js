angular.module("HuntTracker", ["gettext", "HTControllers", "HTDirectives", "HTServices"])

.config(function ($httpProvider) {
    //interceptor that adds random argument to GET-requests to prevent caching in IE.
    $httpProvider.interceptors.push(function ($q) {
        return {
            'request': function (config) {

                if (config.method === "GET") {
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
})