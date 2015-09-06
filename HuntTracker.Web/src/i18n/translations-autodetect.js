angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
    //Originates from https://gist.github.com/skivvies/8015981
    var localeAliases = {};
    localeAliases["no"] = "nb_NO";
    localeAliases["nb"] = "nb_NO";
    localeAliases["nn"] = "nn_NO";
    
    var browserLanguage = (navigator.language || navigator.userLanguage).replace("nb-no","nb_NO").replace("nn-no","nn_NO").replace("-", "_") //1&2 quickfix iOS, 3 IE
    var negotiateLocale = function (n, t, i, r) { var f, u, e, o, s, c, h; for (i = i || "_", r = r || localeAliases, f = [], u = 0, e = t.length; u < e; u++) t[u] && f.push(angular.lowercase(t[u])); for (u = 0, e = n.length; u < e; u++) { if (o = n[u], s = angular.lowercase(o), f.indexOf(s) > -1) return o; if (r && s in r && (c = r[s].replace("_", i), f.indexOf(angular.lowercase(c)) > -1)) return c; if (h = o.split(i), h.length > 1 && f.indexOf(angular.lowercase(h[0])) > -1) return h[0] } }
    var available = [],
        preferred = [browserLanguage];

    Object.keys(gettextCatalog.strings).forEach(function (lang) {
        available.push(lang);
    });

    gettextCatalog.currentLanguage = negotiateLocale(preferred, available);
}]);