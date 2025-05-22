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
import { GithubIcon } from '@/components/icons/github-icon'

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
  metadataBase: new URL('https://cleanbody.dev'),
  openGraph: {
    title: 'Clean Body',
    description: 'Hazle un commit a tu bienestar con nuestros retos diarios',
    url: 'https://cleanbody.dev',
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
          <header className="flex justify-end items-center p-4 gap-4 lg:px-10">
            <Link href={"/"} className="mr-auto ml-0">
              <img src="/clean-body-1.svg" alt="Logo de Clean Body" width={150} />
            </Link>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <Link href={"/my-challenges"}>Mis retos</Link>
              <UserButton />
            </SignedIn>
          </header>
          <main className='min-h-screen'>
            {children}
          </main>
          <footer className="p-4 flex justify-between items-center lg:px-10">
            <Link
              href={'https://github.com/FelixGonzalo/clean-body'}
              target="_blank"
              className="hover:scale-110 duration-200"
            >
              <GithubIcon />
            </Link>
            <p className="text-sm text-gray-300">
              Built by{' '}
              <Link
                href={'https://github.com/FelixGonzalo'}
                target="_blank"
                className="hover:text-blue-200"
              >
                Felix Castro
              </Link>
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
