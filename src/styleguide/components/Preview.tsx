import * as React from 'react';
import * as themes from 'raydiant-kit/lib/themes';

import { ThemeVars } from '../../lib/types';

interface ThemeOption {
  name: string;
  value: ThemeVars;
}

const themeOptions: ThemeOption[] = [];

for (const [key, theme] of Object.entries(themes)) {
  themeOptions.push({
    name: theme.name,
    value: {
      backgroundColor: theme.background_color,
      backgroundImage: theme.background_image,
      backgroundImagePortrait: theme.background_image_portrait,
      headingFont: theme.heading_font,
      headingTextColor: theme.heading_text_color,
      heading2Font: theme.heading_2_font,
      heading2TextColor: theme.heading_2_text_color,
      bodyFont: theme.body_font,
      borderColor: theme.border_color,
      bodyTextColor: theme.body_text_color,
    }
  });
}

const Preview: React.FC<{ vertical: boolean, children: (themeVars: ThemeVars, imageUrl?: string) => any }> = ({ children, vertical = false }) => {
  const [scale, setScale] = React.useState(null);
  const [theme, setTheme] = React.useState(themeOptions[0].value);
  const [imageUrl, setImageUrl] = React.useState<string>('');

  const ref = React.useRef(null);
  const width = vertical ? 1080 : 1920;
  const height = vertical ? 1920 : 1080;

  React.useEffect(() => {
    if (ref.current) {
      const newScale = ref.current.clientWidth/ width;
      setScale(newScale);
    }
  }, [ref, width]);

  return (
    <div style={{width: '100%'}}>
      <div className='preview' ref={ref} style={{ 
        width: '100%',
        height: height * scale,
        border: '2px solid black'
      }}>
        <div style={{ 
          width,
          height,
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
        }}>
          { scale ? children(theme, imageUrl) : null }
        </div>
      </div>
      <h2>Select theme</h2>
      <select onChange={(event) => {
        setTheme(themeOptions[event.target.value as unknown as number].value)
      }}>
        {
          themeOptions.map((themeOption: ThemeOption, index: number) => (
            <option value={index}>{themeOption.name}</option>
          ))
        }
      </select>
      <h2>Input Image Url</h2>
      <input type='string' value={imageUrl} onChange={(event) => {
        setImageUrl(event.target.value);
      }} />
    </div>
  );
}

export default Preview;
