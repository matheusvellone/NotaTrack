'use client'

import { PropsWithChildren } from 'react'
import { trpc } from '~/helpers/trpc'
import { AppShell, Burger, Group, NavLink, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { version } from '~/app'
import { SHORT_HASH_VERSION } from '~/helpers/env'
import { IconBox, IconBuildingStore, IconInvoice, IconPlus } from '@tabler/icons-react'
import ColorThemeSwitch from '~/components/ColorThemeSwitch'

const DashboardLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname()
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding='md'
    >
      <AppShell.Header>
        <Group h='100%' justify='space-between' px='md'>
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom='sm'
              size='sm'
            />
            <Title>Groceries Tracker</Title>
          </Group>
          <ColorThemeSwitch/>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        pb='env(safe-area-inset-bottom)'
        pl='env(safe-area-inset-left)'
      >
        <AppShell.Section grow>
          <NavLink
            label='New invoice'
            leftSection={<IconPlus size={16}/>}
            component={Link}
            active={pathname === '/invoices/new'}
            href='/invoices/new'
            onClick={close}
          />
          <NavLink
            label='Stores'
            leftSection={<IconBuildingStore size={16}/>}
            component={Link}
            active={pathname === '/stores'}
            href='/stores'
            onClick={close}
          />
          <NavLink
            label='Invoices'
            leftSection={<IconInvoice size={16}/>}
            component={Link}
            active={pathname === '/invoices'}
            href='/invoices'
            onClick={close}
          />
          <NavLink
            label='Products'
            leftSection={<IconBox size={16}/>}
            component={Link}
            active={pathname === '/products'}
            href='/products'
            onClick={close}
          />
        </AppShell.Section>
        <AppShell.Section>
          <Text ta='center' size='xs'>Version: {version} ({SHORT_HASH_VERSION})</Text>
        </AppShell.Section>

      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default trpc.withTRPC(DashboardLayout)
