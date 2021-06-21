import lineHighByFontSize from './lineHighByFontSize';

describe('lineHighByFontSize', () => {
  it('should return lineHeight based on font size', () => {
    lineHighByFontSize(undefined).should.equal('1.2em');
    lineHighByFontSize(0).should.equal('1.2em');
    lineHighByFontSize(5).should.equal('1.2em');
    lineHighByFontSize(10).should.equal('1.2em');
    lineHighByFontSize(11).should.equal('1.1em');
    lineHighByFontSize(20).should.equal('1.1em');
    lineHighByFontSize(21).should.equal('1.08em');
    lineHighByFontSize(30).should.equal('1.08em');
    lineHighByFontSize(31).should.equal('1.05em');
    lineHighByFontSize(50).should.equal('1.05em');
    lineHighByFontSize(51).should.equal('1.04em');
    lineHighByFontSize(100).should.equal('1.04em');
    lineHighByFontSize(101).should.equal('1.03em');
    lineHighByFontSize(200).should.equal('1.03em');
    lineHighByFontSize(201).should.equal('1.02em');
    lineHighByFontSize(500).should.equal('1.02em');
  });
});
