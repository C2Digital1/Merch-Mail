/******/ (() => { // webpackBootstrap
  var __webpack_exports__ = {};
  Shopify.theme.jsAddress = {
    init: function ($section) {
      this.$section = $section
      this.initCountrySelector('new')

      this.$editWrappers = $section.find('[data-address-id]')
      this.$editWrappers.each(function (index, item) {
        this.initCountrySelector(item.getAttribute('data-address-id'))
      }.bind(this))
    },
    initCountrySelector: function (id) {
      let countrySelector = `country-selector-${id}`
      let provinceSelector = `province-selector-${id}`
      let provinceWrapper = `province-wrapper-${id}`
      new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
        hideElement: provinceWrapper
      })
    },
    unload: function ($section) {

    }
  }

  /******/
})()
  ;