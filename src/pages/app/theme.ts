// theme.ts

// 1. import `extendTheme` function
import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme

// 如果主题你不生效  大概率可以看看 是不是缓存了
