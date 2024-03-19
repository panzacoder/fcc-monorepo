import { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import moment from 'moment'
export const Timer = ({ startDate }) => {
  //   let date = startDate ? startDate : ''
  const [expired, setExpired] = useState(false)
  const [days, setDays] = useState(-1)
  const [hours, setHours] = useState(-1)
  const [minutes, setMinutes] = useState(-1)
  const [seconds, setSeconds] = useState(-1)
  useEffect(() => {
    setInterval(timerInit, 1000)
  }, [])
  function timerInit() {
    const now: any = moment()
    if (!startDate) {
      setExpired(true)
      return
    }

    const countDownStartDate: any = moment(startDate)
    const distance: any = countDownStartDate - now
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    if (distance < 0 || isNaN(parseFloat(distance))) {
      clearInterval(this.countDownId)
      setDays(0)
      setHours(0)
      setMinutes(0)
      setSeconds(0)
      setExpired(true)
      return
    }
    setDays(days)
    setHours(hours)
    setMinutes(minutes)
    setSeconds(seconds)
    setExpired(false)
  }
  return (
    <View>
      <Typography>
        {!expired ? `${days}d ${hours}h ${minutes}m ${seconds}s` : 'Expired'}
      </Typography>
    </View>
  )
}
