function determineResponsiveMode() {
	window.windowWidth = window.matchMedia("(max-width: 750px)");
	if (windowWidth.matches) {
    var responsiveSize = true;
		worldMapMovement.pause();
		$(".world-map").removeAttr("style");
		destroyPortraits();
		generatePortraits(responsiveSize);
  } else {
    var responsiveSize = false;
		worldMapMovement.play();
		destroyPortraits();
		generatePortraits(responsiveSize);
  }
}

var worldMapMovement = anime({
	targets: '.world-map',
	translateX: -1755,
	translateZ: 0,
	duration: 55000,
	loop: true,	
	easing: 'linear'
});

function destroyPortraits() { 
	$('.ao').remove();
}

function generatePortraits(responsiveSize) {
	var portraitSpacing = 40; // px, Das Spacing is vom Bildmittelpunkt aus gemessen
	var portraitSize = 200; // px
	var rowAmount = 8; // Anzahl der Reihen des Grids
	var portraitAmount = 8; // Wie viele Portraits in jeder Reihe sein sollen
	var parentElement = document.getElementById("photo-grid-container"); // Dahin sollen die divs appended werden
	var portraitCounter; // Für die Schleife
	var rowCounter; // Für die Schleife
	
	if (responsiveSize) {
		portraitSize = portraitSize * 0.5;
		portraitSpacing = portraitSpacing * 0.5;
		rowAmount = 7;
		portraitAmount = 20;
	}

	var images = ['resources/images/faces/1.png', 'resources/images/faces/2.png', 'resources/images/faces/3.png', 'resources/images/faces/4.png', 'resources/images/faces/5.png', 'resources/images/faces/6.png', 'resources/images/faces/7.png', 'resources/images/faces/8.png', 'resources/images/faces/9.png', 'resources/images/faces/10.png', 'resources/images/faces/11.png', 'resources/images/faces/12.png', 'resources/images/faces/13.png', 'resources/images/faces/14.png']; // Alle Bilder für die Portraits


	// Schaut, ob die Anzahl der Reihen ungerade oder gerade ist, weil nämlich in dieser Situation x0 in der Mitte des Viewports ist,
	// nicht links (wegen responsive shit). Also man muss sozusagen negativ nach rechts rechnen, um die Position der ersten Spalte zu ermitteln.
	// Bei ungerader Spaltenanzahl ist die mittlere Reihe genau in der Mitte des Viewports, bei gerader ist der Abstand zwischen den beiden Mittleren genau in der Mitte.
	// Blöd zum erklären
	if (rowAmount % 2 == 0) {
		var horizontalOffset = -(((rowAmount-2)/2) * portraitSpacing + portraitSpacing/2 + ((rowAmount-2)/2) * portraitSize + portraitSize/2);
	} else {
		var horizontalOffset = -(((rowAmount-1)/2) * portraitSpacing + ((rowAmount-1)/2) * portraitSize)
	}

	// Eh selbsterklärend
	for (rowCounter = 1; rowCounter <= rowAmount; rowCounter++) {
		var verticalOffset = 0;
		var parallaxNum = Math.floor(Math.random() * (900 - 100 + 1) + 100);
		var parentDiv = document.createElement('div');
		parentDiv.classList.add("ao");
		parentDiv.setAttribute('data-parallax', "{\"y\" : -" + parallaxNum + ", \"smoothness\" : 7}");
		parentElement.appendChild(parentDiv);

		// Auch selbsterklärend
		for (portraitCounter = 1; portraitCounter <= portraitAmount; portraitCounter++) {
			// Erstellt ein Portrait Element und gibt ihm alle nötigen Eigenschaften
			var portrait = document.createElement('figure');
			// Damit man dann per Klasse die einzelnen Reihen ansteuern kann für Parallax
			portrait.classList.add("ao-elem");
			portrait.style.width = portraitSize + "px";
			portrait.style.height = portraitSize + "px";
			// Damit es zentriert ist
			portrait.style.marginLeft = -(portraitSize/2) + "px";
			//Zufälliges Hintergrundbild
			var num = Math.floor(Math.random() * (images.length));
			portrait.style.backgroundImage = "url(" + images[num] + ")"

			// Versetzt jede Zweite Reihe um die Hälfte der Bildhöhe nach unten und gibt die ganzen Positionsdaten
			if (rowCounter % 2 == 1) {
				portrait.style.transform = "translate3d("+ horizontalOffset + "px, " + (verticalOffset + portraitSize/2) + "px , 0)";
			} else {
				portrait.style.transform = "translate3d("+ horizontalOffset + "px, " + verticalOffset + "px , 0)";
			}

			// Appended das Portrait an das Parent Element
			parentDiv.appendChild(portrait);

			// Nächstes Bild weiter nach unten
			verticalOffset = verticalOffset + portraitSpacing + portraitSize;
		}

		// Nächste Reihe weiter nach rechts
		horizontalOffset = horizontalOffset + portraitSpacing + portraitSize;
	}
}

window.onresize = function(event) {
	determineResponsiveMode();
	$('.nav').removeAttr("style");
};

$(document).ready(function(){
	determineResponsiveMode();
	
	$('.nav-link-container').hover(function() {
		$(this).find('.nav-popup-link-container').toggleClass('isClickable');
		window.items = $(this).find('.nav-popup-link');
		var isMoved = true;
		for ( var i=0; i < items.length; i++ ) {
			var toggleItemMove = getToggleItemMove( i );
			var delay = isMoved ? ( window.items.length - i - 1 ) : i;
			delay *= 80;
			setTimeout( toggleItemMove, delay );
		}
	});

	function getToggleItemMove( i ) {
		var item = items[i];
		return function() {
			item.classList.toggle('isVisible');
		}
	}
	
	$('.hamburger').click(function() {
		$('.hamburger').toggleClass('is-active');
		$('body, html').toggleClass('unscrollable');
		$('.nav').fadeToggle(300);
	})
});