# Neighbourhood MAP App Project
# Nano Degree project No. Eight

> By Mostafa Medht


## Table of Contents

* [Instructions](#instructions)
    * [Definition](#Definition)
* [Run the project Online](#Run)
* [Features](#Features)
* [Inatall](#Run)
* [Contributing](#contributing)
* [About](#About)

## Instructions

##  Neighbourhood MAP App Project
# Definition
_Is a project built using **React**, it has 1 main page:_
* _**main page**_ displays a google map displays places and markers for locations
       of neighbouhood at Sohage City in Egypt.
  * the user can search by resort name
  * a list of all places are shown
  * when the user filters for a specific name the map updates, and displays only the filtertion result
  * when user clicks on a marker an info window opens and displays data about the
  place and the image of the place
    * when the user tabs through the list and presses Enter the corresponding marker location opens and pops up the Info Window

## Run Online Project

You can get the hosted project here -> http://mostafa-medht.github.io/neighborhood-map-pro-8

## Features

1. Click on any marker to see the location details fetched from the [FourSquare APIs](https://developer.foursquare.com/).
2. Search through availaible locations.
3. Get information on locations from the search or through marker click

## Installing

The project uses [Create-React-App starter code](https://github.com/mostafa-medht/neighborhood-map-pro-8/tree/master) on a [Node.js >= 6](https://nodejs.org/en/) environment

Follow these steps:

1. Install node from the link above
1. Clone this repository to your computer
1. Install all the dependencies with `npm install`
1. Launch the app with this command `npm start`

The app will launch in your browser at the address[http://localhost:3000/](http://localhost:3000/).

### Constraints

> It is important to note that, the assets will only be cached when we are on production mode.

## Build

You can run the build for testing the service worker or any other reason following these steps

1 First `npm run build` to create an optimized version of the project
2 Then `npm run deploy` to deploy to the specified address
