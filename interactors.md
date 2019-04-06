---
layout: info_page
scripts:
  - info_page
hero: assets/images/philantropy/hero.png
heading: interactors
title: Interactors
stats:
  - description: members
    number: 1942
  - description: countries
    number: 20
  - description: interact clubs
    number: 74
continents: 
  - name: Europe
    countries:
      - name: Austria
        clubs:
          - Interact Club Donautal
          - Interact Club Gleisdorf
          - Interact Club Tanzenberg
          - Interact Club Wien-Eins
          - Interact Club Ybbs/Donau
      - name: Bulgaria
        clubs:
          - Interact Club Sofia
      - name: France
        clubs:
          - Interact Club Aiglon
          - Interact Club d’Aumale
          - Interact Club Hoche de Versailles
---

## why we connect young people

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla scelerisque orci, vel malesuada mi cursus ut. Vivamus nec cursus nisi, vel lacinia magna. Praesent in suscipit nibh, nec scelerisque tortor. Curabitur ex metus, finibus sit amet tincidunt at, tempor quis massa.

<div class="normal-spacing full-width">
  <img src="assets/images/landing_page/video.svg" class="prominent-image" />
</div>

<div class="column-layout normal-spacing">
{% for item in page.stats %}
<p class="stats">
{{item.number}} {{item.description}}
</p>
{% endfor %}
</div>

Aliquam malesuada metus ac massa porttitor tincidunt. Sed lectus odio, tincidunt in diam id, luctus semper dolor. Etiam ultricies risus vitae turpis viverra, vitae tincidunt tellus convallis. Aliquam id semper nunc. Nulla vel ultrices risus. Quisque finibus odio velit, et elementum quam euismod id. Quisque ac venenatis massa. Nulla suscipit, eros id elementum mollis, nibh tortor hendrerit turpis, ac dictum lorem est non lectus.

## members

The following Interact clubs have joined Initiative Interchange, sorted alphabetically by continent, country and club name. You can send them an e-mail by clicking on the name of the club.

{% for continent in page.continents %}
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