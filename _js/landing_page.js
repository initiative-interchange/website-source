import $ from 'jquery'
import anime from 'animejs'

$(() => {
  const outerElement = $('main')

  let cleanUpAnimation

  function setupScrollAnimation() {

    $('.page').removeClass('hidden')
    const firstPage = $('.page').first()
    $('.top-page-spacer').css('height', (outerElement.height() - firstPage.height()) / 2)

    const halfPage = outerElement.height() / 2

    const timeline = anime.timeline({
      duration: outerElement.height(),
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

    function updateAnimation() {
      const progress = Math.max(0, outerElement.scrollTop()) + halfPage
      timeline.seek(progress)
    }

    if (typeof (cleanUpAnimation) === 'function') {
      cleanUpAnimation()
    }
    outerElement.scroll(updateAnimation)
    cleanUpAnimation = () => outerElement.off('scroll', updateAnimation)

    updateAnimation()
  }

  document.body.onresize = setupScrollAnimation
  setupScrollAnimation()
})
