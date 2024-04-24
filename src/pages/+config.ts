import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

import Head from '../layouts/HeadDefault'
import Layout from '../layouts/LayoutDefault'

// Default config (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'Welcome',
  extends: vikeReact,
} satisfies Config
