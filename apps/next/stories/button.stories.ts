import Button from 'app/design/button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const Meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
}

export default Meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    variant: 'default',
    title: 'Click me!',
  },
}
