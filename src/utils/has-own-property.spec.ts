import hasOwnProperty from './has-own-property';

describe('hasOwnProperty', () => {
  it('should return false with property missing', () => {
    expect(hasOwnProperty({ prop: false }, 'fake')).toBe(false);
  });

  it('should return true with property', () => {
    expect(hasOwnProperty({ prop: false, fake: 'yes' }, 'fake')).toBe(true);
  });

  it('return false with null', () => {
    expect(hasOwnProperty(null, 'fake')).toBe(false);
  });
});
