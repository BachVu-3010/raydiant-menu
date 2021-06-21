import styled, { StyledComponent } from '@emotion/styled';

import animations, { Animation } from '../../utils/animation';

// For the panning animations: # of px to pan from the center
const animationOffset = 50;
export const Image: StyledComponent<{ animation?: Animation, animate?: boolean, src: string }> = styled('div')(({ theme, animation, animate, src }) => {
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  if (animation === 'horizontal') {
    left = -animationOffset;
    right = -animationOffset;
  }
  if (animation === 'vertical') {
    top = -animationOffset;
    bottom = -animationOffset;
  }
  return {
    position: 'absolute',
    top: theme.vw(top),
    right: theme.vw(right),
    bottom: theme.vw(bottom),
    left: theme.vw(left),
    backgroundImage: `url("${src}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
    objectFit: 'cover',
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
  overflow: 'hidden',
  justifyContent: 'center',
}));
