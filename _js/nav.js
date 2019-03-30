import $ from 'jquery'
import anime from 'animejs'

const exitAnimation = anime({
    targets: '.nav-item',
    opacity: [1,0],
    duration: 200,
    easing: 'easeOutQuint',
    autoplay: false
})

const entryAnimation = anime({
    targets: '.nav-item',
    opacity: [0,1],
    translateY: [200,1],
    duration: 400,
    delay: anime.stagger(60),
    easing: 'easeOutQuint',
    autoplay: false
})

function reset() {
    exitAnimation.reset()
    entryAnimation.reset()
}

export default {
    open() {
        $('nav').addClass('open')
        reset()
        entryAnimation.play()
    },
    close() {
        $('nav').removeClass('open')
        reset()
        exitAnimation.play()
    },
    isOpen() {
        return $('nav').hasClass('open')
    },
    toggle() {
        if (this.isOpen()) {
            this.close()
        } else {
            this.open()
        }
    }
}
