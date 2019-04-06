import $ from 'jquery'
import { toggle, close } from './lib/nav'

$(() => {
  $('.nav-button').click(toggle)

  $('nav a').click(close)
})