# Stylesmith

[![Build Status](https://travis-ci.org/andywer/stylesmith.svg?branch=master)](https://travis-ci.org/andywer/stylesmith)
[![Code Climate](https://codeclimate.com/github/andywer/stylesmith/badges/gpa.svg)](https://codeclimate.com/github/andywer/stylesmith)
[![NPM Version](https://img.shields.io/npm/v/stylesmith.svg)](https://www.npmjs.com/package/stylesmith)

Stylesmith is a small zero-dependency library to use ES6 tagged **template strings**
for component styling. It's primary purpose is to be used alongside with **React.js** and **Radium**.

Inspired by [React: CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js)
and Radium's enhanced style objects (':hover', '@media' keys and similar).


## Usage with React / Radium

```javascript
import React, { Component } from 'react'
import style from 'stylesmith'
import { colors } from './my-theme'

/*
 * You can use any JS variable in the template string style. Trailing semicolons are optional.
 * Pass strings or numbers as style rule values.
 * Pass an object to merge its styles.
 */
const buttonStyle = style`
  background: ${colors.green}
  color: ${colors.white}
  margin: 10 20
  padding: 10%

  :hover {
    background: ${colors.blue}
  }

  @media print {
    display: none
  }
`

export default class Button extends Component {
  render () {
    return (
      <button style={buttonStyle}>{this.props.children}</button>
    )
  }
}
```

By the way: You can have trailing semicolons like in CSS, too. But they are optional.

```javascript
style`
  background: ${colors.green};
  color: ${colors.white};
  margin: 20px;

  :hover {
    background: ${colors.blue};
  }
`
```


## Installation

Using NPM:

```bash
npm install --save stylesmith
```

Using JSPM:

```bash
jspm install stylesmith
```


## What happens here?

```javascript
style`
  margin: 10
  color: ${color.white}

  :hover {
    text-decoration: underline
    ${anotherStyle}
  }
`

// returns this object:

{
  margin: 10,
  color: color.white,
  ':hover': Object.assign({
    'text-decoration': 'underline'
  }, anotherStyle)
}
```

Looks much friendlier, doesn't it? And no more CSS class name crazyness!
The styles you define here are only applied to the elements you render with
the `style` property set to it.


## Why would I need that?

As vjeux points out in his popular talk
[React: CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js), CSS styling
comes with some built-in troubles. Some of them can pretty easy be come over by
using a pre-processor like SASS or LESS (like variables).

But other problems persist and cannot easily be solved using stylesheets, such
as the fact that CSS only knows one global scope. So you have to be very careful
how to write your CSS selectors in order to not have them style things they are
not supposed to and avoid naming clashes.

React's inline style objects provide a simple, yet powerful solution for the
problem. Radium extends the concept by introducing nested ':hover', ':active',
'@media', ... objects.

The only problem is now that these objects tend to look quite unpleasant. Using
ES6 template strings you can now write them just as a block of CSS rules and insert
`${variable}` where you need to.

Proper styling, easy and powerful. And you do not even have to preprocess your
styles anymore!


## License

Licensed under the terms of the MIT license. See file [LICENSE](https://github.com/andywer/stylesmith/blob/master/LICENSE) for details.
