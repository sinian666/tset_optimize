CreateMethodProperty(Array.prototype,"reduce",function e(r){var t=ToObject(this),n=t instanceof String?t.split(""):t,o=ToLength(Get(n,"length"));if(!1===IsCallable(r))throw new TypeError(r+" is not a function");var i=arguments.length>1?arguments[1]:undefined;if(0===o&&arguments.length<2)throw new TypeError("Reduce of empty array with no initial value");var a=0,f=undefined;if(arguments.length>1)f=i;else{for(var l=!1;!1===l&&a<o;){var h=ToString(a);l=HasProperty(n,h),l&&(f=Get(n,h)),a+=1}if(!1===l)throw new TypeError("Reduce of empty array with no initial value")}for(;a<o;){if(h=ToString(a),l=HasProperty(n,h)){var y=Get(n,h);f=Call(r,undefined,[f,y,a,t])}a+=1}return f});