import { Typography } from 'app/ui/typography'
import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Typography> = {
  title: 'UI/Typography',
  component: Typography,
  tags: ['autodocs'],
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const P: StoryObj<typeof Typography> = {
  args: {
    variant: 'p',
    children: 'This is a paragraph',
  },
}
export const H1 = {
  args: {
    variant: 'h1',
    children: 'This is a paragraph',
  },
}
