# Readium-2 Glue JS [![Build Status](https://travis-ci.com/readium/r2-glue-js.svg?branch=master)](https://travis-ci.com/readium/r2-glue-js)
This repo contains Javascript resources that are injected by a Readium-2 streamer or navigator.

This is a first draft of how this could be broken down:

- **pagination.js** will handle all functions related to paginating CSS columns:
    - calculating the total number of columns
    - returning the position of the current column
    - scrolling to the next column on the left/right
    - scrolling to a fragment identifier
- **scrolling.js** replicates a number of those operations:
    - calculating the current position in the document
    - jumping to a position
- **touchHandling.js** will handle touch interactions with the document:
    - taps and tap zones (left/right/center)
    - swipe/drag
    - link handler
    - EPUB 3.x style footnotes
    - support for interactions with form elements
- **keyHandling.js** will handle similar interaction but for keys (keyboard, but also dedicated hardware keys, like volume buttons on mobile devices)
- **utils.js** collects a number of functions, including:
    - setting CSS custom properties
    - removing CSS custom properties
    - utility methods shared across modules

This repository is meant to contain templates that the various Readium-2 Test Apps will customize and integrate.

