Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{categories:{cardinal:["zero","one","two","few","many","other"],ordinal:["other"]},fn:function(a,e){var l=String(a).split("."),t=Number(l[0])==a,o=t&&l[0].slice(-2);return e?"other":0==a?"zero":1==a?"one":2==a?"two":o>=3&&o<=10?"few":o>=11&&o<=99?"many":"other"}},locale:"ar"});