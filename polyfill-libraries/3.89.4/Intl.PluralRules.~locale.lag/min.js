Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({locale:"lag",categories:{cardinal:["zero","one","other"],ordinal:["other"]},fn:function(l,a){var e=String(l).split("."),o=e[0];return a?"other":0==l?"zero":0!=o&&1!=o||0==l?"other":"one"}});