
window.onresize = function (event) {
  $('.nav').removeAttr('style');
};

$(document).ready(function () {
  $('.nav-link-container').hover(function () {
    $(this).find('.nav-popup-link-container').toggleClass('isClickable');
    window.items = $(this).find('.nav-popup-link');
    var isMoved = true;
    for (var i = 0; i < items.length; i++) {
      var toggleItemMove = getToggleItemMove(i);
      var delay = isMoved ? (window.items.length - i - 1) : i;
      delay *= 80;
      setTimeout(toggleItemMove, delay);
    }
  });

  function getToggleItemMove (i) {
    var item = items[i];
    return function () {
      item.classList.toggle('isVisible');
    };
  }

  $('.hamburger').click(function () {
    $('.hamburger').toggleClass('is-active');
    $('body, html').toggleClass('unscrollable');
    $('.nav').fadeToggle(300);
  });
});
