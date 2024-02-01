import type { Preview } from '@storybook/react'
import 'raf/polyfill'
import 'setimmediate'

import 'app/design/tailwind/global.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
