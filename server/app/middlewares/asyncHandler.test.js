const asyncHandler = require('./asyncHandler');

describe('asyncHandler', () => {
  test.each([
    ['a synchronous throw', () => { throw new Error('sync'); }],
    ['a rejected promise', () => Promise.reject(new Error('async'))],
  ])('forwards %s to next', async (_, handler) => {
    const next = jest.fn();

    await asyncHandler(handler)({}, {}, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
