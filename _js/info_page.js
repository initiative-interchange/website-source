import $ from 'jquery';
import anime from 'animejs';

// when the document is ready...
$(() => {
  const outerElement = $('main');

  const hero = $('.hero > .background');
  // parallax factor of hero background image disappearing
  const factor = 1.5;
  // height of the background image when it should disappear
  // it only disappears from the page so the hight doesn't need to approach 0
  const percent = 100 / factor;

  // rebuild the animation every time the document changes its size
  document.body.onresize = setupAnimation;
  // and build it the when the page has loaded
  setupAnimation();

  // function that removes the animation
  let removeAnimation;

  function setupAnimation () {
    const animation = anime({
      targets: hero.get(),
      clipPath: `polygon(0 0, 100% 0, 100% ${percent}%, 0 ${percent}%)`,
      duration: hero.height() / factor,
      easing: 'linear',
      autoplay: false
    });

    function updateAnimation () {
      const progress = Math.max(0, outerElement.scrollTop());
      animation.seek(progress);
    }

    // remove old animation
    if (typeof (removeAnimation) === 'function') removeAnimation();
    // update the animation everytime someone scrolls on the page
    outerElement.scroll(updateAnimation);
    // set up the remove hook
    removeAnimation = () => outerElement.off('scroll', updateAnimation);

    // make the animation match the current scroll hight immediately
    updateAnimation();
  }
});
