"use strict";

Shopify.theme.jsFAQ  = {
  init: function init($section) {
    Shopify.theme.jsFAQ = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors
	this.$section = $section
    
    let $main = $section.find('.faq__block-main')
    let $heading = $main.find('.faq__block-title:not(.expand)')
    
    let $panel = $section.find('.faq__item')
    let $questions = $panel.find('.faq__item-question')
    
	let $tags = $section.find('.faq__tags-tag')
    
    
    $tags.on('click',function(e){
      e.preventDefault()
      let tag = $(this).data('tag')
      let offset = $("#"+tag).offset().top
      let headerHeight = Shopify.theme.jsHeader.getHeaderHeight()
      let isHeaderSticky = Shopify.theme.jsHeader.enable_sticky
      if(isHeaderSticky){
      	offset -= headerHeight
      }
      
      $([document.documentElement, document.body]).animate({
        scrollTop: offset
      }, 300);
    })
    
    $heading.on('click',function(){
        if($(this).siblings('.faq__block-main__questions').css('display')=='none'){
            $(this).parent().addClass('tab--open')
            $(this).siblings('.faq__block-main__questions').slideDown()
        }else{
            $(this).siblings('.faq__block-main__questions').slideUp(()=>{
                $(this).parent().removeClass('tab--open')
            })
        }    
    })
    
 	$questions.on('click',function(){
        $(this).closest(".faq__block-faq").siblings(".faq__block-faq").find(".tab--open .faq__item-answer").slideUp();
        $(this).closest(".faq__block-faq").siblings(".faq__block-faq").find(".tab--open").removeClass("tab--open");
        if($(this).siblings('.faq__item-answer').css('display')=='none'){
            $(this).parent().addClass('tab--open')
            $(this).siblings('.faq__item-answer').slideDown()
        }else{
            $(this).siblings('.faq__item-answer').slideUp(()=>{
                $(this).parent().removeClass('tab--open')
            })
        }
    })
  },
  unload: function unload($section) {
    let $panel = $section.find('.faq__item')
    let $heading = $panel.find('.faq__block-title')
    let $questions = $panel.find('.faq__item-question')
    let $tags = $section.find('.faq__tags-tag')
    $questions.off('click');
    $heading.off('click')
    $tags.off('click')
  }
};