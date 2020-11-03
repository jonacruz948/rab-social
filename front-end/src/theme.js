import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'
// import SuisseIntl from '../public/fonts/Suisse-Intl/SuisseIntl-Regular.ttf';

// const suisse = {
//   fontFamily: 'Suisse',
//   fontStyle: 'normal',
//   fontDisplay: 'swap',
//   fontWeight: 400,
//   src: `
//     local('Suisse'),
//     local('Suisse-Regular'),
//     url(${SuisseIntl}) format('ttf')
//   `,
//   unicodeRange:
//     'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
// }

// Create a theme instance.
const theme = createMuiTheme({
  // typography: {
  //   fontFamily: 'SuisseIntl-Regular'
  // },
  // overrides: {
  //   MuiCssBaseline: {
  //     '@global': {
  //       '@font-face': [suisse]
  //     }
  //   }
  // },
  palette: {
    primary: { main: '#556CD6' },
    secondary: { main: '#19857B' },
    error: { main: red.A400 },
    background: { default: '#fff' },
  },
  props: {
    MuiContainer: {
      maxWidth: "false",
    },
  },
})

export default theme
