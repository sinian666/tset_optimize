Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({locale:"dsb",categories:{cardinal:["one","two","few","other"],ordinal:["other"]},fn:function(l,e){var t=String(l).split("."),a=t[0],o=t[1]||"",n=!t[1],r=a.slice(-2),c=o.slice(-2);return e?"other":n&&1==r||1==c?"one":n&&2==r||2==c?"two":n&&(3==r||4==r)||3==c||4==c?"few":"other"}});