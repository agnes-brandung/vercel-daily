import localFont from 'next/font/local'

export const fontPrimary = localFont({
  src: [
    {
      path: './Inter_18pt-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Inter_18pt-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Inter_18pt-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Inter_18pt-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './Inter_18pt-Bold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './Inter_18pt-BoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-primary',
})

export const fontSecondary = localFont({
  src: [
    {
      path: './PermanentMarker-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-secondary',
})