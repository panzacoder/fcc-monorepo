'use client'

import { useState, useEffect } from 'react'
import { View, Alert, ScrollView } from 'react-native'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_ALL_PLANS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'app/ui/button'
const schema = z.object({
  planIndex: z.number()
})
export function PlansScreen() {
  const [isLoading, setLoading] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState(-1)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [plansList, setPlansList] = useState([]) as any
  const [planNames, setPlanNames] = useState([]) as any
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      planIndex: 1
    },
    resolver: zodResolver(schema)
  })
  useEffect(() => {
    async function getPlandetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_ALL_PLANS}`
      let dataObject = {
        header: header
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            let planDetails = data.data
            let plan: any = {}
            planDetails.map((plans: any) => {
              if (plans.planName === 'FCC Subscription') {
                plan = plans
              }
            })

            let plansData: any = plan.planList
            type Response = {
              id: number
              plantype: string
            }
            let planNamesList: Array<{ id: number; title: string }> =
              plansData.map(({ plantype, id }: Response, index: any) => {
                return {
                  title: plantype,
                  id: index + 1
                }
              })
            let planNames: any = []
            plansData.map((planData: any) => {
              planNames.push(planData.plantype)
            })
            let first_plan = _.find(
              plansData,
              (e) => e.plantype === planNames[0]
            )
            let selectedPlanId = first_plan.id
            setPlansList(plansData)
            setPlanNames(planNamesList)
            setSelectedPlanId(selectedPlanId)
            // console.log('getPlanDetails', JSON.stringify(plansData))
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('error', error)
        })
    }
    getPlandetails()
  }, [])
  const getPlansView = () => {
    let planId = selectedPlanId
    if (planId === -1) {
      return <View />
    }
    let data = _.find(plansList, (e) => e.id === planId)
    let colorSet: any = [
      { headingBackground: 'bg-[#dd4b5e]' },
      { headingBackground: 'bg-[#53cfe9]' },
      { headingBackground: 'bg-[#48c9b0]' },
      { headingBackground: 'bg-[#a569bd]' },
      { headingBackground: 'bg-[#eb984e]' }
    ]

    if (!data) {
      return <View />
    }

    let planItems = _.orderBy(data.planItems, (e) => e.displaySequence, 'asc')
    return (
      <View>
        <View
          key={0}
          style={[
            {
              overflow: 'hidden',
              elevation: 3
            }
          ]}
          className="mx-[5%] my-20   rounded-[10px] bg-white "
        >
          <View
            className={`w-full items-center justify-center p-[8px] ${colorSet[selectedPlanIndex].headingBackground}`}
          >
            <Typography className="flex-1 text-[18px] font-bold text-white">
              {planNames[selectedPlanIndex - 1].title.toUpperCase()}
            </Typography>
            {/* <View
              className={`w-full flex-1 items-center justify-center ${data.price > 0 ? 'h-[60]' : 'h-[0]'} ${colorSet[selectedPlanIndex].headingBackground}`}
            > */}
            <View
              className={`mt-[5px] h-[100] w-[100] flex-1 items-center justify-center rounded-full border-[5px] border-white ${data.price > 0 ? 'h-[60]' : 'h-[0]'} ${colorSet[selectedPlanIndex].headingBackground}`}
            >
              <Typography className="text-[25px] text-white">
                {data.price > 0 ? `$${data.price}` : ''}
              </Typography>
            </View>
          </View>
          <View className="mb-[20px] bg-white">
            <Typography className="my-[5px] text-center text-[16px] font-bold">
              Discount: {data.discountPercent.replace('.0', '')} %
            </Typography>
            <View className="h-[0.5px] w-full bg-gray-400" />
            {planItems.map((plan, index) => {
              return (
                <View key={index}>
                  <Typography
                    className="my-[5px] text-center text-[16px] "
                    key={index + 2}
                  >
                    {plan.name ? plan.name : ''}
                  </Typography>
                  <View className="h-[0.5px] w-full bg-gray-400" />
                </View>
              )
            })}

            <ControlledDropdown
              className="my-[10px] w-[80%] self-center"
              control={control}
              name={'planIndex'}
              label={''}
              maxHeight={300}
              list={planNames}
              onChangeValue={(data) => {
                if (data) {
                  let selectedIndex = _.find(
                    plansList,
                    (e) => e.plantype === data.title
                  )
                  // console.log('selectedIndex', JSON.stringify(selectedIndex))
                  setSelectedPlanId(selectedIndex.id)
                  setSelectedPlanIndex(Number(data.id))
                }
              }}
            />
            <Button
              className={`my-[10px] w-[40%] self-center ${colorSet[selectedPlanIndex].headingBackground}`}
              title="Buy Now"
              variant="default"
              onPress={() => {
                router.back()
              }}
            />
          </View>
        </View>
      </View>
    )
  }
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <View className="ml-5 mt-[40px] flex-row">
          <Feather
            className="mt-1"
            name={'arrow-left'}
            size={20}
            color={'black'}
            onPress={() => {
              router.back()
            }}
          />
          <Typography className=" ml-[5px] flex-1 text-[18px] font-bold">
            {'Plans'}
          </Typography>
        </View>
        <ScrollView>
          <View>{getPlansView()}</View>
        </ScrollView>
      </View>
    </View>
  )
}