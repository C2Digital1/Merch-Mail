/******/ (() => { // webpackBootstrap
  var __webpack_exports__ = {};
  Shopify.theme.jsFeaturedCollection = {
    init: function ($section) {

      // Add settings from schema to current object
      Shopify.theme.jsFeaturedCollection = $.extend(this, Shopify.theme.getSectionData($section));

      let $sliderEl = $section.find('[data-slider]');

      if (this.collection_style == 'slider') {
        this.createSlider($sliderEl);
      }
    },
    createSlider: function ($sliderEl) {

      const slideData = {
        products_per_slide: this.products_per,
        products_available: this.products_available,
        products_limit: this.products_limit,
        showSliderInMobile: this.showSliderInMobile,
        centerMode: this.centerMode
      }
      var mode = "left";
      var showArrows = false;
      if (slideData.centerMode) {
        mode = "center";
      }
      if (slideData.products_limit > slideData.products_per_slide || slideData.showSliderInMobile) {
        showArrows = true;
      }
      const slider = $sliderEl.flickity({
        lazyLoad: 2,
        freeScroll: true,
        imagesLoaded: true,
        draggable: true,
        cellAlign: mode,
        wrapAround: false,
        pageDots: false,
        contain: true,
        prevNextButtons: showArrows,
        initialIndex: 0,
        arrowShape: arrowShape,
        watchCSS: slideData.showSliderInMobile
      });
      slider.on('settle.flickity', function () {
        slider.flickity('resize');
      });

    },
    unload: function ($section) {
      let $slider = $section.find('.flickity-enabled');
      $slider.flickity('destroy');
    }
  }

  /******/
})()
  ;