import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { dark } from '@clerk/themes'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Clean Body',
  description: 'Hazle un commit a tu bienestar con nuestros retos diarios',
  metadataBase: new URL('https://clean-body.dev'),
  openGraph: {
    title: 'Clean Body',
    description: 'Hazle un commit a tu bienestar con nuestros retos diarios',
    url: 'https://clean-body.dev',
    siteName: 'Clean Body',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Imagen principal de Clean Body',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clean Body',
    description: 'Hazle un commit a tu bienestar con nuestros retos diarios',
    // site: '@tucuenta',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <Link href={"/"} className="font-bold mr-auto ml-0">Clean Body</Link>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <Link href={"/my-challenges"}>Mis retos</Link>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
