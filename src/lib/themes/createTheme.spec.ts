import createTheme, { vw1080, vw1920 } from './createTheme';

describe('createTheme', () => {
  it('should return correct values', () => {
    const theme = createTheme(
      {
        headingFont: 'http://lvh.me/heading-font.woff',
        headingTextColor: 'headingTextColor',
        heading2Font: 'http://lvh.me/heading2-font.woff',
        heading2TextColor: 'heading2TextColor',
        bodyFont: 'http://lvh.me/body-font.woff',
        bodyTextColor: 'bodyTextColor',
        backgroundColor: 'backgroundColor',
        backgroundImage: 'backgroundImage',
        backgroundImagePortrait: 'backgroundImagePortrait',
        borderColor: 'borderColor',
      },
      false
    );
    theme.should.containEql({
      isPortrait: false,
      vw: vw1920,
      globalStyles: [
        {
          '@font-face': {
            fontFamily: 'http___lvh_me_heading_font_woff',
            src: `url(http://lvh.me/heading-font.woff) format('woff')`,
          },
        },
        {
          '@font-face': {
            fontFamily: 'http___lvh_me_heading2_font_woff',
            src: `url(http://lvh.me/heading2-font.woff) format('woff')`,
          },
        },
        {
          '@font-face': {
            fontFamily: 'http___lvh_me_body_font_woff',
            src: `url(http://lvh.me/body-font.woff) format('woff')`,
          },
        },
        {
          '@font-face': {
            fontFamily: 'https___fonts_raydiant_com_Roboto_Regular_woff',
            src: `url(https://fonts.raydiant.com/Roboto-Regular.woff) format('woff')`,
          },
        },
      ],
      toLoadFonts: [
        'http___lvh_me_heading_font_woff',
        'http___lvh_me_heading2_font_woff',
        'http___lvh_me_body_font_woff',
        'https___fonts_raydiant_com_Roboto_Regular_woff',
      ],
      background: 'backgroundColor',
      backgroundImage: 'backgroundImage',
      backgroundImagePortrait: 'backgroundImagePortrait',
      separator: {
        background: 'borderColor',
      },
    });
    theme.headingText(10).should.eql({
      fontFamily: 'http___lvh_me_heading_font_woff',
      color: 'headingTextColor',
      fontSize: '2.3em',
      lineHeight: '1.08em',
    });
    theme.subHeadingText(10).should.eql({
      fontFamily: 'http___lvh_me_heading2_font_woff',
      color: 'heading2TextColor',
      fontSize: '1.4em',
      lineHeight: '1.1em',
    });
    theme.itemText(10).should.eql({
      fontFamily: 'http___lvh_me_heading2_font_woff',
      color: 'heading2TextColor',
      fontSize: '1em',
      lineHeight: '1.2em',
    });
    theme.itemPriceText(12).should.eql({
      fontFamily: 'http___lvh_me_body_font_woff',
      color: 'bodyTextColor',
      fontSize: '1em',
      lineHeight: '1.1em',
    });
    theme.variantText(12).should.eql({
      fontFamily: 'http___lvh_me_body_font_woff',
      color: 'bodyTextColor',
      fontSize: '0.77em',
      lineHeight: '1.2em',
    });
    theme.variantPriceText().should.eql({
      color: 'bodyTextColor',
    });
    theme.bodyText(101).should.eql({
      fontFamily: 'http___lvh_me_body_font_woff',
      color: 'bodyTextColor',
      lineHeight: '1.03em',
    });

    createTheme(
      {
        headingFont: 'http://lvh.me/heading-font.woff',
        headingTextColor: 'headingTextColor',
        heading2Font: 'http://lvh.me/heading2-font.woff',
        heading2TextColor: 'heading2TextColor',
        bodyFont: 'http://lvh.me/body-font.woff',
        bodyTextColor: 'bodyTextColor',
        backgroundColor: 'backgroundColor',
        backgroundImage: 'backgroundImage',
        backgroundImagePortrait: 'backgroundImagePortrait',
      },
      true
    ).should.containEql({
      isPortrait: true,
      vw: vw1080,
      separator: {
        background: 'bodyTextColor',
      },
    });
  });
});
