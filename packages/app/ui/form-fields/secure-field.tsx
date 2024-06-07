import PtsTextInput, { PtsTextInputProps } from 'app/ui/PtsTextInput'
import { Feather } from 'app/ui/icons'
import React, { useState } from 'react'
import { TouchableOpacity, TextInput } from 'react-native'

export type SecureFieldProps = PtsTextInputProps

export const SecureField = React.forwardRef(function SecureField(
  props: PtsTextInputProps,
  ref: React.Ref<TextInput>
) {
  const [showText, setShowText] = useState(false)
  return (
    <PtsTextInput
      autoCorrect={false}
      secureTextEntry={!showText}
      ref={ref}
      trailingSlot={
        <TouchableOpacity
          onPress={() => {
            setShowText((val) => !val)
          }}
        >
          <Feather
            name={showText ? 'eye' : 'eye-off'}
            size={20}
            color={'black'}
          />
        </TouchableOpacity>
      }
      {...props}
    />
  )
})
