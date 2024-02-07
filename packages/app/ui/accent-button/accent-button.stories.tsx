import { AccentButton } from '.'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof AccentButton>
type StoryMeta = Meta<typeof AccentButton>

const meta: StoryMeta = {
  component: AccentButton,
  parameters: {
    backgrounds: { default: 'dark' }
  }
}

export default meta

export const Default: Story = {
  args: {
    title: 'Click Me',
    onPress: () => alert('Button Pressed')
  }
}
