!function(){function u(u,e){function t(){this.constructor=u}if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");L(u,e),u.prototype=null===e?Object.create(e):(t.prototype=e.prototype,new t)}function e(u,e,t,r){u.get(e)||u.set(e,Object.create(null)),u.get(e)[t]=r}function t(u,e,t){return r(u,e,t)[t]}function r(u,e){for(var t=[],r=2;r<arguments.length;r++)t[r-2]=arguments[r];var n=u.get(e);if(!n)throw new TypeError(e+" InternalSlot has not been initialized");return t.reduce(function(u,e){return u[e]=n[e],u},Object.create(null))}function n(u,e,t){if(void 0===t&&(t=Error),!u)throw new t(e)}function a(u){return Intl.getCanonicalLocales(u)}function o(u){if("symbol"==typeof u)throw TypeError("Cannot convert a Symbol value to a string");return String(u)}function i(u){if(null==u)throw new TypeError("undefined/null cannot be converted to object");return Object(u)}function l(u,e,t,r,n){if("object"!=typeof u)throw new TypeError("Options must be an object");var a=u[e];if(void 0!==a){if("boolean"!==t&&"string"!==t)throw new TypeError("invalid type");if("boolean"===t&&(a=Boolean(a)),"string"===t&&(a=o(a)),void 0!==r&&!r.filter(function(u){return u==a}).length)throw new RangeError(a+" is not within "+r.join(", "));return a}return n}function D(u,e){for(var t=e;;){if(u.has(t))return t;var r=t.lastIndexOf("-");if(!~r)return;r>=2&&"-"===t[r-2]&&(r-=2),t=t.slice(0,r)}}function c(u,e,t){for(var r={locale:""},n=0,a=e;n<a.length;n++){var o=a[n],i=o.replace(_,""),l=D(u,i);if(l)return r.locale=l,o!==i&&(r.extension=o.slice(i.length+1,o.length)),r}return r.locale=t(),r}function s(u,e,t){var r={},n=new Set;u.forEach(function(u){var e=new Intl.Locale(u).minimize().toString();r[e]=u,n.add(e)});for(var a,o=0,i=e;o<i.length;o++){var l=i[o];if(a)break;var c=l.replace(_,"");if(u.has(c)){a=c;break}if(n.has(c)){a=r[c];break}var s=new Intl.Locale(c),F=s.maximize().toString(),f=s.minimize().toString();if(n.has(f)){a=r[f];break}a=D(n,F)}return{locale:a||t()}}function F(u,e){n(2===e.length,"key must have 2 elements");var t=u.length,r="-"+e+"-",a=u.indexOf(r);if(-1!==a){for(var o=a+4,i=o,l=o,D=!1;!D;){var c=u.indexOf("-",l),s=void 0;s=-1===c?t-l:c-l,2===s?D=!0:-1===c?(i=t,D=!0):(i=c,l=c+1)}return u.slice(o,i)}if(r="-"+e,-1!==(a=u.indexOf(r))&&a+3===t)return""}function f(u,e,t,r,a,o){var i,l=t.localeMatcher;i="lookup"===l?c(u,e,o):s(u,e,o);for(var D=i.locale,f={locale:"",dataLocale:D},E="-u",p=0,d=r;p<d.length;p++){var g=d[p];n(D in a,"Missing locale data for "+D);var C=a[D];n("object"==typeof C&&null!==C,"locale data "+g+" must be an object");var y=C[g];n(Array.isArray(y),"keyLocaleData for "+g+" must be an array");var v=y[0];n("string"==typeof v||null===v,"value must be string or null but got "+typeof v+" in key "+g);var h="";if(i.extension){var b=F(i.extension,g);void 0!==b&&(""!==b?~y.indexOf(b)&&(v=b,h="-"+g+"-"+v):~b.indexOf("true")&&(v="true",h="-"+g))}if(g in t){var A=t[g];n("string"==typeof A||void 0===A||null===A,"optionsValue must be String, Undefined or Null"),~y.indexOf(A)&&A!==v&&(v=A,h="")}f[g]=v,E+=h}if(E.length>2){var m=D.indexOf("-x-");if(-1===m)D+=E;else{D=D.slice(0,m)+E+D.slice(m,D.length)}D=Intl.getCanonicalLocales(D)[0]}return f.locale=D,f}function E(u){return u.replace(/([a-z])/g,function(u,e){return e.toUpperCase()})}function p(u){return u=E(u),3===u.length&&!I.test(u)}function d(u){return S.test(u)}function g(u){return z.test(u)}function C(u,e){if("language"===u)return a([e])[0];if("region"===u){if(!d(e))throw RangeError("invalid region");return e.toUpperCase()}if("script"===u){if(!g(e))throw RangeError("invalid script");return""+e[0].toUpperCase()+e.slice(1).toLowerCase()}if(n("currency"===u,"invalid type"),!p(e))throw RangeError("invalid currency");return e.toUpperCase()}function y(u){if(void 0===u)return Object.create(null);if("object"==typeof u)return u;throw new TypeError("Options must be an object")}function v(u){return u.slice(u.indexOf("-")+1)}function h(u,e){for(var t=[],r=0,n=e;r<n.length;r++){var a=n[r],o=a.replace(_,""),i=D(u,o);i&&t.push(i)}return t}function b(u,e,t){return void 0!==t&&(t=i(t),l(t,"localeMatcher","string",["lookup","best fit"],"best fit")),h(u,e)}function A(u,e){switch(u){case"language":return/^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?(-([a-z\d]{5,8}|\d[a-z\d]{3}))*$/i.test(e);case"region":return/^([a-z]{2}|\d{3})$/i.test(e);case"script":return/^[a-z]{4}$/i.test(e);case"currency":return p(e)}}function m(u,e){return t(M,u,e)}function B(u,t,r){e(M,u,t,r)}function w(u,e){if(!(u instanceof R))throw TypeError("Method Intl.DisplayNames.prototype."+e+" called on incompatible receiver")}function x(){var u=Intl.DisplayNames;return!(!u||u.polyfilled)&&"CA"===new u(["en"],{type:"region"}).of("CA")}function O(){var u=Intl.DisplayNames;return!(!u||u.polyfilled)&&"Arabic"!==new u(["en"],{type:"script"}).of("arab")}var j,L=function(u,e){return(L=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(u,e){u.__proto__=e}||function(u,e){for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(u[t]=e[t])})(u,e)},k=function(){return k=Object.assign||function u(e){for(var t,r=1,n=arguments.length;r<n;r++){t=arguments[r];for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a])}return e},k.apply(this,arguments)},_=/-u(?:-[0-9a-z]{2,8})+/gi;!function(u){u.startRange="startRange",u.shared="shared",u.endRange="endRange"}(j||(j={}));var I=/[^A-Z]/,S=/^([a-z]{2}|[0-9]{3})$/i,z=/^[a-z]{4}$/i,T=["angle-degree","area-acre","area-hectare","concentr-percent","digital-bit","digital-byte","digital-gigabit","digital-gigabyte","digital-kilobit","digital-kilobyte","digital-megabit","digital-megabyte","digital-petabyte","digital-terabit","digital-terabyte","duration-day","duration-hour","duration-millisecond","duration-minute","duration-month","duration-second","duration-week","duration-year","length-centimeter","length-foot","length-inch","length-kilometer","length-meter","length-mile-scandinavian","length-mile","length-millimeter","length-yard","mass-gram","mass-kilogram","mass-ounce","mass-pound","mass-stone","temperature-celsius","temperature-fahrenheit","volume-fluid-ounce","volume-gallon","volume-liter","volume-milliliter"],N=(T.map(v),/[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20BF\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC1\uFDFC\uFDFD\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDE8\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEE0-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF73\uDF80-\uDFD8\uDFE0-\uDFEB]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDD78\uDD7A-\uDDCB\uDDCD-\uDE53\uDE60-\uDE6D\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6\uDF00-\uDF92\uDF94-\uDFCA]/),R=(new RegExp("^"+N.source),new RegExp(N.source+"$"),function(e){function t(){var u=null!==e&&e.apply(this,arguments)||this;return u.type="MISSING_LOCALE_DATA",u}u(t,e)}(Error),function(){function u(e,t){if(void 0===this.constructor)throw TypeError("Constructor Intl.DisplayNames requires 'new'");var r=a(e);t=y(t);var o=Object.create(null),i=u.localeData,D=l(t,"localeMatcher","string",["lookup","best fit"],"best fit");o.localeMatcher=D;var c=f(u.availableLocales,r,o,[],u.localeData,u.getDefaultLocale),s=l(t,"style","string",["narrow","short","long"],"long");B(this,"style",s);var F=l(t,"type","string",["language","currency","region","script"],void 0);if(void 0===F)throw TypeError('Intl.DisplayNames constructor requires "type" option');B(this,"type",F),B(this,"fallback",l(t,"fallback","string",["code","none"],"code")),B(this,"locale",c.locale);var E=c.dataLocale,p=i[E];n(!!p,"Missing locale data for "+E),B(this,"localeData",p),n(void 0!==p,"locale data for "+c.locale+" does not exist.");var d=p.types;n("object"==typeof d&&null!=d,"invalid types data");var g=d[F];n("object"==typeof g&&null!=g,"invalid typeFields data");var C=g[s];n("object"==typeof C&&null!=C,"invalid styleFields data"),B(this,"fields",C)}return u.supportedLocalesOf=function(e,t){return b(u.availableLocales,a(e),t)},u.__addLocaleData=function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];for(var r=0,n=e;r<n.length;r++){var a=n[r],o=a.data,i=a.locale,l=new Intl.Locale(i).minimize().toString();u.localeData[i]=u.localeData[l]=o,u.availableLocales.add(l),u.availableLocales.add(i),u.__defaultLocale||(u.__defaultLocale=l)}},u.prototype.of=function(u){w(this,"of");var e=m(this,"type"),t=o(u);if(!A(e,t))throw RangeError("invalid code for Intl.DisplayNames.prototype.of");var n,a=r(M,this,"localeData","style","fallback"),i=a.localeData,l=a.style,D=a.fallback,c=C(e,t);if("language"===e){var s=/-([a-z]{2}|\d{3})\b/i.exec(c);s&&(c=c.substring(0,s.index)+c.substring(s.index+s[0].length),n=s[1])}var F=i.types[e],f=F[l][c]||F["long"][c];if(void 0!==f){if(!n)return f;var E=i.types.region,p=E[l][n]||E["long"][n];if(p||"code"===D){return i.patterns.locale.replace("{0}",f).replace("{1}",p||n)}}if("code"===D)return t},u.prototype.resolvedOptions=function(){return w(this,"resolvedOptions"),k({},r(M,this,"locale","style","type","fallback"))},u.getDefaultLocale=function(){return u.__defaultLocale},u.localeData={},u.availableLocales=new Set,u.__defaultLocale="",u.polyfilled=!0,u}());try{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(R.prototype,Symbol.toStringTag,{value:"Intl.DisplayNames",configurable:!0,enumerable:!1,writable:!1}),Object.defineProperty(R,"length",{value:2,writable:!1,enumerable:!1,configurable:!0})}catch(P){}var M=new WeakMap;(function $(){return!Intl.DisplayNames||x()||O()})()&&Object.defineProperty(Intl,"DisplayNames",{value:R,enumerable:!1,writable:!0,configurable:!0})}();