import { P } from 'app/design/typography'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const Meta = {
  title: 'UI/Typography',
  component: P,
  tags: ['autodocs'],
}

export default Meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    children: 'This is a paragraph',
  },
}
