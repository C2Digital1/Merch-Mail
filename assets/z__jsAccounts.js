/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
Shopify.theme.jsAccounts = {
  init: function($section){

    $('.js-recover-password').on('click', function(){
      $('#login').hide();
      $('#recover').show();
    });

    $('.cancel-recover-password').on('click', function(){
      $('#recover').hide();
      $('#login').show();
    })

  },

  unload: function($section) {
    $('.js-recover-password').off();
    $('.cancel-recover-password').off();
  }
}

/******/ })()
;