angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
    //Originates from https://gist.github.com/skivvies/8015981
    var localeAliases = { ar: "ar_SY", bg: "bg_BG", bs: "bs_BA", ca: "ca_ES", cs: "cs_CZ", da: "da_DK", de: "de_DE", el: "el_GR", en: "en_US", es: "es_ES", et: "et_EE", fa: "fa_IR", fi: "fi_FI", fr: "fr_FR", gl: "gl_ES", he: "he_IL", hu: "hu_HU", id: "id_ID", is: "is_IS", it: "it_IT", ja: "ja_JP", km: "km_KH", ko: "ko_KR", lt: "lt_LT", lv: "lv_LV", mk: "mk_MK", nl: "nl_NL", nn: "nn_NO", no: "nb_NO", pl: "pl_PL", pt: "pt_PT", ro: "ro_RO", ru: "ru_RU", sk: "sk_SK", sl: "sl_SI", sv: "sv_SE", th: "th_TH", tr: "tr_TR", uk: "uk_UA" };
    localeAliases.nn = "nn_NO";
    localeAliases.nb = "nb_NO";

    var browserLanguage = (navigator.language || navigator.userLanguage).replace("-", "_");//IE
    var negotiateLocale = function (n, t, i, r) { var f, u, e, o, s, c, h; for (i = i || "_", r = r || localeAliases, f = [], u = 0, e = t.length; u < e; u++) t[u] && f.push(angular.lowercase(t[u])); for (u = 0, e = n.length; u < e; u++) { if (o = n[u], s = angular.lowercase(o), f.indexOf(s) > -1) return o; if (r && s in r && (c = r[s].replace("_", i), f.indexOf(angular.lowercase(c)) > -1)) return c; if (h = o.split(i), h.length > 1 && f.indexOf(angular.lowercase(h[0])) > -1) return h[0] } }
    var available = [],
        preferred = [browserLanguage];

    Object.keys(gettextCatalog.strings).forEach(function (lang) {
        available.push(lang);
    });

    gettextCatalog.currentLanguage = negotiateLocale(preferred, available);
}]);