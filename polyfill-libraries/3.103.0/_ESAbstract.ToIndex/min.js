function ToIndex(e){if(e===undefined)var n=0;else{var r=ToInteger(e);if(r<0)throw new RangeError("integerIndex < 0");if(n=ToLength(r),!1===SameValueZero(r,n))throw new RangeError("integerIndex < 0")}return n}