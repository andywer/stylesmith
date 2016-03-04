'use strict'

function resolveStringValues(strings, values) {
  let resolved = ''

  strings.forEach((string, index) => {
    resolved += string

    if (values.length > index) {
      const value = values[ index ]

      if (typeof value === 'function') {
        throw new Error(`Functions are not supported (value #${index}).`)
      }
      else if (typeof value === 'object') {
        resolved += `###VALUE:${index}###`
      }
      else {
        resolved += JSON.stringify(value)
      }
    }
  })

  return resolved
}

function parseAtomicValue(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
    return value.substr(1, value.length - 2)
  }
  else if (value.match(/^[0-9]*(\.[0-9]+)?$/)) {
    return parseFloat(value)
  }
  else {
    return value
  }
}

function parseAtomicRule(line, styleObject) {
  const colonIndex = line.indexOf(':')
  const key = line.substring(0, colonIndex).trim()
  const value = line.substr(colonIndex + 1).trim()

  styleObject[ key ] = parseAtomicValue(value)
}

function parseSelector(line) {
  return line.replace(/\{$/, '').trim()
}

function parseJCSSLine(line, styleObjectStack, values) {
  line = line.trim()
  if (!line) { return }

  const styleObject = styleObjectStack[ styleObjectStack.length - 1 ]

  if (line.match(/(###VALUE:([0-9]+)###)/)) {
    if (line.length > RegExp.$1.length) {
      throw new Error('No other statements than the object expression allowed on one line.')
    }

    const value = values[ parseInt(RegExp.$2, 10) ]
    Object.assign(styleObject, value)
  }
  else if (line.match(/^[a-z0-9-]+\s*:/i)) {
    parseAtomicRule(line, styleObject)
  }
  else if (line.match(/\{/)) {
    const selector = parseSelector(line)
    const newNestedStyle = {}

    styleObject[ selector ] = newNestedStyle
    styleObjectStack.push(newNestedStyle)
  }
  else if (line === '}') {
    styleObjectStack.pop()

    if (styleObjectStack.length === 0) {
      throw new Error('Too many closing curly braces.')
    }
  }
  else {
    throw new Error(`Cannot parse line: "${line}"`)
  }
}

function parseJCSS(jcssString, values) {
  if (jcssString.startsWith('\n')) {
    // Strip leading line break to align the line no. with the developer's expectation
    jcssString = jcssString.substr(1)
  }

  const styleObjectStack = [ {} ]
  const lines = jcssString.split('\n')

  lines.forEach((line, lineIndex) => {
    try {
      parseJCSSLine(line, styleObjectStack, values)
    } catch (error) {
      error.message += ` (Style line ${lineIndex + 1})`
      throw error
    }
  })

  if (styleObjectStack.length > 1) {
    throw new Error('Expected closing curly braces.')
  }

  return styleObjectStack[ 0 ]
}

/**
 * Usage: style`
 *  background: white
 *  color: ${colors.text}
 *
 *  :hover {
 *    text-decoration: underline
 *  }
 * `
 */
function style(strings, ...values) {
  const stringValuesResolved = resolveStringValues(strings, values)

  return parseJCSS(stringValuesResolved, values)
}

module.exports = style
