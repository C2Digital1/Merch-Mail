/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 722:
/***/ (() => {

class VariantSelection extends HTMLElement {
  static get observedAttributes() {
    return ['variant'];
  }

  constructor() {
    super();
    this._loaded = false;
    this._productFetcher = Promise.resolve(false);

    this._onMainElChange = event => {
      this.variant = event.currentTarget.value;
    };

    const mainInputEl = this.querySelector('input[data-variants]');
    this._mainEl = mainInputEl || this.querySelector('select[data-variants]');
  }

  set variant(value) {
    if (value) {
      this.setAttribute('variant', value);
    } else {
      this.removeAttribute('variant');
    }
  }

  get variant() {
    return this.getAttribute('variant');
  }

  connectedCallback() {
    this._productFetcher = this._fetchProduct();
    const mainInputEl = this.querySelector('input[data-variants]');
    this._mainEl = mainInputEl || this.querySelector('select[data-variants]');

    this._mainEl.addEventListener('change', this._onMainElChange);

    this.variant = this._mainEl.value;
  }

  disconnectedCallback() {
    this._mainEl.removeEventListener('change', this._onMainElChange);

    this._mainEl = null;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case 'variant':
        this._changeVariant(newValue);

        break;
    }
  }

  getProduct() {
    return this._loaded ? Promise.resolve(this._product) : this._productFetcher;
  }

  getVariant() {
    return this.getProduct().then(product => product ? product.variants.find(v => v.id.toString() === this.variant) || false : false).catch(() => false);
  }

  getState() {
    return this.getVariant().then(variant => variant ? 'selected' : this.getAttribute('variant'));
  }

  _changeVariant(value) {
    this._dispatchEvent(value).then(() => {
      this._mainEl.value = value;
    });
  }

  _fetchProduct() {
    return fetch(this.getAttribute('product-url')).then(response => response.json()).then(product => {
      this._product = product;
      return product;
    }).catch(() => {
      this._product = null;
    }).finally(() => {
      this._loaded = true;
    });
  }

  _dispatchEvent(value) {
    return this.getProduct().then(product => {
      const variant = product ? product.variants.find(v => v.id.toString() === value) || false : false;
      const state = variant ? 'selected' : value;
      const event = new CustomEvent('variant-change', {
        detail: {
          product,
          variant,
          state
        }
      });
      this.dispatchEvent(event);
    });
  }

}

const valueElementType = {
  select: 'option',
  radio: 'input[type="radio"]'
};

function setSelectedOptions(selectOptions, radioOptions, selectedOptions) {
  selectOptions.forEach(({
    option
  }) => {
    option.value = selectedOptions[parseInt(option.dataset.variantOptionIndex, 10)];
  });
  radioOptions.forEach(({
    values
  }) => {
    values.forEach(value => {
      value.checked = value.value === selectedOptions[parseInt(value.dataset.variantOptionValueIndex, 10)];
    });
  });
}

function getOptions(optionsEls) {
  const select = [];
  const radio = [];

  for (let i = 0; i < optionsEls.length; i++) {
    const optionEl = optionsEls[i];
    const wrappers = optionEl.matches('[data-variant-option-value-wrapper]') ? [optionEl] : Array.prototype.slice.call(optionEl.querySelectorAll('[data-variant-option-value-wrapper]'));
    const values = optionEl.matches('[data-variant-option-value]') ? [optionEl] : Array.prototype.slice.call(optionEl.querySelectorAll('[data-variant-option-value]'));
    if (!values.length) break;
    const option = {
      option: optionEl,
      wrappers,
      values
    };

    if (values[0].matches(valueElementType.select)) {
      select.push(option);
    } else if (values[0].matches(valueElementType.radio)) {
      radio.push(option);
    }
  }

  return {
    select,
    radio
  };
}

function getSelectedOptions(product, selectOptions, radioOptions) {
  const options = product.options.map(() => 'not-selected');
  selectOptions.forEach(({
    option
  }) => {
    if (option.value !== 'not-selected') {
      options[parseInt(option.dataset.variantOptionIndex, 10)] = option.value;
    }
  });
  radioOptions.forEach(({
    values
  }) => {
    values.forEach(value => {
      if (value.checked) {
        options[parseInt(value.dataset.variantOptionValueIndex, 10)] = value.value;
      }
    });
  });
  return options;
}

function getVariantFromSelectedOptions(variants, selectedOptions) {
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const isVariant = variant.options.every((option, index) => option === selectedOptions[index]);
    if (isVariant) return variant; // We found the variant
  }

  return false;
}

