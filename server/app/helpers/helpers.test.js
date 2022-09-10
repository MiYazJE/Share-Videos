const getRandomColor = require('./getRandomColor');

describe('Helpers test', () => {
  test('getRandomColor', () => {
    const color = getRandomColor();
    expect(color).toHaveLength(7);
    expect(color[0]).toBe('#');
  });
});
