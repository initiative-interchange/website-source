import $ from 'jquery'
import anime from 'animejs'

import PolyDecomp from 'poly-decomp'
window.decomp = PolyDecomp

import {
  Engine,
  Bodies,
  World,
  Render,
  Runner,
  use
} from 'matter-js'
import MatterAttractors from 'matter-attractors'
import { jumpForwardInSimulation } from './lib/physics'

use(MatterAttractors)

class Circle {
  constructor(element, body) {
    this.element = element
    this.body = body
  }

  static fromDOMNode(domNode) {
    const element = $(domNode)
    const parent = element.parent()
    const margin = parseFloat(element.css('margin'))

    const group =  element.data('group')

    const colorLookup = {
      1: 'red',
      2: 'green',
      3: 'blue'
    }

    const body = Bodies.circle(
      (Math.random() + (group === 2 ? 1 : -1)) * parent.width(), 
      Math.random() * parent.height(),
      element.width() / 2 + margin,
      {
        attractionGroup: group,
        render: {
          fillStyle: colorLookup[group]
        }
      })

    return new Circle(element, body)
  }
}

function setupScrollAnimation(outerElement) {

  let cleanUpAnimation

  function createScrollAnimation() {

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

  document.body.onresize = createScrollAnimation
  createScrollAnimation()
}

async function setupBubbles(bubbleContainer, scrollContainer) {
  const parallexFactor = 2

  const engine = Engine.create()

  const world = engine.world;
  world.gravity.scale = 0;

  const mainContainer = $('main')
  const windowHeight = mainContainer.height()
  const windowWidth = mainContainer.width()

  console.log(windowHeight)

  function attractGroup(group) {
    return {
      isStatic: true,

      plugin: {
        attractors: [
          (attractor, attractee) => {
            const factor = group === attractee.attractionGroup ?
              1e-5 : 0
            return {
              x: (attractor.position.x - attractee.position.x) * factor,
              y: (attractor.position.y - attractee.position.y) * factor,
            }
          }
        ]
      }
    }
  }

  const attractor1 = Bodies.circle(
    0.3 * windowWidth,
    0.2 * windowHeight,
    5,
    attractGroup(1)
    )
  World.add(world, attractor1)

  const attractor2 = Bodies.circle(
    0.7 * windowWidth,
    0.4 * windowHeight,
    5,
    attractGroup(2)
    )
  World.add(world, attractor2)

  const attractor3 = Bodies.circle(
    0.4 * windowWidth,
    1.3 * windowHeight,
    5,
    attractGroup(3)
    )
  World.add(world, attractor3)

  const collisionBodyOptions = {
    isStatic: true,
    render: {
      fillStyle: '#ff0a'
    }
  }

  function pageBodyOffset(index) {
    const realOffset = (index + 1) * windowHeight/2
    const stretchedOffset = realOffset * parallexFactor + windowHeight/2
    return stretchedOffset
  }

  const collisionBody1 = Bodies.circle(
    0.5 * windowWidth,
    0.5 * windowHeight * parallexFactor,
    30, 
    collisionBodyOptions
  )
  World.add(world, collisionBody1)

  const collisionBody2 = Bodies.circle(
    0.5 * windowWidth,
    1 * windowHeight * parallexFactor,
    30, 
    collisionBodyOptions
  )
  World.add(world, collisionBody2)

  const bubbles = bubbleContainer.children('.bubble')
    .toArray()
    .map(Circle.fromDOMNode)

  for (const bubble of bubbles) {
    //World.add(world, bubble.body)
  }

  const solid = Bodies.rectangle(
    windowWidth * 0.5,
    0,
    50,
    50,
    {
      isStatic: true,
      fillStyle: 'red'
    }
  )
  World.add(world, solid)

  World.add(world, Bodies.rectangle(
    windowWidth * 0.5,
    windowHeight * 2,
    50,
    50,
    {
      isStatic: true,
      fillStyle: 'red'
    }
  ))

  World.add(world, Bodies.rectangle(
    windowWidth * 0.5,
    windowHeight * 4,
    50,
    50,
    {
      isStatic: true,
      fillStyle: 'red'
    }
  ))

  var render = Render.create({
    element: bubbleContainer.get(0),
    engine: engine,
    options: {
      width: bubbleContainer.width(),
      height: bubbleContainer.height(),
      background: 'transparent',
      wireframes: false
    }
  });

  // create runner
  var runner = Runner.create();

  let lastBar
  function foo(baroo) {
    if (lastBar != baroo) {
      lastBar = baroo
      console.log(lastBar)
      return
    }
  }
  
  Runner.run(runner, engine);
  Render.run(render);


  //scrollContainer.scroll(() => console.log(scrollContainer.scrollTop()))
  

  requestAnimationFrame(function renderCb() {
    const scrollOffset = scrollContainer[0].scrollTop * parallexFactor  
    foo(scrollOffset)
    Render.lookAt(render, {
      min: { x: 0, y: scrollOffset },
      max: { x: windowWidth, y: windowHeight + scrollOffset }
  })
    requestAnimationFrame(renderCb)
  })
  return

  let oldTime
  requestAnimationFrame(function render(time) {
    if (oldTime) {
      // limit delta to maximal 100ms
      // otherwise the circles go crazy after having the browser window inactive for too long
      const delta = Math.min(time - oldTime, 100)
      Engine.update(engine, delta)
    }
    oldTime = time

    requestAnimationFrame(render)

    for (const bubble of bubbles) {
      const position = bubble.body.position
      const domElement = bubble.element

      const yOffset = position.y - domElement.height()/2
      const xOffset = position.x - domElement.width()/2
      const scrollOffset = scrollContainer[0].scrollTop * parallexFactor

      domElement.css('transform', `translate3d(${xOffset}px, ${yOffset - scrollOffset}px, 0)`)
    }
  })
}

$(() => {
  const mainContainer = $('main')
  setupScrollAnimation(mainContainer)

  const bubbleContainer = $('.bubble-container')
  setupBubbles(bubbleContainer, mainContainer)
})