function _getVariant(variants, options) {
  return variants.find(variant => variant.options.every((option, index) => option === options[index]));
}

function _setOptionsMap(product, selectedOptions, optionsMap, option1, option2 = null, option3 = null) {
  const updatedOptionsMap = { ...optionsMap
  };
  const options = [option1, option2, option3].filter(option => !!option);

  const variant = _getVariant(product.variants, options);

  const variantOptionMatches = options.filter((option, index) => option === selectedOptions[index]).length;
  const isCurrentVariant = variantOptionMatches === product.options.length;
  const isNeighbor = variantOptionMatches === product.options.length - 1;

  for (let i = 0; i < options.length; i++) {
    const option = options[i];

    if (option) {
      let {
        setByCurrentVariant,
        setByNeighbor,
        accessible,
        available
      } = optionsMap[i][option];

      if (variant) {
        accessible = variant.available || accessible; // The current variant is always
        // the priority for option availability

        if (isCurrentVariant) {
          setByCurrentVariant = true;
          ({
            available
          } = variant);
        } else if (!setByCurrentVariant && isNeighbor) {
          // If the variant is a neighbor
          // And the option doesn't belong to the variant
          // Use its availability information for the option
          // If multiple neighbors exist, prefer true
          available = setByNeighbor ? available || variant.available : variant.available;
          setByNeighbor = true;
        }
      } else if (isCurrentVariant) {
        // Catch case where current variant doesn't exist
        // Ensure availability is false
        setByCurrentVariant = true;
        available = false;
      } else if (!setByCurrentVariant && isNeighbor) {
        // Catch case where neighbor doesn't exist
        // Ensure availability is false
        // If multiple neighbors exist, prefer true
        available = setByNeighbor ? available : false;
        setByNeighbor = true;
      } // If the option isn't set by either
      // the current variant or a neighbor
      // default to general accessibility


      if (!setByCurrentVariant && !setByNeighbor) {
        available = accessible;
      }

      updatedOptionsMap[i][option] = {
        setByCurrentVariant,
        setByNeighbor,
        accessible,
        available
      };
    }
  }

  return updatedOptionsMap;
}

function getOptionsAccessibility(product, selectedOptions) {
  let optionsMap = product.options.map(() => ({}));

  for (let i = 0; i < product.options.length; i++) {
    for (let j = 0; j < product.variants.length; j++) {
      const variant = product.variants[j];
      const option = variant.options[i];
      optionsMap[i][option] = {
        setByCurrentVariant: false,
        setByNeighbor: false,
        accessible: false,
        available: false
      };
    }
  }

  const option1Values = optionsMap.length >= 1 ? Object.keys(optionsMap[0]) : [];
  const option2Values = optionsMap.length >= 2 ? Object.keys(optionsMap[1]) : [];
  const option3Values = optionsMap.length >= 3 ? Object.keys(optionsMap[2]) : [];
  option1Values.forEach(option1Value => {
    option2Values.forEach(option2Value => {
      option3Values.forEach(option3Value => {
        optionsMap = _setOptionsMap(product, selectedOptions, optionsMap, option1Value, option2Value, option3Value);
      });

      if (!option3Values.length) {
        optionsMap = _setOptionsMap(product, selectedOptions, optionsMap, option1Value, option2Value);
      }
    });

    if (!option2Values.length) {
      optionsMap = _setOptionsMap(product, selectedOptions, optionsMap, option1Value);
    }
  });
  return optionsMap;
}

