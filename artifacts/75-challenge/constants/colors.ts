/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#17352d',
    tint: '#e06c4d',
    background: '#f7f4ee',
    foreground: '#17352d',
    card: '#fffdf8',
    cardForeground: '#17352d',
    primary: '#e06c4d',
    primaryForeground: '#fffdf8',
    secondary: '#e4eee7',
    secondaryForeground: '#245445',
    muted: '#edf1eb',
    mutedForeground: '#6f8279',
    accent: '#f2c66d',
    accentForeground: '#4b3717',
    destructive: '#c9564a',
    destructiveForeground: '#fffdf8',
    border: '#dce5de',
    input: '#dce5de',
    forest: '#245445',
    sage: '#9db7a5',
    cream: '#fffdf8',
    peach: '#f8ded3',
    sky: '#d9e9e4',
  },
  radius: 18,
};

export default colors;
