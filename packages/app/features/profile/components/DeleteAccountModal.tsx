'use client'
import { View, Alert } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import * as z from 'zod'
import type { ProfileAppUser } from 'app/data/profile'
import type { ProfileDataReturn } from '../hooks/useProfileData'

const schema = z.object({
  password: z.string().min(1, { message: 'Password is required' })
})

type Schema = z.infer<typeof schema>

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  appuserDetails: Partial<ProfileAppUser>
  checkValidCredential: ProfileDataReturn['checkValidCredential']
  deleteAccountMutation: ProfileDataReturn['deleteAccountMutation']
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  appuserDetails,
  checkValidCredential,
  deleteAccountMutation
}: DeleteAccountModalProps) {
  const router = useRouter()

  const { handleSubmit, control } = useForm({
    defaultValues: {
      password: ''
    },
    resolver: zodResolver(schema)
  })

  function deleteAccount(password: string) {
    deleteAccountMutation.mutate(
      {
        appuserVo: {
          email: appuserDetails.email ? appuserDetails.email : '',
          credential: password
        }
      },
      {
        onSuccess: () => {
          router.push('/login')
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete account')
        }
      }
    )
  }

  function checkCredential(formData: Schema) {
    checkValidCredential.mutate(
      {
        appuserVo: {
          credential: formData.password
        }
      },
      {
        onSuccess: () => {
          deleteAccount(formData.password)
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Invalid credential')
        }
      }
    )
  }

  if (!isOpen) return null

  return (
    <View className="absolute top-[100] w-[95%] flex-1 self-center">
      <View
        style={{
          backgroundColor: 'white'
        }}
        className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] "
      >
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{``}</Typography>
        </View>
        <ControlledSecureField
          control={control}
          name="password"
          placeholder={'Password*'}
          className="w-[95%] self-center"
        />
        <View className="my-5 flex-row self-center">
          <Button
            className="my-1 bg-[#066f72]"
            title={'Confirm'}
            variant="default"
            onPress={handleSubmit(checkCredential)}
          />
          <Button
            className="my-1 ml-5 bg-[#86939e]"
            title={'Cancel'}
            variant="default"
            onPress={onClose}
          />
        </View>
      </View>
    </View>
  )
}
