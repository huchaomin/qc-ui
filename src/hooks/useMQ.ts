const xs = 20 // 320px
const sm = 48 // 768px
const md = 62 // 992px
const lg = 75 // 1200px
const xl = 87.5 // 1400px
const xxl = 117.5 // 1880px

export default {
  is2xl: useMediaQuery(`(max-width: ${xxl}rem)`),
  isLg: useMediaQuery(`(max-width: ${lg}rem)`),
  isMd: useMediaQuery(`(max-width: ${md}rem)`),
  isSm: useMediaQuery(`(max-width: ${sm}rem)`),
  isXl: useMediaQuery(`(max-width: ${xl}rem)`),
  isXs: useMediaQuery(`(max-width: ${xs}rem)`),
}
