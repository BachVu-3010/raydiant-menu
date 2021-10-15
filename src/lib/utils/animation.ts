import { keyframes } from '@emotion/react';

export type Animation = 'horizontal' | 'vertical' | 'zoom';

type Animations = { [day in Animation]: (config: object) => string };

const horizontal = ({ animationOffset, duration, timing }: { animationOffset: number, duration: number, timing: string }) => {
  const animation = keyframes({
    '0%': {
      backgroundPosition: `calc(50% - ${animationOffset}) 0`,
    },

    '10%': {
      backgroundPosition: `calc(50% - ${animationOffset}) 0`,
    },

    '90%': {
      backgroundPosition: `calc(50% + ${animationOffset}) 0`,
    },

    '100%': {
      backgroundPosition: `calc(50% + ${animationOffset}) 0`,
    },
  });

  return `${animation} ${duration}s ${timing} 0s infinite alternate`;
};

const vertical = ({ animationOffset, duration, timing }: { animationOffset: number, duration: number, timing: string }) => {
  const animation = keyframes({
    '0%': {
      backgroundPosition: `0 calc(50% - ${animationOffset})`,
    },

    '10%': {
      backgroundPosition: `0 calc(50% - ${animationOffset})`,
    },

    '90%': {
      backgroundPosition: `0 calc(50% + ${animationOffset})`,
    },

    '100%': {
      backgroundPosition: `0 calc(50% + ${animationOffset})`,
    },
  });

  return `${animation} ${duration}s ${timing} 0s infinite alternate`;
};

const zoom = ({ delay, duration, timing }: { delay: number, duration: number, timing: string }) => {
  // To create a pause before switching directions set the first 10%
  // of the animation to the starting value and the last 10% to end value
  const animation = keyframes({
    '0%': {
      backgroundSize: '100% 100%',
    },

    '10%': {
      backgroundSize: '100% 100%',
    },

    '90%': {
      backgroundSize: '102% 102%',
    },

    '100%': {
      backgroundSize: '102% 102%',
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
