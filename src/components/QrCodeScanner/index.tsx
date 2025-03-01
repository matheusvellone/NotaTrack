'use client'

import { Box } from '@mantine/core'
import QrScanner from 'qr-scanner'
import { useEffect, useRef } from 'react'

type Props = {
  onScan: (data: string) => void
  onError: () => void
}

const QrCodeScanner = ({
  onScan,
  onError,
}: Props) => {
  const scanner = useRef<QrScanner>(null)
  const videoEl = useRef<HTMLVideoElement>(null)

  const onDecode = ({ data }: QrScanner.ScanResult) => {
    console.log(data)
    onScan(data)
  }

  useEffect(() => {
    console.log('effect', videoEl.current, scanner.current)
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onDecode, {
        onDecodeError: console.log,
        preferredCamera: 'environment',
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
      })

      scanner.current.start()
        .catch((error) => {
          console.error(error)
          onError()
        })
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
