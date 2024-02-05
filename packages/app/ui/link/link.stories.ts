import { TextLink } from '.'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof TextLink>
type StoryMeta = Meta<typeof TextLink>

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: StoryMeta = {
  component: TextLink
}

export default meta

export const Internal: Story = {
  args: {
    href: '/',
    children: 'Click Me'
  }
}

export const External: Story = {
  args: {
    ...Internal.args,
    external: true
  }
}
