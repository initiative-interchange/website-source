import $ from 'jquery'
import {
  use,
  Engine,
  Render,
  Runner,
  Bodies,
  World,
  Composite
} from 'matter-js'
import MatterAttractors from 'matter-attractors'
import { request } from 'http';

use(MatterAttractors)

$(() => {
  function createEngine(circleWrapper) {
    const engine = Engine.create()

    const world = engine.world;
    world.gravity.scale = 0;

    const attractiveBody = Bodies.circle(
      wrapper.width() / 2,
      wrapper.height() / 2,
      0,
      {
        isStatic: true,

        plugin: {
          attractors: [
            (attractor, attractee) => ({
              x: (attractor.position.x - attractee.position.x) * 1e-6,
              y: (attractor.position.y - attractee.position.y) * 1e-6,
            })
          ]
        }
      })
    World.add(world, attractiveBody)

    function getRelativePosition(circle) {
      const childPosition = circle.offset()
      const parentPosition = circle.parent().offset()
      return {
        top: childPosition.top - parentPosition.top + circle.width()/2,
        left: childPosition.left - parentPosition.left + circle.height()/2
      }
    }

    const domCircles = circleWrapper.children('.circle')
    for (const domCircle of domCircles) {
      const circle = $(domCircle)
      const position = getRelativePosition(circle)
      const circleBody = Bodies.circle(
        position.top, 
        position.left, 
        circle.width() / 2, {
          label: circle.data('id')
        })
      circleBody.domElement = circle
      World.add(world, circleBody)
    }

    return engine
  }

  function wait(engine, seconds) {
    for (let i = 0; i < seconds * 100; i++) {
      Engine.update(engine, 10)
    }
  }

  const wrapper = $('#administration-circles')
  const engine = createEngine(wrapper)
  //wait(engine, 30)

  let oldTime
  requestAnimationFrame(function render(time) {
    if (oldTime) {
      const delta = time - oldTime
      console.log(delta)
      Engine.update(engine, delta)
    }
    oldTime = time

    const circles = Composite.allBodies(engine.world).filter(b => typeof(b.label) === 'number')
    for (const circle of circles) {
      const position = circle.position
      const domElement = circle.domElement

      const yOffset = position.y - domElement.height()/2
      const xOffset = position.x - domElement.width()/2
      
      domElement.css('transform', `translate3d(${xOffset}px, ${yOffset}px, 0)`)
    }

    requestAnimationFrame(render)
  })
})