!function(t,r,e){"use strict";var n,o=0,u=""+Math.random(),l="__symbol:",c=l.length,a="__symbol@@"+u,i="defineProperty",f="defineProperties",s="getOwnPropertyNames",v="getOwnPropertyDescriptor",b="propertyIsEnumerable",y=t.prototype,h=y.hasOwnProperty,p=y[b],m=y.toString,g=Array.prototype.concat,w=t.getOwnPropertyNames?t.getOwnPropertyNames(self):[],d=t[s],S=function L(t){if("[object Window]"===m.call(t))try{return d(t)}catch(r){return g.call([],w)}return d(t)},P=t[v],j=t.create,O=t.keys,E=t.freeze||t,N=t[i],_=t[f],k=P(t,s),T=function(t,r,e){if(!h.call(t,a))try{N(t,a,{enumerable:!1,configurable:!1,writable:!1,value:{}})}catch(n){t[a]={}}t[a]["@@"+r]=e},z=function(t,r){var e=j(t);return S(r).forEach(function(t){M.call(r,t)&&G(e,t,r[t])}),e},A=function(t){var r=j(t);return r.enumerable=!1,r},D=function Q(){},F=function(t){return t!=a&&!h.call(x,t)},I=function(t){return t!=a&&h.call(x,t)},M=function R(t){var r=""+t;return I(r)?h.call(this,r)&&this[a]["@@"+r]:p.call(this,t)},W=function(r){var e={enumerable:!1,configurable:!0,get:D,set:function(t){n(this,r,{enumerable:!1,configurable:!0,writable:!0,value:t}),T(this,r,!0)}};try{N(y,r,e)}catch(u){y[r]=e.value}x[r]=N(t(r),"constructor",B);var o=P(q.prototype,"description");return o&&N(x[r],"description",o),E(x[r])},q=function U(){var t=arguments[0];if(this instanceof U)throw new TypeError("Symbol is not a constructor");return W(l.concat(t||"",u,++o))},x=j(null),B={value:q},C=function(t){return x[t]},G=function V(t,r,e){var o=""+r;return I(o)?(n(t,o,e.enumerable?A(e):e),T(t,o,!!e.enumerable)):N(t,r,e),t},H=function(t){return function(r){return h.call(t,a)&&h.call(t[a],"@@"+r)}},J=function X(t){return S(t).filter(t===y?H(t):I).map(C)};k.value=G,N(t,i,k),k.value=J,N(t,"getOwnPropertySymbols",k),k.value=function Y(t){return S(t).filter(F)},N(t,s,k),k.value=function Z(t,r){var e=J(r);return e.length?O(r).concat(e).forEach(function(e){M.call(r,e)&&G(t,e,r[e])}):_(t,r),t},N(t,f,k),k.value=M,N(y,b,k),k.value=q,N(e,"Symbol",k),k.value=function(t){var r=l.concat(l,t,u);return r in y?x[r]:W(r)},N(q,"for",k),k.value=function(t){if(F(t))throw new TypeError(t+" is not a symbol");return h.call(x,t)?t.slice(2*c,-u.length):void 0},N(q,"keyFor",k),k.value=function $(t,r){var e=P(t,r);return e&&I(r)&&(e.enumerable=M.call(t,r)),e},N(t,v,k),k.value=function(t,r){return 1===arguments.length||void 0===r?j(t):z(t,r)},N(t,"create",k);var K=null===function(){return this}.call(null);k.value=K?function(){var t=m.call(this);return"[object String]"===t&&I(this)?"[object Symbol]":t}:function(){if(this===window)return"[object Null]";var t=m.call(this);return"[object String]"===t&&I(this)?"[object Symbol]":t},N(y,"toString",k),n=function(t,r,e){var n=P(y,r);delete y[r],N(t,r,e),t!==y&&N(y,r,n)}}(Object,0,this);