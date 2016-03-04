# Stylesmith

Stylesmith is a small ES6 (ES2015) syntax, zero-dependency library to provide
tagged template strings for style creation.

It's primary purpose is to be used alongside with React.js and Radium.

Inspired by [React: CSS in JS](https://speakerdeck.com/vjeux/react-css-in-js)
and Radium's enhanced style objects (':hover', '@media' keys and similar).


## Usage with React / Radium

```javascript
import React, { Component } from 'react'
import style from 'stylesmith'
import { colors } from './my-theme'

/*
 * You can use any JS variable in the template string style.
 * Pass strings or numbers as style rule values.
 * Pass an object to merge its styles.
 */
const buttonStyle = style`
  background: ${colors.green}
  color: ${colors.white}
  margin: 10 20

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

Looks much friendlier, doesn't it?


## License

Licensed under the MIT license. See file LICENSE for details.
