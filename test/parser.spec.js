'use strict'

import { expect } from 'chai'
import style from '../lib'

describe('stylessmith parser', () => {
  it('can parse simple static string', () => {
    const styles = style`
      background: blue
      color: red
      margin: 20px
      padding: 10
      width: 100%
    `

    expect(styles).to.eql({
      background: 'blue',
      color: 'red',
      margin: '20px',
      padding: 10,
      width: '100%'
    })
  })

  it('can parse static rules containing trailing semicolons', () => {
    const styles = style`
      background: blue
      color: red;
      margin: 20;
    `

    expect(styles).to.eql({
      background: 'blue',
      color: 'red',
      margin: 20
    })
  })

  it('can parse nested selectors', () => {
    const styles = style`
      background: blue
      color: red

      :hover {
        text-transform: uppercase
      }

      @media print {
        :active {
          background: transparent
          border: none
        }
      }
    `

    expect(styles).to.eql({
      background: 'blue',
      color: 'red',
      ':hover': {
        'text-transform': 'uppercase'
      },
      '@media print': {
        ':active': {
          background: 'transparent',
          border: 'none'
        }
      }
    })
  })

  it('can parse string parameters', () => {
    const styles = style`
      background: blue
      color: ${'red'}
    `

    expect(styles).to.eql({
      background: 'blue',
      color: 'red'
    })
  })

  it('can parse object parameters', () => {
    const styles1 = {
      color: 'red'
    }
    const styles2 = {
      color: 'yellow',
      'text-decoration': 'underline'
    }

    const styles = style`
      background: blue
      ${styles1}

      :hover {
        color: white
        ${styles2}
      }
    `

    expect(styles).to.eql({
      background: 'blue',
      color: 'red',
      ':hover': {
        color: 'yellow',
        'text-decoration': 'underline'
      }
    })
  })

  it('throws proper error if function parameter is passed', () => {
    expect(() => {
      style`
        background: ${() => {}}
      `
    }).to.throw('Functions are not supported (value #0).')
  })

  it('throws proper error if curly braces do not match', () => {
    expect(() => {
      style`
        :hover {
          color: red
        }
        }
      `
    }).to.throw('Too many closing curly braces. (Style line 4)')

    expect(() => {
      style`
        :hover {
          color: red
      `
    }).to.throw('Expected closing curly braces.')
  })

  it('throws proper error if rule cannot be parsed', () => {
    expect(() => {
      style`
        color red
      `
    }).to.throw('Cannot parse line: "color red" (Style line 1)')
  })

})
