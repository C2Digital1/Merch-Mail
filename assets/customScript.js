$(document).ready(function () {
    $(".popupBtn").click(function () {
        $("body, html").addClass("enableScroll");
    });
    $(".tabHeading").click(function(){
       $(this).toggleClass("active");
       $(this).next(".tabContent ").slideToggle(300);
    });
});