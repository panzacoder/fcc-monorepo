import { View } from 'react-native'
import { cn } from 'app/ui/utils'
import { Card, CardProps } from 'app/ui/card'

export type CardViewProps = {
  children: React.ReactNode
  className?: string
  cardProps?: Partial<CardProps>
}

export function CardView({ children, className = '' }: CardViewProps) {
  return (
    <View
      className={cn(
        'web:py-0 web:max-h-[95vh] web:max-w-screen flex w-full flex-1 flex-col items-center justify-center md:max-w-screen-sm',
        className
      )}
    >
      <Card className="web:w-auto native:w-full">{children}</Card>
    </View>
  )
}
