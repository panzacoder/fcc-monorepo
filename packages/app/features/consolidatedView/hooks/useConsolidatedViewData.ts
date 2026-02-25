'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  useConsolidatedFilterOptions,
  useConsolidatedDetails,
  useFilterConsolidatedDetails
} from 'app/data/dashboard'
import { useAppSelector } from 'app/redux/hooks'

export function useConsolidatedViewData(
  queryFromDate: string,
  queryToDate: string,
  selectedType: string,
  isFilterActive: boolean
) {
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const userDetails = useAppSelector((state) => state.userProfileState.header)

  const memberData = useMemo(
    () => ({
      member: userDetails.memberId ? userDetails.memberId : ''
    }),
    [userDetails.memberId]
  )

  const [typesList, setTypesList] = useState<{ id: number; title: string }[]>(
    []
  )

  const { data: filterOptionsData, isLoading: isFilterOptionsLoading } =
    useConsolidatedFilterOptions(header)

  const { data: detailsData, isLoading: isDetailsLoading } =
    useConsolidatedDetails(header, {
      fromdate: queryFromDate,
      todate: queryToDate
    })

  const { data: filteredDetailsData, isLoading: isFilteredDetailsLoading } =
    useFilterConsolidatedDetails(header, {
      fromdate: queryFromDate,
      todate: queryToDate,
      type: selectedType
    })

  const isLoading =
    isFilterOptionsLoading ||
    (!isFilterActive && isDetailsLoading) ||
    (isFilterActive && isFilteredDetailsLoading)

  useEffect(() => {
    if (filterOptionsData) {
      let list: { id: number; title: string }[] = [{ id: 1, title: 'All' }]
      filterOptionsData.filterOptionTypes.map((data, index) => {
        let object = {
          title: data,
          id: index + 2
        }
        list.push(object)
      })
      setTypesList(list)
    }
  }, [filterOptionsData])

  return {
    header,
    userAddress,
    memberAddress,
    memberData,
    typesList,
    detailsData,
    filteredDetailsData,
    isLoading,
    isFilterActive
  }
}
