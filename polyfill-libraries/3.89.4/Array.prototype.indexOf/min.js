CreateMethodProperty(Array.prototype,"indexOf",function r(t){var e=ToObject(this),n=ToLength(Get(e,"length"));if(0===n)return-1;var i=ToInteger(arguments[1]);if(i>=n)return-1;if(i>=0)var o=1/i==-Infinity?0:i;else(o=n+i)<0&&(o=0);for(;o<n;){if(HasProperty(e,ToString(o))){if(t===Get(e,ToString(o)))return o}o+=1}return-1});