Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{categories:{cardinal:["zero","one","two","few","many","other"],ordinal:["one","many","other"]},fn:function(e,a){var l=String(e).split("."),n=Number(l[0])==e,o=n&&l[0].slice(-2),t=n&&l[0].slice(-3),r=n&&l[0].slice(-5),c=n&&l[0].slice(-6);return a?n&&e>=1&&e<=4||o>=1&&o<=4||o>=21&&o<=24||o>=41&&o<=44||o>=61&&o<=64||o>=81&&o<=84?"one":5==e||5==o?"many":"other":0==e?"zero":1==e?"one":2==o||22==o||42==o||62==o||82==o||n&&0==t&&(r>=1e3&&r<=2e4||4e4==r||6e4==r||8e4==r)||0!=e&&1e5==c?"two":3==o||23==o||43==o||63==o||83==o?"few":1==e||1!=o&&21!=o&&41!=o&&61!=o&&81!=o?"other":"many"}},locale:"kw"});