function updateOptions(product, selectOptions, radioOptions, selectedOptions, disableUnavailableOptions, removeUnavailableOptions) {
  const options = [...selectOptions, ...radioOptions];

  if (options.length === 0) {
    return;
  }

  const optionsAccessibility = getOptionsAccessibility(product, selectedOptions); // Iterate over each option type

  for (let i = 0; i < product.options.length; i++) {
    // Corresponding select dropdown, if it exists
    const optionValues = options.find(({
      option
    }) => {
      if (parseInt(option.dataset.variantOptionIndex, 10) === i) {
        return true;
      }

      return false;
    });

    if (optionValues) {
      const fragment = document.createDocumentFragment();
      const {
        option,
        wrappers,
        values
      } = optionValues;

      for (let j = values.length - 1; j >= 0; j--) {
        const wrapper = wrappers[j];
        const optionValue = values[j];
        const {
          value
        } = optionValue;
        const {
          available
        } = value in optionsAccessibility[i] ? optionsAccessibility[i][value] : false;
        const {
          accessible
        } = value in optionsAccessibility[i] ? optionsAccessibility[i][value] : false;
        const isChooseOption = value === 'not-selected'; // Option element to indicate unchosen option
        // Disable unavailable options

        optionValue.disabled = isChooseOption || disableUnavailableOptions && !accessible;
        optionValue.dataset.variantOptionAccessible = accessible;
        optionValue.dataset.variantOptionAvailable = available;

        if (!removeUnavailableOptions || accessible || isChooseOption) {
          fragment.insertBefore(wrapper, fragment.firstElementChild);
        }
      }

      option.innerHTML = '';
      option.appendChild(fragment);
      const chosenValue = values.find(value => value.selected || value.checked);
      option.dataset.variantOptionChosenValue = chosenValue && chosenValue.value !== 'not-selected' ? chosenValue.value : false;
    }
  }
}

class OptionsSelection extends HTMLElement {
  static get observedAttributes() {
    return ['variant-selection', 'disable-unavailable', 'remove-unavailable'];
  }

  static synchronize(mainOptionsSelection) {
    const mainVariantSelection = mainOptionsSelection.getVariantSelection(); // Fast return if we aren't associated with a variant selection

    if (!mainVariantSelection) return Promise.resolve(false);
    return mainOptionsSelection.getSelectedOptions().then(selectedOptions => {
      // Update all other options selects associated with the same variant ui
      const optionsSelections = document.querySelectorAll('options-selection');
      optionsSelections.forEach(optionsSelection => {
        if (optionsSelection !== mainOptionsSelection && optionsSelection.getVariantSelection() === mainVariantSelection) {
          optionsSelection.setSelectedOptions(selectedOptions);
        }
      });
    }).then(() => true);
  }

  constructor() {
    super();
    this.style.display = '';
    this._events = [];
    this._onChangeFn = this._onOptionChange.bind(this);
    this._optionsEls = this.querySelectorAll('[data-variant-option]');
    ({
      select: this._selectOptions,
      radio: this._radioOptions
    } = getOptions(this._optionsEls));

    this._associateVariantSelection(this.getAttribute('variant-selection'));
  }

  set variantSelection(value) {
    if (value) {
      this.setAttribute('variant-selection', value);
    } else {
      this.removeAttribute('variant-selection');
    }
  }

  get variantSelection() {
    return this.getAttribute('variant-selection');
  }

  connectedCallback() {
    this._optionsEls = this.querySelectorAll('[data-variant-option]');
    ({
      select: this._selectOptions,
      radio: this._radioOptions
    } = getOptions(this._optionsEls));

    this._associateVariantSelection(this.getAttribute('variant-selection'));

    this._selectOptions.forEach(({
      option
    }) => {
      option.addEventListener('change', this._onChangeFn);

      this._events.push({
        el: option,
        fn: this._onChangeFn
      });
    });

    this._radioOptions.forEach(({
      values
    }) => {
      values.forEach(value => {
        value.addEventListener('change', this._onChangeFn);

        this._events.push({
          el: value,
          fn: this._onChangeFn
        });
      });
    });

    this._onOptionChange();
  }

