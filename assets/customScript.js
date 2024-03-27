$(document).ready(function () {
    $(".popupBtn").click(function () {
        var currentTime = new Date().getTime();
        localStorage.setItem("dontShowBanner", JSON.stringify({
            value: true,
            timestamp: currentTime
        }));
        $("body, html").addClass("enableScroll");
    });

    $(".mobileToggleIcon").click(function () {
        $(this).toggleClass("active");
        $(".mobile-header").toggleClass("isOpen");
    });

    $(".tabHeading").click(function () {
        $(this).toggleClass("active");
        $(this).next(".tabContent ").slideToggle(300);
    });
    $(".forgotPassLabel").click(function () {
        $(".login__form").hide();
        $(".reset_form").fadeIn(200);
    });
    $(".cancelForgotPass").click(function () {
        $(".reset_form").hide();
        $(".login__form").fadeIn(200);
    });
    if ($(".flickity-button").length > 0) {
        var arrowIcon = `<svg viewBox="0 0 16 14"><g fill="none" fill-rule="evenodd"><path d="M-4-5h24v24H-4z"/><g fill="currentColor" fill-rule="nonzero"><path d="M0 7c0-.393.274-.717.629-.768l.098-.007h14.546c.401 0 .727.347.727.775 0 .392-.274.716-.629.768l-.098.007H.727C.326 7.775 0 7.428 0 7z"/><path d="M8.893 1.324A.811.811 0 018.891.228a.695.695 0 01.947-.077l.081.075 5.867 6.224c.26.276.283.708.07 1.012l-.07.087-5.867 6.225a.696.696 0 01-1.028-.002.813.813 0 01-.069-1.01l.071-.086 5.349-5.677-5.349-5.675z"/></g></g></svg>`;
        $(".flickity-button").html(arrowIcon);
    }
    if($(".mobile-menu__first-level span.close-dropdown").length > 0){
        var dropdownIcon = `<svg viewBox="0 0 14.031 7.059"><g fill="none" fill-rule="evenodd"><path d="M19.002-8.998v18h-18v-18z"/><path d="M19.002-8.998v24h-24v-24z"/><path fill="currentColor" fill-rule="nonzero" d="M.002 1.002a1 1 0 011.64-.77l5.36 4.48 5.37-4.32a1 1 0 011.41.15 1 1 0 01-.15 1.46l-6 4.83a1 1 0 01-1.27 0l-6-5a1 1 0 01-.36-.83z"/></g></svg>`
        $(".mobile-menu__first-level span.close-dropdown").html(dropdownIcon);
    }
    $('.checkPass').click(function () {
        var password = $('input#password').val();
        var confirmPassword = $('#confirmPassField').val();
        console.log(password);
        console.log(confirmPassword);
        if (password !== confirmPassword) {
            if ($(".errorLabel").length > 0) {
                $('#confirmPass').find('.errorLabel').remove();
            }
            $('#confirmPass').addClass('has-error');
            $('#confirmPass').append('<p class="errorLabel">Passwords do not match</p>');
        } else {
            $('#confirmPass').removeClass('has-error');
            $('#confirmPass').find('.errorLabel').remove();
            $(".mainSubmitBtn").click();
        }
    });

    $("button.sideProfileBtn").click(function () {
        $("button.sideProfileBtn").removeClass("active");
        $(this).addClass("active");
        var activeTabId = $(this).attr("data-tabid");
        $(".tabContentInner").hide();
        $(activeTabId).fadeIn(300);
    });

    $(".showNewAddressForm").click(function () {
        $(this).hide();
        $("#add_address").show();
    });
    $(".cancelAddressForm").click(function () {
        $(".showNewAddressForm").show();
        $("#add_address").hide();
    });
});