"navigator"in self||(self.navigator={}),self.navigator.sendBeacon=function e(t,n){try{var r=new XMLHttpRequest;return r.open("POST",t,!1),r.onerror=function(){},r.setRequestHeader("Accept","*/*"),"string"==typeof n?r.setRequestHeader("Content-Type","text/plain;charset=UTF-8"):"[object Blob]"===Object.prototype.toString.call(n)&&n.type&&r.setRequestHeader("Content-Type",n.type),r.send(n),!0}catch(o){return!1}};