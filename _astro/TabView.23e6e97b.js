import{r as v}from"./index.45a47ed6.js";import{j as e}from"./jsx-runtime.73bdaf71.js";function C({children:a,className:t}){return e.jsx("div",{className:`w-full h-min min-h-[8rem] bg-white rounded-3xl shadow-xl p-6 ${t??""}`,children:a})}function $(a){const{tabs:t,headerClassesName:l,contentClassesName:d,tabsClassesName:m,useContentCard:x}=a,b=Math.max(t.findIndex(s=>s?.preSelected),0),[i,u]=v.useState(b),h=t.map(({tabId:s,name:c},r)=>{const n=r===i;return e.jsx("button",{className:`py-1 px-0 ${n?"text-black border-black":"text-gray-400 border-transparent"} hover:text-black border-b-2 hover:border-black font-medium cursor-pointer`,onClick:()=>u(r),children:c},s)}),p=t.map(({tabId:s},c)=>{const r=c===i,n=a[s],o=`col-start-1 row-start-1 ${r?"":"collapse"} ${m??""}`;return x?e.jsx(C,{className:o,children:n},s):e.jsx("div",{className:o,children:n},s)});return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:`flex justify-around space-x-3 ${l??""}`,children:h}),e.jsx("div",{className:`grid ${d??""}`,children:p})]})}export{$ as default};
