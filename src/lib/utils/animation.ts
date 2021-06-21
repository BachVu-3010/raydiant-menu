import { keyframes } from '@emotion/react';

export type Animation = 'horizontal' | 'vertical' | 'zoom';

type Animations = { [day in Animation]: (config: object) => string };

const horizontal = ({ animationOffset, duration, timing }: { animationOffset: number, duration: number, timing: string }) => {
  const animation = keyframes({
    '0%': {
      transform: `translateX(-${animationOffset})`,
    },

    '10%': {
      transform: `translateX(-${animationOffset})`,
    },

    '90%': {
      transform: `translateX(${animationOffset})`,
    },

    '100%': {
      transform: `translateX(${animationOffset})`,
    },
  });

  return `${animation} ${duration}s ${timing} 0s infinite alternate`;
};

const vertical = ({ animationOffset, duration, timing }: { animationOffset: number, duration: number, timing: string }) => {
  const animation = keyframes({
    '0%': {
      transform: `translateY(-${animationOffset})`,
    },

    '10%': {
      transform: `translateY(-${animationOffset})`,
    },

    '90%': {
      transform: `translateY(${animationOffset})`,
    },

    '100%': {
      transform: `translateY(${animationOffset})`,
    },
  });

  return `${animation} ${duration}s ${timing} 0s infinite alternate`;
};

const zoom = ({ delay, duration, timing }: { delay: number, duration: number, timing: string }) => {
  // To create a pause before switching directions set the first 10%
  // of the animation to the starting value and the last 10% to end value
  const animation = keyframes({
    '0%': {
      transform: 'scale(1, 1)',
    },

    '10%': {
      transform: 'scale(1, 1)',
    },

    '90%': {
      transform: `scale(1.02, 1.02)`,
    },

    '100%': {
      transform: `scale(1.02, 1.02)`,
    },
  });

  return `${animation} ${duration}s ${timing} ${delay}s infinite alternate`;
};

const animations: Animations = {
  horizontal,
  vertical,
  zoom,
};

export default animations;
