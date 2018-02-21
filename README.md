# Readium-2 Glue JS
This repo contains Javascript resources that are injected by a Readium-2 streamer or navigator.

This is a first draft of how this could be broken down:

- **pagination.js** will handle all operations related to paginating CSS columns:
    - calculating the total number of columns
    - returning the position of the current column
    - scrolling to the next column on the left/right
    - scrolling to a fragment identifier
- **touchHandling.js** will handle touch interactions with the document:
    - taps and tap zones (left/right/center)
    - swipe/drag
    - link handler
    - EPUB 3.x style footnotes
    - support for interactions with form elements
- **keyHandling.js** will handle similar interaction but for keys (keyboard, but also dedicated hardware keys, like volume buttons on mobile devices)
- **customProperties.js** will handle all CSS Custom Properties related operations

This repository is meant to contain templates that the various Readium-2 Test Apps will customize and integrate.

