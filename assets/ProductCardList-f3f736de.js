import{a3 as g,k as S,g as R,d as A,a4 as j,s as P,_ as h,a5 as x,r as E,e as _,f as I,j as i,b as w,h as O,F as W,u as M,G as U,I as F,a6 as T}from"./index-d1e9d783.js";import{S as D,E as B,f as X,h as K}from"./swiper-e31d1d58.js";import{addToCart as v}from"./cartSlice-0c1f42b2.js";import{u as L}from"./useNotification-a88ee381.js";function V(e,t=0,s=1){return S(e,t,s)}function q(e){e=e.slice(1);const t=new RegExp(`.{1,${e.length>=6?2:1}}`,"g");let s=e.match(t);return s&&s[0].length===1&&(s=s.map(a=>a+a)),s?`rgb${s.length===4?"a":""}(${s.map((a,n)=>n<3?parseInt(a,16):Math.round(parseInt(a,16)/255*1e3)/1e3).join(", ")})`:""}function N(e){if(e.type)return e;if(e.charAt(0)==="#")return N(q(e));const t=e.indexOf("("),s=e.substring(0,t);if(["rgb","rgba","hsl","hsla","color"].indexOf(s)===-1)throw new Error(g(9,e));let a=e.substring(t+1,e.length-1),n;if(s==="color"){if(a=a.split(" "),n=a.shift(),a.length===4&&a[3].charAt(0)==="/"&&(a[3]=a[3].slice(1)),["srgb","display-p3","a98-rgb","prophoto-rgb","rec-2020"].indexOf(n)===-1)throw new Error(g(10,n))}else a=a.split(",");return a=a.map(l=>parseFloat(l)),{type:s,values:a,colorSpace:n}}function G(e){const{type:t,colorSpace:s}=e;let{values:a}=e;return t.indexOf("rgb")!==-1?a=a.map((n,l)=>l<3?parseInt(n,10):n):t.indexOf("hsl")!==-1&&(a[1]=`${a[1]}%`,a[2]=`${a[2]}%`),t.indexOf("color")!==-1?a=`${s} ${a.join(" ")}`:a=`${a.join(", ")}`,`${t}(${a})`}function Q(e,t){return e=N(e),t=V(t),(e.type==="rgb"||e.type==="hsl")&&(e.type+="a"),e.type==="color"?e.values[3]=`/${t}`:e.values[3]=t,G(e)}function z(e){return String(e).match(/[\d.\-+]*\s*(.*)/)[1]||""}function H(e){return parseFloat(e)}function J(e){return R("MuiSkeleton",e)}A("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const Y=["animation","className","component","height","style","variant","width"];let p=e=>e,b,y,k,C;const Z=e=>{const{classes:t,variant:s,animation:a,hasChildren:n,width:l,height:o}=e;return O({root:["root",s,a,n&&"withChildren",n&&!l&&"fitContent",n&&!o&&"heightAuto"]},J,t)},ee=j(b||(b=p`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`)),te=j(y||(y=p`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`)),ae=P("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:s}=e;return[t.root,t[s.variant],s.animation!==!1&&t[s.animation],s.hasChildren&&t.withChildren,s.hasChildren&&!s.width&&t.fitContent,s.hasChildren&&!s.height&&t.heightAuto]}})(({theme:e,ownerState:t})=>{const s=z(e.shape.borderRadius)||"px",a=H(e.shape.borderRadius);return h({display:"block",backgroundColor:e.vars?e.vars.palette.Skeleton.bg:Q(e.palette.text.primary,e.palette.mode==="light"?.11:.13),height:"1.2em"},t.variant==="text"&&{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${s}/${Math.round(a/.6*10)/10}${s}`,"&:empty:before":{content:'"\\00a0"'}},t.variant==="circular"&&{borderRadius:"50%"},t.variant==="rounded"&&{borderRadius:(e.vars||e).shape.borderRadius},t.hasChildren&&{"& > *":{visibility:"hidden"}},t.hasChildren&&!t.width&&{maxWidth:"fit-content"},t.hasChildren&&!t.height&&{height:"auto"})},({ownerState:e})=>e.animation==="pulse"&&x(k||(k=p`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `),ee),({ownerState:e,theme:t})=>e.animation==="wave"&&x(C||(C=p`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `),te,(t.vars||t).palette.action.hover)),se=E.forwardRef(function(t,s){const a=_({props:t,name:"MuiSkeleton"}),{animation:n="pulse",className:l,component:o="span",height:c,style:r,variant:u="text",width:d}=a,f=I(a,Y),m=h({},a,{animation:n,component:o,variant:u,hasChildren:!!f.children}),$=Z(m);return i.jsx(ae,h({as:o,ref:s,className:w($.root,l),ownerState:m},f,{style:h({width:d,height:c},r)}))}),le=se,de=({product:e,...t})=>{const{t:s}=W(),a=M(),n=U(),{success:l,error:o}=L();if(!e)return i.jsx("div",{children:"Wait..."});const c=async()=>{try{if(e&&e.id){const r=await n(v({productId:e.id,quantity:1}));v.fulfilled.match(r)?l(s("products.addedToCart")):r.payload==="Not enough stock available"?o(s("products.notEnoughStock")):r.payload==="Invalid product data received from server"?o(s("products.invalidProduct")):typeof r.payload=="string"?o(r.payload):o(s("common.errorOccurred"))}T("AddToCart",{Product:e.name,Price:e.price,Quantity:1})}catch{o(s("common.errorOccurred"))}};return i.jsxs("div",{className:"product","data-aos":"fade-up",onClick:()=>a(`/products/${e.id}`),...t,children:[i.jsxs("div",{className:"thumbs",children:[i.jsx(D,{loop:!1,speed:600,effect:"flip",slidesPerView:1,spaceBetween:10,modules:[B],children:e&&e.images.slice(0,2).map((r,u)=>{let d=r;return r&&(r.startsWith("/uploads")||r.startsWith("uploads/"))?d=`https://eurl-server.onrender.com${r.startsWith("/")?"":"/"}${r}`:r&&(r.startsWith("http://")||r.startsWith("https://"))&&(d=r),i.jsx(X,{children:i.jsx("img",{src:d,className:"image"})},u)})}),i.jsx("div",{className:"over-mode"}),e.isFeatured&&i.jsx("div",{className:"over sale",children:"Featured"}),i.jsx("div",{className:"in-cart",children:i.jsx(F,{onClick:c,disabled:e.countInStock===0,className:"text-girl-secondary",children:i.jsx(K,{className:"w-7 h-7"})})}),e.countInStock>0&&i.jsx("div",{className:"over pink",children:i.jsx("i",{className:"fi fi-rr-thumbtack flex items-center justify-center"})})]}),i.jsxs("div",{className:w("info","flex flex-col-reverse items-start"),children:[i.jsx("div",{className:"price ",children:e.oldPrice&&e.oldPrice>e.price?i.jsxs("div",{className:"space-x-2",children:[i.jsxs("span",{className:"text-girl-secondary",children:["DA ",e.price]}),i.jsxs("span",{className:"line-through text-sm text-gray-600",children:["DA ",e.oldPrice]})]}):i.jsxs("span",{children:["DA ",e.price]})}),i.jsx("div",{className:"name",children:e.name})]})]})};export{de as P,le as S};
