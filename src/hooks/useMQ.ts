const xs = 20
const sm = 48
const md = 62
const lg = 75
const xl = 87.5
const xxl = 117.5

export default function useMQ() {
  const isXs = useMediaQuery(`(max-width: ${xs}rem)`)
  const isSm = useMediaQuery(`(max-width: ${sm}rem)`)
  const isMd = useMediaQuery(`(max-width: ${md}rem)`)
  const isLg = useMediaQuery(`(max-width: ${lg}rem)`)
  const isXl = useMediaQuery(`(max-width: ${xl}rem)`)
  const is2xl = useMediaQuery(`(max-width: ${xxl}rem)`)

  return {
    is2xl,
    isLg,
    isMd,
    isSm,
    isXl,
    isXs,
  }
}
