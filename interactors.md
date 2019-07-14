---
layout: info_page
scripts:
  - info_page
  - interactors_page
hero: assets/images/interactors/hero.png
heading: interactors
title: Interactors
---

## why we connect young people

When we reach out to young people from all around the world, it is our goal to give our future a compelling face. We want to paint the picture of a new world in which every child has access to education; a world in which every child can take their fate in their own hands and can tackle both personal and world-scale challenges by their own efforts. 

Nobody understands the urgency of this challenge as well as young people. Many of us want to give everyone the chances we had, but individual efforts are often inefficient because they are uncoordinated. Interchange connects young people because we want to channel the energy and talent to make this future world reality. We believe that the whole is more than the sum of its parts – we want to create the whole.

<div class="normal-spacing full-width video">
  <img src="assets/images/interactors/world.svg" class="prominent-image" />
</div>

<div class="column-layout normal-spacing">
{% for item in site.data.stats %}
<p class="stats">
{{item.number}} {{item.description}}
</p>
{% endfor %}
</div>

Interchange is a platform that helps Interactors (young members of the international charity organization Rotary) from all around the world to connect with one another. Technology blurs the lines between countries and continents and we want to close the gap between people. Interact has over 500,000 members around the world and the potential that could be gained is unparalleled. Rotary embodies this kind of connection, we want to extend this spirit to young people. We want to develop friendships. We want to encourage personal and intellectual exchange. We want to create a strong network of people who construct the future we painted.

## how we connect young people

We are in contact via social media as well as personal meetings. To facilitate the formation of friendships, we organize regular events and conferences in several countries (see [Events](/#) for an overview of past and upcoming events). Every Interact Club is welcome to join by simply submitting the form on our [Join us](/#) page. You will receive all information needed to connect with other Interactors and to change the world with them for the better.

## members

The following Interact clubs have joined Initiative Interchange, sorted alphabetically by continent, country and club name. You can send them an e-mail by clicking on the name of the club.

{% for continent in site.data.continents %}
<h3 class="continent-heading text text-center normal-spacing">
{{ continent.name | upcase }}
</h3>
{% for country in continent.countries %}
<h4 class="country-heading text text-center small-spacing">
{{ country.name }}
</h4>

<div class="column-layout small-spacing">
{% for club in country.clubs %}
<p class="no-spacing text text-center">{{ club }}</p>
{% endfor %}
</div>
{% endfor %}
{% endfor %}