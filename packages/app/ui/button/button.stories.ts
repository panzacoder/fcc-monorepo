import { Button } from '.'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof Button>
type StoryMeta = Meta<typeof Button>

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: StoryMeta = {
  component: Button
}

export default meta

export const Default: Story = {
  args: {
    title: 'Click Me',
    onPress: () => alert('Button Pressed')
  }
}

export const Destructive: Story = {
  args: {
    ...Default.args,
    variant: 'destructive',
    title: 'Delete'
  }
}

export const Outline: Story = {
  args: {
    ...Default.args,
    variant: 'outline',
    title: 'Outline'
  }
}

export const SmallSize: Story = {
  args: {
    ...Default.args,
    size: 'sm'
  }
}

export const LargeSize: Story = {
  args: {
    ...Default.args,
    size: 'lg'
  }
}
