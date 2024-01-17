import { Typography } from 'app/ui/typography'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const Meta = {
  title: 'UI/Typography',
  component: Typography,
  tags: ['autodocs'],
}

export default Meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const P = {
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
