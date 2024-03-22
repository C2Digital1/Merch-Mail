$(document).ready(function () {
    $(".popupBtn").click(function () {
        $("body, html").addClass("enableScroll");
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
});