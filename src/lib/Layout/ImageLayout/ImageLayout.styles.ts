import styled, { StyledComponent } from '@emotion/styled';

import animations, { Animation } from '../../utils/animation';

// For the panning animations: # of px to pan from the center
const animationOffset = 50;
export const Image: StyledComponent<{ animation?: Animation, animate?: boolean, src: string }> = styled('div')(({ theme, animation, animate, src }) => {
  return {
    width: '100%',
    height: '100%',
    backgroundImage: `url("${src}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPsition: 'center center',
    animation:
      animation &&
      animations[animation]({
        animationOffset: theme.vw(animationOffset),
        delay: 0,
        duration: 30,
        timing: 'ease-in-out',
      }),
    animationPlayState: animate ? 'running' : 'paused',
  };
});

export const ImageLayout: StyledComponent<{ height: number, width: number }> = styled('div')(({ theme, height, width }) => ({
  height: theme.vw(height),
  width: theme.vw(width),
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
}));
