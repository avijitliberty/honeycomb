// Scroll to top of page.
    $('.back-to-top').click(function (event) {
      event.preventDefault();
      $('html, body').animate({
        'scrollTop': 0
      }, 800, function () {
        window.location.hash = "";
      });
    });
