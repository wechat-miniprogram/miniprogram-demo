module.exports = tokenize

const delimRe = /[\s{}=;:[\],'"()<>]/g
const stringDoubleRe = /(?:"([^"\\]*(?:\\.[^"\\]*)*)")/g
const stringSingleRe = /(?:'([^'\\]*(?:\\.[^'\\]*)*)')/g

const setCommentRe = /^ *[*/]+ */
const setCommentAltRe = /^\s*\*?\/*/
const setCommentSplitRe = /\n/g
const whitespaceRe = /\s/
const unescapeRe = /\\(.?)/g

const unescapeMap = {
  0: '\0',
  r: '\r',
  n: '\n',
  t: '\t'
}

/**
 * Unescapes a string.
 * @param {string} str String to unescape
 * @returns {string} Unescaped string
 * @property {Object.<string,string>} map Special characters map
 * @memberof tokenize
 */
function unescape(str) {
  return str.replace(unescapeRe, function ($0, $1) {
    switch ($1) {
      case '\\':
      case '':
        return $1
      default:
        return unescapeMap[$1] || ''
    }
  })
}

tokenize.unescape = unescape

/**
 * Gets the next token and advances.
 * @typedef TokenizerHandleNext
 * @type {function}
 * @returns {string|null} Next token or `null` on eof
 */

/**
 * Peeks for the next token.
 * @typedef TokenizerHandlePeek
 * @type {function}
 * @returns {string|null} Next token or `null` on eof
 */

/**
 * Pushes a token back to the stack.
 * @typedef TokenizerHandlePush
 * @type {function}
 * @param {string} token Token
 * @returns {undefined}
 */

/**
 * Skips the next token.
 * @typedef TokenizerHandleSkip
 * @type {function}
 * @param {string} expected Expected token
 * @param {boolean} [optional=false] If optional
 * @returns {boolean} Whether the token matched
 * @throws {Error} If the token didn't match and is not optional
 */

/**
 * Gets the comment on the previous line or, alternatively, the line comment on the specified line.
 * @typedef TokenizerHandleCmnt
 * @type {function}
 * @param {number} [line] Line number
 * @returns {string|null} Comment text or `null` if none
 */

/**
 * Handle object returned from {@link tokenize}.
 * @interface ITokenizerHandle
 * @property {TokenizerHandleNext} next Gets the next token and advances (`null` on eof)
 * @property {TokenizerHandlePeek} peek Peeks for the next token (`null` on eof)
 * @property {TokenizerHandlePush} push Pushes a token back to the stack
 * @property {TokenizerHandleSkip} skip Skips a token, returns its presence and advances or, if non-optional and not present, throws
 * @property {TokenizerHandleCmnt} cmnt Gets the comment on the previous line or the line comment on the specified line, if any
 * @property {number} line Current line number
 */

/**
 * Tokenizes the given .proto source and returns an object with useful utility functions.
 * @param {string} source Source contents
 * @param {boolean} alternateCommentMode Whether we should activate alternate comment parsing mode.
 * @returns {ITokenizerHandle} Tokenizer handle
 */
function tokenize(source, alternateCommentMode) {
  /* eslint-disable callback-return */
  source = source.toString()

  let offset = 0
  const length = source.length
  let line = 1
  let commentType = null
  let commentText = null
  let commentLine = 0
  let commentLineEmpty = false

  const stack = []

  let stringDelim = null

  /* istanbul ignore next */
  /**
     * Creates an error for illegal syntax.
     * @param {string} subject Subject
     * @returns {Error} Error created
     * @inner
     */
  function illegal(subject) {
    return Error('illegal ' + subject + ' (line ' + line + ')')
  }

  /**
     * Reads a string till its end.
     * @returns {string} String read
     * @inner
     */
  function readString() {
    const re = stringDelim === "'" ? stringSingleRe : stringDoubleRe
    re.lastIndex = offset - 1
    const match = re.exec(source)
    if (!match) throw illegal('string')
    offset = re.lastIndex
    push(stringDelim)
    stringDelim = null
    return unescape(match[1])
  }

  /**
     * Gets the character at `pos` within the source.
     * @param {number} pos Position
     * @returns {string} Character
     * @inner
     */
  function charAt(pos) {
    return source.charAt(pos)
  }

  /**
     * Sets the current comment text.
     * @param {number} start Start offset
     * @param {number} end End offset
     * @returns {undefined}
     * @inner
     */
  function setComment(start, end) {
    commentType = source.charAt(start++)
    commentLine = line
    commentLineEmpty = false
    let lookback
    if (alternateCommentMode) {
      lookback = 2 // alternate comment parsing: "//" or "/*"
    } else {
      lookback = 3 // "///" or "/**"
    }
    let commentOffset = start - lookback
    let c
    do {
      if (--commentOffset < 0 ||
                (c = source.charAt(commentOffset)) === '\n') {
        commentLineEmpty = true
        break
      }
    } while (c === ' ' || c === '\t')
    const lines = source
      .substring(start, end)
      .split(setCommentSplitRe)
    for (let i = 0; i < lines.length; ++i) {
      lines[i] = lines[i]
        .replace(alternateCommentMode ? setCommentAltRe : setCommentRe, '')
        .trim()
    }
    commentText = lines
      .join('\n')
      .trim()
  }

  function isDoubleSlashCommentLine(startOffset) {
    const endOffset = findEndOfLine(startOffset)

    // see if remaining line matches comment pattern
    const lineText = source.substring(startOffset, endOffset)
    // look for 1 or 2 slashes since startOffset would already point past
    // the first slash that started the comment.
    const isComment = /^\s*\/{1,2}/.test(lineText)
    return isComment
  }

  function findEndOfLine(cursor) {
    // find end of cursor's line
    let endOffset = cursor
    while (endOffset < length && charAt(endOffset) !== '\n') {
      endOffset++
    }
    return endOffset
  }

  /**
     * Obtains the next token.
     * @returns {string|null} Next token or `null` on eof
     * @inner
     */
  function next() {
    if (stack.length > 0) return stack.shift()
    if (stringDelim) return readString()
    let repeat
    let prev
    let curr
    let start
    let isDoc
    do {
      if (offset === length) return null
      repeat = false
      while (whitespaceRe.test(curr = charAt(offset))) {
        if (curr === '\n') ++line
        if (++offset === length) return null
      }

      if (charAt(offset) === '/') {
        if (++offset === length) {
          throw illegal('comment')
        }
        if (charAt(offset) === '/') { // Line
          if (!alternateCommentMode) {
            // check for triple-slash comment
            isDoc = charAt(start = offset + 1) === '/'

            while (charAt(++offset) !== '\n') {
              if (offset === length) {
                return null
              }
            }
            ++offset
            if (isDoc) {
              setComment(start, offset - 1)
            }
            ++line
            repeat = true
          } else {
            // check for double-slash comments, consolidating consecutive lines
            start = offset
            isDoc = false
            if (isDoubleSlashCommentLine(offset)) {
              isDoc = true
              do {
                offset = findEndOfLine(offset)
                if (offset === length) {
                  break
                }
                offset++
              } while (isDoubleSlashCommentLine(offset))
            } else {
              offset = Math.min(length, findEndOfLine(offset) + 1)
            }
            if (isDoc) {
              setComment(start, offset)
            }
            line++
            repeat = true
          }
        } else if ((curr = charAt(offset)) === '*') { /* Block */
          // check for /** (regular comment mode) or /* (alternate comment mode)
          start = offset + 1
          isDoc = alternateCommentMode || charAt(start) === '*'
          do {
            if (curr === '\n') {
              ++line
            }
            if (++offset === length) {
              throw illegal('comment')
            }
            prev = curr
            curr = charAt(offset)
          } while (prev !== '*' || curr !== '/')
          ++offset
          if (isDoc) {
            setComment(start, offset - 2)
          }
          repeat = true
        } else {
          return '/'
        }
      }
    } while (repeat)

    // offset !== length if we got here

    let end = offset
    delimRe.lastIndex = 0
    const delim = delimRe.test(charAt(end++))
    if (!delim) while (end < length && !delimRe.test(charAt(end))) ++end
    const token = source.substring(offset, offset = end)
    if (token === '"' || token === "'") stringDelim = token
    return token
  }

  /**
     * Pushes a token back to the stack.
     * @param {string} token Token
     * @returns {undefined}
     * @inner
     */
  function push(token) {
    stack.push(token)
  }

  /**
     * Peeks for the next token.
     * @returns {string|null} Token or `null` on eof
     * @inner
     */
  function peek() {
    if (!stack.length) {
      const token = next()
      if (token === null) return null
      push(token)
    }
    return stack[0]
  }

  /**
     * Skips a token.
     * @param {string} expected Expected token
     * @param {boolean} [optional=false] Whether the token is optional
     * @returns {boolean} `true` when skipped, `false` if not
     * @throws {Error} When a required token is not present
     * @inner
     */
  function skip(expected, optional) {
    const actual = peek()
    const equals = actual === expected
    if (equals) {
      next()
      return true
    }
    if (!optional) throw illegal("token '" + actual + "', '" + expected + "' expected")
    return false
  }

  /**
     * Gets a comment.
     * @param {number} [trailingLine] Line number if looking for a trailing comment
     * @returns {string|null} Comment text
     * @inner
     */
  function cmnt(trailingLine) {
    let ret = null
    if (trailingLine === undefined) {
      if (commentLine === line - 1 && (alternateCommentMode || commentType === '*' || commentLineEmpty)) {
        ret = commentText
      }
    } else {
      /* istanbul ignore else */
      if (commentLine < trailingLine) {
        peek()
      }
      if (commentLine === trailingLine && !commentLineEmpty && (alternateCommentMode || commentType === '/')) {
        ret = commentText
      }
    }
    return ret
  }

  return Object.defineProperty({
    next,
    peek,
    push,
    skip,
    cmnt
  }, 'line', {
    get() { return line }
  })
  /* eslint-enable callback-return */
}
