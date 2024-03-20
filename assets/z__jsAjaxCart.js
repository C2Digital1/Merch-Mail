/******/ (() => { // webpackBootstrap
  var __webpack_exports__ = {};
  Shopify.theme.jsAjaxCart = {
    init: function ($section) {

      // Add settings from schema to current object
      Shopify.theme.jsAjaxCart = $.extend(this, Shopify.theme.getSectionData($section));

      if (isScreenSizeLarge() || this.cart_action == 'drawer') {
        this.initializeAjaxCart();       
      } else {
        this.initializeAjaxCartOnMobile();       
      }

      if (this.cart_action == 'drawer') {

        this.ajaxCartDrawer = $('[data-ajax-cart-drawer]');

        $(document).on('click', '[data-ajax-cart-trigger]', function (e) {
          e.preventDefault();
          Shopify.theme.jsAjaxCart.showDrawer();

          return false;
        });

      } else if (this.cart_action == 'mini_cart') {
        this.showMiniCartOnHover();
      }

      $(document).on('click', '.ajax-submit', function (e) {
        e.preventDefault();
        const $addToCartForm = $(this).closest('form');
        Shopify.theme.jsAjaxCart.addToCart($addToCartForm);

        return false;
      });

      $(document).on('click', '.customQuickAddBtn', function (e) {
        e.preventDefault();
        const $addToCartForm = $(this).closest('form');
        Shopify.theme.jsAjaxCart.addToCart($addToCartForm);

        return false;
      });

      $(document).on('click', '[data-ajax-cart-delete]', function (e) {
        e.preventDefault();
        const lineID = $(this).parents('[data-line-item]').data('line-item');
        Shopify.theme.jsAjaxCart.removeFromCart(lineID);

        if (Shopify.theme.jsCart) {
          Shopify.theme.jsCart.removeFromCart(lineID);
        }

        return false;
      });

      $(document).on('click', '[data-ajax-cart-close]', function (e) {
        e.preventDefault();
        Shopify.theme.jsAjaxCart.hideDrawer();
        Shopify.theme.jsAjaxCart.hideMiniCart();

        return false;
      });

    },
    showMiniCartOnHover: function () {
      const $el = $('[data-ajax-cart-trigger]');

      $el.hover(function () {
        if (Shopify.theme_settings.header_layout == 'centered' && $('.header-sticky-wrapper').hasClass('is-sticky')) {
          $('.header-sticky-wrapper [data-ajax-cart-trigger]').addClass('show-mini-cart');
        } else {
          $el.addClass('show-mini-cart');
        }
      }, function () {
        $el.removeClass('show-mini-cart');
      });
    },
    hideMiniCart: function () {
      if (this.cart_action != 'mini_cart') return false;
      const $el = $('[data-ajax-cart-close]').parents('[data-ajax-cart-trigger]');
      $el.removeClass('show-mini-cart');
    },
    toggleMiniCart: function () {
      const $el = $('.mobile-header [data-ajax-cart-trigger]');

      // Removes url to the cart page so user is not redirected
      $el.attr('href', '#');

      $el.off('touchstart').on('touchstart', function (e) {
        // If user clicks inside the element, do nothing
        if (e.target.closest('[data-ajax-cart-mini_cart]')) {
          return;
        }

        // Loads content into ajaxCart container for mobile header
        Shopify.theme.jsAjaxCart.initializeAjaxCartOnMobile();

        // If user clicks outside the element, toggle the mini cart
        $el.toggleClass('show-mini-cart');
      });
    },
    showDrawer: function () {
      if (this.cart_action != 'drawer') return false;
      this.ajaxCartDrawer.addClass('is-visible');
      $('.ajax-cart__overlay').addClass('is-visible');
    },
    hideDrawer: function () {
      if (this.cart_action != 'drawer') return false;
      this.ajaxCartDrawer.removeClass('is-visible');
      $('.ajax-cart__overlay').removeClass('is-visible');
    },
    removeFromCart: function (lineID, callback) {
      $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: 'quantity=0&line=' + lineID,
        dataType: 'json',
        success: function (cart) {
          Shopify.theme.jsAjaxCart.updateView();
        },
        error: function (XMLHttpRequest, textStatus) {
          var response = eval('(' + XMLHttpRequest.responseText + ')');
          response = response.description;

        }
      });
    },
    initializeAjaxCart: function () {
      Shopify.theme.asyncView.load(
        Shopify.routes.cart_url, // template name
        'ajax', // view name (suffix)
      )
        .done(({ html, options }) => {
          $('[data-ajax-cart-content]').html(html.content);
          // Converting the currencies
          if (Shopify.theme.currencyConverter) {
            Shopify.theme.currencyConverter.convertCurrencies();
          }           
          setTimeout(function () {
            this.initializeUpsellCarousel();
            if($(".cartDrawerUpsells .flickity-button").length > 0){
              var arrowIcon = `<svg viewBox="0 0 16 14"><g fill="none" fill-rule="evenodd"><path d="M-4-5h24v24H-4z"/><g fill="currentColor" fill-rule="nonzero"><path d="M0 7c0-.393.274-.717.629-.768l.098-.007h14.546c.401 0 .727.347.727.775 0 .392-.274.716-.629.768l-.098.007H.727C.326 7.775 0 7.428 0 7z"/><path d="M8.893 1.324A.811.811 0 018.891.228a.695.695 0 01.947-.077l.081.075 5.867 6.224c.26.276.283.708.07 1.012l-.07.087-5.867 6.225a.696.696 0 01-1.028-.002.813.813 0 01-.069-1.01l.071-.086 5.349-5.677-5.349-5.675z"/></g></g></svg>`;
              $(".cartDrawerUpsells .flickity-button").html(arrowIcon);              
            }
          }.bind(this), 100);      
        })
        .fail(() => {
          // some error handling
        });
    },
    initializeAjaxCartOnMobile: function () {

      this.toggleMiniCart();

      Shopify.theme.asyncView.load(
        Shopify.routes.cart_url, // template name
        'ajax', // view name (suffix)
      )
        .done(({ html, options }) => {

          $('.mobile-header [data-ajax-cart-content]').html(html.content);
          setTimeout(function () {
            this.initializeUpsellCarousel();
            if($(".cartDrawerUpsells .flickity-button").length > 0){
              var arrowIcon = `<svg viewBox="0 0 16 14"><g fill="none" fill-rule="evenodd"><path d="M-4-5h24v24H-4z"/><g fill="currentColor" fill-rule="nonzero"><path d="M0 7c0-.393.274-.717.629-.768l.098-.007h14.546c.401 0 .727.347.727.775 0 .392-.274.716-.629.768l-.098.007H.727C.326 7.775 0 7.428 0 7z"/><path d="M8.893 1.324A.811.811 0 018.891.228a.695.695 0 01.947-.077l.081.075 5.867 6.224c.26.276.283.708.07 1.012l-.07.087-5.867 6.225a.696.696 0 01-1.028-.002.813.813 0 01-.069-1.01l.071-.086 5.349-5.677-5.349-5.675z"/></g></g></svg>`;
              $(".cartDrawerUpsells .flickity-button").html(arrowIcon);
            }
          }.bind(this), 100);      
        })
        .fail(() => {
          // some error handling
        });
    },
    initializeUpsellCarousel: function () {
      if ($('.upsellContainer').length > 0) {    
       $('.upsellContainer').flickity({
          lazyLoad: 2,
          freeScroll: false,
          imagesLoaded: true,
          draggable: true,
          cellAlign: 'left',
          wrapAround: false,
          pageDots: true,
          contain: true,
          prevNextButtons: true,
          initialIndex: 0,
          watchCSS: false,
        });       
      }
    },
    addToCart: function ($addToCartForm) {
      const $addToCartBtn = $addToCartForm.find('.button--add-to-cart');

      $addToCartForm.removeClass('shopify-product-form--unselected-error');

      if ($addToCartBtn[0].hasAttribute('data-options-unselected')) {
        const cartWarning = `<p class="cart-warning__message animated bounceIn">${Shopify.translation.select_variant}</p>`;

        $('.warning').remove();

        $addToCartForm
          .addClass('shopify-product-form--unselected-error')
          .find('.cart-warning')
          .html(cartWarning);

        $addToCartBtn
          .removeAttr('disabled')
          .removeClass('disabled');

        $addToCartBtn.find('.icon')
          .removeClass('zoomOut')
          .addClass('zoomIn');

        $addToCartBtn
          .find('span:not(.icon)')
          .text($addToCartBtn.data('label'))
          .removeClass('zoomOut')
          .addClass('zoomIn');
      } else {
        $.ajax({
          url: '/cart/add.js',
          dataType: 'json',
          cache: false,
          type: 'post',
          data: $addToCartForm.serialize(),
          beforeSend: function () {
            $addToCartBtn
              .attr('disabled', 'disabled')
              .addClass('disabled');

            $addToCartBtn.find('span')
              .removeClass("fadeInDown")
              .addClass('animated zoomOut');
          },
          success: function (product) {

            let $el = $('[data-ajax-cart-trigger]');

            $addToCartBtn
              .find('.checkmark')
              .addClass('checkmark-active');

            function addedToCart() {

              if (!isScreenSizeLarge()) {
                $el = $('.mobile-header [data-ajax-cart-trigger]');
                Shopify.theme.scrollToTop($el);
              } else {
                $el = $('[data-ajax-cart-trigger]');
              }

              $el.addClass('show-mini-cart');

              $addToCartBtn.find('span')
                .removeClass('fadeInDown');
            }

            window.setTimeout(function () {
              $addToCartBtn
                .removeAttr('disabled')
                .removeClass('disabled');

              $addToCartBtn.find('.checkmark')
                .removeClass('checkmark-active');

              $addToCartBtn.find('.text, .icon')
                .removeClass('zoomOut')
                .addClass('fadeInDown');

              $addToCartBtn.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', addedToCart);

            }, 1000);

            Shopify.theme.jsAjaxCart.showDrawer();
            Shopify.theme.jsAjaxCart.updateView();

            if (Shopify.theme.jsCart) {
              $.ajax({
                dataType: "json",
                async: false,
                cache: false,
                dataType: 'html',
                url: "/cart",
                success: function (html) {
                  const cartForm = $(html).find('.cart__form');
                  $('.cart__form').replaceWith(cartForm);

                }
              });
            }

          },
          error: function (XMLHttpRequest) {
            let response = eval('(' + XMLHttpRequest.responseText + ')');
            response = (response.message) ? response.message : response.description;

            const cartWarning = `<p class="cart-warning__message animated bounceIn">${response.replace('All 1 ', 'All ')}</p>`;

            $('.warning').remove();

            $addToCartForm
              .find('.cart-warning')
              .html(cartWarning);

            $addToCartBtn
              .removeAttr('disabled')
              .removeClass('disabled');

            $addToCartBtn.find('.icon')
              .removeClass('zoomOut')
              .addClass('zoomIn');

            $addToCartBtn
              .find('span:not(.icon)')
              .text($addToCartBtn.data('label'))
              .removeClass('zoomOut')
              .addClass('zoomIn');
          }
        });
      }
    },
    updateView: function () {

      Shopify.theme.asyncView.load(
        Shopify.routes.cart_url, // template name
        'ajax', // view name (suffix)
      )
        .done(({ html, options }) => {

          if (options.item_count > 0) {
            const itemList = $(html.content).find('.ajax-cart__list');
            const cartDetails = $(html.content).find('.ajax-cart__details-wrapper');
            const total_price = options.total_price

            $('.ajax-cart__list').replaceWith(itemList);
            $('.ajax-cart__details-wrapper').replaceWith(cartDetails);
            $('.ajax-cart__empty-cart-message').addClass('is-hidden');
            $('.ajax-cart__form').removeClass('is-hidden');
            $('[data-ajax-cart-trigger]').addClass('has-cart-count');
            $('[data-bind="itemCount"]').text(options.item_count);

            /* Update shipping indicator asynchronously js */
            if ($('[data-fs-threshold]').length) {
              let $parent = $('[data-fs-threshold]')
              let $remainingWrapper = $parent.find('.fs-indicator__remaining')
              let $successWrapper = $parent.find('.fs-indicator__success')

              let fs_threshold = $('[data-fs-threshold]').data('fs-threshold');
              if (fs_threshold >= total_price) {
                //udpate
                let fs_remaining = fs_threshold - total_price;
                let fs_remaining_percent = total_price / fs_threshold * 100

                $remainingWrapper.find('.bar').css('width', fs_remaining_percent + '%')
                $remainingWrapper.find('[data-bind="remaining-amount"]').text(Shopify.formatMoney(fs_remaining))

                $remainingWrapper.removeClass('is-hidden')
                $successWrapper.addClass('is-hidden')
              } else {
                //remove shipping indicator
                $remainingWrapper.addClass('is-hidden')
                $successWrapper.removeClass('is-hidden')
              }
            }
            setTimeout(function () {
              this.initializeUpsellCarousel();
              if($(".cartDrawerUpsells .flickity-button").length > 0){
                var arrowIcon = `<svg viewBox="0 0 16 14"><g fill="none" fill-rule="evenodd"><path d="M-4-5h24v24H-4z"/><g fill="currentColor" fill-rule="nonzero"><path d="M0 7c0-.393.274-.717.629-.768l.098-.007h14.546c.401 0 .727.347.727.775 0 .392-.274.716-.629.768l-.098.007H.727C.326 7.775 0 7.428 0 7z"/><path d="M8.893 1.324A.811.811 0 018.891.228a.695.695 0 01.947-.077l.081.075 5.867 6.224c.26.276.283.708.07 1.012l-.07.087-5.867 6.225a.696.696 0 01-1.028-.002.813.813 0 01-.069-1.01l.071-.086 5.349-5.677-5.349-5.675z"/></g></g></svg>`;
                $(".cartDrawerUpsells .flickity-button").html(arrowIcon);
              }
            }.bind(this), 100);     

          } else {
            $('.ajax-cart__empty-cart-message').removeClass('is-hidden');
            $('.ajax-cart__form').addClass('is-hidden');
            $('[data-ajax-cart-trigger]').removeClass('has-cart-count');
            $('[data-bind="itemCount"]').text('0');
          }

          if (Shopify.theme.currencyConverter) {
            Shopify.theme.currencyConverter.convertCurrencies();
          }
        })
        .fail(() => {
          // some error handling
        });
    },
    unload: function ($section) {

      // Clear event listeners in theme editor
      $('.ajax-submit').off();
      $('[data-ajax-cart-delete]').off();
    }
  }

  /******/
})()
  ;