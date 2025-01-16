'use client'

import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
import classes from './ColorThemeSwitch.module.css'

const ColorThemeSwitch = () => {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      aria-label="Toggle color scheme"
    >
      <IconSun size={16} className={classes.light} stroke={1.5} />
      <IconMoon size={16} className={classes.dark} stroke={1.5} />
    </ActionIcon>
  )
}

export default ColorThemeSwitch