  disconnectedCallback() {
    this._resetOptions();

    this._events.forEach(({
      el,
      fn
    }) => el.removeEventListener('change', fn));

    this._events = [];
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    switch (name) {
      case 'variant-selection':
        this._associateVariantSelection(newValue);

        break;

      case 'disable-unavailable':
      case 'remove-unavailable':
        this._updateOptions(this.hasAttribute('disable-unavailable'), this.hasAttribute('remove-unavailable'));

        break;
    }
  }

  getSelectedOptions() {
    if (!this._variantSelection) return Promise.resolve(null);
    return this._variantSelection.getProduct().then(product => {
      if (!product) return null;
      return getSelectedOptions(product, this._selectOptions, this._radioOptions);
    });
  }

  getVariantSelection() {
    return this._variantSelection;
  }

  setSelectedOptions(selectedOptions) {
    setSelectedOptions(this._selectOptions, this._radioOptions, selectedOptions);
    return this._updateOptions(this.hasAttribute('disable-unavailable'), this.hasAttribute('remove-unavailable'), selectedOptions);
  }

  _associateVariantSelection(id) {
    this._variantSelection = id ? document.getElementById(id) : this.closest('variant-selection');
  }

  _updateLabels() {
    // Update any labels
    for (let i = 0; i < this._optionsEls.length; i++) {
      const optionsEl = this._optionsEls[i];
      let optionsNameEl = null;
      let {
        parentElement
      } = optionsEl;

      while (parentElement && !optionsNameEl) {
        const tmpOptionsNameEl = parentElement.querySelector('[data-variant-option-name]');

        if (tmpOptionsNameEl) {
          optionsNameEl = tmpOptionsNameEl;
        }

        ({
          parentElement
        } = parentElement);
      }

      if (optionsNameEl) {
        optionsNameEl.dataset.variantOptionChosenValue = optionsEl.dataset.variantOptionChosenValue;

        if (optionsEl.dataset.variantOptionChosenValue !== 'false') {
          optionsNameEl.innerHTML = optionsNameEl.dataset.variantOptionName;
          const optionNameValueSpan = optionsNameEl.querySelector('span');

          if (optionNameValueSpan) {
            optionNameValueSpan.innerHTML = optionsEl.dataset.variantOptionChosenValue;
          }
        } else {
          optionsNameEl.innerHTML = optionsNameEl.dataset.variantOptionChooseName;
        }
      }
    }
  }

  _resetOptions() {
    return this._updateOptions(false, false);
  }

  _updateOptions(disableUnavailableOptions, removeUnavailableOptions, selectedOptions = null) {
    if (!this._variantSelection) return Promise.resolve(false);
    return this._variantSelection.getProduct().then(product => {
      updateOptions(product, this._selectOptions, this._radioOptions, selectedOptions || getSelectedOptions(product, this._selectOptions, this._radioOptions), disableUnavailableOptions, removeUnavailableOptions);

      this._updateLabels();
    }).then(() => true);
  }

  _updateVariantSelection(product, selectedOptions) {
    if (!this._variantSelection) return;
    const variant = getVariantFromSelectedOptions(product.variants, selectedOptions);
    const isNotSelected = selectedOptions.some(option => option === 'not-selected'); // Update master select

    if (variant) {
      this._variantSelection.variant = variant.id;
    } else {
      this._variantSelection.variant = isNotSelected ? 'not-selected' : 'unavailable';
    }
  }

  _onOptionChange() {
    if (!this._variantSelection) return;

    this._variantSelection.getProduct().then(product => {
      if (!product) return;
      const selectedOptions = getSelectedOptions(product, this._selectOptions, this._radioOptions);

      this._updateOptions(this.hasAttribute('disable-unavailable'), this.hasAttribute('remove-unavailable'), selectedOptions);

      this._updateVariantSelection(product, selectedOptions);

      OptionsSelection.synchronize(this);
    });
  }

}

if (!customElements.get('variant-selection')) {
  customElements.define('variant-selection', VariantSelection);
}

