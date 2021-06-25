import isValidPrice from './isValidPrice';

describe('isValidPrice', () => {
  it('should handle spaces', () => {
    isValidPrice('  ').should.be.false();
    isValidPrice('  10').should.be.true();
  });

  it('should return false for falsy prices', () => {
    isValidPrice(0).should.be.false();
    isValidPrice(null).should.be.false();
    isValidPrice(undefined).should.be.false();
  });

  it('should return true for numbers and strings', () => {
    isValidPrice(1).should.be.true();
    isValidPrice('1').should.be.true();
  });
});
