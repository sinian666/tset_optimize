CreateMethodProperty(String.prototype,"padEnd",function e(r){"use strict";var t=arguments.length>1?arguments[1]:undefined,n=RequireObjectCoercible(this),i=ToString(n),o=ToLength(r),u=i.length;if(o<=u)return i;if(t===undefined)var d=" ";else d=ToString(t);if(""===d)return i;for(var f=o-u,g="",s=0;s<f;s++)g+=d;return g=g.substr(0,f),i+g});