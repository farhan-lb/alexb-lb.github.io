/** Get saved whitelist */
const LB_LOCAL_STORAGE_KEY = "lb-cookie-consent";
const LB_LOCAL_STORAGE_PREFERENCES_KEY = "lb-preferences";

(function () {
  // detect essentials that must NOT be blocked
  const root = document.getElementById("lb-cookie-consent");
  const webAppUrl = root?.getAttribute("data-web-app") || "";
  const essentialsWhiteList = [
    "^/",
    "^./",
    window.location.host,
    ...(webAppUrl ? [webAppUrl.replace(/https?:\/\//i, "")] : []),
  ];

  // check whether show both banner and pref center or pref center only
  const isPrefCenterDefaultOpen =
    (root?.getAttribute("data-preferences-default-open") || "") === "true";
  const isPrefCenterOnly =
    (root?.getAttribute("data-preferences-only") || "") === "true";
  const isLbPrefCenter = isPrefCenterOnly || isPrefCenterDefaultOpen;

  const consentsRaw = window.localStorage.getItem(LB_LOCAL_STORAGE_KEY);

  /**
   * User already added preferences:
   * - if preferences only: allow everything excepts domains from saved blacklist
   * - if banner: block everything excepts domains from saved whitelist
   */
  if (consentsRaw) {
    let userConsents = null;
    try {
      userConsents = JSON.parse(consentsRaw);
    } catch (e) {
      console.log("cannot parse whitelisted domains");
    }

    if (!userConsents) return;

    if (isLbPrefCenter) {
      window.YETT_BLACKLIST = userConsents.blackList?.map(
        (pattern) => new RegExp(pattern, 'g')
      );
    } else {
      // if banner selected, by default everything blocked excepts web-app and current domain
      if (userConsents.whiteList?.length) {
        window.YETT_WHITELIST = userConsents.whiteList?.map((pattern) => new RegExp(pattern, 'g'));
      } else {
        window.YETT_BLACKLIST = []
      }

    }
  }

  /**
   * No preferences added yet:
   * - if preferences only: allow everything
   * - if banner: block everything excepts essential domains
   */
  if (!consentsRaw) {
    if (isLbPrefCenter) {
      window.YETT_BLACKLIST = []
    } else {
      window.YETT_WHITELIST = essentialsWhiteList.map(
        (pattern) => new RegExp(pattern, 'g')
      );
    }
  }
})();

/**Yett blocking script  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).yett={})}(this,(function(t){"use strict";var e="javascript/blocked",r={blacklist:window.YETT_BLACKLIST,whitelist:window.YETT_WHITELIST},n={blacklisted:[]},i=function(t,n){return t&&(!n||n!==e)&&(!r.blacklist||r.blacklist.some((function(e){return e.test(t)})))&&(!r.whitelist||r.whitelist.every((function(e){return!e.test(t)})))},o=function(t){var e=t.getAttribute("src");return r.blacklist&&r.blacklist.every((function(t){return!t.test(e)}))||r.whitelist&&r.whitelist.some((function(t){return t.test(e)}))},c=new MutationObserver((function(t){for(var r=0;r<t.length;r++)for(var o=t[r].addedNodes,c=function(t){var r=o[t];if(1===r.nodeType&&"SCRIPT"===r.tagName){var c=r.src,l=r.type;if(i(c,l)){n.blacklisted.push([r,r.type]),r.type=e;r.addEventListener("beforescriptexecute",(function t(n){r.getAttribute("type")===e&&n.preventDefault(),r.removeEventListener("beforescriptexecute",t)})),r.parentElement&&r.parentElement.removeChild(r)}}},l=0;l<o.length;l++)c(l)}));function l(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function a(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?l(Object(r),!0).forEach((function(e){s(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}function s(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function u(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var r=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null==r)return;var n,i,o=[],c=!0,l=!1;try{for(r=r.call(t);!(c=(n=r.next()).done)&&(o.push(n.value),!e||o.length!==e);c=!0);}catch(t){l=!0,i=t}finally{try{c||null==r.return||r.return()}finally{if(l)throw i}}return o}(t,e)||f(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(t){return function(t){if(Array.isArray(t))return y(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||f(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(t,e){if(t){if("string"==typeof t)return y(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?y(t,e):void 0}}function y(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}c.observe(document.documentElement,{childList:!0,subtree:!0});var b=document.createElement,d={src:Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"src"),type:Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype,"type")};document.createElement=function(){for(var t=arguments.length,r=new Array(t),n=0;n<t;n++)r[n]=arguments[n];if("script"!==r[0].toLowerCase())return b.bind(document).apply(void 0,r);var o=b.bind(document).apply(void 0,r);try{Object.defineProperties(o,{src:a(a({},d.src),{},{set:function(t){i(t,o.type)&&d.type.set.call(this,e),d.src.set.call(this,t)}}),type:a(a({},d.type),{},{get:function(){var t=d.type.get.call(this);return t===e||i(this.src,t)?null:t},set:function(t){var r=i(o.src,o.type)?e:t;d.type.set.call(this,r)}})}),o.setAttribute=function(t,e){"type"===t||"src"===t?o[t]=e:HTMLScriptElement.prototype.setAttribute.call(o,t,e)}}catch(t){console.warn("Yett: unable to prevent script execution for script src ",o.src,".\n",'A likely cause would be because you are using a third-party browser extension that monkey patches the "document.createElement" function.')}return o};var v=new RegExp("[|\\{}()[\\]^$+*?.]","g");t.unblock=function(){for(var t=arguments.length,i=new Array(t),l=0;l<t;l++)i[l]=arguments[l];i.length<1?(r.blacklist=[],r.whitelist=[]):(r.blacklist&&(r.blacklist=r.blacklist.filter((function(t){return i.every((function(e){return"string"==typeof e?!t.test(e):e instanceof RegExp?t.toString()!==e.toString():void 0}))}))),r.whitelist&&(r.whitelist=[].concat(p(r.whitelist),p(i.map((function(t){if("string"==typeof t){var e=".*"+t.replace(v,"\\$&")+".*";if(r.whitelist.every((function(t){return t.toString()!==e.toString()})))return new RegExp(e)}else if(t instanceof RegExp&&r.whitelist.every((function(e){return e.toString()!==t.toString()})))return t;return null})).filter(Boolean)))));for(var a=document.querySelectorAll('script[type="'.concat(e,'"]')),s=0;s<a.length;s++){var f=a[s];o(f)&&(n.blacklisted.push([f,"application/javascript"]),f.parentElement.removeChild(f))}var y=0;p(n.blacklisted).forEach((function(t,e){var r=u(t,2),i=r[0],c=r[1];if(o(i)){for(var l=document.createElement("script"),a=0;a<i.attributes.length;a++){var s=i.attributes[a];"src"!==s.name&&"type"!==s.name&&l.setAttribute(s.name,i.attributes[a].value)}l.setAttribute("src",i.src),l.setAttribute("type",c||"application/javascript"),document.head.appendChild(l),n.blacklisted.splice(e-y,1),y++}})),r.blacklist&&r.blacklist.length<1&&c.disconnect()},Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=yett.min.js.map

const initCookieConsent = () => {
  const root = document.getElementById("lb-cookie-consent");
  const webAppUrl = root?.getAttribute("data-web-app") || "";

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${webAppUrl}/assets/styles.css`;
  link.type = "text/css";
  document.head.appendChild(link);

  const scriptRenderer = document.createElement("script");
  scriptRenderer.type = "text/javascript";
  scriptRenderer.src = `${webAppUrl}/js/renderCookieConsent.js`;
  scriptRenderer.async = true;
  document.head.appendChild(scriptRenderer);

  const timer = setInterval(() => {
    if (typeof renderCookieConsent === "function") {
      // eslint-disable-next-line no-undef
      renderCookieConsent();
      clearInterval(timer);
    }
  }, 100);
};

document.addEventListener('DOMContentLoaded', () => {
  initCookieConsent();
});