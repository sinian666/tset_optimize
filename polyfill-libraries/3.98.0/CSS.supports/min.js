!function(){function n(n,t){var r=n.split(t);if(r.length>1)return r.map(function(n,t,r){return t%2==0?n+r[t+1]:""}).filter(Boolean)}if("supportsCSS"in window)return window.CSS={},void(window.CSS.supports=window.supportsCSS);if("CSS"in window||(window.CSS={}),!("supports"in window.CSS)){var t={};window.CSS.supports=function(r,i){var o=[r,i].toString();return o in t?t[o]:t[o]=function e(t,r){var i=document.createElement("div").style;if("string"!=typeof t||r)return"string"==typeof t&&"string"==typeof r&&(i.cssText=t+":"+r,!!i.length);var o=n(t,/([)])\s*or\s*([(])/gi);if(o)return o.some(function(n){return window.CSS.supports(n)});var e=n(t,/([)])\s*and\s*([(])/gi);return e?e.every(function(n){return window.CSS.supports(n)}):(i.cssText=t.replace("(","").replace(/[)]$/,""),!!i.length)}(r,i)}}}();