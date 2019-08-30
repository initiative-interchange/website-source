import $ from 'jquery';
import Plyr from 'plyr';
import 'slick-carousel';

$(() => {
  $('.carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true
  });

  Plyr.setup('.video-player');
});
