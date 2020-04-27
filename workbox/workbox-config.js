module.exports = {
    "maximumFileSizeToCacheInBytes": 5 * 1024 * 1024,
    "globDirectory": "dist/main-frontend/",
    "globPatterns": [
      "**/*.{css,eot,svg,ttf,woff,json,png,gif,ico,woff2work,js,html,webmanifest}"
    ],
    "swDest": "dist/main-frontend/service-worker.js",
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [new RegExp('auth'), new RegExp('Shibboleth.sso')],
    ignoreURLParametersMatching: [new RegExp('auth'), new RegExp('Shibboleth.sso')],
    skipWaiting: true,
    clientsClaim: true
};