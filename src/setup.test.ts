expect.extend({
  toEqualStringified(received, compared) {
    return JSON.stringify(received) === JSON.stringify(compared)
      ? {
          message: () => `Expected received not to be equal to compared`,
          pass: true
        }
      : {
          message: () => `Expected received to be equal to compared`,
          pass: false
        }
  }
})

declare global {
  namespace jest {
    interface Matchers<R> {
      toEqualStringified(compared: any): CustomMatcherResult
    }
  }
}

describe('Noop', () => {
  test('', () => {
    expect(true).toBe(true)
  })
})

export {}
