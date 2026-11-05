/**
 * The fixed Codex asset contract. Only these names ever exist on disk -
 * never invent another file name here.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  squirrel: require('../../assets/sprite_1.png'),
  acorn: require('../../assets/sprite_2.png'),
  basket: require('../../assets/sprite_3.png'),
  sticker: require('../../assets/sprite_4.png'),
  jar: require('../../assets/sprite_5.png'),
} as const;

export default assets;
