import $ from 'jquery'
import {
  use,
  Engine,
  Body,
  Bodies,
  World,
  Common
} from 'matter-js'
import MatterAttractors from 'matter-attractors'

use(MatterAttractors)

class Circle {
  constructor(id, element, body) {
    this.id = id;
    this.element = element
    this.body = body

    this.element.click(() => 
      element.parent().trigger('setActive', id))
  }

  setActive(active) {
    if (this.active == active) {
      return
    }

    const body = this.body

    function scaleBody(factor) {
      Body.scale(body, factor, factor)
    }

    if (active) {
      this.element.addClass('active')
      scaleBody(2.45)
    } else {
      this.element.removeClass('active')
      scaleBody(1 / 2.45)
    }
  }

  get active() {
    return this.element.hasClass('active')
  }

  static fromDOMNode() {
    const element = $(this)
    const parent = element.parent()
    const margin = parseFloat(element.css('margin'))

    const body = Bodies.circle(
      Common.random(0, parent.width()), 
      Common.random(0, parent.height()), 
      element.width() / 2 + margin,
      {
        plugin: {
          attractors: [
            (attractor, attractee) => {
              const factor = 1e-6
              return {
                x: (attractor.position.x - attractee.position.x) * factor,
                y: (attractor.position.y - attractee.position.y) * factor,
              }
            }
          ]
        }
      })

    const id = element.data('id') 

    return new Circle(id, element, body)
  }
}

function createEngine(wrapperElement) {
  const engine = Engine.create()

  const world = engine.world;
  world.gravity.scale = 0;

  const attractiveBody = Bodies.circle(
    wrapperElement.width() / 2,
    wrapperElement.height() / 2,
    0,
    {
      isStatic: true,

      plugin: {
        attractors: [
          (attractor, attractee) => {
            const factor = 1e-9 * attractee.area
            return {
              x: (attractor.position.x - attractee.position.x) * factor,
              y: (attractor.position.y - attractee.position.y) * factor,
            }
          }
        ]
      }
    })
  World.add(world, attractiveBody)

  return engine
}

function wait(engine, seconds) {
  for (let i = 0; i < seconds * 100; i++) {
    Engine.update(engine, 10)
  }
}

function setup(wrapperElement) {
  const engine = createEngine(wrapperElement)

  const circles = wrapperElement.children('.circle')
    .map(Circle.fromDOMNode)
    .toArray()

  wrapperElement.on('setActive', (e, id) => {
    for (const circle of circles) {
      circle.setActive(circle.id === id)
    }
  })

  wrapperElement.click(e => {
    if (e.target === wrapperElement.get(0)) {
      wrapperElement.trigger('setActive', -1)
    }
  })

  for (const circle of circles) {
    World.add(engine.world, circle.body)
  }

  wait(engine, 30)

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

    for (const circle of circles) {
      const position = circle.body.position
      const domElement = circle.element

      const yOffset = position.y - domElement.height()/2
      const xOffset = position.x - domElement.width()/2
      
      domElement.css('transform', `translate3d(${xOffset}px, ${yOffset}px, 0)`)
    }
  })
 
  for (const circle of circles) {
    circle.element.removeClass('hidden')
  }
}

$(() => {
  setup($('#interaction-circles'))
  setup($('#administration-circles'))
})