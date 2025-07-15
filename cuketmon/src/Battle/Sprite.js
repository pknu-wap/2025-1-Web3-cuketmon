import React from 'react';
import { SpriteAnimator } from 'react-sprite-animator';

const Sprite = ({ active }) => {
  return (
    <SpriteAnimator
      sprite="/Sprite/fire.png"
      width={32}
      height={32}
      frameCount={11}
      fps={8}
      direction="horizontal"
      autoplay={active}
      loop
    />
  );
};

export default Sprite;
