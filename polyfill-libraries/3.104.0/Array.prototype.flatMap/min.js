CreateMethodProperty(Array.prototype,"flatMap",function e(r){"use strict";var t=ToObject(this),a=ToLength(Get(t,"length"));if(!1===IsCallable(r))throw new TypeError("mapperFunction is not callable.");var n;n=1 in arguments?arguments[1]:undefined;var o=ArraySpeciesCreate(t,0);return FlattenIntoArray(o,t,a,0,1,r,n),o});