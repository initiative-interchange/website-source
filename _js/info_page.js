import $ from 'jquery'
import anime from 'animejs'

$(() => {
  const hero = $('.hero > .background')
  const factor = 1.5
  const percent = 100/factor

  const animation = anime({
    targets: hero.get(),
    clipPath: `polygon(0 0, 100% 0, 100% ${percent}%, 0 ${percent}%)`,
    duration: hero.height() / factor,
    easing: 'linear',
    autoplay: false
  })

  function updateAnimation() {
    const progress = Math.max(0, window.scrollY)
    animation.seek(progress)
  }
  document.body.onscroll = updateAnimation
  updateAnimation()
})