import { extendTheme, theme as defaultTheme } from '@chakra-ui/react';
// import breakpoints from './breakpoints';
// import components from './components';
import foundations from './foundations';
import typography from './typography';

const theme = extendTheme(
  {
    // components,
    ...typography,
    ...foundations,
  },
  {
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
      disableTransitionOnChange: false
    },
    direction: defaultTheme.direction,
    transition: defaultTheme.transition,
    // breakpoints,
    zIndices: defaultTheme.zIndices,
    components: defaultTheme.components,
    styles: {
      global: props => ({
        'html, body': {
          color: props.colorMode === 'light' ? 'grey.900' : 'offWhite',
          bg: props.colorMode === 'light' ? 'offWhite' : 'grey.900',
          transition: "background-color 1s",
          borderColor: props.colorMode === 'light' ? 'rgb(0, 0, 0, 0.5)' : 'rgb(255, 255, 255, 0.5)'
        }
      })
    },
    colors: {},
    // radii: {},
    // shadows: {},
    sizes: {},
    space: {},
    fonts: {},
    fontSizes: {},
    fontWeights: {},
    letterSpacings: {},
    lineHeights: {},
  }
);

export default theme;