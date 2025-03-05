'use client'

import { Box } from '@mantine/core'
import QrScanner from 'qr-scanner'
import { useEffect, useRef } from 'react'
import { getNotificationErrorHandler } from '~/helpers/notifications'

type Props = {
  onScan: (data: string) => void
}

const QrCodeScanner = ({
  onScan,
}: Props) => {
  const scanner = useRef<QrScanner>(null)
  const videoEl = useRef<HTMLVideoElement>(null)

  const onDecode = ({ data }: QrScanner.ScanResult) => {
    onScan(data)
  }

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onDecode, {
        preferredCamera: 'environment',
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
      })

      scanner.current.start()
        .catch(getNotificationErrorHandler('Erro ao iniciar leitor de QR Code'))
    }

    // return () => {
    //   console.log('cleanup', videoEl.current)
    //   if (!videoEl.current) {
    //     console.log('stop', scanner.current)
    //     scanner.current?.stop()
    //   }
    // }
  }, [])

  return (
    <Box>
      <video
        ref={videoEl}
        style={{
          width: '100%',
        }}
      ></video>
    </Box>
  )
}

export default QrCodeScanner
