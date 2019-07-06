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

//use(MatterAttractors)

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
  const fillHeight = 1000

  const engine = Engine.create()

  const world = engine.world;
  world.gravity.x = 0;
  world.gravity.y = -0.1;

  const mainContainer = $('main')
  const windowHeight = mainContainer.height()
  const windowWidth = mainContainer.width()

  const dummyInstance = $('<img class="bubble"></img>')
  bubbleContainer.append(dummyInstance)
  const bubbleWidth = parseFloat(dummyInstance.css('width'))
  const bubbleMargin = parseFloat(dummyInstance.css('margin'))
  bubbleContainer.remove(dummyInstance)
  const circleRadius = bubbleWidth/2 + bubbleMargin

  // creating boundaries
  const upperBoundary = Bodies.rectangle(
    windowWidth/2, -circleRadius,
    windowWidth + 2 * circleRadius, 10,
    {
      isStatic: true
    }
  )
  World.add(world, upperBoundary)

  const boundaryHeight = fillHeight * 1.5

  const leftBoundary = Bodies.rectangle(
    -circleRadius, boundaryHeight/2,
    10, boundaryHeight,
    {
      isStatic: true
    }
  )
  World.add(world, leftBoundary)

  const rightBoundary = Bodies.rectangle(
    windowWidth + circleRadius, boundaryHeight/2,
    10, boundaryHeight,
    {
      isStatic: true
    }
  )
  World.add(world, rightBoundary)

  // create content placeholders
  for (const page of $('.page')) {
    const yOffset = page.offsetTop + page.offsetHeight/2
    console.log(yOffset)
    const element = Bodies.rectangle(
      windowWidth/2, yOffset,
      100, 100,
      {
        isStatic: true
      }
    )
    World.add(world, element)
  }

  // calculate number of bubbles bubbles
  // https://math.stackexchange.com/questions/2548513/maximum-number-of-circle-packing-into-a-rectangle
  const areaToFill = (windowWidth + 2*circleRadius) * (fillHeight + circleRadius)
  const fillableArea = (areaToFill * Math.PI) / (2 * Math.sqrt(3))
  const bubbleArea = circleRadius * circleRadius * Math.PI
  const numberOfBubbles = Math.floor(fillableArea / bubbleArea)

  const bubbles = []
  
  for (let i = 0; i < numberOfBubbles; i++) {
    const bubble = new Circle(bubbleContainer,
      Math.random() * windowWidth,
      Math.random() * fillHeight)
    bubbles.push(bubble)
    World.add(world, bubble.body)
  }

  //await jumpForwardInSimulation(engine, 5)
  
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
  
  Runner.run(runner, engine);
  Render.run(render);


  
  //scrollContainer.scroll(() => console.log(scrollContainer.scrollTop()))

  requestAnimationFrame(function renderCb() {
    const scrollOffset = scrollContainer[0].scrollTop * parallexFactor  
    Render.lookAt(render, {
      min: { x: 0, y: scrollOffset },
      max: { x: windowWidth, y: windowHeight + scrollOffset }
  })
    requestAnimationFrame(renderCb)
  })

  return
  let oldTime
  let lastDelta = 10
  requestAnimationFrame(function render(time) {
    if (oldTime) {
      // limit delta to maximal 100ms
      // otherwise the circles go crazy after having the browser window inactive for too long
      const delta = Math.min(time - oldTime, 100)
      const correction = delta/lastDelta
      Engine.update(engine, delta, correction)
      lastDelta = delta
    }
    oldTime = time

    requestAnimationFrame(render)

    const height = $('.bubble').height()
    const width = $('.bubble').width()
    const scrollOffset = scrollContainer[0].scrollTop * parallexFactor

    for (const bubble of bubbles) {
      const position = bubble.body.position
      const domElement = bubble.element

      const yOffset = position.y - height/2
      const xOffset = position.x - width/2

      domElement.css('transform', `translate3d(${xOffset}px, ${yOffset - scrollOffset}px, 0)`)
    }
  })
}

class Circle {
  constructor(parent, x, y) {
    const face = Math.floor(Math.random()*10 + 1)
    const facePath = `/assets/images/landing_page/faces/${face}.jpg`

    const element = $(`<img class="bubble" src="${facePath}"></img>`)
    parent.append(element)

    const elementWidth = parseFloat(element.css('width'))
    const elementMargin = parseFloat(element.css('margin'))
    const bodyRadius = elementWidth/2 + elementMargin
    
    const body = Bodies.circle(
      x, y,
      bodyRadius
    )

    this.element = element
    this.body = body
  }
}

$(() => {
  const mainContainer = $('main')
  setupScrollAnimation(mainContainer)

  const bubbleContainer = $('.bubble-container')
  setupBubbles(bubbleContainer, mainContainer)
})
