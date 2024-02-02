import { Feather } from '.'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof Feather>
type StoryMeta = Meta<typeof Feather>

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: StoryMeta = {
  component: Feather
}

export default meta

export const Default: Story = {
  args: {
    name: 'arrow-up'
  }
}