if (!customElements.get('options-selection')) {
  customElements.define('options-selection', OptionsSelection);
}
/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _pixelunion_shopify_variants_ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(722);
/* harmony import */ var _pixelunion_shopify_variants_ui__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_pixelunion_shopify_variants_ui__WEBPACK_IMPORTED_MODULE_0__);


// Section Shopify Shopify.theme editor events

$(document)
.on('shopify:section:reorder', function(e){

  var $target = $(e.target);
  var $parentSection = $('#shopify-section-' + e.detail.sectionId);

  if (Shopify.theme.jsHeader.enable_overlay == true) {
    Shopify.theme.jsHeader.unload();
    Shopify.theme.jsHeader.updateOverlayStyle(Shopify.theme.jsHeader.sectionUnderlayIsImage());
  }

});

$(document)
.on('shopify:section:load', function(e){

  // Shopify section as jQuery object
  var $section = $(e.target);

  // Vanilla js selection of Shopify section
  var section = document.getElementById('shopify-section-' + e.detail.sectionId);

  // Blocks within section
  var $jsSectionBlocks = $section.find('.shopify-section[class*=js]');

  var sectionObjectUrl = $section.find('[data-theme-editor-load-script]').attr('src');

  // Check classes on schema and look for js (eg. jsMap)
  for (var i = 0; i < section.classList.length; i++) {
    if (section.classList[i].substring(0, 2) === "js"){
      var triggerClass = section.classList[i];

      // Check to see if section script exists
      if (typeof Shopify.theme[triggerClass] == 'undefined') {
        // make AJAX call to load script
        Shopify.theme.loadScript(triggerClass, sectionObjectUrl, function () {
          Shopify.theme[triggerClass].init($(section));
        });
      } else {
        if (Shopify.theme[triggerClass]) {
          // console.log('Section: ' + triggerClass + ' has been loaded.')
          Shopify.theme[triggerClass].init($(section));
        } else {
          // console.warn('Uh oh, ' + triggerClass + ' is referenced in section schema class, but can not be found. Make sure "z__' + triggerClass + '.js" and Shopify.theme.' + triggerClass + '.init() function exists.');
        }
      }
    }
  }

  // Load video feature
  Shopify.theme.video.init();

  // Scrolling animations
  Shopify.theme.animation.init();

  // Initialize reviews
  Shopify.theme.productReviews.init();

  // Infinite scrolling
  Shopify.theme.infiniteScroll.init();

  // Disclosure menus
  Shopify.theme.disclosure.enable();

  // Search
  $(document).on('click',  '[data-show-search-trigger]', function(){
    Shopify.theme.jsHeader.showSearch();
  });

  $('.search-overlay__close').on('click', function(){
    Shopify.theme.jsHeader.hideSearch();
  });

  if (Shopify.theme_settings.enable_autocomplete == true) {
    Shopify.theme.predictiveSearch.init();
  }
  // Product review scroll
  Shopify.theme.productReviews.productReviewScroll();

});


$(document)
.on('shopify:section:unload', function(e){

  // Shopify section as jQuery object
  var $section = $(e.target);

  // Vanilla js selection of Shopify section
  var section = document.getElementById('shopify-section-' + e.detail.sectionId);

  // Blocks within section
  var $jsSectionBlocks = $section.find('.shopify-section[class*=js]');

  // Check classes on schema and look for js (eg. jsMap)
  for (var i = 0; i < section.classList.length; i++) {
    if (section.classList[i].substring(0, 2) === "js"){
      var triggerClass = section.classList[i];
      if (Shopify.theme[triggerClass]) {
        // console.log('Section: ' + triggerClass + ' is unloaded.')
        Shopify.theme[triggerClass].unload($(section));
      } else {
        // console.warn('Uh oh, ' + triggerClass + ' is referenced in section schema class, but can not be found. Make sure "z__' + triggerClass + '.js" and Shopify.theme.' + triggerClass + '.unload() function exists.');
      }
    }
  }

  // Scrolling animations
  Shopify.theme.animation.unload($section);

  // QuantityBox
  Shopify.theme.quantityBox.unload($section);

  // Infinite scrolling
  Shopify.theme.infiniteScroll.unload($section);

  // Disclosure menus
  Shopify.theme.disclosure.enable();

});

