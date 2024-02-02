import { Typography } from '.'
import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof Typography>
type StoryMeta = Meta<typeof Typography>

const meta: StoryMeta = {
  component: Typography
}

export default meta

export const H1: Story = {
  args: {
    variant: 'h1',
    children: 'We care because you care.'
  }
}
export const H2: Story = {
  args: {
    variant: 'h2',
    children: 'We care because you care.'
  }
}
export const H3: Story = {
  args: {
    variant: 'h3',
    children: 'We care because you care.'
  }
}
export const H4: Story = {
  args: {
    variant: 'h4',
    children: 'We care because you care.'
  }
}
export const H5: Story = {
  args: {
    variant: 'h5',
    children: 'We care because you care.'
  }
}
export const H6: Story = {
  args: {
    variant: 'h6',
    children: 'We care because you care.'
  }
}

export const P: Story = {
  args: {
    variant: 'p',
    children: 'We care because you care.'
  }
}

export const Span: Story = {
  args: {
    variant: 'span',
    children: 'We care because you care.'
  }
}

export const Strong: Story = {
  args: {
    variant: 'strong',
    children: 'We care because you care.'
  }
}

export const Em: Story = {
  args: {
    variant: 'em',
    children: 'We care because you care.'
  }
}

export const Small: Story = {
  args: {
    variant: 'small',
    children: 'We care because you care.'
  }
}

export const A: Story = {
  args: {
    variant: 'a',
    children: 'We care because you care.'
  }
}

export const Blockquote: Story = {
  args: {
    variant: 'blockquote',
    children: 'We care because you care.'
  }
}
