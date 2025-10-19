"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./contexts/AuthContext.tsx":
/*!**********************************!*\
  !*** ./contexts/AuthContext.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction AuthProvider({ children }) {\n    const [userRole, setUserRole] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [isDarkMode, setIsDarkMode] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    // Load user role and dark mode preference from localStorage on mount\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const savedRole = localStorage.getItem(\"userRole\");\n        const savedDarkMode = localStorage.getItem(\"darkMode\") === \"true\";\n        if (savedRole) {\n            setUserRole(savedRole);\n        }\n        setIsDarkMode(savedDarkMode);\n        setIsLoading(false);\n    }, []);\n    const login = (role)=>{\n        setUserRole(role);\n        localStorage.setItem(\"userRole\", role || \"\");\n    };\n    const logout = ()=>{\n        setUserRole(null);\n        localStorage.removeItem(\"userRole\");\n        // Redirect to home page on logout\n        router.push(\"/\");\n    };\n    const toggleDarkMode = ()=>{\n        const newDarkMode = !isDarkMode;\n        setIsDarkMode(newDarkMode);\n        localStorage.setItem(\"darkMode\", newDarkMode.toString());\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: {\n            userRole,\n            login,\n            logout,\n            isLoading,\n            isDarkMode,\n            toggleDarkMode\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\projects\\\\EduChain-Fresh\\\\hackathon1018\\\\projects\\\\web\\\\contexts\\\\AuthContext.tsx\",\n        lineNumber: 54,\n        columnNumber: 5\n    }, this);\n}\nfunction useAuth() {\n    const context = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (context === undefined) {\n        throw new Error(\"useAuth must be used within an AuthProvider\");\n    }\n    return context;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0cy9BdXRoQ29udGV4dC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQWlGO0FBQzFDO0FBYXZDLE1BQU1LLDRCQUFjTCxvREFBYUEsQ0FBOEJNO0FBRXhELFNBQVNDLGFBQWEsRUFBRUMsUUFBUSxFQUEyQjtJQUNoRSxNQUFNLENBQUNDLFVBQVVDLFlBQVksR0FBR1IsK0NBQVFBLENBQVc7SUFDbkQsTUFBTSxDQUFDUyxXQUFXQyxhQUFhLEdBQUdWLCtDQUFRQSxDQUFDO0lBQzNDLE1BQU0sQ0FBQ1csWUFBWUMsY0FBYyxHQUFHWiwrQ0FBUUEsQ0FBQztJQUM3QyxNQUFNYSxTQUFTWCxzREFBU0E7SUFFeEIscUVBQXFFO0lBQ3JFRCxnREFBU0EsQ0FBQztRQUNSLE1BQU1hLFlBQVlDLGFBQWFDLE9BQU8sQ0FBQztRQUN2QyxNQUFNQyxnQkFBZ0JGLGFBQWFDLE9BQU8sQ0FBQyxnQkFBZ0I7UUFFM0QsSUFBSUYsV0FBVztZQUNiTixZQUFZTTtRQUNkO1FBQ0FGLGNBQWNLO1FBQ2RQLGFBQWE7SUFDZixHQUFHLEVBQUU7SUFFTCxNQUFNUSxRQUFRLENBQUNDO1FBQ2JYLFlBQVlXO1FBQ1pKLGFBQWFLLE9BQU8sQ0FBQyxZQUFZRCxRQUFRO0lBQzNDO0lBRUEsTUFBTUUsU0FBUztRQUNiYixZQUFZO1FBQ1pPLGFBQWFPLFVBQVUsQ0FBQztRQUN4QixrQ0FBa0M7UUFDbENULE9BQU9VLElBQUksQ0FBQztJQUNkO0lBRUEsTUFBTUMsaUJBQWlCO1FBQ3JCLE1BQU1DLGNBQWMsQ0FBQ2Q7UUFDckJDLGNBQWNhO1FBQ2RWLGFBQWFLLE9BQU8sQ0FBQyxZQUFZSyxZQUFZQyxRQUFRO0lBQ3ZEO0lBRUEscUJBQ0UsOERBQUN2QixZQUFZd0IsUUFBUTtRQUFDQyxPQUFPO1lBQUVyQjtZQUFVVztZQUFPRztZQUFRWjtZQUFXRTtZQUFZYTtRQUFlO2tCQUMzRmxCOzs7Ozs7QUFHUDtBQUVPLFNBQVN1QjtJQUNkLE1BQU1DLFVBQVUvQixpREFBVUEsQ0FBQ0k7SUFDM0IsSUFBSTJCLFlBQVkxQixXQUFXO1FBQ3pCLE1BQU0sSUFBSTJCLE1BQU07SUFDbEI7SUFDQSxPQUFPRDtBQUNUIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmlzYS1lbXBsb3ltZW50LXZlcmlmaWNhdGlvbi8uL2NvbnRleHRzL0F1dGhDb250ZXh0LnRzeD82ZDgxIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZVN0YXRlLCB1c2VFZmZlY3QsIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInXG5cbmV4cG9ydCB0eXBlIFVzZXJSb2xlID0gJ0luc3RpdHV0aW9uJyB8ICdBdXRob3JpdHknIHwgJ0NlcnRpZmllcicgfCAnU3R1ZGVudCcgfCBudWxsXG5cbmludGVyZmFjZSBBdXRoQ29udGV4dFR5cGUge1xuICB1c2VyUm9sZTogVXNlclJvbGVcbiAgbG9naW46IChyb2xlOiBVc2VyUm9sZSkgPT4gdm9pZFxuICBsb2dvdXQ6ICgpID0+IHZvaWRcbiAgaXNMb2FkaW5nOiBib29sZWFuXG4gIGlzRGFya01vZGU6IGJvb2xlYW5cbiAgdG9nZ2xlRGFya01vZGU6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VHlwZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKVxuXG5leHBvcnQgZnVuY3Rpb24gQXV0aFByb3ZpZGVyKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3ROb2RlIH0pIHtcbiAgY29uc3QgW3VzZXJSb2xlLCBzZXRVc2VyUm9sZV0gPSB1c2VTdGF0ZTxVc2VyUm9sZT4obnVsbClcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpXG4gIGNvbnN0IFtpc0RhcmtNb2RlLCBzZXRJc0RhcmtNb2RlXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuXG4gIC8vIExvYWQgdXNlciByb2xlIGFuZCBkYXJrIG1vZGUgcHJlZmVyZW5jZSBmcm9tIGxvY2FsU3RvcmFnZSBvbiBtb3VudFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHNhdmVkUm9sZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyUm9sZScpIGFzIFVzZXJSb2xlXG4gICAgY29uc3Qgc2F2ZWREYXJrTW9kZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkYXJrTW9kZScpID09PSAndHJ1ZSdcbiAgICBcbiAgICBpZiAoc2F2ZWRSb2xlKSB7XG4gICAgICBzZXRVc2VyUm9sZShzYXZlZFJvbGUpXG4gICAgfVxuICAgIHNldElzRGFya01vZGUoc2F2ZWREYXJrTW9kZSlcbiAgICBzZXRJc0xvYWRpbmcoZmFsc2UpXG4gIH0sIFtdKVxuXG4gIGNvbnN0IGxvZ2luID0gKHJvbGU6IFVzZXJSb2xlKSA9PiB7XG4gICAgc2V0VXNlclJvbGUocm9sZSlcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlclJvbGUnLCByb2xlIHx8ICcnKVxuICB9XG5cbiAgY29uc3QgbG9nb3V0ID0gKCkgPT4ge1xuICAgIHNldFVzZXJSb2xlKG51bGwpXG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXJSb2xlJylcbiAgICAvLyBSZWRpcmVjdCB0byBob21lIHBhZ2Ugb24gbG9nb3V0XG4gICAgcm91dGVyLnB1c2goJy8nKVxuICB9XG5cbiAgY29uc3QgdG9nZ2xlRGFya01vZGUgPSAoKSA9PiB7XG4gICAgY29uc3QgbmV3RGFya01vZGUgPSAhaXNEYXJrTW9kZVxuICAgIHNldElzRGFya01vZGUobmV3RGFya01vZGUpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2RhcmtNb2RlJywgbmV3RGFya01vZGUudG9TdHJpbmcoKSlcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IHVzZXJSb2xlLCBsb2dpbiwgbG9nb3V0LCBpc0xvYWRpbmcsIGlzRGFya01vZGUsIHRvZ2dsZURhcmtNb2RlIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvQXV0aENvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUF1dGgoKSB7XG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KVxuICBpZiAoY29udGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1c2VBdXRoIG11c3QgYmUgdXNlZCB3aXRoaW4gYW4gQXV0aFByb3ZpZGVyJylcbiAgfVxuICByZXR1cm4gY29udGV4dFxufVxuIl0sIm5hbWVzIjpbImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSb3V0ZXIiLCJBdXRoQ29udGV4dCIsInVuZGVmaW5lZCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidXNlclJvbGUiLCJzZXRVc2VyUm9sZSIsImlzTG9hZGluZyIsInNldElzTG9hZGluZyIsImlzRGFya01vZGUiLCJzZXRJc0RhcmtNb2RlIiwicm91dGVyIiwic2F2ZWRSb2xlIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNhdmVkRGFya01vZGUiLCJsb2dpbiIsInJvbGUiLCJzZXRJdGVtIiwibG9nb3V0IiwicmVtb3ZlSXRlbSIsInB1c2giLCJ0b2dnbGVEYXJrTW9kZSIsIm5ld0RhcmtNb2RlIiwidG9TdHJpbmciLCJQcm92aWRlciIsInZhbHVlIiwidXNlQXV0aCIsImNvbnRleHQiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./contexts/AuthContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! styled-jsx/style */ \"styled-jsx/style\");\n/* harmony import */ var styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(styled_jsx_style__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../contexts/AuthContext */ \"./contexts/AuthContext.tsx\");\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((styled_jsx_style__WEBPACK_IMPORTED_MODULE_1___default()), {\n                id: \"f6ec8f8ad2dee2e9\",\n                children: '*{margin:0;padding:0;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html,body{margin:0;padding:0;width:100%;height:100%}body{font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",\"Roboto\",\"Oxygen\",\"Ubuntu\",\"Cantarell\",\"Fira Sans\",\"Droid Sans\",\"Helvetica Neue\",sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}'\n            }, void 0, false, void 0, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_contexts_AuthContext__WEBPACK_IMPORTED_MODULE_2__.AuthProvider, {\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps,\n                    className: \"jsx-f6ec8f8ad2dee2e9\" + \" \" + (pageProps && pageProps.className != null && pageProps.className || \"\")\n                }, void 0, false, {\n                    fileName: \"C:\\\\projects\\\\EduChain-Fresh\\\\hackathon1018\\\\projects\\\\web\\\\pages\\\\_app.tsx\",\n                    lineNumber: 30,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\projects\\\\EduChain-Fresh\\\\hackathon1018\\\\projects\\\\web\\\\pages\\\\_app.tsx\",\n                lineNumber: 29,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNzRDtBQUV2QyxTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHFCQUNFOzs7Ozs7MEJBdUJFLDhEQUFDSCwrREFBWUE7MEJBQ1gsNEVBQUNFO29CQUFXLEdBQUdDLFNBQVM7K0RBQVRBLGFBQUFBLCtCQUFBQTs7Ozs7Ozs7Ozs7OztBQUl2QiIsInNvdXJjZXMiOlsid2VicGFjazovL3Zpc2EtZW1wbG95bWVudC12ZXJpZmljYXRpb24vLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4uL2NvbnRleHRzL0F1dGhDb250ZXh0J1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8c3R5bGUganN4IGdsb2JhbD57YFxuICAgICAgICAqIHtcbiAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBodG1sLCBib2R5IHtcbiAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGJvZHkge1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsICdSb2JvdG8nLCAnT3h5Z2VuJyxcbiAgICAgICAgICAgICdVYnVudHUnLCAnQ2FudGFyZWxsJywgJ0ZpcmEgU2FucycsICdEcm9pZCBTYW5zJywgJ0hlbHZldGljYSBOZXVlJyxcbiAgICAgICAgICAgIHNhbnMtc2VyaWY7XG4gICAgICAgICAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XG4gICAgICAgICAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcbiAgICAgICAgfVxuICAgICAgYH08L3N0eWxlPlxuICAgICAgPEF1dGhQcm92aWRlcj5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9BdXRoUHJvdmlkZXI+XG4gICAgPC8+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJBdXRoUHJvdmlkZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "styled-jsx/style":
/*!***********************************!*\
  !*** external "styled-jsx/style" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("styled-jsx/style");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();