$(document)
.on('shopify:section:select', function(e){

  // Shopify section as jQuery object
  var $section = $(e.target);

  // Vanilla js selection of Shopify section
  var section = document.getElementById('shopify-section-' + e.detail.sectionId);

  // Force show state when section is selected in theme editor
  for (var i = 0; i < section.classList.length; i++) {
    if (section.classList[i].substring(0, 2) === "js") {
      var triggerClass = section.classList[i];
      if (Shopify.theme[triggerClass].showThemeEditorState) {
        Shopify.theme[triggerClass].showThemeEditorState(e.detail.sectionId, $section);
      }
    }
  }

  // Predictive search
  if (Shopify.theme_settings.enable_autocomplete == true) {
    Shopify.theme.predictiveSearch.init();
  }

  if(isScreenSizeLarge() && Shopify.theme.jsHeader.enable_overlay === true) {
    Shopify.theme.jsHeader.updateOverlayStyle(Shopify.theme.jsHeader.sectionUnderlayIsImage());
  }

  if ($('.block__recommended-products').length > 0) {
    var $productPage = $('.block__recommended-products').parents('.product-page');
    Shopify.theme.jsRecommendedProducts.init($productPage);
  }

});

$(document)
.on('shopify:section:deselect', function(e){

  // Shopify section as jQuery object
  var $section = $(e.target);

  // Vanilla js selection of Shopify section
  var section = document.getElementById('shopify-section-' + e.detail.sectionId);

  // Force hide state when section is selected in theme editor
  for (var i = 0; i < section.classList.length; i++) {
    if (section.classList[i].substring(0, 2) === "js") {
      var triggerClass = section.classList[i];
      if (Shopify.theme[triggerClass].showThemeEditorState) {
        Shopify.theme[triggerClass].hideThemeEditorState(e.detail.sectionId, $(section));
      }
    }
  }

});

// Block Shopify Shopify.theme editor events

$(document)
.on('shopify:block:select', function(e){

  var blockId = e.detail.blockId;
  var $parentSection = $('#shopify-section-' + e.detail.sectionId);
  var $block = $('#shopify-section-' + blockId);

  if($('.jsFeaturedPromos').length > 0) {
    Shopify.theme.jsFeaturedPromos.blockSelect($parentSection, blockId);
  }

  if($('.jsSlideshowWithText').length > 0) {
    Shopify.theme.jsSlideshowWithText.blockSelect($parentSection, blockId);
  }

  if ($('.jsSlideshowClassic').length > 0) {
    Shopify.theme.jsSlideshowClassic.blockSelect($parentSection, blockId);
  }

  if($('.jsTestimonials').length > 0) {
    Shopify.theme.jsTestimonials.blockSelect($parentSection, blockId);
  }

  // Sidebar collection multi-tag filter
  if ($block.hasClass('sidebar__block')) {
    var $toggleBtn = $block.find('[data-sidebar-block__toggle="closed"]');
    if ($toggleBtn) {
      Shopify.theme.jsSidebar.openSidebarBlock($toggleBtn);
    }
  }

  // Predictive search
  if (Shopify.theme_settings.enable_autocomplete == true) {
    Shopify.theme.predictiveSearch.init();
  }

  // Scrolling animations
  Shopify.theme.animation.init();

});

$(document)
.on('shopify:block:deselect', function(e){

  var $block = $('#shopify-section-' + e.detail.blockId);

  if ($block.hasClass('sidebar__block')) {
    var $toggleBtn = $block.find('[data-sidebar-block__toggle="open"]');
    if ($toggleBtn) {
      Shopify.theme.jsSidebar.closeSidebarBlock($toggleBtn);
    }
  }

});

$(document)
.on('shopify:block:load', function(e){



});

