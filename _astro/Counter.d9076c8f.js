import{r as p}from"./index.45a47ed6.js";var n={},d={get exports(){return n},set exports(r){n=r}},s={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var f=p,x=Symbol.for("react.element"),m=Symbol.for("react.fragment"),_=Object.prototype.hasOwnProperty,a=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,y={key:!0,ref:!0,__self:!0,__source:!0};function c(r,e,l){var t,o={},u=null,i=null;l!==void 0&&(u=""+l),e.key!==void 0&&(u=""+e.key),e.ref!==void 0&&(i=e.ref);for(t in e)_.call(e,t)&&!y.hasOwnProperty(t)&&(o[t]=e[t]);if(r&&r.defaultProps)for(t in e=r.defaultProps,e)o[t]===void 0&&(o[t]=e[t]);return{$$typeof:x,type:r,key:u,ref:i,props:o,_owner:a.current}}s.Fragment=m;s.jsx=c;s.jsxs=c;(function(r){r.exports=s})(d);const b=()=>{const[r,e]=p.useState(0);return n.jsxs("div",{children:[n.jsxs("div",{children:["Counter: ",r]}),n.jsx("button",{className:"m-1 px-2.5 py-1.5 text-white bg-blue-600 rounded-lg",onClick:()=>e(r+1),children:"Increment"}),n.jsx("button",{className:"m-1 px-2.5 py-1.5 text-white bg-blue-600 rounded-lg",onClick:()=>e(r-1),children:"Decrement"})]})};export{b as default};
