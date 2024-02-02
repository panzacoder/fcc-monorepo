import type { Preview } from '@storybook/react'
import 'raf/polyfill'
import 'setimmediate'

// for now, we need to duplicate the global styles and import them here.
import './global.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