// Document ready
$(function() {

  var $jsSections = $('.shopify-section[class*=js]');

  // Loop through sections with js classes and load them in
  var $jsSectionNames = $jsSections.each(function () {
    for (var i = 0; i < this.classList.length; i++) {
      if (this.classList[i].substring(0, 2) === "js"){
        var triggerClass = this.classList[i];
        if (Shopify.theme[triggerClass]) {
          // console.log('Section: ' + triggerClass + ' has been loaded.')
          Shopify.theme[triggerClass].init($(this));
        } else {
          // console.warn('Uh oh, ' + triggerClass + ' is referenced in section schema class, but can not be found. Make sure "z__' + triggerClass + '.js" and Shopify.theme.' + triggerClass + '.init() function exists.');
        }

      }
    }
  });

  var resizeTimer;

  // Store window width in variable
  var width = $(window).width(), height = $(window).height();

  $(window).on('resize', function(e) {

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {

      if (Shopify.theme.jsHeader.header_layout === 'vertical') {
        Shopify.theme.predictiveSearch.alignVerticalSearch()
      }

      if (!isScreenSizeLarge()){
        // When 798 or less
        Shopify.theme.mobileMenu.init();

      } else {

        // When larger than 798
        Shopify.theme.mobileMenu.unload();
      }

    }, 250);

  });

  //Enable plyr
  Shopify.theme.video.init();

  // Predictive search
  if (Shopify.theme_settings.enable_autocomplete == true) {
    Shopify.theme.predictiveSearch.init();
  }
  if ($('a[href]').length) {
    Shopify.theme.handleNewTabLinks($('a[href]'))
  }
  Shopify.theme.dropdownMenu();

  Shopify.theme.disclosure.enable();

  // Scrolling animations
  Shopify.theme.animation.init();

  // QuantityBox
  Shopify.theme.quantityBox.init();

  /* Show associated variant image on hover */
  if (Shopify.theme_settings.show_collection_swatches == true) {
    Shopify.theme.thumbnail.enableSwatches();
  }

  /* Show secondary image on hover */
  if (Shopify.theme_settings.show_secondary_image == true) {
    Shopify.theme.thumbnail.showVariantImage();
  }

  // Quick shop
  if (Shopify.theme_settings.enable_quickshop) {
    Shopify.theme.thumbnail.showQuickShop();
  }

  // Currency converter
  if (Shopify.theme.currencyConverter) {
    Shopify.theme.currencyConverter.init();
  }

  //Infinite scrolling
  if ($('[data-custom-pagination]').length) {
    Shopify.theme.infiniteScroll.init();
  }
  
  $('.shopify-currency-form ul li').on('click', function () {
    $(this)
      .parents('form')
      .submit();
  });


  // Additional checkout buttons
  if (!isScreenSizeLarge()) {
    $('.additional-checkout-buttons').addClass('additional-checkout-buttons--vertical');
  }

  // Responsive Video
  Shopify.theme.responsiveVideo.init();

  // Flickity IOS Fix
  Shopify.theme.flickityIosFix();

  // Product review scroll
  Shopify.theme.productReviews.productReviewScroll();

});

/*============================================================================
Slideshow arrows
==============================================================================*/

if (Shopify.theme_settings.icon_style == 'icon_solid') {
  window.arrowShape = 'M95.04 46 21.68 46 48.18 22.8 42.91 16.78 4.96 50 42.91 83.22 48.18 77.2 21.68 54 95.04 54 95.04 46z';
} else {
  window.arrowShape = 'M95,48H9.83L41,16.86A2,2,0,0,0,38.14,14L3.59,48.58a1.79,1.79,0,0,0-.25.31,1.19,1.19,0,0,0-.09.15l-.1.2-.06.2a.84.84,0,0,0,0,.17,2,2,0,0,0,0,.78.84.84,0,0,0,0,.17l.06.2.1.2a1.19,1.19,0,0,0,.09.15,1.79,1.79,0,0,0,.25.31L38.14,86A2,2,0,0,0,41,86a2,2,0,0,0,0-2.83L9.83,52H95a2,2,0,0,0,0-4Z';
}

})();

/******/ })()
;