import $ from 'jquery';
import anime from 'animejs';
import PolyDecomp from 'poly-decomp';
import Plyr from 'plyr';
import { Engine, Bodies, World, Render, Runner } from 'matter-js';
window.decomp = PolyDecomp;

// when the document is loaded...
$(() => {
  const mainContainer = $('main');
  setupScrollAnimation(mainContainer);

  // no bubbles for now
  // const bubbleContainer = $('.bubble-container')
  // setupBubbles(bubbleContainer, mainContainer)

  setupYoutubeVideo('.video-player');
});

function setupScrollAnimation (outerElement) {
  // recreate the animation every time the document changes its size
  document.body.onresize = () => {
    if (typeof cleanUpAnimation === 'function') {
      cleanUpAnimation();
    }
    cleanUpAnimation = createScrollAnimation();
  };
  let cleanUpAnimation = createScrollAnimation();

  // show the pages
  $('.page').removeClass('hidden');

  function createScrollAnimation () {
    const firstPage = $('.page').first();

    // adapt the height of the top spacer
    $('.top-page-spacer').css(
      'height',
      (outerElement.height() - firstPage.height()) / 2
    );

    const halfPage = outerElement.height() / 2;

    // the main timeline for the animation
    const timeline = anime.timeline({
      duration: outerElement.height(),
      autoplay: false
    });

    // add all the fade-in animations
    for (const el of $('.fade-in')) {
      timeline.add(
        {
          targets: el,
          opacity: [0, 1],
          duration: el.clientHeight,
          easing: 'easeInQuint'
        },
        el.offsetTop - el.clientHeight / 2
      );
    }

    // add all the fade-out animations
    for (const el of $('.fade-out')) {
      timeline.add(
        {
          targets: el,
          opacity: [1, 0],
          duration: el.clientHeight,
          easing: 'easeOutQuad'
        },
        el.offsetTop + el.clientHeight / 2
      );
    }

    // update the animation on every scroll
    outerElement.scroll(updateAnimation);
    // and update it now for the current scroll
    updateAnimation();

    // clean up routine
    return () => outerElement.off('scroll', updateAnimation);

    // adjust animation progress to the current scroll position
    function updateAnimation () {
      const progress = Math.max(0, outerElement.scrollTop()) + halfPage;
      timeline.seek(progress);
    }
  }
}

async function setupBubbles (bubbleContainer, scrollContainer) {
  // parallex scroll factor
  const parallexFactor = 2;
  // the fill height of the bubbles
  const fillHeight = 1000;

  const engine = Engine.create();

  // only very weak upwards gravity
  const world = engine.world;
  world.gravity.x = 0;
  world.gravity.y = -0.1;

  const mainContainer = $('main');
  const windowHeight = mainContainer.height();
  const windowWidth = mainContainer.width();

  // briefly create a bubble to get the effective CSS properties
  const dummyInstance = $('<img class="bubble"></img>');
  bubbleContainer.append(dummyInstance);
  const bubbleWidth = parseFloat(dummyInstance.css('width'));
  const bubbleMargin = parseFloat(dummyInstance.css('margin'));
  bubbleContainer.remove(dummyInstance);
  const circleRadius = bubbleWidth / 2 + bubbleMargin;

  // creating boundaries
  const upperBoundary = Bodies.rectangle(
    windowWidth / 2,
    -circleRadius,
    windowWidth + 2 * circleRadius,
    10,
    {
      isStatic: true
    }
  );
  World.add(world, upperBoundary);

  const boundaryHeight = fillHeight * 1.5;

  const leftBoundary = Bodies.rectangle(
    -circleRadius,
    boundaryHeight / 2,
    10,
    boundaryHeight,
    {
      isStatic: true
    }
  );
  World.add(world, leftBoundary);

  const rightBoundary = Bodies.rectangle(
    windowWidth + circleRadius,
    boundaryHeight / 2,
    10,
    boundaryHeight,
    {
      isStatic: true
    }
  );
  World.add(world, rightBoundary);

  // those elements occupy the space needed to see the pages' contents
  for (const page of $('.page')) {
    const yOffset = page.offsetTop + page.offsetHeight / 2;
    const element = Bodies.rectangle(windowWidth / 2, yOffset, 100, 100, {
      isStatic: true
    });
    World.add(world, element);
  }

  // calculate the number of bubbles
  // https://math.stackexchange.com/questions/2548513/maximum-number-of-circle-packing-into-a-rectangle
  const areaToFill =
    (windowWidth + 2 * circleRadius) * (fillHeight + circleRadius);
  const fillableArea = (areaToFill * Math.PI) / (2 * Math.sqrt(3));
  const bubbleArea = circleRadius * circleRadius * Math.PI;
  const numberOfBubbles = Math.floor(fillableArea / bubbleArea);

  // create the bubbles
  const bubbles = [];
  for (let i = 0; i < numberOfBubbles; i++) {
    const bubble = new Circle(
      bubbleContainer,
      Math.random() * windowWidth,
      Math.random() * fillHeight
    );
    bubbles.push(bubble);
    World.add(world, bubble.body);
  }

  /*
   *  this is all just for debugging
   */
  // this is a debug renderer
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

  // adjust the debug render frame to the scrolling position
  requestAnimationFrame(function renderCb () {
    const scrollOffset = scrollContainer[0].scrollTop * parallexFactor;
    Render.lookAt(render, {
      min: { x: 0, y: scrollOffset },
      max: { x: windowWidth, y: windowHeight + scrollOffset }
    });
    requestAnimationFrame(renderCb);
  });

  /*
   *  debugging ends here
   */

  // no real rendering for now
  /*
  // remember previous timing values
  let oldTime;
  let lastDelta = 10;
  requestAnimationFrame(function render (time) {
    if (oldTime) {
      // limit delta to maximal 100ms
      // otherwise the circles go crazy after having the browser window inactive for too long
      const delta = Math.min(time - oldTime, 100);
      const correction = delta / lastDelta;
      Engine.update(engine, delta, correction);
      lastDelta = delta;
    }
    oldTime = time;

    // schedule the next render
    requestAnimationFrame(render);

    const height = $('.bubble').height();
    const width = $('.bubble').width();
    const scrollOffset = scrollContainer[0].scrollTop * parallexFactor;

    for (const bubble of bubbles) {
      const position = bubble.body.position;
      const domElement = bubble.element;

      const yOffset = position.y - height / 2;
      const xOffset = position.x - width / 2;

      // apply offset via translate3d
      // that is optimized for performance in most browsers
      domElement.css(
        'transform',
        `translate3d(${xOffset}px, ${yOffset - scrollOffset}px, 0)`
      );
    }
  });
  */
}

class Circle {
  constructor (parent, x, y) {
    // select a random face
    const faceNumber = Math.floor(Math.random() * 10 + 1);
    const facePath = `/assets/images/landing_page/faces/${faceNumber}.jpg`;

    const element = $(`<img class="bubble" src="${facePath}"></img>`);
    parent.append(element);

    const elementWidth = parseFloat(element.css('width'));
    const elementMargin = parseFloat(element.css('margin'));
    const bodyRadius = elementWidth / 2 + elementMargin;

    const body = Bodies.circle(x, y, bodyRadius);

    this.element = element;
    this.body = body;
  }
}

function setupYoutubeVideo (element) {
  Plyr.setup(element);
}
