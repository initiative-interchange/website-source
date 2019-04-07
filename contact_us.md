---
layout: empty
content_class: contact
scripts:
 - contact_us
title: Initiative Interchange
---

# contact us

{:class="email"}
what's your email address?

# our board members

<div id="interaction-circles"></div>

## INTERACTION RESORT

<div id="administration-circles">
  {% assign admins = site.members | where: 'administration', member.ressort %}

  {% for member in admins %}
  <figure class="circle" data-id="{{ forloop.index }}">
    <img src="assets/images/contact/faces/{{ member.face }}"/>
    <figcaption>
      <p class="text board-member-name">{{ member.name }}</p>
      <p class="text board-member">{{ member.occupation }}</p>

      <div class="small-spacing">
        {% for role in member.roles %}
        <p class="text board-member">{{ role }}</p>
        {% endfor %}
      </div>
    </figcaption>
  </figure>
  {% endfor %}
</div>

## ADMINISTRATION RESORT