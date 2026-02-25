'use client'
import { useState } from 'react'
import { View, Alert } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import type { ProfileMember } from 'app/data/profile'
import type { ProfileDataReturn } from '../hooks/useProfileData'

const sponsorSchema = z.object({
  sponsorCode: z.string().min(1, { message: 'Sponsor code is required' })
})

type SponsorSchema = z.infer<typeof sponsorSchema>

interface SponsorshipSectionProps {
  memberDetails: Partial<ProfileMember>
  updateSponsorCode: ProfileDataReturn['updateSponsorCode']
}

export function SponsorshipSection({
  memberDetails,
  updateSponsorCode
}: SponsorshipSectionProps) {
  const [isShowSponsorship, setIsShowSponsorship] = useState(false)

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      sponsorCode: ''
    },
    resolver: zodResolver(sponsorSchema)
  })

  function saveSponsorCode(formData: SponsorSchema) {
    updateSponsorCode.mutate(
      {
        appuserVo: {
          sponsorCode: formData.sponsorCode,
          email: memberDetails.email ? memberDetails.email : ''
        }
      },
      {
        onSuccess: () => {
          reset({ sponsorCode: '' })
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to update sponsor code')
        }
      }
    )
  }

  return (
    <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
      <View className="flex-row">
        <Typography className="ml-2 w-[90%] self-center font-bold">
          {'Sponsorship Details'}
        </Typography>
        <Feather
          onPress={() => {
            setIsShowSponsorship(!isShowSponsorship)
          }}
          className="self-center"
          name={!isShowSponsorship ? 'chevron-down' : 'chevron-up'}
          size={20}
          color={'black'}
        />
      </View>
      {isShowSponsorship ? (
        <View className="ml-2">
          <ControlledTextField
            control={control}
            name="sponsorCode"
            placeholder={'Sponsor Code*'}
            className="w-[95%] bg-white"
          />
          <Button
            className="my-2 w-[40%] self-center bg-[#ef6603]"
            title={'Save'}
            leadingIcon="save"
            variant="default"
            onPress={handleSubmit(saveSponsorCode)}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
