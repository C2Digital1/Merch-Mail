/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
Shopify.theme.jsAnnouncementBar = {
  init: function($section){

    // Add settings from schema to current object
    Shopify.theme.jsAnnouncementBar = $.extend(this, Shopify.theme.getSectionData($section));

    let template = this.homepage_only ? '.index' : '';
    this.$el = $('#announcement-bar', template);
    let announcementCookie = Cookies.get('announcement-bar');
    $('.announcement-bar__shadow').height(this.$el.height());

    if (this.show_close_icon === false) {
      // Close icon is disabled, always show announcement
      Cookies.remove('announcement-bar');
      $('body').addClass('announcement-bar--visible');
      if (Shopify.theme_settings.header_layout == 'vertical') {
        this.addVerticalHeaderTopMargin();
      }

    } else if (announcementCookie !== 'dismiss') {
      // Close icon has not been clicked
      $('body').addClass('announcement-bar--visible');
      if (Shopify.theme_settings.header_layout == 'vertical') {
        this.addVerticalHeaderTopMargin();
      }

    } else {

      // Close icon has been clicked and announcement is hidden
      $('body').addClass('announcement-bar--hidden');
      this.disableSticky();
      if (Shopify.theme_settings.header_layout == 'vertical') {
        this.removeVerticalHeaderTopMargin();
      }
      return false;
    }

    // Sticky announcement bar
    if (this.enable_sticky === true) {
      this.enableSticky();
    } else {
      this.disableSticky();
    }

    // Hide announcement by default, but then hide or show based on close icon status
    if (this.show_close_icon === true) {
      $('body').addClass('has-announcement-bar-toggle');

      // Attach event to hide announcement if close icon is clicked
      this.$el.on('click', '.js-close-announcement', () => {
        this.hide();
        if (Shopify.theme_settings.header_layout == 'vertical') {
          this.removeVerticalHeaderTopMargin();
        }
      });
    }

    // Announcement Bar Slider
    if(this.slider === true){
      let $sliderEl = $section.find('[data-slider]');
      this.createSlider($sliderEl);
      $('.announcement-bar__shadow').height(this.$el.height());
    }

  },
  addVerticalHeaderTopMargin: function() {
    // Add negative margin if header is vertical
    if (isScreenSizeLarge()) {
      $('.header--vertical').css('marginTop', -this.$el.height());
      $('.announcement-bar__shadow').height(this.$el.height());
    }
  },
  removeVerticalHeaderTopMargin: function () {
    // Remove negative margin
    $('.header--vertical').removeAttr('style');
  },
  enableSticky: function() {
    // Add sticky functionality and recalculate offset for header sticky
    this.$el.parent().sticky({
      wrapperClassName: 'announcement-sticky-wrapper',
      zIndex: 40
    })

    this.resetHeader(this.$el.height());
  },
  disableSticky: function() {

    // Remove sticky functionality and recalculate offset for header sticky
    this.$el.parent().unstick();

    this.resetHeader(0);
  },
  hide: function() {

    // Remove announcement bar and set cookie to hide it for 30 days
    $('body').removeClass('announcement-bar--visible');
    this.disableSticky();
    Cookies.set('announcement-bar', 'dismiss', { expires: 30 });
  },
  resetHeader: function(offset) {
    if (Shopify.theme.jsHeader.enable_sticky === true && isScreenSizeLarge()) {
      if (Shopify.theme_settings.header_layout != 'vertical') {
        // Reset desktop sticky header
        Shopify.theme.jsHeader.disableSticky();
        Shopify.theme.jsHeader.enableSticky(offset);
      }
    } else if (Shopify.theme.jsHeader.enable_sticky === true && !isScreenSizeLarge()) {
      // Reset mobile sticky header
      Shopify.theme.mobileMenu.disableSticky();
      Shopify.theme.mobileMenu.enableSticky(offset);
    }
  },
  getAnnouncementHeight() {
    const announcementHeight = $('.announcement-container').outerHeight() || 0;

    return announcementHeight;
  },
  createSlider: function ($sliderEl) {

    const slider = $sliderEl.flickity({
      lazyLoad: 2,
      freeScroll: false,
      imagesLoaded: true,
      draggable: true,
      autoPlay: this.auto_slider,
      cellAlign: 'center',
      wrapAround: true,
      pageDots: false,
      contain: true,
      prevNextButtons: this.slider_arrows,
      initialIndex: 0,
      arrowShape: arrowShape
    });
    slider.on('settle.flickity', function () {
      slider.flickity('resize');
    });

  },
  unload: function($section) {

    let $slider = $section.find('.flickity-enabled');
    $slider.flickity('destroy');

    // Clear event listeners in theme editor
    $('#announcement-bar').off();
    $('#announcement-bar').unstick();
    
  }
}

/******/ })()
;