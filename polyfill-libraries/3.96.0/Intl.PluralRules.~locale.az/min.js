Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{az:{categories:{cardinal:["one","other"],ordinal:["one","few","many","other"]},fn:function(a,e){var l=String(a).split("."),n=l[0],t=n.slice(-1),o=n.slice(-2),r=n.slice(-3);return e?1==t||2==t||5==t||7==t||8==t||20==o||50==o||70==o||80==o?"one":3==t||4==t||100==r||200==r||300==r||400==r||500==r||600==r||700==r||800==r||900==r?"few":0==n||6==t||40==o||60==o||90==o?"many":"other":1==a?"one":"other"}}},availableLocales:["az"]});