import $ from 'jquery'
import anime from 'animejs'

import { openNavigation, closeNavigation } from './common'

function setupScrollAnimation () {
  $('.page').removeClass('hidden')

  const halfPage = window.innerHeight / 2

  const timeline = anime.timeline({
    duration: document.body.clientHeight,
    autoplay: false
  })

  for (const el of $('.fade-in')) {
    timeline.add({
      targets: el,
      opacity: [0, 1],
      duration: el.clientHeight,
      easing: 'easeInQuint'
    }, el.offsetTop - el.clientHeight / 2)
  }

  for (const el of $('.fade-out')) {
    timeline.add({
      targets: el,
      opacity: [1, 0],
      duration: el.clientHeight,
      easing: 'easeOutQuad'
    }, el.offsetTop + el.clientHeight / 2)
  }

  function updateAnimation () {
    const progress = Math.max(0, window.scrollY) + halfPage
    timeline.seek(progress)
  }
  document.body.onscroll = updateAnimation
  updateAnimation()
}

document.body.onresize = setupScrollAnimation
setupScrollAnimation()

$('.nav-button').click(function () {
  openNavigation()
})
