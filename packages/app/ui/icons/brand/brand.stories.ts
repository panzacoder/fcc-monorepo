import { BrandIcon } from '.'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof BrandIcon>
type StoryMeta = Meta<typeof BrandIcon>

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: StoryMeta = {
  component: BrandIcon
}

export default meta

export const Default: Story = {
  args: {
    name: 'home'
  }
}
