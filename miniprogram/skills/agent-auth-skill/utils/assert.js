class AssertionError extends Error {
  constructor(message, expected, actual) {
    super(message)
    this.name = 'AssertionError'
    this.expected = expected
    this.actual = actual
  }
}

function safeStringify(value) {
  try {
    return JSON.stringify(value)
  } catch (e) {
    return String(value)
  }
}

function assertTrue(actual, message) {
  if (!actual) {
    throw new AssertionError(
      message || `assertTrue failed, got ${safeStringify(actual)}`,
      true,
      actual
    )
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new AssertionError(
      message || `assertEquals failed: expected ${safeStringify(expected)}, got ${safeStringify(actual)}`,
      expected,
      actual
    )
  }
}

function assertType(actual, expectedType, message) {
  const t = typeof actual
  if (t !== expectedType) {
    throw new AssertionError(
      message || `assertType failed: expected typeof === '${expectedType}', got '${t}' (value=${safeStringify(actual)})`,
      expectedType,
      t
    )
  }
}

function runAssertions(cases) {
  const failures = []
  let total = 0

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i]
    if (!c || c.length < 2) continue

    const name = c[0]
    const fn = c[1]
    total += 1

    try {
      fn()
    } catch (e) {
      failures.push({
        name,
        errMsg: (e && (e.message || e.errMsg)) || String(e),
        expected: e && e.expected,
        actual: e && e.actual
      })
    }
  }

  return { passed: failures.length === 0, failures, total }
}

module.exports = {
  AssertionError,
  assertTrue,
  assertEquals,
  assertType,
  runAssertions
}
