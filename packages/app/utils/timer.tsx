import { useState, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { Typography } from 'app/ui/typography'

interface TimerProps {
  startDate: string
}

export const Timer = ({ startDate }: TimerProps) => {
  const [expired, setExpired] = useState(false)
  const [days, setDays] = useState(-1)
  const [hours, setHours] = useState(-1)
  const [minutes, setMinutes] = useState(-1)
  const [seconds, setSeconds] = useState(-1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    intervalRef.current = setInterval(timerInit, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function timerInit() {
    const now = new Date()
    if (!startDate) {
      setExpired(true)
      return
    }

    const countDownStartDate = new Date(startDate)
    const distance = countDownStartDate.getTime() - now.getTime()
    const days = Math.floor(distance / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)

    if (distance < 0 || isNaN(distance)) {
      if (intervalRef.current) clearInterval(intervalRef.current)
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
