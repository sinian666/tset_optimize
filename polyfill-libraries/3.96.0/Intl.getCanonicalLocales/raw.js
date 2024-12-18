
// Intl.getCanonicalLocales
(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () { 'use strict';

    var __assign = (undefined && undefined.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var ALPHANUM_1_8 = /^[a-z0-9]{1,8}$/i;
    var ALPHANUM_2_8 = /^[a-z0-9]{2,8}$/i;
    var ALPHANUM_3_8 = /^[a-z0-9]{3,8}$/i;
    var KEY_REGEX = /^[a-z0-9][a-z]$/i;
    var TYPE_REGEX = /^[a-z0-9]{3,8}$/i;
    var ALPHA_4 = /^[a-z]{4}$/i;
    // alphanum-[tTuUxX]
    var OTHER_EXTENSION_TYPE = /^[0-9a-svwyz]$/i;
    var UNICODE_REGION_SUBTAG_REGEX = /^([a-z]{2}|[0-9]{3})$/i;
    var UNICODE_VARIANT_SUBTAG_REGEX = /^([a-z0-9]{5,8}|[0-9][a-z0-9]{3})$/i;
    var UNICODE_LANGUAGE_SUBTAG_REGEX = /^([a-z]{2,3}|[a-z]{5,8})$/i;
    var TKEY_REGEX = /^[a-z][0-9]$/i;
    var SEPARATOR = '-';
    function isUnicodeLanguageSubtag(lang) {
        return UNICODE_LANGUAGE_SUBTAG_REGEX.test(lang);
    }
    function isUnicodeRegionSubtag(region) {
        return UNICODE_REGION_SUBTAG_REGEX.test(region);
    }
    function isUnicodeScriptSubtag(script) {
        return ALPHA_4.test(script);
    }
    function isUnicodeVariantSubtag(variant) {
        return UNICODE_VARIANT_SUBTAG_REGEX.test(variant);
    }
    function parseUnicodeLanguageId(chunks) {
        if (typeof chunks === 'string') {
            chunks = chunks.split(SEPARATOR);
        }
        var lang = chunks.shift();
        if (!lang) {
            throw new RangeError('Missing unicode_language_subtag');
        }
        if (lang === 'root') {
            return { lang: 'root', variants: [] };
        }
        // unicode_language_subtag
        if (!isUnicodeLanguageSubtag(lang)) {
            throw new RangeError('Malformed unicode_language_subtag');
        }
        var script;
        // unicode_script_subtag
        if (isUnicodeScriptSubtag(chunks[0])) {
            script = chunks.shift();
        }
        var region;
        // unicode_region_subtag
        if (isUnicodeRegionSubtag(chunks[0])) {
            region = chunks.shift();
        }
        var variants = {};
        while (chunks.length && isUnicodeVariantSubtag(chunks[0])) {
            var variant = chunks.shift();
            if (variant in variants) {
                throw new RangeError("Duplicate variant \"" + variant + "\"");
            }
            variants[variant] = 1;
        }
        return {
            lang: lang,
            script: script,
            region: region,
            variants: Object.keys(variants),
        };
    }
    function parseUnicodeExtension(chunks) {
        var keywords = [];
        var keyword;
        while (chunks.length && (keyword = parseKeyword(chunks))) {
            keywords.push(keyword);
        }
        if (keywords.length) {
            return {
                type: 'u',
                keywords: keywords,
                attributes: [],
            };
        }
        // Mix of attributes & keywords
        // Check for attributes first
        var attributes = [];
        while (chunks.length && ALPHANUM_3_8.test(chunks[0])) {
            attributes.push(chunks.shift());
        }
        while (chunks.length && (keyword = parseKeyword(chunks))) {
            keywords.push(keyword);
        }
        if (keywords.length || attributes.length) {
            return {
                type: 'u',
                attributes: attributes,
                keywords: keywords,
            };
        }
        throw new RangeError('Malformed unicode_extension');
    }
    function parseKeyword(chunks) {
        var key;
        if (!KEY_REGEX.test(chunks[0])) {
            return;
        }
        key = chunks.shift();
        var type = [];
        while (chunks.length && TYPE_REGEX.test(chunks[0])) {
            type.push(chunks.shift());
        }
        var value = '';
        if (type.length) {
            value = type.join(SEPARATOR);
        }
        return [key, value];
    }
    function parseTransformedExtension(chunks) {
        var lang;
        try {
            lang = parseUnicodeLanguageId(chunks);
        }
        catch (e) {
            // Try just parsing tfield
        }
        var fields = [];
        while (chunks.length && TKEY_REGEX.test(chunks[0])) {
            var key = chunks.shift();
            var value = [];
            while (chunks.length && ALPHANUM_3_8.test(chunks[0])) {
                value.push(chunks.shift());
            }
            if (!value.length) {
                throw new RangeError("Missing tvalue for tkey \"" + key + "\"");
            }
            fields.push([key, value.join(SEPARATOR)]);
        }
        if (fields.length) {
            return {
                type: 't',
                fields: fields,
                lang: lang,
            };
        }
        throw new RangeError('Malformed transformed_extension');
    }
    function parsePuExtension(chunks) {
        var exts = [];
        while (chunks.length && ALPHANUM_1_8.test(chunks[0])) {
            exts.push(chunks.shift());
        }
        if (exts.length) {
            return {
                type: 'x',
                value: exts.join(SEPARATOR),
            };
        }
        throw new RangeError('Malformed private_use_extension');
    }
    function parseOtherExtensionValue(chunks) {
        var exts = [];
        while (chunks.length && ALPHANUM_2_8.test(chunks[0])) {
            exts.push(chunks.shift());
        }
        if (exts.length) {
            return exts.join(SEPARATOR);
        }
        return '';
    }
    function parseExtensions(chunks) {
        if (!chunks.length) {
            return { extensions: [] };
        }
        var extensions = [];
        var unicodeExtension;
        var transformedExtension;
        var puExtension;
        var otherExtensionMap = {};
        do {
            var type = chunks.shift();
            switch (type) {
                case 'u':
                case 'U':
                    if (unicodeExtension) {
                        throw new RangeError('There can only be 1 -u- extension');
                    }
                    unicodeExtension = parseUnicodeExtension(chunks);
                    extensions.push(unicodeExtension);
                    break;
                case 't':
                case 'T':
                    if (transformedExtension) {
                        throw new RangeError('There can only be 1 -t- extension');
                    }
                    transformedExtension = parseTransformedExtension(chunks);
                    extensions.push(transformedExtension);
                    break;
                case 'x':
                case 'X':
                    if (puExtension) {
                        throw new RangeError('There can only be 1 -x- extension');
                    }
                    puExtension = parsePuExtension(chunks);
                    extensions.push(puExtension);
                    break;
                default:
                    if (!OTHER_EXTENSION_TYPE.test(type)) {
                        throw new RangeError('Malformed extension type');
                    }
                    if (type in otherExtensionMap) {
                        throw new RangeError("There can only be 1 -" + type + "- extension");
                    }
                    var extension = {
                        type: type,
                        value: parseOtherExtensionValue(chunks),
                    };
                    otherExtensionMap[extension.type] = extension;
                    extensions.push(extension);
                    break;
            }
        } while (chunks.length);
        return { extensions: extensions };
    }
    function parseUnicodeLocaleId(locale) {
        var chunks = locale.split(SEPARATOR);
        var lang = parseUnicodeLanguageId(chunks);
        return __assign({ lang: lang }, parseExtensions(chunks));
    }

    var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
    function emitUnicodeLanguageId(lang) {
        if (!lang) {
            return '';
        }
        return __spreadArrays([lang.lang, lang.script, lang.region], (lang.variants || [])).filter(Boolean)
            .join('-');
    }
    function emitUnicodeLocaleId(_a) {
        var lang = _a.lang, extensions = _a.extensions;
        var chunks = [emitUnicodeLanguageId(lang)];
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
            var ext = extensions_1[_i];
            chunks.push(ext.type);
            switch (ext.type) {
                case 'u':
                    chunks.push.apply(chunks, __spreadArrays(ext.attributes, ext.keywords.reduce(function (all, kv) { return all.concat(kv); }, [])));
                    break;
                case 't':
                    chunks.push.apply(chunks, __spreadArrays([emitUnicodeLanguageId(ext.lang)], ext.fields.reduce(function (all, kv) { return all.concat(kv); }, [])));
                    break;
                default:
                    chunks.push(ext.value);
                    break;
            }
        }
        return chunks.filter(Boolean).join('-');
    }

    /* @generated */
    // prettier-ignore  
    var languageAlias = { "aa-SAAHO": "ssy", "aam": "aas", "aar": "aa", "abk": "ab", "adp": "dz", "afr": "af", "aju": "jrb", "aka": "ak", "alb": "sq", "als": "sq", "amh": "am", "ara": "ar", "arb": "ar", "arg": "an", "arm": "hy", "art-lojban": "jbo", "asd": "snz", "asm": "as", "aue": "ktz", "ava": "av", "ave": "ae", "aym": "ay", "ayr": "ay", "ayx": "nun", "az-AZ": "az-Latn-AZ", "aze": "az", "azj": "az", "bak": "ba", "bam": "bm", "baq": "eu", "bcc": "bal", "bcl": "bik", "bel": "be", "ben": "bn", "bgm": "bcg", "bh": "bho", "bih": "bho", "bis": "bi", "bjd": "drl", "bod": "bo", "bos": "bs", "bre": "br", "bs-BA": "bs-Latn-BA", "bul": "bg", "bur": "my", "bxk": "luy", "bxr": "bua", "cat": "ca", "ccq": "rki", "cel-gaulish": "xtg-x-cel-gaulish", "ces": "cs", "cha": "ch", "che": "ce", "chi": "zh", "chu": "cu", "chv": "cv", "cjr": "mom", "cka": "cmr", "cld": "syr", "cmk": "xch", "cmn": "zh", "cnr": "sr-ME", "cor": "kw", "cos": "co", "coy": "pij", "cqu": "quh", "cre": "cr", "cwd": "cr", "cym": "cy", "cze": "cs", "dan": "da", "deu": "de", "dgo": "doi", "dhd": "mwr", "dik": "din", "diq": "zza", "dit": "dif", "div": "dv", "drh": "mn", "drw": "fa-af", "dut": "nl", "dzo": "dz", "ekk": "et", "ell": "el", "emk": "man", "eng": "en", "epo": "eo", "esk": "ik", "est": "et", "eus": "eu", "ewe": "ee", "fao": "fo", "fas": "fa", "fat": "ak", "fij": "fj", "fin": "fi", "fra": "fr", "fre": "fr", "fry": "fy", "fuc": "ff", "ful": "ff", "gav": "dev", "gaz": "om", "gbo": "grb", "geo": "ka", "ger": "de", "gfx": "vaj", "ggn": "gvr", "gla": "gd", "gle": "ga", "glg": "gl", "glv": "gv", "gno": "gon", "gre": "el", "grn": "gn", "gti": "nyc", "gug": "gn", "guj": "gu", "guv": "duz", "gya": "gba", "ha-Latn-GH": "ha-GH", "ha-Latn-NE": "ha-NE", "ha-Latn-NG": "ha-NG", "hat": "ht", "hau": "ha", "hbs": "sr-Latn", "hdn": "hai", "hea": "hmn", "heb": "he", "her": "hz", "him": "srx", "hin": "hi", "hmo": "ho", "hrr": "jal", "hrv": "hr", "hun": "hu", "hye": "hy", "i-ami": "ami", "i-bnn": "bnn", "i-hak": "hak", "i-klingon": "tlh", "i-lux": "lb", "i-navajo": "nv", "i-pwn": "pwn", "i-tao": "tao", "i-tay": "tay", "i-tsu": "tsu", "i-default": "en-x-i-default", "i-enochian": "und-x-i-enochian", "i-mingo": "see-x-i-mingo", "ibi": "opa", "ibo": "ig", "ice": "is", "ido": "io", "iii": "ii", "ike": "iu", "iku": "iu", "ile": "ie", "ilw": "gal", "in": "id", "ina": "ia", "ind": "id", "ipk": "ik", "isl": "is", "ita": "it", "iw": "he", "jav": "jv", "jeg": "oyb", "ji": "yi", "jpn": "ja", "jw": "jv", "kal": "kl", "kan": "kn", "kas": "ks", "kat": "ka", "kau": "kr", "kaz": "kk", "kgc": "tdf", "kgh": "kml", "khk": "mn", "khm": "km", "kik": "ki", "kin": "rw", "kir": "ky", "kk-Cyrl-KZ": "kk-KZ", "kmr": "ku", "knc": "kr", "kng": "kg", "knn": "kok", "koj": "kwv", "kom": "kv", "kon": "kg", "kor": "ko", "kpv": "kv", "krm": "bmf", "ks-Arab-IN": "ks-IN", "ktr": "dtp", "kua": "kj", "kur": "ku", "kvs": "gdj", "kwq": "yam", "kxe": "tvd", "ky-Cyrl-KG": "ky-KG", "kzj": "dtp", "kzt": "dtp", "lao": "lo", "lat": "la", "lav": "lv", "lbk": "bnc", "lii": "raq", "lim": "li", "lin": "ln", "lit": "lt", "llo": "ngt", "lmm": "rmx", "ltz": "lb", "lub": "lu", "lug": "lg", "lvs": "lv", "mac": "mk", "mah": "mh", "mal": "ml", "mao": "mi", "mar": "mr", "may": "ms", "meg": "cir", "mhr": "chm", "mkd": "mk", "mlg": "mg", "mlt": "mt", "mn-Cyrl-MN": "mn-MN", "mnk": "man", "mo": "ro", "mol": "ro", "mon": "mn", "mri": "mi", "ms-Latn-BN": "ms-BN", "ms-Latn-MY": "ms-MY", "ms-Latn-SG": "ms-SG", "msa": "ms", "mst": "mry", "mup": "raj", "mwj": "vaj", "mya": "my", "myd": "aog", "myt": "mry", "nad": "xny", "nau": "na", "nav": "nv", "nbl": "nr", "ncp": "kdz", "nde": "nd", "ndo": "ng", "nep": "ne", "nld": "nl", "nno": "nn", "nns": "nbr", "nnx": "ngv", "no": "nb", "no-bok": "nb", "no-BOKMAL": "nb", "no-nyn": "nn", "no-NYNORSK": "nn", "nob": "nb", "nor": "nb", "npi": "ne", "nts": "pij", "nya": "ny", "oci": "oc", "ojg": "oj", "oji": "oj", "ori": "or", "orm": "om", "ory": "or", "oss": "os", "oun": "vaj", "pa-IN": "pa-Guru-IN", "pa-PK": "pa-Arab-PK", "pan": "pa", "pbu": "ps", "pcr": "adx", "per": "fa", "pes": "fa", "pli": "pi", "plt": "mg", "pmc": "huw", "pmu": "phr", "pnb": "lah", "pol": "pl", "por": "pt", "ppa": "bfy", "ppr": "lcq", "prs": "fa-AF", "pry": "prt", "pus": "ps", "puz": "pub", "que": "qu", "quz": "qu", "rmy": "rom", "roh": "rm", "ron": "ro", "rum": "ro", "run": "rn", "rus": "ru", "sag": "sg", "san": "sa", "sca": "hle", "scc": "sr", "scr": "hr", "sgn-BE-FR": "sfb", "sgn-BE-NL": "vgt", "sgn-CH-DE": "sgg", "sh": "sr-Latn", "shi-MA": "shi-Tfng-MA", "sin": "si", "skk": "oyb", "slk": "sk", "slo": "sk", "slv": "sl", "sme": "se", "smo": "sm", "sna": "sn", "snd": "sd", "som": "so", "sot": "st", "spa": "es", "spy": "kln", "sqi": "sq", "sr-BA": "sr-Cyrl-BA", "sr-ME": "sr-Latn-ME", "sr-RS": "sr-Cyrl-RS", "sr-XK": "sr-Cyrl-XK", "src": "sc", "srd": "sc", "srp": "sr", "ssw": "ss", "sun": "su", "swa": "sw", "swc": "sw-CD", "swe": "sv", "swh": "sw", "tah": "ty", "tam": "ta", "tat": "tt", "tdu": "dtp", "tel": "te", "tgk": "tg", "tgl": "fil", "tha": "th", "thc": "tpo", "thx": "oyb", "tib": "bo", "tie": "ras", "tir": "ti", "tkk": "twm", "tl": "fil", "tlw": "weo", "tmp": "tyj", "tne": "kak", "tnf": "fa-af", "ton": "to", "tsf": "taj", "tsn": "tn", "tso": "ts", "ttq": "tmh", "tuk": "tk", "tur": "tr", "tw": "ak", "twi": "ak", "tzm-Latn-MA": "tzm-MA", "ug-Arab-CN": "ug-CN", "uig": "ug", "ukr": "uk", "umu": "del", "uok": "ema", "urd": "ur", "uz-AF": "uz-Arab-AF", "uz-UZ": "uz-Latn-UZ", "uzb": "uz", "uzn": "uz", "vai-LR": "vai-Vaii-LR", "ven": "ve", "vie": "vi", "vol": "vo", "wel": "cy", "wln": "wa", "wol": "wo", "xba": "cax", "xho": "xh", "xia": "acn", "xkh": "waw", "xpe": "kpe", "xsj": "suj", "xsl": "den", "ybd": "rki", "ydd": "yi", "yid": "yi", "yma": "lrr", "ymt": "mtm", "yor": "yo", "yos": "zom", "yue-CN": "yue-Hans-CN", "yue-HK": "yue-Hant-HK", "yuu": "yug", "zai": "zap", "zh-CN": "zh-Hans-CN", "zh-guoyu": "zh", "zh-hakka": "hak", "zh-HK": "zh-Hant-HK", "zh-min-nan": "nan", "zh-MO": "zh-Hant-MO", "zh-SG": "zh-Hans-SG", "zh-TW": "zh-Hant-TW", "zh-xiang": "hsn", "zh-min": "nan-x-zh-min", "zha": "za", "zho": "zh", "zsm": "ms", "zul": "zu", "zyb": "za" };
    var territoryAlias = { "100": "BG", "104": "MM", "108": "BI", "112": "BY", "116": "KH", "120": "CM", "124": "CA", "132": "CV", "136": "KY", "140": "CF", "144": "LK", "148": "TD", "152": "CL", "156": "CN", "158": "TW", "162": "CX", "166": "CC", "170": "CO", "172": "RU AM AZ BY GE KG KZ MD TJ TM UA UZ", "174": "KM", "175": "YT", "178": "CG", "180": "CD", "184": "CK", "188": "CR", "191": "HR", "192": "CU", "196": "CY", "200": "CZ SK", "203": "CZ", "204": "BJ", "208": "DK", "212": "DM", "214": "DO", "218": "EC", "222": "SV", "226": "GQ", "230": "ET", "231": "ET", "232": "ER", "233": "EE", "234": "FO", "238": "FK", "239": "GS", "242": "FJ", "246": "FI", "248": "AX", "249": "FR", "250": "FR", "254": "GF", "258": "PF", "260": "TF", "262": "DJ", "266": "GA", "268": "GE", "270": "GM", "275": "PS", "276": "DE", "278": "DE", "280": "DE", "288": "GH", "292": "GI", "296": "KI", "300": "GR", "304": "GL", "308": "GD", "312": "GP", "316": "GU", "320": "GT", "324": "GN", "328": "GY", "332": "HT", "334": "HM", "336": "VA", "340": "HN", "344": "HK", "348": "HU", "352": "IS", "356": "IN", "360": "ID", "364": "IR", "368": "IQ", "372": "IE", "376": "IL", "380": "IT", "384": "CI", "388": "JM", "392": "JP", "398": "KZ", "400": "JO", "404": "KE", "408": "KP", "410": "KR", "414": "KW", "417": "KG", "418": "LA", "422": "LB", "426": "LS", "428": "LV", "430": "LR", "434": "LY", "438": "LI", "440": "LT", "442": "LU", "446": "MO", "450": "MG", "454": "MW", "458": "MY", "462": "MV", "466": "ML", "470": "MT", "474": "MQ", "478": "MR", "480": "MU", "484": "MX", "492": "MC", "496": "MN", "498": "MD", "499": "ME", "500": "MS", "504": "MA", "508": "MZ", "512": "OM", "516": "NA", "520": "NR", "524": "NP", "528": "NL", "530": "CW SX BQ", "531": "CW", "532": "CW SX BQ", "533": "AW", "534": "SX", "535": "BQ", "536": "SA IQ", "540": "NC", "548": "VU", "554": "NZ", "558": "NI", "562": "NE", "566": "NG", "570": "NU", "574": "NF", "578": "NO", "580": "MP", "581": "UM", "582": "FM MH MP PW", "583": "FM", "584": "MH", "585": "PW", "586": "PK", "591": "PA", "598": "PG", "600": "PY", "604": "PE", "608": "PH", "612": "PN", "616": "PL", "620": "PT", "624": "GW", "626": "TL", "630": "PR", "634": "QA", "638": "RE", "642": "RO", "643": "RU", "646": "RW", "652": "BL", "654": "SH", "659": "KN", "660": "AI", "662": "LC", "663": "MF", "666": "PM", "670": "VC", "674": "SM", "678": "ST", "682": "SA", "686": "SN", "688": "RS", "690": "SC", "694": "SL", "702": "SG", "703": "SK", "704": "VN", "705": "SI", "706": "SO", "710": "ZA", "716": "ZW", "720": "YE", "724": "ES", "728": "SS", "729": "SD", "732": "EH", "736": "SD", "740": "SR", "744": "SJ", "748": "SZ", "752": "SE", "756": "CH", "760": "SY", "762": "TJ", "764": "TH", "768": "TG", "772": "TK", "776": "TO", "780": "TT", "784": "AE", "788": "TN", "792": "TR", "795": "TM", "796": "TC", "798": "TV", "800": "UG", "804": "UA", "807": "MK", "810": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ", "818": "EG", "826": "GB", "830": "JE GG", "831": "GG", "832": "JE", "833": "IM", "834": "TZ", "840": "US", "850": "VI", "854": "BF", "858": "UY", "860": "UZ", "862": "VE", "876": "WF", "882": "WS", "886": "YE", "887": "YE", "890": "RS ME SI HR MK BA", "891": "RS ME", "894": "ZM", "958": "AA", "959": "QM", "960": "QN", "962": "QP", "963": "QQ", "964": "QR", "965": "QS", "966": "QT", "967": "EU", "968": "QV", "969": "QW", "970": "QX", "971": "QY", "972": "QZ", "973": "XA", "974": "XB", "975": "XC", "976": "XD", "977": "XE", "978": "XF", "979": "XG", "980": "XH", "981": "XI", "982": "XJ", "983": "XK", "984": "XL", "985": "XM", "986": "XN", "987": "XO", "988": "XP", "989": "XQ", "990": "XR", "991": "XS", "992": "XT", "993": "XU", "994": "XV", "995": "XW", "996": "XX", "997": "XY", "998": "XZ", "999": "ZZ", "004": "AF", "008": "AL", "010": "AQ", "012": "DZ", "016": "AS", "020": "AD", "024": "AO", "028": "AG", "031": "AZ", "032": "AR", "036": "AU", "040": "AT", "044": "BS", "048": "BH", "050": "BD", "051": "AM", "052": "BB", "056": "BE", "060": "BM", "062": "034 143", "064": "BT", "068": "BO", "070": "BA", "072": "BW", "074": "BV", "076": "BR", "084": "BZ", "086": "IO", "090": "SB", "092": "VG", "096": "BN", "AAA": "AA", "ABW": "AW", "AFG": "AF", "AGO": "AO", "AIA": "AI", "ALA": "AX", "ALB": "AL", "AN": "CW SX BQ", "AND": "AD", "ANT": "CW SX BQ", "ARE": "AE", "ARG": "AR", "ARM": "AM", "ASC": "AC", "ASM": "AS", "ATA": "AQ", "ATF": "TF", "ATG": "AG", "AUS": "AU", "AUT": "AT", "AZE": "AZ", "BDI": "BI", "BEL": "BE", "BEN": "BJ", "BES": "BQ", "BFA": "BF", "BGD": "BD", "BGR": "BG", "BHR": "BH", "BHS": "BS", "BIH": "BA", "BLM": "BL", "BLR": "BY", "BLZ": "BZ", "BMU": "BM", "BOL": "BO", "BRA": "BR", "BRB": "BB", "BRN": "BN", "BTN": "BT", "BU": "MM", "BUR": "MM", "BVT": "BV", "BWA": "BW", "CAF": "CF", "CAN": "CA", "CCK": "CC", "CHE": "CH", "CHL": "CL", "CHN": "CN", "CIV": "CI", "CMR": "CM", "COD": "CD", "COG": "CG", "COK": "CK", "COL": "CO", "COM": "KM", "CPT": "CP", "CPV": "CV", "CRI": "CR", "CS": "RS ME", "CT": "KI", "CUB": "CU", "CUW": "CW", "CXR": "CX", "CYM": "KY", "CYP": "CY", "CZE": "CZ", "DD": "DE", "DDR": "DE", "DEU": "DE", "DGA": "DG", "DJI": "DJ", "DMA": "DM", "DNK": "DK", "DOM": "DO", "DY": "BJ", "DZA": "DZ", "ECU": "EC", "EGY": "EG", "ERI": "ER", "ESH": "EH", "ESP": "ES", "EST": "EE", "ETH": "ET", "FIN": "FI", "FJI": "FJ", "FLK": "FK", "FQ": "AQ TF", "FRA": "FR", "FRO": "FO", "FSM": "FM", "FX": "FR", "FXX": "FR", "GAB": "GA", "GBR": "GB", "GEO": "GE", "GGY": "GG", "GHA": "GH", "GIB": "GI", "GIN": "GN", "GLP": "GP", "GMB": "GM", "GNB": "GW", "GNQ": "GQ", "GRC": "GR", "GRD": "GD", "GRL": "GL", "GTM": "GT", "GUF": "GF", "GUM": "GU", "GUY": "GY", "HKG": "HK", "HMD": "HM", "HND": "HN", "HRV": "HR", "HTI": "HT", "HUN": "HU", "HV": "BF", "IDN": "ID", "IMN": "IM", "IND": "IN", "IOT": "IO", "IRL": "IE", "IRN": "IR", "IRQ": "IQ", "ISL": "IS", "ISR": "IL", "ITA": "IT", "JAM": "JM", "JEY": "JE", "JOR": "JO", "JPN": "JP", "JT": "UM", "KAZ": "KZ", "KEN": "KE", "KGZ": "KG", "KHM": "KH", "KIR": "KI", "KNA": "KN", "KOR": "KR", "KWT": "KW", "LAO": "LA", "LBN": "LB", "LBR": "LR", "LBY": "LY", "LCA": "LC", "LIE": "LI", "LKA": "LK", "LSO": "LS", "LTU": "LT", "LUX": "LU", "LVA": "LV", "MAC": "MO", "MAF": "MF", "MAR": "MA", "MCO": "MC", "MDA": "MD", "MDG": "MG", "MDV": "MV", "MEX": "MX", "MHL": "MH", "MI": "UM", "MKD": "MK", "MLI": "ML", "MLT": "MT", "MMR": "MM", "MNE": "ME", "MNG": "MN", "MNP": "MP", "MOZ": "MZ", "MRT": "MR", "MSR": "MS", "MTQ": "MQ", "MUS": "MU", "MWI": "MW", "MYS": "MY", "MYT": "YT", "NAM": "NA", "NCL": "NC", "NER": "NE", "NFK": "NF", "NGA": "NG", "NH": "VU", "NIC": "NI", "NIU": "NU", "NLD": "NL", "NOR": "NO", "NPL": "NP", "NQ": "AQ", "NRU": "NR", "NT": "SA IQ", "NTZ": "SA IQ", "NZL": "NZ", "OMN": "OM", "PAK": "PK", "PAN": "PA", "PC": "FM MH MP PW", "PCN": "PN", "PER": "PE", "PHL": "PH", "PLW": "PW", "PNG": "PG", "POL": "PL", "PRI": "PR", "PRK": "KP", "PRT": "PT", "PRY": "PY", "PSE": "PS", "PU": "UM", "PYF": "PF", "PZ": "PA", "QAT": "QA", "QMM": "QM", "QNN": "QN", "QPP": "QP", "QQQ": "QQ", "QRR": "QR", "QSS": "QS", "QTT": "QT", "QU": "EU", "QUU": "EU", "QVV": "QV", "QWW": "QW", "QXX": "QX", "QYY": "QY", "QZZ": "QZ", "REU": "RE", "RH": "ZW", "ROU": "RO", "RUS": "RU", "RWA": "RW", "SAU": "SA", "SCG": "RS ME", "SDN": "SD", "SEN": "SN", "SGP": "SG", "SGS": "GS", "SHN": "SH", "SJM": "SJ", "SLB": "SB", "SLE": "SL", "SLV": "SV", "SMR": "SM", "SOM": "SO", "SPM": "PM", "SRB": "RS", "SSD": "SS", "STP": "ST", "SU": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ", "SUN": "RU AM AZ BY EE GE KZ KG LV LT MD TJ TM UA UZ", "SUR": "SR", "SVK": "SK", "SVN": "SI", "SWE": "SE", "SWZ": "SZ", "SXM": "SX", "SYC": "SC", "SYR": "SY", "TAA": "TA", "TCA": "TC", "TCD": "TD", "TGO": "TG", "THA": "TH", "TJK": "TJ", "TKL": "TK", "TKM": "TM", "TLS": "TL", "TMP": "TL", "TON": "TO", "TP": "TL", "TTO": "TT", "TUN": "TN", "TUR": "TR", "TUV": "TV", "TWN": "TW", "TZA": "TZ", "UGA": "UG", "UK": "GB", "UKR": "UA", "UMI": "UM", "URY": "UY", "USA": "US", "UZB": "UZ", "VAT": "VA", "VCT": "VC", "VD": "VN", "VEN": "VE", "VGB": "VG", "VIR": "VI", "VNM": "VN", "VUT": "VU", "WK": "UM", "WLF": "WF", "WSM": "WS", "XAA": "XA", "XBB": "XB", "XCC": "XC", "XDD": "XD", "XEE": "XE", "XFF": "XF", "XGG": "XG", "XHH": "XH", "XII": "XI", "XJJ": "XJ", "XKK": "XK", "XLL": "XL", "XMM": "XM", "XNN": "XN", "XOO": "XO", "XPP": "XP", "XQQ": "XQ", "XRR": "XR", "XSS": "XS", "XTT": "XT", "XUU": "XU", "XVV": "XV", "XWW": "XW", "XXX": "XX", "XYY": "XY", "XZZ": "XZ", "YD": "YE", "YEM": "YE", "YMD": "YE", "YU": "RS ME", "YUG": "RS ME", "ZAF": "ZA", "ZAR": "CD", "ZMB": "ZM", "ZR": "CD", "ZWE": "ZW", "ZZZ": "ZZ" };
    var scriptAlias = { "Qaai": "Zinh" };
    var variantAlias = { "AALAND": "AX", "arevela": "hy", "arevmda": "hyw", "heploc": "alalc97", "HEPLOC": "ALALC97", "POLYTONI": "POLYTON" };

    var supplemental = {
    	version: {
    		_unicodeVersion: "12.1.0",
    		_cldrVersion: "36"
    	},
    	likelySubtags: {
    		aa: "aa-Latn-ET",
    		aai: "aai-Latn-ZZ",
    		aak: "aak-Latn-ZZ",
    		aau: "aau-Latn-ZZ",
    		ab: "ab-Cyrl-GE",
    		abi: "abi-Latn-ZZ",
    		abq: "abq-Cyrl-ZZ",
    		abr: "abr-Latn-GH",
    		abt: "abt-Latn-ZZ",
    		aby: "aby-Latn-ZZ",
    		acd: "acd-Latn-ZZ",
    		ace: "ace-Latn-ID",
    		ach: "ach-Latn-UG",
    		ada: "ada-Latn-GH",
    		ade: "ade-Latn-ZZ",
    		adj: "adj-Latn-ZZ",
    		adp: "adp-Tibt-BT",
    		ady: "ady-Cyrl-RU",
    		adz: "adz-Latn-ZZ",
    		ae: "ae-Avst-IR",
    		aeb: "aeb-Arab-TN",
    		aey: "aey-Latn-ZZ",
    		af: "af-Latn-ZA",
    		agc: "agc-Latn-ZZ",
    		agd: "agd-Latn-ZZ",
    		agg: "agg-Latn-ZZ",
    		agm: "agm-Latn-ZZ",
    		ago: "ago-Latn-ZZ",
    		agq: "agq-Latn-CM",
    		aha: "aha-Latn-ZZ",
    		ahl: "ahl-Latn-ZZ",
    		aho: "aho-Ahom-IN",
    		ajg: "ajg-Latn-ZZ",
    		ak: "ak-Latn-GH",
    		akk: "akk-Xsux-IQ",
    		ala: "ala-Latn-ZZ",
    		ali: "ali-Latn-ZZ",
    		aln: "aln-Latn-XK",
    		alt: "alt-Cyrl-RU",
    		am: "am-Ethi-ET",
    		amm: "amm-Latn-ZZ",
    		amn: "amn-Latn-ZZ",
    		amo: "amo-Latn-NG",
    		amp: "amp-Latn-ZZ",
    		an: "an-Latn-ES",
    		anc: "anc-Latn-ZZ",
    		ank: "ank-Latn-ZZ",
    		ann: "ann-Latn-ZZ",
    		any: "any-Latn-ZZ",
    		aoj: "aoj-Latn-ZZ",
    		aom: "aom-Latn-ZZ",
    		aoz: "aoz-Latn-ID",
    		apc: "apc-Arab-ZZ",
    		apd: "apd-Arab-TG",
    		ape: "ape-Latn-ZZ",
    		apr: "apr-Latn-ZZ",
    		aps: "aps-Latn-ZZ",
    		apz: "apz-Latn-ZZ",
    		ar: "ar-Arab-EG",
    		arc: "arc-Armi-IR",
    		"arc-Nbat": "arc-Nbat-JO",
    		"arc-Palm": "arc-Palm-SY",
    		arh: "arh-Latn-ZZ",
    		arn: "arn-Latn-CL",
    		aro: "aro-Latn-BO",
    		arq: "arq-Arab-DZ",
    		ars: "ars-Arab-SA",
    		ary: "ary-Arab-MA",
    		arz: "arz-Arab-EG",
    		as: "as-Beng-IN",
    		asa: "asa-Latn-TZ",
    		ase: "ase-Sgnw-US",
    		asg: "asg-Latn-ZZ",
    		aso: "aso-Latn-ZZ",
    		ast: "ast-Latn-ES",
    		ata: "ata-Latn-ZZ",
    		atg: "atg-Latn-ZZ",
    		atj: "atj-Latn-CA",
    		auy: "auy-Latn-ZZ",
    		av: "av-Cyrl-RU",
    		avl: "avl-Arab-ZZ",
    		avn: "avn-Latn-ZZ",
    		avt: "avt-Latn-ZZ",
    		avu: "avu-Latn-ZZ",
    		awa: "awa-Deva-IN",
    		awb: "awb-Latn-ZZ",
    		awo: "awo-Latn-ZZ",
    		awx: "awx-Latn-ZZ",
    		ay: "ay-Latn-BO",
    		ayb: "ayb-Latn-ZZ",
    		az: "az-Latn-AZ",
    		"az-Arab": "az-Arab-IR",
    		"az-IQ": "az-Arab-IQ",
    		"az-IR": "az-Arab-IR",
    		"az-RU": "az-Cyrl-RU",
    		ba: "ba-Cyrl-RU",
    		bal: "bal-Arab-PK",
    		ban: "ban-Latn-ID",
    		bap: "bap-Deva-NP",
    		bar: "bar-Latn-AT",
    		bas: "bas-Latn-CM",
    		bav: "bav-Latn-ZZ",
    		bax: "bax-Bamu-CM",
    		bba: "bba-Latn-ZZ",
    		bbb: "bbb-Latn-ZZ",
    		bbc: "bbc-Latn-ID",
    		bbd: "bbd-Latn-ZZ",
    		bbj: "bbj-Latn-CM",
    		bbp: "bbp-Latn-ZZ",
    		bbr: "bbr-Latn-ZZ",
    		bcf: "bcf-Latn-ZZ",
    		bch: "bch-Latn-ZZ",
    		bci: "bci-Latn-CI",
    		bcm: "bcm-Latn-ZZ",
    		bcn: "bcn-Latn-ZZ",
    		bco: "bco-Latn-ZZ",
    		bcq: "bcq-Ethi-ZZ",
    		bcu: "bcu-Latn-ZZ",
    		bdd: "bdd-Latn-ZZ",
    		be: "be-Cyrl-BY",
    		bef: "bef-Latn-ZZ",
    		beh: "beh-Latn-ZZ",
    		bej: "bej-Arab-SD",
    		bem: "bem-Latn-ZM",
    		bet: "bet-Latn-ZZ",
    		bew: "bew-Latn-ID",
    		bex: "bex-Latn-ZZ",
    		bez: "bez-Latn-TZ",
    		bfd: "bfd-Latn-CM",
    		bfq: "bfq-Taml-IN",
    		bft: "bft-Arab-PK",
    		bfy: "bfy-Deva-IN",
    		bg: "bg-Cyrl-BG",
    		bgc: "bgc-Deva-IN",
    		bgn: "bgn-Arab-PK",
    		bgx: "bgx-Grek-TR",
    		bhb: "bhb-Deva-IN",
    		bhg: "bhg-Latn-ZZ",
    		bhi: "bhi-Deva-IN",
    		bhl: "bhl-Latn-ZZ",
    		bho: "bho-Deva-IN",
    		bhy: "bhy-Latn-ZZ",
    		bi: "bi-Latn-VU",
    		bib: "bib-Latn-ZZ",
    		big: "big-Latn-ZZ",
    		bik: "bik-Latn-PH",
    		bim: "bim-Latn-ZZ",
    		bin: "bin-Latn-NG",
    		bio: "bio-Latn-ZZ",
    		biq: "biq-Latn-ZZ",
    		bjh: "bjh-Latn-ZZ",
    		bji: "bji-Ethi-ZZ",
    		bjj: "bjj-Deva-IN",
    		bjn: "bjn-Latn-ID",
    		bjo: "bjo-Latn-ZZ",
    		bjr: "bjr-Latn-ZZ",
    		bjt: "bjt-Latn-SN",
    		bjz: "bjz-Latn-ZZ",
    		bkc: "bkc-Latn-ZZ",
    		bkm: "bkm-Latn-CM",
    		bkq: "bkq-Latn-ZZ",
    		bku: "bku-Latn-PH",
    		bkv: "bkv-Latn-ZZ",
    		blt: "blt-Tavt-VN",
    		bm: "bm-Latn-ML",
    		bmh: "bmh-Latn-ZZ",
    		bmk: "bmk-Latn-ZZ",
    		bmq: "bmq-Latn-ML",
    		bmu: "bmu-Latn-ZZ",
    		bn: "bn-Beng-BD",
    		bng: "bng-Latn-ZZ",
    		bnm: "bnm-Latn-ZZ",
    		bnp: "bnp-Latn-ZZ",
    		bo: "bo-Tibt-CN",
    		boj: "boj-Latn-ZZ",
    		bom: "bom-Latn-ZZ",
    		bon: "bon-Latn-ZZ",
    		bpy: "bpy-Beng-IN",
    		bqc: "bqc-Latn-ZZ",
    		bqi: "bqi-Arab-IR",
    		bqp: "bqp-Latn-ZZ",
    		bqv: "bqv-Latn-CI",
    		br: "br-Latn-FR",
    		bra: "bra-Deva-IN",
    		brh: "brh-Arab-PK",
    		brx: "brx-Deva-IN",
    		brz: "brz-Latn-ZZ",
    		bs: "bs-Latn-BA",
    		bsj: "bsj-Latn-ZZ",
    		bsq: "bsq-Bass-LR",
    		bss: "bss-Latn-CM",
    		bst: "bst-Ethi-ZZ",
    		bto: "bto-Latn-PH",
    		btt: "btt-Latn-ZZ",
    		btv: "btv-Deva-PK",
    		bua: "bua-Cyrl-RU",
    		buc: "buc-Latn-YT",
    		bud: "bud-Latn-ZZ",
    		bug: "bug-Latn-ID",
    		buk: "buk-Latn-ZZ",
    		bum: "bum-Latn-CM",
    		buo: "buo-Latn-ZZ",
    		bus: "bus-Latn-ZZ",
    		buu: "buu-Latn-ZZ",
    		bvb: "bvb-Latn-GQ",
    		bwd: "bwd-Latn-ZZ",
    		bwr: "bwr-Latn-ZZ",
    		bxh: "bxh-Latn-ZZ",
    		bye: "bye-Latn-ZZ",
    		byn: "byn-Ethi-ER",
    		byr: "byr-Latn-ZZ",
    		bys: "bys-Latn-ZZ",
    		byv: "byv-Latn-CM",
    		byx: "byx-Latn-ZZ",
    		bza: "bza-Latn-ZZ",
    		bze: "bze-Latn-ML",
    		bzf: "bzf-Latn-ZZ",
    		bzh: "bzh-Latn-ZZ",
    		bzw: "bzw-Latn-ZZ",
    		ca: "ca-Latn-ES",
    		can: "can-Latn-ZZ",
    		cbj: "cbj-Latn-ZZ",
    		cch: "cch-Latn-NG",
    		ccp: "ccp-Cakm-BD",
    		ce: "ce-Cyrl-RU",
    		ceb: "ceb-Latn-PH",
    		cfa: "cfa-Latn-ZZ",
    		cgg: "cgg-Latn-UG",
    		ch: "ch-Latn-GU",
    		chk: "chk-Latn-FM",
    		chm: "chm-Cyrl-RU",
    		cho: "cho-Latn-US",
    		chp: "chp-Latn-CA",
    		chr: "chr-Cher-US",
    		cic: "cic-Latn-US",
    		cja: "cja-Arab-KH",
    		cjm: "cjm-Cham-VN",
    		cjv: "cjv-Latn-ZZ",
    		ckb: "ckb-Arab-IQ",
    		ckl: "ckl-Latn-ZZ",
    		cko: "cko-Latn-ZZ",
    		cky: "cky-Latn-ZZ",
    		cla: "cla-Latn-ZZ",
    		cme: "cme-Latn-ZZ",
    		cmg: "cmg-Soyo-MN",
    		co: "co-Latn-FR",
    		cop: "cop-Copt-EG",
    		cps: "cps-Latn-PH",
    		cr: "cr-Cans-CA",
    		crh: "crh-Cyrl-UA",
    		crj: "crj-Cans-CA",
    		crk: "crk-Cans-CA",
    		crl: "crl-Cans-CA",
    		crm: "crm-Cans-CA",
    		crs: "crs-Latn-SC",
    		cs: "cs-Latn-CZ",
    		csb: "csb-Latn-PL",
    		csw: "csw-Cans-CA",
    		ctd: "ctd-Pauc-MM",
    		cu: "cu-Cyrl-RU",
    		"cu-Glag": "cu-Glag-BG",
    		cv: "cv-Cyrl-RU",
    		cy: "cy-Latn-GB",
    		da: "da-Latn-DK",
    		dad: "dad-Latn-ZZ",
    		daf: "daf-Latn-ZZ",
    		dag: "dag-Latn-ZZ",
    		dah: "dah-Latn-ZZ",
    		dak: "dak-Latn-US",
    		dar: "dar-Cyrl-RU",
    		dav: "dav-Latn-KE",
    		dbd: "dbd-Latn-ZZ",
    		dbq: "dbq-Latn-ZZ",
    		dcc: "dcc-Arab-IN",
    		ddn: "ddn-Latn-ZZ",
    		de: "de-Latn-DE",
    		ded: "ded-Latn-ZZ",
    		den: "den-Latn-CA",
    		dga: "dga-Latn-ZZ",
    		dgh: "dgh-Latn-ZZ",
    		dgi: "dgi-Latn-ZZ",
    		dgl: "dgl-Arab-ZZ",
    		dgr: "dgr-Latn-CA",
    		dgz: "dgz-Latn-ZZ",
    		dia: "dia-Latn-ZZ",
    		dje: "dje-Latn-NE",
    		dnj: "dnj-Latn-CI",
    		dob: "dob-Latn-ZZ",
    		doi: "doi-Arab-IN",
    		dop: "dop-Latn-ZZ",
    		dow: "dow-Latn-ZZ",
    		drh: "drh-Mong-CN",
    		dri: "dri-Latn-ZZ",
    		drs: "drs-Ethi-ZZ",
    		dsb: "dsb-Latn-DE",
    		dtm: "dtm-Latn-ML",
    		dtp: "dtp-Latn-MY",
    		dts: "dts-Latn-ZZ",
    		dty: "dty-Deva-NP",
    		dua: "dua-Latn-CM",
    		duc: "duc-Latn-ZZ",
    		dud: "dud-Latn-ZZ",
    		dug: "dug-Latn-ZZ",
    		dv: "dv-Thaa-MV",
    		dva: "dva-Latn-ZZ",
    		dww: "dww-Latn-ZZ",
    		dyo: "dyo-Latn-SN",
    		dyu: "dyu-Latn-BF",
    		dz: "dz-Tibt-BT",
    		dzg: "dzg-Latn-ZZ",
    		ebu: "ebu-Latn-KE",
    		ee: "ee-Latn-GH",
    		efi: "efi-Latn-NG",
    		egl: "egl-Latn-IT",
    		egy: "egy-Egyp-EG",
    		eka: "eka-Latn-ZZ",
    		eky: "eky-Kali-MM",
    		el: "el-Grek-GR",
    		ema: "ema-Latn-ZZ",
    		emi: "emi-Latn-ZZ",
    		en: "en-Latn-US",
    		"en-Shaw": "en-Shaw-GB",
    		enn: "enn-Latn-ZZ",
    		enq: "enq-Latn-ZZ",
    		eo: "eo-Latn-001",
    		eri: "eri-Latn-ZZ",
    		es: "es-Latn-ES",
    		esg: "esg-Gonm-IN",
    		esu: "esu-Latn-US",
    		et: "et-Latn-EE",
    		etr: "etr-Latn-ZZ",
    		ett: "ett-Ital-IT",
    		etu: "etu-Latn-ZZ",
    		etx: "etx-Latn-ZZ",
    		eu: "eu-Latn-ES",
    		ewo: "ewo-Latn-CM",
    		ext: "ext-Latn-ES",
    		fa: "fa-Arab-IR",
    		faa: "faa-Latn-ZZ",
    		fab: "fab-Latn-ZZ",
    		fag: "fag-Latn-ZZ",
    		fai: "fai-Latn-ZZ",
    		fan: "fan-Latn-GQ",
    		ff: "ff-Latn-SN",
    		"ff-Adlm": "ff-Adlm-GN",
    		ffi: "ffi-Latn-ZZ",
    		ffm: "ffm-Latn-ML",
    		fi: "fi-Latn-FI",
    		fia: "fia-Arab-SD",
    		fil: "fil-Latn-PH",
    		fit: "fit-Latn-SE",
    		fj: "fj-Latn-FJ",
    		flr: "flr-Latn-ZZ",
    		fmp: "fmp-Latn-ZZ",
    		fo: "fo-Latn-FO",
    		fod: "fod-Latn-ZZ",
    		fon: "fon-Latn-BJ",
    		"for": "for-Latn-ZZ",
    		fpe: "fpe-Latn-ZZ",
    		fqs: "fqs-Latn-ZZ",
    		fr: "fr-Latn-FR",
    		frc: "frc-Latn-US",
    		frp: "frp-Latn-FR",
    		frr: "frr-Latn-DE",
    		frs: "frs-Latn-DE",
    		fub: "fub-Arab-CM",
    		fud: "fud-Latn-WF",
    		fue: "fue-Latn-ZZ",
    		fuf: "fuf-Latn-GN",
    		fuh: "fuh-Latn-ZZ",
    		fuq: "fuq-Latn-NE",
    		fur: "fur-Latn-IT",
    		fuv: "fuv-Latn-NG",
    		fuy: "fuy-Latn-ZZ",
    		fvr: "fvr-Latn-SD",
    		fy: "fy-Latn-NL",
    		ga: "ga-Latn-IE",
    		gaa: "gaa-Latn-GH",
    		gaf: "gaf-Latn-ZZ",
    		gag: "gag-Latn-MD",
    		gah: "gah-Latn-ZZ",
    		gaj: "gaj-Latn-ZZ",
    		gam: "gam-Latn-ZZ",
    		gan: "gan-Hans-CN",
    		gaw: "gaw-Latn-ZZ",
    		gay: "gay-Latn-ID",
    		gba: "gba-Latn-ZZ",
    		gbf: "gbf-Latn-ZZ",
    		gbm: "gbm-Deva-IN",
    		gby: "gby-Latn-ZZ",
    		gbz: "gbz-Arab-IR",
    		gcr: "gcr-Latn-GF",
    		gd: "gd-Latn-GB",
    		gde: "gde-Latn-ZZ",
    		gdn: "gdn-Latn-ZZ",
    		gdr: "gdr-Latn-ZZ",
    		geb: "geb-Latn-ZZ",
    		gej: "gej-Latn-ZZ",
    		gel: "gel-Latn-ZZ",
    		gez: "gez-Ethi-ET",
    		gfk: "gfk-Latn-ZZ",
    		ggn: "ggn-Deva-NP",
    		ghs: "ghs-Latn-ZZ",
    		gil: "gil-Latn-KI",
    		gim: "gim-Latn-ZZ",
    		gjk: "gjk-Arab-PK",
    		gjn: "gjn-Latn-ZZ",
    		gju: "gju-Arab-PK",
    		gkn: "gkn-Latn-ZZ",
    		gkp: "gkp-Latn-ZZ",
    		gl: "gl-Latn-ES",
    		glk: "glk-Arab-IR",
    		gmm: "gmm-Latn-ZZ",
    		gmv: "gmv-Ethi-ZZ",
    		gn: "gn-Latn-PY",
    		gnd: "gnd-Latn-ZZ",
    		gng: "gng-Latn-ZZ",
    		god: "god-Latn-ZZ",
    		gof: "gof-Ethi-ZZ",
    		goi: "goi-Latn-ZZ",
    		gom: "gom-Deva-IN",
    		gon: "gon-Telu-IN",
    		gor: "gor-Latn-ID",
    		gos: "gos-Latn-NL",
    		got: "got-Goth-UA",
    		grb: "grb-Latn-ZZ",
    		grc: "grc-Cprt-CY",
    		"grc-Linb": "grc-Linb-GR",
    		grt: "grt-Beng-IN",
    		grw: "grw-Latn-ZZ",
    		gsw: "gsw-Latn-CH",
    		gu: "gu-Gujr-IN",
    		gub: "gub-Latn-BR",
    		guc: "guc-Latn-CO",
    		gud: "gud-Latn-ZZ",
    		gur: "gur-Latn-GH",
    		guw: "guw-Latn-ZZ",
    		gux: "gux-Latn-ZZ",
    		guz: "guz-Latn-KE",
    		gv: "gv-Latn-IM",
    		gvf: "gvf-Latn-ZZ",
    		gvr: "gvr-Deva-NP",
    		gvs: "gvs-Latn-ZZ",
    		gwc: "gwc-Arab-ZZ",
    		gwi: "gwi-Latn-CA",
    		gwt: "gwt-Arab-ZZ",
    		gyi: "gyi-Latn-ZZ",
    		ha: "ha-Latn-NG",
    		"ha-CM": "ha-Arab-CM",
    		"ha-SD": "ha-Arab-SD",
    		hag: "hag-Latn-ZZ",
    		hak: "hak-Hans-CN",
    		ham: "ham-Latn-ZZ",
    		haw: "haw-Latn-US",
    		haz: "haz-Arab-AF",
    		hbb: "hbb-Latn-ZZ",
    		hdy: "hdy-Ethi-ZZ",
    		he: "he-Hebr-IL",
    		hhy: "hhy-Latn-ZZ",
    		hi: "hi-Deva-IN",
    		hia: "hia-Latn-ZZ",
    		hif: "hif-Latn-FJ",
    		hig: "hig-Latn-ZZ",
    		hih: "hih-Latn-ZZ",
    		hil: "hil-Latn-PH",
    		hla: "hla-Latn-ZZ",
    		hlu: "hlu-Hluw-TR",
    		hmd: "hmd-Plrd-CN",
    		hmt: "hmt-Latn-ZZ",
    		hnd: "hnd-Arab-PK",
    		hne: "hne-Deva-IN",
    		hnj: "hnj-Hmng-LA",
    		hnn: "hnn-Latn-PH",
    		hno: "hno-Arab-PK",
    		ho: "ho-Latn-PG",
    		hoc: "hoc-Deva-IN",
    		hoj: "hoj-Deva-IN",
    		hot: "hot-Latn-ZZ",
    		hr: "hr-Latn-HR",
    		hsb: "hsb-Latn-DE",
    		hsn: "hsn-Hans-CN",
    		ht: "ht-Latn-HT",
    		hu: "hu-Latn-HU",
    		hui: "hui-Latn-ZZ",
    		hy: "hy-Armn-AM",
    		hz: "hz-Latn-NA",
    		ia: "ia-Latn-001",
    		ian: "ian-Latn-ZZ",
    		iar: "iar-Latn-ZZ",
    		iba: "iba-Latn-MY",
    		ibb: "ibb-Latn-NG",
    		iby: "iby-Latn-ZZ",
    		ica: "ica-Latn-ZZ",
    		ich: "ich-Latn-ZZ",
    		id: "id-Latn-ID",
    		idd: "idd-Latn-ZZ",
    		idi: "idi-Latn-ZZ",
    		idu: "idu-Latn-ZZ",
    		ife: "ife-Latn-TG",
    		ig: "ig-Latn-NG",
    		igb: "igb-Latn-ZZ",
    		ige: "ige-Latn-ZZ",
    		ii: "ii-Yiii-CN",
    		ijj: "ijj-Latn-ZZ",
    		ik: "ik-Latn-US",
    		ikk: "ikk-Latn-ZZ",
    		ikt: "ikt-Latn-CA",
    		ikw: "ikw-Latn-ZZ",
    		ikx: "ikx-Latn-ZZ",
    		ilo: "ilo-Latn-PH",
    		imo: "imo-Latn-ZZ",
    		"in": "in-Latn-ID",
    		inh: "inh-Cyrl-RU",
    		io: "io-Latn-001",
    		iou: "iou-Latn-ZZ",
    		iri: "iri-Latn-ZZ",
    		is: "is-Latn-IS",
    		it: "it-Latn-IT",
    		iu: "iu-Cans-CA",
    		iw: "iw-Hebr-IL",
    		iwm: "iwm-Latn-ZZ",
    		iws: "iws-Latn-ZZ",
    		izh: "izh-Latn-RU",
    		izi: "izi-Latn-ZZ",
    		ja: "ja-Jpan-JP",
    		jab: "jab-Latn-ZZ",
    		jam: "jam-Latn-JM",
    		jbo: "jbo-Latn-001",
    		jbu: "jbu-Latn-ZZ",
    		jen: "jen-Latn-ZZ",
    		jgk: "jgk-Latn-ZZ",
    		jgo: "jgo-Latn-CM",
    		ji: "ji-Hebr-UA",
    		jib: "jib-Latn-ZZ",
    		jmc: "jmc-Latn-TZ",
    		jml: "jml-Deva-NP",
    		jra: "jra-Latn-ZZ",
    		jut: "jut-Latn-DK",
    		jv: "jv-Latn-ID",
    		jw: "jw-Latn-ID",
    		ka: "ka-Geor-GE",
    		kaa: "kaa-Cyrl-UZ",
    		kab: "kab-Latn-DZ",
    		kac: "kac-Latn-MM",
    		kad: "kad-Latn-ZZ",
    		kai: "kai-Latn-ZZ",
    		kaj: "kaj-Latn-NG",
    		kam: "kam-Latn-KE",
    		kao: "kao-Latn-ML",
    		kbd: "kbd-Cyrl-RU",
    		kbm: "kbm-Latn-ZZ",
    		kbp: "kbp-Latn-ZZ",
    		kbq: "kbq-Latn-ZZ",
    		kbx: "kbx-Latn-ZZ",
    		kby: "kby-Arab-NE",
    		kcg: "kcg-Latn-NG",
    		kck: "kck-Latn-ZW",
    		kcl: "kcl-Latn-ZZ",
    		kct: "kct-Latn-ZZ",
    		kde: "kde-Latn-TZ",
    		kdh: "kdh-Arab-TG",
    		kdl: "kdl-Latn-ZZ",
    		kdt: "kdt-Thai-TH",
    		kea: "kea-Latn-CV",
    		ken: "ken-Latn-CM",
    		kez: "kez-Latn-ZZ",
    		kfo: "kfo-Latn-CI",
    		kfr: "kfr-Deva-IN",
    		kfy: "kfy-Deva-IN",
    		kg: "kg-Latn-CD",
    		kge: "kge-Latn-ID",
    		kgf: "kgf-Latn-ZZ",
    		kgp: "kgp-Latn-BR",
    		kha: "kha-Latn-IN",
    		khb: "khb-Talu-CN",
    		khn: "khn-Deva-IN",
    		khq: "khq-Latn-ML",
    		khs: "khs-Latn-ZZ",
    		kht: "kht-Mymr-IN",
    		khw: "khw-Arab-PK",
    		khz: "khz-Latn-ZZ",
    		ki: "ki-Latn-KE",
    		kij: "kij-Latn-ZZ",
    		kiu: "kiu-Latn-TR",
    		kiw: "kiw-Latn-ZZ",
    		kj: "kj-Latn-NA",
    		kjd: "kjd-Latn-ZZ",
    		kjg: "kjg-Laoo-LA",
    		kjs: "kjs-Latn-ZZ",
    		kjy: "kjy-Latn-ZZ",
    		kk: "kk-Cyrl-KZ",
    		"kk-AF": "kk-Arab-AF",
    		"kk-Arab": "kk-Arab-CN",
    		"kk-CN": "kk-Arab-CN",
    		"kk-IR": "kk-Arab-IR",
    		"kk-MN": "kk-Arab-MN",
    		kkc: "kkc-Latn-ZZ",
    		kkj: "kkj-Latn-CM",
    		kl: "kl-Latn-GL",
    		kln: "kln-Latn-KE",
    		klq: "klq-Latn-ZZ",
    		klt: "klt-Latn-ZZ",
    		klx: "klx-Latn-ZZ",
    		km: "km-Khmr-KH",
    		kmb: "kmb-Latn-AO",
    		kmh: "kmh-Latn-ZZ",
    		kmo: "kmo-Latn-ZZ",
    		kms: "kms-Latn-ZZ",
    		kmu: "kmu-Latn-ZZ",
    		kmw: "kmw-Latn-ZZ",
    		kn: "kn-Knda-IN",
    		knf: "knf-Latn-GW",
    		knp: "knp-Latn-ZZ",
    		ko: "ko-Kore-KR",
    		koi: "koi-Cyrl-RU",
    		kok: "kok-Deva-IN",
    		kol: "kol-Latn-ZZ",
    		kos: "kos-Latn-FM",
    		koz: "koz-Latn-ZZ",
    		kpe: "kpe-Latn-LR",
    		kpf: "kpf-Latn-ZZ",
    		kpo: "kpo-Latn-ZZ",
    		kpr: "kpr-Latn-ZZ",
    		kpx: "kpx-Latn-ZZ",
    		kqb: "kqb-Latn-ZZ",
    		kqf: "kqf-Latn-ZZ",
    		kqs: "kqs-Latn-ZZ",
    		kqy: "kqy-Ethi-ZZ",
    		kr: "kr-Latn-ZZ",
    		krc: "krc-Cyrl-RU",
    		kri: "kri-Latn-SL",
    		krj: "krj-Latn-PH",
    		krl: "krl-Latn-RU",
    		krs: "krs-Latn-ZZ",
    		kru: "kru-Deva-IN",
    		ks: "ks-Arab-IN",
    		ksb: "ksb-Latn-TZ",
    		ksd: "ksd-Latn-ZZ",
    		ksf: "ksf-Latn-CM",
    		ksh: "ksh-Latn-DE",
    		ksj: "ksj-Latn-ZZ",
    		ksr: "ksr-Latn-ZZ",
    		ktb: "ktb-Ethi-ZZ",
    		ktm: "ktm-Latn-ZZ",
    		kto: "kto-Latn-ZZ",
    		ktr: "ktr-Latn-MY",
    		ku: "ku-Latn-TR",
    		"ku-Arab": "ku-Arab-IQ",
    		"ku-LB": "ku-Arab-LB",
    		kub: "kub-Latn-ZZ",
    		kud: "kud-Latn-ZZ",
    		kue: "kue-Latn-ZZ",
    		kuj: "kuj-Latn-ZZ",
    		kum: "kum-Cyrl-RU",
    		kun: "kun-Latn-ZZ",
    		kup: "kup-Latn-ZZ",
    		kus: "kus-Latn-ZZ",
    		kv: "kv-Cyrl-RU",
    		kvg: "kvg-Latn-ZZ",
    		kvr: "kvr-Latn-ID",
    		kvx: "kvx-Arab-PK",
    		kw: "kw-Latn-GB",
    		kwj: "kwj-Latn-ZZ",
    		kwo: "kwo-Latn-ZZ",
    		kwq: "kwq-Latn-ZZ",
    		kxa: "kxa-Latn-ZZ",
    		kxc: "kxc-Ethi-ZZ",
    		kxe: "kxe-Latn-ZZ",
    		kxm: "kxm-Thai-TH",
    		kxp: "kxp-Arab-PK",
    		kxw: "kxw-Latn-ZZ",
    		kxz: "kxz-Latn-ZZ",
    		ky: "ky-Cyrl-KG",
    		"ky-Arab": "ky-Arab-CN",
    		"ky-CN": "ky-Arab-CN",
    		"ky-Latn": "ky-Latn-TR",
    		"ky-TR": "ky-Latn-TR",
    		kye: "kye-Latn-ZZ",
    		kyx: "kyx-Latn-ZZ",
    		kzj: "kzj-Latn-MY",
    		kzr: "kzr-Latn-ZZ",
    		kzt: "kzt-Latn-MY",
    		la: "la-Latn-VA",
    		lab: "lab-Lina-GR",
    		lad: "lad-Hebr-IL",
    		lag: "lag-Latn-TZ",
    		lah: "lah-Arab-PK",
    		laj: "laj-Latn-UG",
    		las: "las-Latn-ZZ",
    		lb: "lb-Latn-LU",
    		lbe: "lbe-Cyrl-RU",
    		lbu: "lbu-Latn-ZZ",
    		lbw: "lbw-Latn-ID",
    		lcm: "lcm-Latn-ZZ",
    		lcp: "lcp-Thai-CN",
    		ldb: "ldb-Latn-ZZ",
    		led: "led-Latn-ZZ",
    		lee: "lee-Latn-ZZ",
    		lem: "lem-Latn-ZZ",
    		lep: "lep-Lepc-IN",
    		leq: "leq-Latn-ZZ",
    		leu: "leu-Latn-ZZ",
    		lez: "lez-Cyrl-RU",
    		lg: "lg-Latn-UG",
    		lgg: "lgg-Latn-ZZ",
    		li: "li-Latn-NL",
    		lia: "lia-Latn-ZZ",
    		lid: "lid-Latn-ZZ",
    		lif: "lif-Deva-NP",
    		"lif-Limb": "lif-Limb-IN",
    		lig: "lig-Latn-ZZ",
    		lih: "lih-Latn-ZZ",
    		lij: "lij-Latn-IT",
    		lis: "lis-Lisu-CN",
    		ljp: "ljp-Latn-ID",
    		lki: "lki-Arab-IR",
    		lkt: "lkt-Latn-US",
    		lle: "lle-Latn-ZZ",
    		lln: "lln-Latn-ZZ",
    		lmn: "lmn-Telu-IN",
    		lmo: "lmo-Latn-IT",
    		lmp: "lmp-Latn-ZZ",
    		ln: "ln-Latn-CD",
    		lns: "lns-Latn-ZZ",
    		lnu: "lnu-Latn-ZZ",
    		lo: "lo-Laoo-LA",
    		loj: "loj-Latn-ZZ",
    		lok: "lok-Latn-ZZ",
    		lol: "lol-Latn-CD",
    		lor: "lor-Latn-ZZ",
    		los: "los-Latn-ZZ",
    		loz: "loz-Latn-ZM",
    		lrc: "lrc-Arab-IR",
    		lt: "lt-Latn-LT",
    		ltg: "ltg-Latn-LV",
    		lu: "lu-Latn-CD",
    		lua: "lua-Latn-CD",
    		luo: "luo-Latn-KE",
    		luy: "luy-Latn-KE",
    		luz: "luz-Arab-IR",
    		lv: "lv-Latn-LV",
    		lwl: "lwl-Thai-TH",
    		lzh: "lzh-Hans-CN",
    		lzz: "lzz-Latn-TR",
    		mad: "mad-Latn-ID",
    		maf: "maf-Latn-CM",
    		mag: "mag-Deva-IN",
    		mai: "mai-Deva-IN",
    		mak: "mak-Latn-ID",
    		man: "man-Latn-GM",
    		"man-GN": "man-Nkoo-GN",
    		"man-Nkoo": "man-Nkoo-GN",
    		mas: "mas-Latn-KE",
    		maw: "maw-Latn-ZZ",
    		maz: "maz-Latn-MX",
    		mbh: "mbh-Latn-ZZ",
    		mbo: "mbo-Latn-ZZ",
    		mbq: "mbq-Latn-ZZ",
    		mbu: "mbu-Latn-ZZ",
    		mbw: "mbw-Latn-ZZ",
    		mci: "mci-Latn-ZZ",
    		mcp: "mcp-Latn-ZZ",
    		mcq: "mcq-Latn-ZZ",
    		mcr: "mcr-Latn-ZZ",
    		mcu: "mcu-Latn-ZZ",
    		mda: "mda-Latn-ZZ",
    		mde: "mde-Arab-ZZ",
    		mdf: "mdf-Cyrl-RU",
    		mdh: "mdh-Latn-PH",
    		mdj: "mdj-Latn-ZZ",
    		mdr: "mdr-Latn-ID",
    		mdx: "mdx-Ethi-ZZ",
    		med: "med-Latn-ZZ",
    		mee: "mee-Latn-ZZ",
    		mek: "mek-Latn-ZZ",
    		men: "men-Latn-SL",
    		mer: "mer-Latn-KE",
    		met: "met-Latn-ZZ",
    		meu: "meu-Latn-ZZ",
    		mfa: "mfa-Arab-TH",
    		mfe: "mfe-Latn-MU",
    		mfn: "mfn-Latn-ZZ",
    		mfo: "mfo-Latn-ZZ",
    		mfq: "mfq-Latn-ZZ",
    		mg: "mg-Latn-MG",
    		mgh: "mgh-Latn-MZ",
    		mgl: "mgl-Latn-ZZ",
    		mgo: "mgo-Latn-CM",
    		mgp: "mgp-Deva-NP",
    		mgy: "mgy-Latn-TZ",
    		mh: "mh-Latn-MH",
    		mhi: "mhi-Latn-ZZ",
    		mhl: "mhl-Latn-ZZ",
    		mi: "mi-Latn-NZ",
    		mif: "mif-Latn-ZZ",
    		min: "min-Latn-ID",
    		mis: "mis-Hatr-IQ",
    		"mis-Medf": "mis-Medf-NG",
    		miw: "miw-Latn-ZZ",
    		mk: "mk-Cyrl-MK",
    		mki: "mki-Arab-ZZ",
    		mkl: "mkl-Latn-ZZ",
    		mkp: "mkp-Latn-ZZ",
    		mkw: "mkw-Latn-ZZ",
    		ml: "ml-Mlym-IN",
    		mle: "mle-Latn-ZZ",
    		mlp: "mlp-Latn-ZZ",
    		mls: "mls-Latn-SD",
    		mmo: "mmo-Latn-ZZ",
    		mmu: "mmu-Latn-ZZ",
    		mmx: "mmx-Latn-ZZ",
    		mn: "mn-Cyrl-MN",
    		"mn-CN": "mn-Mong-CN",
    		"mn-Mong": "mn-Mong-CN",
    		mna: "mna-Latn-ZZ",
    		mnf: "mnf-Latn-ZZ",
    		mni: "mni-Beng-IN",
    		mnw: "mnw-Mymr-MM",
    		mo: "mo-Latn-RO",
    		moa: "moa-Latn-ZZ",
    		moe: "moe-Latn-CA",
    		moh: "moh-Latn-CA",
    		mos: "mos-Latn-BF",
    		mox: "mox-Latn-ZZ",
    		mpp: "mpp-Latn-ZZ",
    		mps: "mps-Latn-ZZ",
    		mpt: "mpt-Latn-ZZ",
    		mpx: "mpx-Latn-ZZ",
    		mql: "mql-Latn-ZZ",
    		mr: "mr-Deva-IN",
    		mrd: "mrd-Deva-NP",
    		mrj: "mrj-Cyrl-RU",
    		mro: "mro-Mroo-BD",
    		ms: "ms-Latn-MY",
    		"ms-CC": "ms-Arab-CC",
    		"ms-ID": "ms-Arab-ID",
    		mt: "mt-Latn-MT",
    		mtc: "mtc-Latn-ZZ",
    		mtf: "mtf-Latn-ZZ",
    		mti: "mti-Latn-ZZ",
    		mtr: "mtr-Deva-IN",
    		mua: "mua-Latn-CM",
    		mur: "mur-Latn-ZZ",
    		mus: "mus-Latn-US",
    		mva: "mva-Latn-ZZ",
    		mvn: "mvn-Latn-ZZ",
    		mvy: "mvy-Arab-PK",
    		mwk: "mwk-Latn-ML",
    		mwr: "mwr-Deva-IN",
    		mwv: "mwv-Latn-ID",
    		mww: "mww-Hmnp-US",
    		mxc: "mxc-Latn-ZW",
    		mxm: "mxm-Latn-ZZ",
    		my: "my-Mymr-MM",
    		myk: "myk-Latn-ZZ",
    		mym: "mym-Ethi-ZZ",
    		myv: "myv-Cyrl-RU",
    		myw: "myw-Latn-ZZ",
    		myx: "myx-Latn-UG",
    		myz: "myz-Mand-IR",
    		mzk: "mzk-Latn-ZZ",
    		mzm: "mzm-Latn-ZZ",
    		mzn: "mzn-Arab-IR",
    		mzp: "mzp-Latn-ZZ",
    		mzw: "mzw-Latn-ZZ",
    		mzz: "mzz-Latn-ZZ",
    		na: "na-Latn-NR",
    		nac: "nac-Latn-ZZ",
    		naf: "naf-Latn-ZZ",
    		nak: "nak-Latn-ZZ",
    		nan: "nan-Hans-CN",
    		nap: "nap-Latn-IT",
    		naq: "naq-Latn-NA",
    		nas: "nas-Latn-ZZ",
    		nb: "nb-Latn-NO",
    		nca: "nca-Latn-ZZ",
    		nce: "nce-Latn-ZZ",
    		ncf: "ncf-Latn-ZZ",
    		nch: "nch-Latn-MX",
    		nco: "nco-Latn-ZZ",
    		ncu: "ncu-Latn-ZZ",
    		nd: "nd-Latn-ZW",
    		ndc: "ndc-Latn-MZ",
    		nds: "nds-Latn-DE",
    		ne: "ne-Deva-NP",
    		neb: "neb-Latn-ZZ",
    		"new": "new-Deva-NP",
    		nex: "nex-Latn-ZZ",
    		nfr: "nfr-Latn-ZZ",
    		ng: "ng-Latn-NA",
    		nga: "nga-Latn-ZZ",
    		ngb: "ngb-Latn-ZZ",
    		ngl: "ngl-Latn-MZ",
    		nhb: "nhb-Latn-ZZ",
    		nhe: "nhe-Latn-MX",
    		nhw: "nhw-Latn-MX",
    		nif: "nif-Latn-ZZ",
    		nii: "nii-Latn-ZZ",
    		nij: "nij-Latn-ID",
    		nin: "nin-Latn-ZZ",
    		niu: "niu-Latn-NU",
    		niy: "niy-Latn-ZZ",
    		niz: "niz-Latn-ZZ",
    		njo: "njo-Latn-IN",
    		nkg: "nkg-Latn-ZZ",
    		nko: "nko-Latn-ZZ",
    		nl: "nl-Latn-NL",
    		nmg: "nmg-Latn-CM",
    		nmz: "nmz-Latn-ZZ",
    		nn: "nn-Latn-NO",
    		nnf: "nnf-Latn-ZZ",
    		nnh: "nnh-Latn-CM",
    		nnk: "nnk-Latn-ZZ",
    		nnm: "nnm-Latn-ZZ",
    		nnp: "nnp-Wcho-IN",
    		no: "no-Latn-NO",
    		nod: "nod-Lana-TH",
    		noe: "noe-Deva-IN",
    		non: "non-Runr-SE",
    		nop: "nop-Latn-ZZ",
    		nou: "nou-Latn-ZZ",
    		nqo: "nqo-Nkoo-GN",
    		nr: "nr-Latn-ZA",
    		nrb: "nrb-Latn-ZZ",
    		nsk: "nsk-Cans-CA",
    		nsn: "nsn-Latn-ZZ",
    		nso: "nso-Latn-ZA",
    		nss: "nss-Latn-ZZ",
    		ntm: "ntm-Latn-ZZ",
    		ntr: "ntr-Latn-ZZ",
    		nui: "nui-Latn-ZZ",
    		nup: "nup-Latn-ZZ",
    		nus: "nus-Latn-SS",
    		nuv: "nuv-Latn-ZZ",
    		nux: "nux-Latn-ZZ",
    		nv: "nv-Latn-US",
    		nwb: "nwb-Latn-ZZ",
    		nxq: "nxq-Latn-CN",
    		nxr: "nxr-Latn-ZZ",
    		ny: "ny-Latn-MW",
    		nym: "nym-Latn-TZ",
    		nyn: "nyn-Latn-UG",
    		nzi: "nzi-Latn-GH",
    		oc: "oc-Latn-FR",
    		ogc: "ogc-Latn-ZZ",
    		okr: "okr-Latn-ZZ",
    		okv: "okv-Latn-ZZ",
    		om: "om-Latn-ET",
    		ong: "ong-Latn-ZZ",
    		onn: "onn-Latn-ZZ",
    		ons: "ons-Latn-ZZ",
    		opm: "opm-Latn-ZZ",
    		or: "or-Orya-IN",
    		oro: "oro-Latn-ZZ",
    		oru: "oru-Arab-ZZ",
    		os: "os-Cyrl-GE",
    		osa: "osa-Osge-US",
    		ota: "ota-Arab-ZZ",
    		otk: "otk-Orkh-MN",
    		ozm: "ozm-Latn-ZZ",
    		pa: "pa-Guru-IN",
    		"pa-Arab": "pa-Arab-PK",
    		"pa-PK": "pa-Arab-PK",
    		pag: "pag-Latn-PH",
    		pal: "pal-Phli-IR",
    		"pal-Phlp": "pal-Phlp-CN",
    		pam: "pam-Latn-PH",
    		pap: "pap-Latn-AW",
    		pau: "pau-Latn-PW",
    		pbi: "pbi-Latn-ZZ",
    		pcd: "pcd-Latn-FR",
    		pcm: "pcm-Latn-NG",
    		pdc: "pdc-Latn-US",
    		pdt: "pdt-Latn-CA",
    		ped: "ped-Latn-ZZ",
    		peo: "peo-Xpeo-IR",
    		pex: "pex-Latn-ZZ",
    		pfl: "pfl-Latn-DE",
    		phl: "phl-Arab-ZZ",
    		phn: "phn-Phnx-LB",
    		pil: "pil-Latn-ZZ",
    		pip: "pip-Latn-ZZ",
    		pka: "pka-Brah-IN",
    		pko: "pko-Latn-KE",
    		pl: "pl-Latn-PL",
    		pla: "pla-Latn-ZZ",
    		pms: "pms-Latn-IT",
    		png: "png-Latn-ZZ",
    		pnn: "pnn-Latn-ZZ",
    		pnt: "pnt-Grek-GR",
    		pon: "pon-Latn-FM",
    		ppa: "ppa-Deva-IN",
    		ppo: "ppo-Latn-ZZ",
    		pra: "pra-Khar-PK",
    		prd: "prd-Arab-IR",
    		prg: "prg-Latn-001",
    		ps: "ps-Arab-AF",
    		pss: "pss-Latn-ZZ",
    		pt: "pt-Latn-BR",
    		ptp: "ptp-Latn-ZZ",
    		puu: "puu-Latn-GA",
    		pwa: "pwa-Latn-ZZ",
    		qu: "qu-Latn-PE",
    		quc: "quc-Latn-GT",
    		qug: "qug-Latn-EC",
    		rai: "rai-Latn-ZZ",
    		raj: "raj-Deva-IN",
    		rao: "rao-Latn-ZZ",
    		rcf: "rcf-Latn-RE",
    		rej: "rej-Latn-ID",
    		rel: "rel-Latn-ZZ",
    		res: "res-Latn-ZZ",
    		rgn: "rgn-Latn-IT",
    		rhg: "rhg-Arab-MM",
    		ria: "ria-Latn-IN",
    		rif: "rif-Tfng-MA",
    		"rif-NL": "rif-Latn-NL",
    		rjs: "rjs-Deva-NP",
    		rkt: "rkt-Beng-BD",
    		rm: "rm-Latn-CH",
    		rmf: "rmf-Latn-FI",
    		rmo: "rmo-Latn-CH",
    		rmt: "rmt-Arab-IR",
    		rmu: "rmu-Latn-SE",
    		rn: "rn-Latn-BI",
    		rna: "rna-Latn-ZZ",
    		rng: "rng-Latn-MZ",
    		ro: "ro-Latn-RO",
    		rob: "rob-Latn-ID",
    		rof: "rof-Latn-TZ",
    		roo: "roo-Latn-ZZ",
    		rro: "rro-Latn-ZZ",
    		rtm: "rtm-Latn-FJ",
    		ru: "ru-Cyrl-RU",
    		rue: "rue-Cyrl-UA",
    		rug: "rug-Latn-SB",
    		rw: "rw-Latn-RW",
    		rwk: "rwk-Latn-TZ",
    		rwo: "rwo-Latn-ZZ",
    		ryu: "ryu-Kana-JP",
    		sa: "sa-Deva-IN",
    		saf: "saf-Latn-GH",
    		sah: "sah-Cyrl-RU",
    		saq: "saq-Latn-KE",
    		sas: "sas-Latn-ID",
    		sat: "sat-Latn-IN",
    		sav: "sav-Latn-SN",
    		saz: "saz-Saur-IN",
    		sba: "sba-Latn-ZZ",
    		sbe: "sbe-Latn-ZZ",
    		sbp: "sbp-Latn-TZ",
    		sc: "sc-Latn-IT",
    		sck: "sck-Deva-IN",
    		scl: "scl-Arab-ZZ",
    		scn: "scn-Latn-IT",
    		sco: "sco-Latn-GB",
    		scs: "scs-Latn-CA",
    		sd: "sd-Arab-PK",
    		"sd-Deva": "sd-Deva-IN",
    		"sd-Khoj": "sd-Khoj-IN",
    		"sd-Sind": "sd-Sind-IN",
    		sdc: "sdc-Latn-IT",
    		sdh: "sdh-Arab-IR",
    		se: "se-Latn-NO",
    		sef: "sef-Latn-CI",
    		seh: "seh-Latn-MZ",
    		sei: "sei-Latn-MX",
    		ses: "ses-Latn-ML",
    		sg: "sg-Latn-CF",
    		sga: "sga-Ogam-IE",
    		sgs: "sgs-Latn-LT",
    		sgw: "sgw-Ethi-ZZ",
    		sgz: "sgz-Latn-ZZ",
    		shi: "shi-Tfng-MA",
    		shk: "shk-Latn-ZZ",
    		shn: "shn-Mymr-MM",
    		shu: "shu-Arab-ZZ",
    		si: "si-Sinh-LK",
    		sid: "sid-Latn-ET",
    		sig: "sig-Latn-ZZ",
    		sil: "sil-Latn-ZZ",
    		sim: "sim-Latn-ZZ",
    		sjr: "sjr-Latn-ZZ",
    		sk: "sk-Latn-SK",
    		skc: "skc-Latn-ZZ",
    		skr: "skr-Arab-PK",
    		sks: "sks-Latn-ZZ",
    		sl: "sl-Latn-SI",
    		sld: "sld-Latn-ZZ",
    		sli: "sli-Latn-PL",
    		sll: "sll-Latn-ZZ",
    		sly: "sly-Latn-ID",
    		sm: "sm-Latn-WS",
    		sma: "sma-Latn-SE",
    		smj: "smj-Latn-SE",
    		smn: "smn-Latn-FI",
    		smp: "smp-Samr-IL",
    		smq: "smq-Latn-ZZ",
    		sms: "sms-Latn-FI",
    		sn: "sn-Latn-ZW",
    		snc: "snc-Latn-ZZ",
    		snk: "snk-Latn-ML",
    		snp: "snp-Latn-ZZ",
    		snx: "snx-Latn-ZZ",
    		sny: "sny-Latn-ZZ",
    		so: "so-Latn-SO",
    		sog: "sog-Sogd-UZ",
    		sok: "sok-Latn-ZZ",
    		soq: "soq-Latn-ZZ",
    		sou: "sou-Thai-TH",
    		soy: "soy-Latn-ZZ",
    		spd: "spd-Latn-ZZ",
    		spl: "spl-Latn-ZZ",
    		sps: "sps-Latn-ZZ",
    		sq: "sq-Latn-AL",
    		sr: "sr-Cyrl-RS",
    		"sr-ME": "sr-Latn-ME",
    		"sr-RO": "sr-Latn-RO",
    		"sr-RU": "sr-Latn-RU",
    		"sr-TR": "sr-Latn-TR",
    		srb: "srb-Sora-IN",
    		srn: "srn-Latn-SR",
    		srr: "srr-Latn-SN",
    		srx: "srx-Deva-IN",
    		ss: "ss-Latn-ZA",
    		ssd: "ssd-Latn-ZZ",
    		ssg: "ssg-Latn-ZZ",
    		ssy: "ssy-Latn-ER",
    		st: "st-Latn-ZA",
    		stk: "stk-Latn-ZZ",
    		stq: "stq-Latn-DE",
    		su: "su-Latn-ID",
    		sua: "sua-Latn-ZZ",
    		sue: "sue-Latn-ZZ",
    		suk: "suk-Latn-TZ",
    		sur: "sur-Latn-ZZ",
    		sus: "sus-Latn-GN",
    		sv: "sv-Latn-SE",
    		sw: "sw-Latn-TZ",
    		swb: "swb-Arab-YT",
    		swc: "swc-Latn-CD",
    		swg: "swg-Latn-DE",
    		swp: "swp-Latn-ZZ",
    		swv: "swv-Deva-IN",
    		sxn: "sxn-Latn-ID",
    		sxw: "sxw-Latn-ZZ",
    		syl: "syl-Beng-BD",
    		syr: "syr-Syrc-IQ",
    		szl: "szl-Latn-PL",
    		ta: "ta-Taml-IN",
    		taj: "taj-Deva-NP",
    		tal: "tal-Latn-ZZ",
    		tan: "tan-Latn-ZZ",
    		taq: "taq-Latn-ZZ",
    		tbc: "tbc-Latn-ZZ",
    		tbd: "tbd-Latn-ZZ",
    		tbf: "tbf-Latn-ZZ",
    		tbg: "tbg-Latn-ZZ",
    		tbo: "tbo-Latn-ZZ",
    		tbw: "tbw-Latn-PH",
    		tbz: "tbz-Latn-ZZ",
    		tci: "tci-Latn-ZZ",
    		tcy: "tcy-Knda-IN",
    		tdd: "tdd-Tale-CN",
    		tdg: "tdg-Deva-NP",
    		tdh: "tdh-Deva-NP",
    		tdu: "tdu-Latn-MY",
    		te: "te-Telu-IN",
    		ted: "ted-Latn-ZZ",
    		tem: "tem-Latn-SL",
    		teo: "teo-Latn-UG",
    		tet: "tet-Latn-TL",
    		tfi: "tfi-Latn-ZZ",
    		tg: "tg-Cyrl-TJ",
    		"tg-Arab": "tg-Arab-PK",
    		"tg-PK": "tg-Arab-PK",
    		tgc: "tgc-Latn-ZZ",
    		tgo: "tgo-Latn-ZZ",
    		tgu: "tgu-Latn-ZZ",
    		th: "th-Thai-TH",
    		thl: "thl-Deva-NP",
    		thq: "thq-Deva-NP",
    		thr: "thr-Deva-NP",
    		ti: "ti-Ethi-ET",
    		tif: "tif-Latn-ZZ",
    		tig: "tig-Ethi-ER",
    		tik: "tik-Latn-ZZ",
    		tim: "tim-Latn-ZZ",
    		tio: "tio-Latn-ZZ",
    		tiv: "tiv-Latn-NG",
    		tk: "tk-Latn-TM",
    		tkl: "tkl-Latn-TK",
    		tkr: "tkr-Latn-AZ",
    		tkt: "tkt-Deva-NP",
    		tl: "tl-Latn-PH",
    		tlf: "tlf-Latn-ZZ",
    		tlx: "tlx-Latn-ZZ",
    		tly: "tly-Latn-AZ",
    		tmh: "tmh-Latn-NE",
    		tmy: "tmy-Latn-ZZ",
    		tn: "tn-Latn-ZA",
    		tnh: "tnh-Latn-ZZ",
    		to: "to-Latn-TO",
    		tof: "tof-Latn-ZZ",
    		tog: "tog-Latn-MW",
    		toq: "toq-Latn-ZZ",
    		tpi: "tpi-Latn-PG",
    		tpm: "tpm-Latn-ZZ",
    		tpz: "tpz-Latn-ZZ",
    		tqo: "tqo-Latn-ZZ",
    		tr: "tr-Latn-TR",
    		tru: "tru-Latn-TR",
    		trv: "trv-Latn-TW",
    		trw: "trw-Arab-ZZ",
    		ts: "ts-Latn-ZA",
    		tsd: "tsd-Grek-GR",
    		tsf: "tsf-Deva-NP",
    		tsg: "tsg-Latn-PH",
    		tsj: "tsj-Tibt-BT",
    		tsw: "tsw-Latn-ZZ",
    		tt: "tt-Cyrl-RU",
    		ttd: "ttd-Latn-ZZ",
    		tte: "tte-Latn-ZZ",
    		ttj: "ttj-Latn-UG",
    		ttr: "ttr-Latn-ZZ",
    		tts: "tts-Thai-TH",
    		ttt: "ttt-Latn-AZ",
    		tuh: "tuh-Latn-ZZ",
    		tul: "tul-Latn-ZZ",
    		tum: "tum-Latn-MW",
    		tuq: "tuq-Latn-ZZ",
    		tvd: "tvd-Latn-ZZ",
    		tvl: "tvl-Latn-TV",
    		tvu: "tvu-Latn-ZZ",
    		twh: "twh-Latn-ZZ",
    		twq: "twq-Latn-NE",
    		txg: "txg-Tang-CN",
    		ty: "ty-Latn-PF",
    		tya: "tya-Latn-ZZ",
    		tyv: "tyv-Cyrl-RU",
    		tzm: "tzm-Latn-MA",
    		ubu: "ubu-Latn-ZZ",
    		udm: "udm-Cyrl-RU",
    		ug: "ug-Arab-CN",
    		"ug-Cyrl": "ug-Cyrl-KZ",
    		"ug-KZ": "ug-Cyrl-KZ",
    		"ug-MN": "ug-Cyrl-MN",
    		uga: "uga-Ugar-SY",
    		uk: "uk-Cyrl-UA",
    		uli: "uli-Latn-FM",
    		umb: "umb-Latn-AO",
    		und: "en-Latn-US",
    		"und-002": "en-Latn-NG",
    		"und-003": "en-Latn-US",
    		"und-005": "pt-Latn-BR",
    		"und-009": "en-Latn-AU",
    		"und-011": "en-Latn-NG",
    		"und-013": "es-Latn-MX",
    		"und-014": "sw-Latn-TZ",
    		"und-015": "ar-Arab-EG",
    		"und-017": "sw-Latn-CD",
    		"und-018": "en-Latn-ZA",
    		"und-019": "en-Latn-US",
    		"und-021": "en-Latn-US",
    		"und-029": "es-Latn-CU",
    		"und-030": "zh-Hans-CN",
    		"und-034": "hi-Deva-IN",
    		"und-035": "id-Latn-ID",
    		"und-039": "it-Latn-IT",
    		"und-053": "en-Latn-AU",
    		"und-054": "en-Latn-PG",
    		"und-057": "en-Latn-GU",
    		"und-061": "sm-Latn-WS",
    		"und-142": "zh-Hans-CN",
    		"und-143": "uz-Latn-UZ",
    		"und-145": "ar-Arab-SA",
    		"und-150": "ru-Cyrl-RU",
    		"und-151": "ru-Cyrl-RU",
    		"und-154": "en-Latn-GB",
    		"und-155": "de-Latn-DE",
    		"und-202": "en-Latn-NG",
    		"und-419": "es-Latn-419",
    		"und-AD": "ca-Latn-AD",
    		"und-Adlm": "ff-Adlm-GN",
    		"und-AE": "ar-Arab-AE",
    		"und-AF": "fa-Arab-AF",
    		"und-Aghb": "lez-Aghb-RU",
    		"und-Ahom": "aho-Ahom-IN",
    		"und-AL": "sq-Latn-AL",
    		"und-AM": "hy-Armn-AM",
    		"und-AO": "pt-Latn-AO",
    		"und-AQ": "und-Latn-AQ",
    		"und-AR": "es-Latn-AR",
    		"und-Arab": "ar-Arab-EG",
    		"und-Arab-CC": "ms-Arab-CC",
    		"und-Arab-CN": "ug-Arab-CN",
    		"und-Arab-GB": "ks-Arab-GB",
    		"und-Arab-ID": "ms-Arab-ID",
    		"und-Arab-IN": "ur-Arab-IN",
    		"und-Arab-KH": "cja-Arab-KH",
    		"und-Arab-MM": "rhg-Arab-MM",
    		"und-Arab-MN": "kk-Arab-MN",
    		"und-Arab-MU": "ur-Arab-MU",
    		"und-Arab-NG": "ha-Arab-NG",
    		"und-Arab-PK": "ur-Arab-PK",
    		"und-Arab-TG": "apd-Arab-TG",
    		"und-Arab-TH": "mfa-Arab-TH",
    		"und-Arab-TJ": "fa-Arab-TJ",
    		"und-Arab-TR": "az-Arab-TR",
    		"und-Arab-YT": "swb-Arab-YT",
    		"und-Armi": "arc-Armi-IR",
    		"und-Armn": "hy-Armn-AM",
    		"und-AS": "sm-Latn-AS",
    		"und-AT": "de-Latn-AT",
    		"und-Avst": "ae-Avst-IR",
    		"und-AW": "nl-Latn-AW",
    		"und-AX": "sv-Latn-AX",
    		"und-AZ": "az-Latn-AZ",
    		"und-BA": "bs-Latn-BA",
    		"und-Bali": "ban-Bali-ID",
    		"und-Bamu": "bax-Bamu-CM",
    		"und-Bass": "bsq-Bass-LR",
    		"und-Batk": "bbc-Batk-ID",
    		"und-BD": "bn-Beng-BD",
    		"und-BE": "nl-Latn-BE",
    		"und-Beng": "bn-Beng-BD",
    		"und-BF": "fr-Latn-BF",
    		"und-BG": "bg-Cyrl-BG",
    		"und-BH": "ar-Arab-BH",
    		"und-Bhks": "sa-Bhks-IN",
    		"und-BI": "rn-Latn-BI",
    		"und-BJ": "fr-Latn-BJ",
    		"und-BL": "fr-Latn-BL",
    		"und-BN": "ms-Latn-BN",
    		"und-BO": "es-Latn-BO",
    		"und-Bopo": "zh-Bopo-TW",
    		"und-BQ": "pap-Latn-BQ",
    		"und-BR": "pt-Latn-BR",
    		"und-Brah": "pka-Brah-IN",
    		"und-Brai": "fr-Brai-FR",
    		"und-BT": "dz-Tibt-BT",
    		"und-Bugi": "bug-Bugi-ID",
    		"und-Buhd": "bku-Buhd-PH",
    		"und-BV": "und-Latn-BV",
    		"und-BY": "be-Cyrl-BY",
    		"und-Cakm": "ccp-Cakm-BD",
    		"und-Cans": "cr-Cans-CA",
    		"und-Cari": "xcr-Cari-TR",
    		"und-CD": "sw-Latn-CD",
    		"und-CF": "fr-Latn-CF",
    		"und-CG": "fr-Latn-CG",
    		"und-CH": "de-Latn-CH",
    		"und-Cham": "cjm-Cham-VN",
    		"und-Cher": "chr-Cher-US",
    		"und-CI": "fr-Latn-CI",
    		"und-CL": "es-Latn-CL",
    		"und-CM": "fr-Latn-CM",
    		"und-CN": "zh-Hans-CN",
    		"und-CO": "es-Latn-CO",
    		"und-Copt": "cop-Copt-EG",
    		"und-CP": "und-Latn-CP",
    		"und-Cprt": "grc-Cprt-CY",
    		"und-CR": "es-Latn-CR",
    		"und-CU": "es-Latn-CU",
    		"und-CV": "pt-Latn-CV",
    		"und-CW": "pap-Latn-CW",
    		"und-CY": "el-Grek-CY",
    		"und-Cyrl": "ru-Cyrl-RU",
    		"und-Cyrl-AL": "mk-Cyrl-AL",
    		"und-Cyrl-BA": "sr-Cyrl-BA",
    		"und-Cyrl-GE": "ab-Cyrl-GE",
    		"und-Cyrl-GR": "mk-Cyrl-GR",
    		"und-Cyrl-MD": "uk-Cyrl-MD",
    		"und-Cyrl-RO": "bg-Cyrl-RO",
    		"und-Cyrl-SK": "uk-Cyrl-SK",
    		"und-Cyrl-TR": "kbd-Cyrl-TR",
    		"und-Cyrl-XK": "sr-Cyrl-XK",
    		"und-CZ": "cs-Latn-CZ",
    		"und-DE": "de-Latn-DE",
    		"und-Deva": "hi-Deva-IN",
    		"und-Deva-BT": "ne-Deva-BT",
    		"und-Deva-FJ": "hif-Deva-FJ",
    		"und-Deva-MU": "bho-Deva-MU",
    		"und-Deva-PK": "btv-Deva-PK",
    		"und-DJ": "aa-Latn-DJ",
    		"und-DK": "da-Latn-DK",
    		"und-DO": "es-Latn-DO",
    		"und-Dogr": "doi-Dogr-IN",
    		"und-Dupl": "fr-Dupl-FR",
    		"und-DZ": "ar-Arab-DZ",
    		"und-EA": "es-Latn-EA",
    		"und-EC": "es-Latn-EC",
    		"und-EE": "et-Latn-EE",
    		"und-EG": "ar-Arab-EG",
    		"und-Egyp": "egy-Egyp-EG",
    		"und-EH": "ar-Arab-EH",
    		"und-Elba": "sq-Elba-AL",
    		"und-Elym": "arc-Elym-IR",
    		"und-ER": "ti-Ethi-ER",
    		"und-ES": "es-Latn-ES",
    		"und-ET": "am-Ethi-ET",
    		"und-Ethi": "am-Ethi-ET",
    		"und-EU": "en-Latn-GB",
    		"und-EZ": "de-Latn-EZ",
    		"und-FI": "fi-Latn-FI",
    		"und-FO": "fo-Latn-FO",
    		"und-FR": "fr-Latn-FR",
    		"und-GA": "fr-Latn-GA",
    		"und-GE": "ka-Geor-GE",
    		"und-Geor": "ka-Geor-GE",
    		"und-GF": "fr-Latn-GF",
    		"und-GH": "ak-Latn-GH",
    		"und-GL": "kl-Latn-GL",
    		"und-Glag": "cu-Glag-BG",
    		"und-GN": "fr-Latn-GN",
    		"und-Gong": "wsg-Gong-IN",
    		"und-Gonm": "esg-Gonm-IN",
    		"und-Goth": "got-Goth-UA",
    		"und-GP": "fr-Latn-GP",
    		"und-GQ": "es-Latn-GQ",
    		"und-GR": "el-Grek-GR",
    		"und-Gran": "sa-Gran-IN",
    		"und-Grek": "el-Grek-GR",
    		"und-Grek-TR": "bgx-Grek-TR",
    		"und-GS": "und-Latn-GS",
    		"und-GT": "es-Latn-GT",
    		"und-Gujr": "gu-Gujr-IN",
    		"und-Guru": "pa-Guru-IN",
    		"und-GW": "pt-Latn-GW",
    		"und-Hanb": "zh-Hanb-TW",
    		"und-Hang": "ko-Hang-KR",
    		"und-Hani": "zh-Hani-CN",
    		"und-Hano": "hnn-Hano-PH",
    		"und-Hans": "zh-Hans-CN",
    		"und-Hant": "zh-Hant-TW",
    		"und-Hatr": "mis-Hatr-IQ",
    		"und-Hebr": "he-Hebr-IL",
    		"und-Hebr-CA": "yi-Hebr-CA",
    		"und-Hebr-GB": "yi-Hebr-GB",
    		"und-Hebr-SE": "yi-Hebr-SE",
    		"und-Hebr-UA": "yi-Hebr-UA",
    		"und-Hebr-US": "yi-Hebr-US",
    		"und-Hira": "ja-Hira-JP",
    		"und-HK": "zh-Hant-HK",
    		"und-Hluw": "hlu-Hluw-TR",
    		"und-HM": "und-Latn-HM",
    		"und-Hmng": "hnj-Hmng-LA",
    		"und-Hmnp": "mww-Hmnp-US",
    		"und-HN": "es-Latn-HN",
    		"und-HR": "hr-Latn-HR",
    		"und-HT": "ht-Latn-HT",
    		"und-HU": "hu-Latn-HU",
    		"und-Hung": "hu-Hung-HU",
    		"und-IC": "es-Latn-IC",
    		"und-ID": "id-Latn-ID",
    		"und-IL": "he-Hebr-IL",
    		"und-IN": "hi-Deva-IN",
    		"und-IQ": "ar-Arab-IQ",
    		"und-IR": "fa-Arab-IR",
    		"und-IS": "is-Latn-IS",
    		"und-IT": "it-Latn-IT",
    		"und-Ital": "ett-Ital-IT",
    		"und-Jamo": "ko-Jamo-KR",
    		"und-Java": "jv-Java-ID",
    		"und-JO": "ar-Arab-JO",
    		"und-JP": "ja-Jpan-JP",
    		"und-Jpan": "ja-Jpan-JP",
    		"und-Kali": "eky-Kali-MM",
    		"und-Kana": "ja-Kana-JP",
    		"und-KE": "sw-Latn-KE",
    		"und-KG": "ky-Cyrl-KG",
    		"und-KH": "km-Khmr-KH",
    		"und-Khar": "pra-Khar-PK",
    		"und-Khmr": "km-Khmr-KH",
    		"und-Khoj": "sd-Khoj-IN",
    		"und-KM": "ar-Arab-KM",
    		"und-Knda": "kn-Knda-IN",
    		"und-Kore": "ko-Kore-KR",
    		"und-KP": "ko-Kore-KP",
    		"und-KR": "ko-Kore-KR",
    		"und-Kthi": "bho-Kthi-IN",
    		"und-KW": "ar-Arab-KW",
    		"und-KZ": "ru-Cyrl-KZ",
    		"und-LA": "lo-Laoo-LA",
    		"und-Lana": "nod-Lana-TH",
    		"und-Laoo": "lo-Laoo-LA",
    		"und-Latn-AF": "tk-Latn-AF",
    		"und-Latn-AM": "ku-Latn-AM",
    		"und-Latn-CN": "za-Latn-CN",
    		"und-Latn-CY": "tr-Latn-CY",
    		"und-Latn-DZ": "fr-Latn-DZ",
    		"und-Latn-ET": "en-Latn-ET",
    		"und-Latn-GE": "ku-Latn-GE",
    		"und-Latn-IR": "tk-Latn-IR",
    		"und-Latn-KM": "fr-Latn-KM",
    		"und-Latn-MA": "fr-Latn-MA",
    		"und-Latn-MK": "sq-Latn-MK",
    		"und-Latn-MM": "kac-Latn-MM",
    		"und-Latn-MO": "pt-Latn-MO",
    		"und-Latn-MR": "fr-Latn-MR",
    		"und-Latn-RU": "krl-Latn-RU",
    		"und-Latn-SY": "fr-Latn-SY",
    		"und-Latn-TN": "fr-Latn-TN",
    		"und-Latn-TW": "trv-Latn-TW",
    		"und-Latn-UA": "pl-Latn-UA",
    		"und-LB": "ar-Arab-LB",
    		"und-Lepc": "lep-Lepc-IN",
    		"und-LI": "de-Latn-LI",
    		"und-Limb": "lif-Limb-IN",
    		"und-Lina": "lab-Lina-GR",
    		"und-Linb": "grc-Linb-GR",
    		"und-Lisu": "lis-Lisu-CN",
    		"und-LK": "si-Sinh-LK",
    		"und-LS": "st-Latn-LS",
    		"und-LT": "lt-Latn-LT",
    		"und-LU": "fr-Latn-LU",
    		"und-LV": "lv-Latn-LV",
    		"und-LY": "ar-Arab-LY",
    		"und-Lyci": "xlc-Lyci-TR",
    		"und-Lydi": "xld-Lydi-TR",
    		"und-MA": "ar-Arab-MA",
    		"und-Mahj": "hi-Mahj-IN",
    		"und-Maka": "mak-Maka-ID",
    		"und-Mand": "myz-Mand-IR",
    		"und-Mani": "xmn-Mani-CN",
    		"und-Marc": "bo-Marc-CN",
    		"und-MC": "fr-Latn-MC",
    		"und-MD": "ro-Latn-MD",
    		"und-ME": "sr-Latn-ME",
    		"und-Medf": "mis-Medf-NG",
    		"und-Mend": "men-Mend-SL",
    		"und-Merc": "xmr-Merc-SD",
    		"und-Mero": "xmr-Mero-SD",
    		"und-MF": "fr-Latn-MF",
    		"und-MG": "mg-Latn-MG",
    		"und-MK": "mk-Cyrl-MK",
    		"und-ML": "bm-Latn-ML",
    		"und-Mlym": "ml-Mlym-IN",
    		"und-MM": "my-Mymr-MM",
    		"und-MN": "mn-Cyrl-MN",
    		"und-MO": "zh-Hant-MO",
    		"und-Modi": "mr-Modi-IN",
    		"und-Mong": "mn-Mong-CN",
    		"und-MQ": "fr-Latn-MQ",
    		"und-MR": "ar-Arab-MR",
    		"und-Mroo": "mro-Mroo-BD",
    		"und-MT": "mt-Latn-MT",
    		"und-Mtei": "mni-Mtei-IN",
    		"und-MU": "mfe-Latn-MU",
    		"und-Mult": "skr-Mult-PK",
    		"und-MV": "dv-Thaa-MV",
    		"und-MX": "es-Latn-MX",
    		"und-MY": "ms-Latn-MY",
    		"und-Mymr": "my-Mymr-MM",
    		"und-Mymr-IN": "kht-Mymr-IN",
    		"und-Mymr-TH": "mnw-Mymr-TH",
    		"und-MZ": "pt-Latn-MZ",
    		"und-NA": "af-Latn-NA",
    		"und-Nand": "sa-Nand-IN",
    		"und-Narb": "xna-Narb-SA",
    		"und-Nbat": "arc-Nbat-JO",
    		"und-NC": "fr-Latn-NC",
    		"und-NE": "ha-Latn-NE",
    		"und-Newa": "new-Newa-NP",
    		"und-NI": "es-Latn-NI",
    		"und-Nkoo": "man-Nkoo-GN",
    		"und-NL": "nl-Latn-NL",
    		"und-NO": "nb-Latn-NO",
    		"und-NP": "ne-Deva-NP",
    		"und-Nshu": "zhx-Nshu-CN",
    		"und-Ogam": "sga-Ogam-IE",
    		"und-Olck": "sat-Olck-IN",
    		"und-OM": "ar-Arab-OM",
    		"und-Orkh": "otk-Orkh-MN",
    		"und-Orya": "or-Orya-IN",
    		"und-Osge": "osa-Osge-US",
    		"und-Osma": "so-Osma-SO",
    		"und-PA": "es-Latn-PA",
    		"und-Palm": "arc-Palm-SY",
    		"und-Pauc": "ctd-Pauc-MM",
    		"und-PE": "es-Latn-PE",
    		"und-Perm": "kv-Perm-RU",
    		"und-PF": "fr-Latn-PF",
    		"und-PG": "tpi-Latn-PG",
    		"und-PH": "fil-Latn-PH",
    		"und-Phag": "lzh-Phag-CN",
    		"und-Phli": "pal-Phli-IR",
    		"und-Phlp": "pal-Phlp-CN",
    		"und-Phnx": "phn-Phnx-LB",
    		"und-PK": "ur-Arab-PK",
    		"und-PL": "pl-Latn-PL",
    		"und-Plrd": "hmd-Plrd-CN",
    		"und-PM": "fr-Latn-PM",
    		"und-PR": "es-Latn-PR",
    		"und-Prti": "xpr-Prti-IR",
    		"und-PS": "ar-Arab-PS",
    		"und-PT": "pt-Latn-PT",
    		"und-PW": "pau-Latn-PW",
    		"und-PY": "gn-Latn-PY",
    		"und-QA": "ar-Arab-QA",
    		"und-QO": "en-Latn-DG",
    		"und-RE": "fr-Latn-RE",
    		"und-Rjng": "rej-Rjng-ID",
    		"und-RO": "ro-Latn-RO",
    		"und-Rohg": "rhg-Rohg-MM",
    		"und-RS": "sr-Cyrl-RS",
    		"und-RU": "ru-Cyrl-RU",
    		"und-Runr": "non-Runr-SE",
    		"und-RW": "rw-Latn-RW",
    		"und-SA": "ar-Arab-SA",
    		"und-Samr": "smp-Samr-IL",
    		"und-Sarb": "xsa-Sarb-YE",
    		"und-Saur": "saz-Saur-IN",
    		"und-SC": "fr-Latn-SC",
    		"und-SD": "ar-Arab-SD",
    		"und-SE": "sv-Latn-SE",
    		"und-Sgnw": "ase-Sgnw-US",
    		"und-Shaw": "en-Shaw-GB",
    		"und-Shrd": "sa-Shrd-IN",
    		"und-SI": "sl-Latn-SI",
    		"und-Sidd": "sa-Sidd-IN",
    		"und-Sind": "sd-Sind-IN",
    		"und-Sinh": "si-Sinh-LK",
    		"und-SJ": "nb-Latn-SJ",
    		"und-SK": "sk-Latn-SK",
    		"und-SM": "it-Latn-SM",
    		"und-SN": "fr-Latn-SN",
    		"und-SO": "so-Latn-SO",
    		"und-Sogd": "sog-Sogd-UZ",
    		"und-Sogo": "sog-Sogo-UZ",
    		"und-Sora": "srb-Sora-IN",
    		"und-Soyo": "cmg-Soyo-MN",
    		"und-SR": "nl-Latn-SR",
    		"und-ST": "pt-Latn-ST",
    		"und-Sund": "su-Sund-ID",
    		"und-SV": "es-Latn-SV",
    		"und-SY": "ar-Arab-SY",
    		"und-Sylo": "syl-Sylo-BD",
    		"und-Syrc": "syr-Syrc-IQ",
    		"und-Tagb": "tbw-Tagb-PH",
    		"und-Takr": "doi-Takr-IN",
    		"und-Tale": "tdd-Tale-CN",
    		"und-Talu": "khb-Talu-CN",
    		"und-Taml": "ta-Taml-IN",
    		"und-Tang": "txg-Tang-CN",
    		"und-Tavt": "blt-Tavt-VN",
    		"und-TD": "fr-Latn-TD",
    		"und-Telu": "te-Telu-IN",
    		"und-TF": "fr-Latn-TF",
    		"und-Tfng": "zgh-Tfng-MA",
    		"und-TG": "fr-Latn-TG",
    		"und-Tglg": "fil-Tglg-PH",
    		"und-TH": "th-Thai-TH",
    		"und-Thaa": "dv-Thaa-MV",
    		"und-Thai": "th-Thai-TH",
    		"und-Thai-CN": "lcp-Thai-CN",
    		"und-Thai-KH": "kdt-Thai-KH",
    		"und-Thai-LA": "kdt-Thai-LA",
    		"und-Tibt": "bo-Tibt-CN",
    		"und-Tirh": "mai-Tirh-IN",
    		"und-TJ": "tg-Cyrl-TJ",
    		"und-TK": "tkl-Latn-TK",
    		"und-TL": "pt-Latn-TL",
    		"und-TM": "tk-Latn-TM",
    		"und-TN": "ar-Arab-TN",
    		"und-TO": "to-Latn-TO",
    		"und-TR": "tr-Latn-TR",
    		"und-TV": "tvl-Latn-TV",
    		"und-TW": "zh-Hant-TW",
    		"und-TZ": "sw-Latn-TZ",
    		"und-UA": "uk-Cyrl-UA",
    		"und-UG": "sw-Latn-UG",
    		"und-Ugar": "uga-Ugar-SY",
    		"und-UY": "es-Latn-UY",
    		"und-UZ": "uz-Latn-UZ",
    		"und-VA": "it-Latn-VA",
    		"und-Vaii": "vai-Vaii-LR",
    		"und-VE": "es-Latn-VE",
    		"und-VN": "vi-Latn-VN",
    		"und-VU": "bi-Latn-VU",
    		"und-Wara": "hoc-Wara-IN",
    		"und-Wcho": "nnp-Wcho-IN",
    		"und-WF": "fr-Latn-WF",
    		"und-WS": "sm-Latn-WS",
    		"und-XK": "sq-Latn-XK",
    		"und-Xpeo": "peo-Xpeo-IR",
    		"und-Xsux": "akk-Xsux-IQ",
    		"und-YE": "ar-Arab-YE",
    		"und-Yiii": "ii-Yiii-CN",
    		"und-YT": "fr-Latn-YT",
    		"und-Zanb": "cmg-Zanb-MN",
    		"und-ZW": "sn-Latn-ZW",
    		unr: "unr-Beng-IN",
    		"unr-Deva": "unr-Deva-NP",
    		"unr-NP": "unr-Deva-NP",
    		unx: "unx-Beng-IN",
    		uok: "uok-Latn-ZZ",
    		ur: "ur-Arab-PK",
    		uri: "uri-Latn-ZZ",
    		urt: "urt-Latn-ZZ",
    		urw: "urw-Latn-ZZ",
    		usa: "usa-Latn-ZZ",
    		utr: "utr-Latn-ZZ",
    		uvh: "uvh-Latn-ZZ",
    		uvl: "uvl-Latn-ZZ",
    		uz: "uz-Latn-UZ",
    		"uz-AF": "uz-Arab-AF",
    		"uz-Arab": "uz-Arab-AF",
    		"uz-CN": "uz-Cyrl-CN",
    		vag: "vag-Latn-ZZ",
    		vai: "vai-Vaii-LR",
    		van: "van-Latn-ZZ",
    		ve: "ve-Latn-ZA",
    		vec: "vec-Latn-IT",
    		vep: "vep-Latn-RU",
    		vi: "vi-Latn-VN",
    		vic: "vic-Latn-SX",
    		viv: "viv-Latn-ZZ",
    		vls: "vls-Latn-BE",
    		vmf: "vmf-Latn-DE",
    		vmw: "vmw-Latn-MZ",
    		vo: "vo-Latn-001",
    		vot: "vot-Latn-RU",
    		vro: "vro-Latn-EE",
    		vun: "vun-Latn-TZ",
    		vut: "vut-Latn-ZZ",
    		wa: "wa-Latn-BE",
    		wae: "wae-Latn-CH",
    		waj: "waj-Latn-ZZ",
    		wal: "wal-Ethi-ET",
    		wan: "wan-Latn-ZZ",
    		war: "war-Latn-PH",
    		wbp: "wbp-Latn-AU",
    		wbq: "wbq-Telu-IN",
    		wbr: "wbr-Deva-IN",
    		wci: "wci-Latn-ZZ",
    		wer: "wer-Latn-ZZ",
    		wgi: "wgi-Latn-ZZ",
    		whg: "whg-Latn-ZZ",
    		wib: "wib-Latn-ZZ",
    		wiu: "wiu-Latn-ZZ",
    		wiv: "wiv-Latn-ZZ",
    		wja: "wja-Latn-ZZ",
    		wji: "wji-Latn-ZZ",
    		wls: "wls-Latn-WF",
    		wmo: "wmo-Latn-ZZ",
    		wnc: "wnc-Latn-ZZ",
    		wni: "wni-Arab-KM",
    		wnu: "wnu-Latn-ZZ",
    		wo: "wo-Latn-SN",
    		wob: "wob-Latn-ZZ",
    		wos: "wos-Latn-ZZ",
    		wrs: "wrs-Latn-ZZ",
    		wsg: "wsg-Gong-IN",
    		wsk: "wsk-Latn-ZZ",
    		wtm: "wtm-Deva-IN",
    		wuu: "wuu-Hans-CN",
    		wuv: "wuv-Latn-ZZ",
    		wwa: "wwa-Latn-ZZ",
    		xav: "xav-Latn-BR",
    		xbi: "xbi-Latn-ZZ",
    		xcr: "xcr-Cari-TR",
    		xes: "xes-Latn-ZZ",
    		xh: "xh-Latn-ZA",
    		xla: "xla-Latn-ZZ",
    		xlc: "xlc-Lyci-TR",
    		xld: "xld-Lydi-TR",
    		xmf: "xmf-Geor-GE",
    		xmn: "xmn-Mani-CN",
    		xmr: "xmr-Merc-SD",
    		xna: "xna-Narb-SA",
    		xnr: "xnr-Deva-IN",
    		xog: "xog-Latn-UG",
    		xon: "xon-Latn-ZZ",
    		xpr: "xpr-Prti-IR",
    		xrb: "xrb-Latn-ZZ",
    		xsa: "xsa-Sarb-YE",
    		xsi: "xsi-Latn-ZZ",
    		xsm: "xsm-Latn-ZZ",
    		xsr: "xsr-Deva-NP",
    		xwe: "xwe-Latn-ZZ",
    		yam: "yam-Latn-ZZ",
    		yao: "yao-Latn-MZ",
    		yap: "yap-Latn-FM",
    		yas: "yas-Latn-ZZ",
    		yat: "yat-Latn-ZZ",
    		yav: "yav-Latn-CM",
    		yay: "yay-Latn-ZZ",
    		yaz: "yaz-Latn-ZZ",
    		yba: "yba-Latn-ZZ",
    		ybb: "ybb-Latn-CM",
    		yby: "yby-Latn-ZZ",
    		yer: "yer-Latn-ZZ",
    		ygr: "ygr-Latn-ZZ",
    		ygw: "ygw-Latn-ZZ",
    		yi: "yi-Hebr-001",
    		yko: "yko-Latn-ZZ",
    		yle: "yle-Latn-ZZ",
    		ylg: "ylg-Latn-ZZ",
    		yll: "yll-Latn-ZZ",
    		yml: "yml-Latn-ZZ",
    		yo: "yo-Latn-NG",
    		yon: "yon-Latn-ZZ",
    		yrb: "yrb-Latn-ZZ",
    		yre: "yre-Latn-ZZ",
    		yrl: "yrl-Latn-BR",
    		yss: "yss-Latn-ZZ",
    		yua: "yua-Latn-MX",
    		yue: "yue-Hant-HK",
    		"yue-CN": "yue-Hans-CN",
    		"yue-Hans": "yue-Hans-CN",
    		yuj: "yuj-Latn-ZZ",
    		yut: "yut-Latn-ZZ",
    		yuw: "yuw-Latn-ZZ",
    		za: "za-Latn-CN",
    		zag: "zag-Latn-SD",
    		zdj: "zdj-Arab-KM",
    		zea: "zea-Latn-NL",
    		zgh: "zgh-Tfng-MA",
    		zh: "zh-Hans-CN",
    		"zh-AU": "zh-Hant-AU",
    		"zh-BN": "zh-Hant-BN",
    		"zh-Bopo": "zh-Bopo-TW",
    		"zh-GB": "zh-Hant-GB",
    		"zh-GF": "zh-Hant-GF",
    		"zh-Hanb": "zh-Hanb-TW",
    		"zh-Hant": "zh-Hant-TW",
    		"zh-HK": "zh-Hant-HK",
    		"zh-ID": "zh-Hant-ID",
    		"zh-MO": "zh-Hant-MO",
    		"zh-MY": "zh-Hant-MY",
    		"zh-PA": "zh-Hant-PA",
    		"zh-PF": "zh-Hant-PF",
    		"zh-PH": "zh-Hant-PH",
    		"zh-SR": "zh-Hant-SR",
    		"zh-TH": "zh-Hant-TH",
    		"zh-TW": "zh-Hant-TW",
    		"zh-US": "zh-Hant-US",
    		"zh-VN": "zh-Hant-VN",
    		zhx: "zhx-Nshu-CN",
    		zia: "zia-Latn-ZZ",
    		zlm: "zlm-Latn-TG",
    		zmi: "zmi-Latn-MY",
    		zne: "zne-Latn-ZZ",
    		zu: "zu-Latn-ZA",
    		zza: "zza-Latn-TR"
    	}
    };

    var __spreadArrays$1 = (undefined && undefined.__spreadArrays) || function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
    function canonicalizeAttrs(strs) {
        return Object.keys(strs.reduce(function (all, str) {
            all[str.toLowerCase()] = 1;
            return all;
        }, {})).sort();
    }
    function canonicalizeKVs(arr) {
        var all = {};
        var result = [];
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var kv = arr_1[_i];
            if (kv[0] in all) {
                continue;
            }
            all[kv[0]] = 1;
            if (!kv[1] || kv[1] === 'true') {
                result.push([kv[0].toLowerCase()]);
            }
            else {
                result.push([kv[0].toLowerCase(), kv[1].toLowerCase()]);
            }
        }
        return result.sort(compareKV);
    }
    function compareKV(t1, t2) {
        return t1[0] < t2[0] ? -1 : t1[0] > t2[0] ? 1 : 0;
    }
    function compareExtension(e1, e2) {
        return e1.type < e2.type ? -1 : e1.type > e2.type ? 1 : 0;
    }
    function mergeVariants(v1, v2) {
        var result = __spreadArrays$1(v1);
        for (var _i = 0, v2_1 = v2; _i < v2_1.length; _i++) {
            var v = v2_1[_i];
            if (v1.indexOf(v) < 0) {
                result.push(v);
            }
        }
        return result;
    }
    /**
     * CAVEAT: We don't do this section in the spec bc they have no JSON data
     * Use the bcp47 data to replace keys, types, tfields, and tvalues by their canonical forms. See Section 3.6.4 U Extension Data Files) and Section 3.7.1 T Extension Data Files. The aliases are in the alias attribute value, while the canonical is in the name attribute value. For example,
    Because of the following bcp47 data:
    <key name="ms"…>…<type name="uksystem" … alias="imperial" … />…</key>
    We get the following transformation:
    en-u-ms-imperial ⇒ en-u-ms-uksystem
     * @param lang
     */
    function canonicalizeUnicodeLanguageId(unicodeLanguageId) {
        /**
         * If the language subtag matches the type attribute of a languageAlias element in Supplemental Data, replace the language subtag with the replacement value.
         *  1. If there are additional subtags in the replacement value, add them to the result, but only if there is no corresponding subtag already in the tag.
         *  2. Five special deprecated grandfathered codes (such as i-default) are in type attributes, and are also replaced.
         */
        // From https://github.com/unicode-org/icu/blob/master/icu4j/main/classes/core/src/com/ibm/icu/util/ULocale.java#L1246
        // Try language _ variant
        var finalLangAst = unicodeLanguageId;
        if (unicodeLanguageId.variants.length) {
            var replacedLang_1 = '';
            for (var _i = 0, _a = unicodeLanguageId.variants; _i < _a.length; _i++) {
                var variant = _a[_i];
                if ((replacedLang_1 =
                    languageAlias[emitUnicodeLanguageId({
                        lang: unicodeLanguageId.lang,
                        variants: [variant],
                    })])) {
                    var replacedLangAst = parseUnicodeLanguageId(replacedLang_1.split(SEPARATOR));
                    finalLangAst = {
                        lang: replacedLangAst.lang,
                        script: finalLangAst.script || replacedLangAst.script,
                        region: finalLangAst.region || replacedLangAst.region,
                        variants: mergeVariants(finalLangAst.variants, replacedLangAst.variants),
                    };
                    break;
                }
            }
        }
        // language _ script _ country
        // ug-Arab-CN -> ug-CN
        if (finalLangAst.script && finalLangAst.region) {
            var replacedLang_2 = languageAlias[emitUnicodeLanguageId({
                lang: finalLangAst.lang,
                script: finalLangAst.script,
                region: finalLangAst.region,
                variants: [],
            })];
            if (replacedLang_2) {
                var replacedLangAst = parseUnicodeLanguageId(replacedLang_2.split(SEPARATOR));
                finalLangAst = {
                    lang: replacedLangAst.lang,
                    script: replacedLangAst.script,
                    region: replacedLangAst.region,
                    variants: finalLangAst.variants,
                };
            }
        }
        // language _ country
        // eg. az_AZ -> az_Latn_A
        if (finalLangAst.region) {
            var replacedLang_3 = languageAlias[emitUnicodeLanguageId({
                lang: finalLangAst.lang,
                region: finalLangAst.region,
                variants: [],
            })];
            if (replacedLang_3) {
                var replacedLangAst = parseUnicodeLanguageId(replacedLang_3.split(SEPARATOR));
                finalLangAst = {
                    lang: replacedLangAst.lang,
                    script: finalLangAst.script || replacedLangAst.script,
                    region: replacedLangAst.region,
                    variants: finalLangAst.variants,
                };
            }
        }
        // only language
        // e.g. twi -> ak
        var replacedLang = languageAlias[emitUnicodeLanguageId({
            lang: finalLangAst.lang,
            variants: [],
        })];
        if (replacedLang) {
            var replacedLangAst = parseUnicodeLanguageId(replacedLang.split(SEPARATOR));
            finalLangAst = {
                lang: replacedLangAst.lang,
                script: finalLangAst.script || replacedLangAst.script,
                region: finalLangAst.region || replacedLangAst.region,
                variants: finalLangAst.variants,
            };
        }
        if (finalLangAst.region) {
            var region = finalLangAst.region.toUpperCase();
            var regionAlias = territoryAlias[region];
            var replacedRegion = void 0;
            if (regionAlias) {
                var regions = regionAlias.split(' ');
                replacedRegion = regions[0];
                var likelySubtag = supplemental.likelySubtags[emitUnicodeLanguageId({
                    lang: finalLangAst.lang,
                    script: finalLangAst.script,
                    variants: [],
                })];
                if (likelySubtag) {
                    var likelyRegion = parseUnicodeLanguageId(likelySubtag.split(SEPARATOR)).region;
                    if (likelyRegion && regions.indexOf(likelyRegion) > -1) {
                        replacedRegion = likelyRegion;
                    }
                }
            }
            if (replacedRegion) {
                finalLangAst.region = replacedRegion;
            }
            finalLangAst.region = finalLangAst.region.toUpperCase();
        }
        if (finalLangAst.script) {
            finalLangAst.script =
                finalLangAst.script[0].toUpperCase() +
                    finalLangAst.script.slice(1).toLowerCase();
            if (scriptAlias[finalLangAst.script]) {
                finalLangAst.script = scriptAlias[finalLangAst.script];
            }
        }
        if (finalLangAst.variants.length) {
            for (var i = 0; i < finalLangAst.variants.length; i++) {
                var variant = finalLangAst.variants[i].toLowerCase();
                if (variantAlias[variant]) {
                    var alias = variantAlias[variant];
                    if (isUnicodeVariantSubtag(alias)) {
                        finalLangAst.variants[i] = alias;
                    }
                    else if (isUnicodeLanguageSubtag(alias)) {
                        // Yes this can happen per the spec
                        finalLangAst.lang = alias;
                    }
                }
            }
            finalLangAst.variants.sort();
        }
        return finalLangAst;
    }
    /**
     * Canonicalize based on
     * https://www.unicode.org/reports/tr35/tr35.html#Canonical_Unicode_Locale_Identifiers
     * https://tc39.es/ecma402/#sec-canonicalizeunicodelocaleid
     * IMPORTANT: This modifies the object inline
     * @param locale
     */
    function canonicalizeUnicodeLocaleId(locale) {
        locale.lang = canonicalizeUnicodeLanguageId(locale.lang);
        if (locale.extensions) {
            for (var _i = 0, _a = locale.extensions; _i < _a.length; _i++) {
                var extension = _a[_i];
                switch (extension.type) {
                    case 'u':
                        extension.keywords = canonicalizeKVs(extension.keywords);
                        if (extension.attributes) {
                            extension.attributes = canonicalizeAttrs(extension.attributes);
                        }
                        break;
                    case 't':
                        if (extension.lang) {
                            extension.lang = canonicalizeUnicodeLanguageId(extension.lang);
                        }
                        extension.fields = canonicalizeKVs(extension.fields);
                        break;
                    default:
                        extension.value = extension.value.toLowerCase();
                        break;
                }
            }
            locale.extensions.sort(compareExtension);
        }
        return locale;
    }

    function canonicalizeLocaleList(locales) {
        if (locales === undefined) {
            return [];
        }
        var seen = [];
        if (typeof locales === 'string') {
            locales = [locales];
        }
        for (var _i = 0, locales_1 = locales; _i < locales_1.length; _i++) {
            var locale = locales_1[_i];
            var canonicalizedTag = emitUnicodeLocaleId(canonicalizeUnicodeLocaleId(parseUnicodeLocaleId(locale)));
            if (seen.indexOf(canonicalizedTag) < 0) {
                seen.push(canonicalizedTag);
            }
        }
        return seen;
    }
    function getCanonicalLocales(locales) {
        return canonicalizeLocaleList(locales);
    }

    if (typeof Intl === 'undefined') {
        if (typeof window !== 'undefined') {
            Object.defineProperty(window, 'Intl', {
                value: {},
            });
        }
        else if (typeof global !== 'undefined') {
            Object.defineProperty(global, 'Intl', {
                value: {},
            });
        }
    }
    if (!('getCanonicalLocales' in Intl) ||
        // Native Intl.getCanonicalLocales is just buggy
        Intl.getCanonicalLocales('und-x-private')[0] === 'x-private') {
        Object.defineProperty(Intl, 'getCanonicalLocales', {
            value: getCanonicalLocales,
            writable: true,
            enumerable: false,
            configurable: true,
        });
    }

})));

