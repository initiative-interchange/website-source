import $ from 'jquery';
import anime from 'animejs';

const navBackgroundEntryAnimation = anime({
  targets: 'nav > .background',
  opacity: [0, 1],
  duration: 200,
  easing: 'linear',
  autoplay: false
});

const navBackgroundExitAnimation = anime({
  targets: 'nav > .background',
  opacity: [1, 0],
  duration: 200,
  easing: 'linear',
  autoplay: false,
	complete: function(anim){
			$('nav').removeClass('open');}
});

const itemExitAnimation = anime({
  targets: '.nav-item',
  opacity: [1, 0],
	translateY: [0, 50],
  duration: 300,
  easing: 'easeOutQuint',
  autoplay: false
});

const itemEntryAnimation = anime({
  targets: '.nav-item',
  opacity: [0, 1],
  translateY: [100, 0],
  duration: 400,
  delay: anime.stagger(40),
  easing: 'easeOutQuint',
  autoplay: false
});

const barExitAnimation = anime.timeline({
  duration: 400,
  autoplay: false
});

barExitAnimation.add({
  targets: '#firstBar',
  y1: [0, 5],
  y2: [22, 5],
  duration: 400,
  easing: 'easeOutQuint',
  autoplay: false
}, 0);

barExitAnimation.add({
  targets: '#secondBar',
  x1: [6, 0],
  x2: [6, 22],
  opacity: [0, 1],
  duration: 400,
  easing: 'easeOutQuint',
  autoplay: false
}, 0);

barExitAnimation.add({
  targets: '#thirdBar',
  y1: [22, 17],
  y2: [0, 17],
  duration: 400,
  easing: 'easeOutQuint',
  autoplay: false
}, 0);

const barEntryAnimation = anime.timeline({
  duration: 400,
  autoplay: false
});

barEntryAnimation.add({
  targets: '#firstBar',
  y1: [5, 0],
  y2: [5, 22],
  duration: 400,
  easing: 'easeOutQuint',
  autoplay: false
}, 0);

barEntryAnimation.add({
  targets: '#secondBar',
  x1: [0, 6],
  x2: [22, 6],
  opacity: [1, 0],
  duration: 400,
  easing: 'easeOutQuint',
  autoplay: false
}, 0);

barEntryAnimation.add({
  targets: '#thirdBar',
  y1: [17, 22],
  y2: [17, 0],
  duration: 400,
  easing: 'easeOutQuint',
  autoplay: false
}, 0);

function reset () {
  itemExitAnimation.reset();
  itemEntryAnimation.reset();
  barEntryAnimation.reset();
  barExitAnimation.reset();
}

export function open () {
  $('nav').addClass('open');
  reset();
  barEntryAnimation.play();
  itemEntryAnimation.play();
	navBackgroundEntryAnimation.play();
}
export function close () {
  reset();
  barExitAnimation.play();
  itemExitAnimation.play();
	navBackgroundExitAnimation.play();
}
export function isOpen () {
  return $('nav').hasClass('open');
}
export function toggle () {
  if (isOpen()) {
    close();
  } else {
    open();
  }
}

export default {
  open,
  close,
  isOpen,
  toggle
};
