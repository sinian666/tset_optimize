Intl.PluralRules&&"function"==typeof Intl.PluralRules.__addLocaleData&&Intl.PluralRules.__addLocaleData({data:{categories:{cardinal:["zero","one","other"],ordinal:["other"]},fn:function(e,l){var a=String(e).split("."),r=a[1]||"",t=r.length,o=Number(a[0])==e,n=o&&a[0].slice(-1),c=o&&a[0].slice(-2),i=r.slice(-2),u=r.slice(-1);return l?"other":o&&0==n||c>=11&&c<=19||2==t&&i>=11&&i<=19?"zero":1==n&&11!=c||2==t&&1==u&&11!=i||2!=t&&1==u?"one":"other"}},locale:"prg"});