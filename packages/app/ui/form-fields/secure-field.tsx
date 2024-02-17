import PtsTextInput, { PtsTextInputProps } from 'app/ui/PtsTextInput'
import { Feather } from 'app/ui/icons'
import { useState } from 'react'
import { Pressable } from 'react-native'

export type SecureFieldProps = PtsTextInputProps

export function SecureField(props: PtsTextInputProps) {
  const [showText, setShowText] = useState(false)
  return (
    <PtsTextInput
      autoCorrect={false}
      secureTextEntry={!showText}
      trailingSlot={
        <Pressable
          onPress={() => {
            setShowText((val) => !val)
          }}
        >
          <Feather
            name={showText ? 'eye' : 'eye-off'}
            size={20}
            color={'black'}
          />
        </Pressable>
      }
      {...props}
    />
  )
}
