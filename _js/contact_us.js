import $ from 'jquery';
import {
  use,
  Engine,
  Body,
  Bodies,
  World
} from 'matter-js';
import MatterAttractors from 'matter-attractors';
import { jumpForwardInSimulation } from './lib/physics';

// use matterjs plugin
use(MatterAttractors);

// when the document is ready...
$(() => {
  setup($('#interaction-circles'));
  setup($('#administration-circles'));
  setup($('#philantropy-circles'));
});

function setup(wrapperElement) {
  const engine = createEngine();

  const wallWidth = 100;

  let attractiveBody;
  let bottomWall;
  let circles;

  // initialize bodies with random circle locations
  addBodies();

  // setActive is emmitted when a circle or the space between circles is clicked
  wrapperElement.on('setActive', (e, id) => {
    for (const circle of circles) {
      // actives the circle with the matching id,
      // collapses all other circles
      circle.setActive(circle.id === id);
    }
  });

  // when the space between circles is clicked
  wrapperElement.click(e => {
    if (e.target === wrapperElement.get(0)) {
      // no circle can have the id of -1 so all circle will be collapsed
      wrapperElement.trigger('setActive', -1);
    }
  });

  // handle resizes, wait for the circle resize animation to finish
  $(window).resize(() => setTimeout(() => {
    // remove all circle from the simulation
    for (const circle of circles) {
      World.remove(engine.world, circle.body);
    }
    // remove the bottom wall from the simulation
    World.remove(engine.world, bottomWall)

    // remove attrive body in the center from simulation
    World.remove(engine.world, attractiveBody)

    // rebuild bodies but keep circle locations
    addBodies(true)
  }, 400))

  // first render
  requestAnimationFrame(() => {
    render();
    // make circles visible
    for (const circle of circles) {
      circle.element.removeClass('hidden');
    }

    let oldTime;
    function render(time) {
      if (oldTime) {
        // limit delta to a maximum of 100ms
        // otherwise the circles go crazy after having the browser window inactive for too long
        const delta = Math.min(time - oldTime, 100);
        Engine.update(engine, delta);
      }
      oldTime = time;

      // let the browser trigger the next frame
      requestAnimationFrame(render);

      for (const circle of circles) {
        const position = circle.body.position;
        const domElement = circle.element;

        // calculate the absolute offsets from (0|0)
        // domElement is only used to correct the error from dom and matterjs using different anchor points
        const yOffset = position.y - domElement.height() / 2;
        const xOffset = position.x - domElement.width() / 2;

        // apply the absolute offset as a CSS property
        domElement.css('transform', `translate3d(${xOffset}px, ${yOffset}px, 0)`);
      }
    }
  });

  function addBodies(keepCirclePositions = false) {
    // invisible body in the center of the wrapper that keeps all the bubbles together
    attractiveBody = Bodies.circle(
      wrapperElement.width() / 2,
      wrapperElement.height() / 2,
      0,
      {
        isStatic: true,

        plugin: {
          attractors: [
            (attractor, attractee) => {
              const factor = 1e-9 * attractee.area;
              return {
                x: (attractor.position.x - attractee.position.x) * factor,
                y: (attractor.position.y - attractee.position.y) * factor,
              };
            }
          ]
        }
      });
    World.add(engine.world, attractiveBody);

    // body at the bottom, keeping the bubbles from covering the heading
    bottomWall = Bodies.rectangle(
      wrapperElement.width()/2, wrapperElement.height() + wallWidth/2,
      wrapperElement.width(), wallWidth,
      {
        isStatic: true
      }
    );
    World.add(engine.world, bottomWall);

    // create Circle instances from all '.circle' elements within the wrapper
    circles = wrapperElement.children('.circle')
      .toArray()
      .map(node => Circle.fromDOMNode(node, keepCirclePositions));

    for (const circle of circles) {
      World.add(engine.world, circle.body)
    }
  }
}

// creates empty engine without any bubbles
function createEngine() {
  const engine = Engine.create();

  const world = engine.world;
  // disables gravity on all axes
  world.gravity.scale = 0;

  return engine;
}

// links physics body to dom element
class Circle {
  constructor(id, element, body) {
    this.id = id;
    this.element = element;
    this.body = body;

    this.element.click(() =>
      // triggers 'setActive' on the wrapper element
      // causes this circle to expand and all others to collapse
      element.parent().trigger('setActive', id));
  }

  setActive(active) {
    if (this.active == active) {
      return;
    }

    // this.body inside of scaleBody doesn't work
    const body = this.body;
    // scales the physics body
    function scaleBody(factor) {
      Body.scale(body, factor, factor);
    }

    if (active) {
      // changes to physics body
      scaleBody(2.45);
      // changes to visual representation
      this.element.addClass('active');
    } else {
      this.element.removeClass('active');
      scaleBody(1 / 2.45);
    }
  }

  get active() {
    return this.element.hasClass('active');
  }

  // constructs Circle object from an existing dom node
  static fromDOMNode(domNode, keepPosition = false) {
    const element = $(domNode);
    const parent = element.parent();
    const margin = parseFloat(element.css('margin'));

    // read id from dom property
    const id = element.data('id');

    let x = Math.random() * parent.width();
    let y = Math.random() * parent.height();

    // parse position from transform attribute
    if (keepPosition) {
      const css = element.css('transform');
      const regex = /^matrix\(1, 0, 0, 1, (?<x>\d+(?:\.\d+)), (?<y>\d+(?:\.\d+))\)$/;
      const match = css.match(regex);

      if(match) {
        // element dimensions are calculated in because DOM and matterjs use different anchor points
        x = parseFloat(match.groups.x) + element.width()/2;
        y = parseFloat(match.groups.y) + element.height()/2;
      }
    }

    // create physics body
    const body = Bodies.circle(
      x,
      y,
      element.width() / 2 + margin,
      {
        plugin: {
          attractors: [
            (attractor, attractee) => {
              const factor = 1e-6;
              return {
                x: (attractor.position.x - attractee.position.x) * factor,
                y: (attractor.position.y - attractee.position.y) * factor,
              };
            }
          ]
        }
      });

    return new Circle(id, element, body);
  }
}

