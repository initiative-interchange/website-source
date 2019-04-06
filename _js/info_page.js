import $ from 'jquery'
import anime from 'animejs'

$(() => {
  const outerElement = $('main')

  const hero = $('.hero > .background')
  const factor = 1.5
  const percent = 100/factor

  document.body.onresize = setupAnimation
  setupAnimation()

  let removeAnimation;

  function setupAnimation() {
    
    const animation = anime({
      targets: hero.get(),
      clipPath: `polygon(0 0, 100% 0, 100% ${percent}%, 0 ${percent}%)`,
      duration: hero.height() / factor,
      easing: 'linear',
      autoplay: false
    })
  
    function updateAnimation() {
      const progress = Math.max(0, outerElement.scrollTop())
      animation.seek(progress)
    }
  
    if (typeof(removeAnimation) === 'function') removeAnimation()
    outerElement.scroll(updateAnimation)
    removeAnimation = () => outerElement.off('scroll', updateAnimation)
  
    updateAnimation()
  }
})