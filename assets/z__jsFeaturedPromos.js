/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
Shopify.theme.jsFeaturedPromos = {
	init: function($section) {

    // Selectors
    const $prevButton = $section.find('.featured-promotions__nav--prev');
    const $nextButton = $section.find('.featured-promotions__nav--next');
    const $promoSlider = $section.find('[data-slider]');

    const $featuredPromosSlider = $promoSlider.flickity({
      initialIndex: 0,
      contain: true,
      wrapAround: true,
      prevNextButtons: false,
      pageDots: false,
      imagesLoaded: true,
      draggable: true
    });

    $featuredPromosSlider.on( 'settle.flickity', function() {
      $featuredPromosSlider.flickity('resize');
    });

    $prevButton.on('click', function () {
      $featuredPromosSlider.flickity('previous');
    });

    $nextButton.on('click', function () {
      $featuredPromosSlider.flickity('next');
    });
	},
  blockSelect: function($section, blockId) {
    var $featuredPromosSlider = $section.find('[data-slider]');

    var slideIndex = $('#shopify-section-' + blockId).data('index');

    $featuredPromosSlider.flickity('select', slideIndex, true, true);
  },
	unload: function($section) {
    var $slider = $section.find('.flickity-enabled');
    $slider.flickity('destroy');
    $('.featured-promotions__nav--prev').off();
    $('.featured-promotions__nav--next').off();

	}
}

/******/ })()
;