/**Yett blocking script  */
const yettScript = document.getElementById("lb-cookie-consent-yett");
const domain = yettScript?.getAttribute("data-domain") || "";
window.YETT_WHITELIST = [/^\//, /^\.\//, new RegExp(window.location.host)];
if (domain)
  window.YETT_WHITELIST.push(new RegExp(domain.replace(/https?:\/\//i, "")));
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? t(exports)
    : "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(
        ((e = "undefined" != typeof globalThis ? globalThis : e || self).yett =
          {})
      );
})(this, function (e) {
  "use strict";
  var t = "javascript/blocked",
    r = { blacklist: window.YETT_BLACKLIST, whitelist: window.YETT_WHITELIST },
    i = { blacklisted: [] },
    n = (e, i) =>
      e &&
      (!i || i !== t) &&
      (!r.blacklist || r.blacklist.some((t) => t.test(e))) &&
      (!r.whitelist || r.whitelist.every((t) => !t.test(e))),
    c = function (e) {
      var t = e.getAttribute("src");
      return (
        (r.blacklist && r.blacklist.every((e) => !e.test(t))) ||
        (r.whitelist && r.whitelist.some((e) => e.test(t)))
      );
    },
    s = new MutationObserver((e) => {
      for (var r = 0; r < e.length; r++)
        for (
          var { addedNodes: c } = e[r],
            s = function (e) {
              var r = c[e];
              if (1 === r.nodeType && "SCRIPT" === r.tagName) {
                var s = r.src,
                  o = r.type;
                if (n(s, o)) {
                  i.blacklisted.push([r, r.type]), (r.type = t);
                  r.addEventListener("beforescriptexecute", function e(i) {
                    r.getAttribute("type") === t && i.preventDefault(),
                      r.removeEventListener("beforescriptexecute", e);
                  }),
                    r.parentElement && r.parentElement.removeChild(r);
                }
              }
            },
            o = 0;
          o < c.length;
          o++
        )
          s(o);
    });
  function o(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var i = Object.getOwnPropertySymbols(e);
      t &&
        (i = i.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, i);
    }
    return r;
  }
  function l(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? o(Object(r), !0).forEach(function (t) {
            a(e, t, r[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : o(Object(r)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
          });
    }
    return e;
  }
  function a(e, t, r) {
    return (
      t in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  s.observe(document.documentElement, { childList: !0, subtree: !0 });
  var p = document.createElement,
    u = {
      src: Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, "src"),
      type: Object.getOwnPropertyDescriptor(
        HTMLScriptElement.prototype,
        "type"
      ),
    };
  document.createElement = function () {
    for (var e = arguments.length, r = new Array(e), i = 0; i < e; i++)
      r[i] = arguments[i];
    if ("script" !== r[0].toLowerCase()) return p.bind(document)(...r);
    var c = p.bind(document)(...r);
    try {
      Object.defineProperties(c, {
        src: l(
          l({}, u.src),
          {},
          {
            set(e) {
              n(e, c.type) && u.type.set.call(this, t), u.src.set.call(this, e);
            },
          }
        ),
        type: l(
          l({}, u.type),
          {},
          {
            get() {
              var e = u.type.get.call(this);
              return e === t || n(this.src, e) ? null : e;
            },
            set(e) {
              var r = n(c.src, c.type) ? t : e;
              u.type.set.call(this, r);
            },
          }
        ),
      }),
        (c.setAttribute = function (e, t) {
          "type" === e || "src" === e
            ? (c[e] = t)
            : HTMLScriptElement.prototype.setAttribute.call(c, e, t);
        });
    } catch (e) {
      console.warn(
        "Yett: unable to prevent script execution for script src ",
        c.src,
        ".\n",
        'A likely cause would be because you are using a third-party browser extension that monkey patches the "document.createElement" function.'
      );
    }
    return c;
  };
  var b = new RegExp("[|\\{}()[\\]^$+*?.]", "g");
  (e.unblock = function () {
    for (var e = arguments.length, n = new Array(e), o = 0; o < e; o++)
      n[o] = arguments[o];
    n.length < 1
      ? ((r.blacklist = []), (r.whitelist = []))
      : (r.blacklist &&
          (r.blacklist = r.blacklist.filter((e) =>
            n.every((t) =>
              "string" == typeof t
                ? !e.test(t)
                : t instanceof RegExp
                ? e.toString() !== t.toString()
                : void 0
            )
          )),
        r.whitelist &&
          (r.whitelist = [
            ...r.whitelist,
            ...n
              .map((e) => {
                if ("string" == typeof e) {
                  var t = ".*" + e.replace(b, "\\$&") + ".*";
                  if (r.whitelist.every((e) => e.toString() !== t.toString()))
                    return new RegExp(t);
                } else if (
                  e instanceof RegExp &&
                  r.whitelist.every((t) => t.toString() !== e.toString())
                )
                  return e;
                return null;
              })
              .filter(Boolean),
          ]));
    for (
      var l = document.querySelectorAll('script[type="'.concat(t, '"]')), a = 0;
      a < l.length;
      a++
    ) {
      var p = l[a];
      c(p) &&
        (i.blacklisted.push([p, "application/javascript"]),
        p.parentElement.removeChild(p));
    }
    var u = 0;
    [...i.blacklisted].forEach((e, t) => {
      var [r, n] = e;
      if (c(r)) {
        for (
          var s = document.createElement("script"), o = 0;
          o < r.attributes.length;
          o++
        ) {
          var l = r.attributes[o];
          "src" !== l.name &&
            "type" !== l.name &&
            s.setAttribute(l.name, r.attributes[o].value);
        }
        s.setAttribute("src", r.src),
          s.setAttribute("type", n || "application/javascript"),
          document.head.appendChild(s),
          i.blacklisted.splice(t - u, 1),
          u++;
      }
    }),
      r.blacklist && r.blacklist.length < 1 && s.disconnect();
  }),
    Object.defineProperty(e, "__esModule", { value: !0 });
});
//# sourceMappingURL=yett.min.modern.js.map
/** */

const initCookieConsent = () => {
  const root = document.getElementById("lb-cookie-consent");
  const webAppUrl = root?.getAttribute("data-web-app") || "";
  const domain = root?.getAttribute("data-domain") || "";

  var head = document.getElementsByTagName("head")[0];

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `./assets/styles.css`;
  link.type = "text/css";
  head.appendChild(link);

  window.yett?.unblock(new RegExp(webAppUrl.replace(/https?:\/\//i, "")));

  const scriptRenderer = document.createElement("script");
  scriptRenderer.type = "text/javascript";
  scriptRenderer.src = `./js/renderCookieConsent.js`;
  scriptRenderer.async = true;
  head.appendChild(scriptRenderer);

  const timer = setInterval(() => {
    if (typeof renderCookieConsent === "function") {
      // eslint-disable-next-line no-undef
      renderCookieConsent();
      clearInterval(timer);
    }
  }, 100);
};

initCookieConsent();
