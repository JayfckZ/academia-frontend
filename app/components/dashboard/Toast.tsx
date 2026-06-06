'use client'

import { useEffect, useState } from 'react'
import { Snackbar, Alert, LinearProgress, Box } from '@mui/material'

interface ToastProps {
  open: boolean
  message: string
  severity: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
  duration?: number
}

export default function Toast({
  open,
  message,
  severity,
  onClose,
  duration = 4000
}: ToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!open) return

    const resetTimer = setTimeout(() => setProgress(100), 0)

    const step = 50
    const decrement = (step / duration) * 100

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - decrement
        if (next <= 0) {
          clearInterval(interval)
          return 0
        }
        return next
      })
    }, step)

    return () => {
      clearTimeout(resetTimer)
      clearInterval(interval)
    }
  }, [open, duration])

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Box
        sx={{
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1
        }}
      >
        <Alert
          onClose={onClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
        <LinearProgress
          variant="determinate"
          value={progress}
          color="inherit"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            opacity: 0.5,
            bgcolor: 'transparent'
          }}
        />
      </Box>
    </Snackbar>
  )
}
