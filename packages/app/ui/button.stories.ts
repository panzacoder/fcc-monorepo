import { Button } from './button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs']
}

export default meta

export const Default: StoryObj<typeof Button> = {
  args: {
    title: 'Click Me',
    onPress: () => alert('Button Pressed')
  }
}

export const Destructive = {
  args: {
    ...Default.args,
    variant: 'destructive',
    title: 'Delete'
  }
}

export const Outline = {
  args: {
    ...Default.args,
    variant: 'outline',
    title: 'Outline'
  }
}

export const SmallSize = {
  args: {
    ...Default.args,
    size: 'sm'
  }
}

export const LargeSize = {
  args: {
    ...Default.args,
    size: 'lg'
  }
}

// export const IconButton = {
//   args: {
//     ...Default.args,
//     size: 'icon',
//     children: <Ico />, // Assuming an Icon component is available
//   },
// };
