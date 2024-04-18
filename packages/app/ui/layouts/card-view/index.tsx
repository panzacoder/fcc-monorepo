import { View } from 'react-native'
import { cn } from 'app/ui/utils'
import { Card, CardProps } from 'app/ui/card'
import { ScrollView } from 'app/ui/scroll-view'

export type CardViewProps = {
  children: React.ReactNode
  className?: string
  cardProps?: Partial<CardProps>
  scroll?: boolean
}

export function CardView({ children, scroll, className = '' }: CardViewProps) {
  return (
    <View
      className={cn(
        'native:max-h-[95%] web:py-0 web:max-h-[95vh] web:max-w-screen flex w-full items-center justify-center md:max-w-screen-sm',
        className
      )}
    >
      <ScrollView className="overflow-visible">
        <Card scroll={scroll} className="web:w-auto native:w-full">
          {children}
        </Card>
      </ScrollView>
    </View>
  )
}
