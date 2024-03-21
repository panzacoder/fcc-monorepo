import { View } from 'react-native'
import { tv, type VariantProps } from 'tailwind-variants'

const dividerVariants = tv({
  variants: {
    variant: {
      vertical: 'h-full w-[1px] bg-gray-200',
      horizontal: 'h-[1px] w-full bg-gray-200'
    }
  },
  defaultVariants: {
    variant: 'horizontal'
  }
})

export type DividerProps = VariantProps<typeof dividerVariants> & {
  className?: string
}

export function Divider({ variant, className }: DividerProps) {
  return <View className={dividerVariants({ variant, className })} />
}
