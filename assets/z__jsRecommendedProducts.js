/******/ (() => { // webpackBootstrap
  var __webpack_exports__ = {};
  Shopify.theme.jsRecommendedProducts = {
    init: function ($section) {

      // Add settings from schema to current object
      Shopify.theme.jsRecommendedProducts = $.extend(this, Shopify.theme.getSectionData($section));

      // Look for an element with class 'product-recommendations'
      const $productRecommendations = $section.find('.product-recommendations');

      // Selectors
      const productID = $productRecommendations.data('product-id');
      const limit = $productRecommendations.data('limit');
      const sectionID = $productRecommendations.data('section-id');

      // If showing custom collection we do not want to build request url
      if (this.show_custom_collection) {
        this.showCustomCollection($section);
        return;
      }

      // Build request URL
      const shopURL = $productRecommendations.data('base-url');
      const requestUrl = `${shopURL}?section_id=${sectionID}&limit=${limit}&product_id=${productID}`;

      $.ajax({
        type: 'GET',
        url: requestUrl,
        success: function (data) {

          let $recommendedProductsElement = $(data).find('.product-recommendations').html();
          if(!$recommendedProductsElement.trim().length){
            $section.hide()
            console.warn('No Recommendations Found.Hiding The Section')
            return;
          }
          // Insert product list into the product recommendations container
          $productRecommendations.html($recommendedProductsElement);

          Shopify.theme.jsProduct.relatedProducts($section);

          // Initialize shopify payment buttons
          if (Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }

          // Converting the currencies
          if (Shopify.theme.currencyConverter) {
            Shopify.theme.currencyConverter.convertCurrencies();
          }
        }
      });
    },
    showCustomCollection: function ($section) {
      const $recommendedProductsElement = $section.find('.product-recommendations').html();

      const $productRecommendationsContainer = $('.product-recommendations');
      $productRecommendationsContainer.html($recommendedProductsElement);

      Shopify.theme.jsProduct.relatedProducts($section);
    },
    unload: function ($section) {
    }
  }

  /******/
})()
  ;