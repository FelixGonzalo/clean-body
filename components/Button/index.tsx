import { MouseEventHandler } from "react"

export const buttonStyle = "cursor-pointer py-2 px-4 animate-background-shine rounded-lg border border-[#5f6c7f] duration-300 hover:scale-105 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] "

export const Button = ({
  children,
  onClick,
}: {
  children: React.ReactNode,
  onClick: MouseEventHandler<HTMLButtonElement> | undefined
}) => {
  return (
    <button
      className={buttonStyle}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export const confirmButtonStyle = "cursor-pointer py-2 px-4 animate-background-shine rounded-lg border border-[#b04444] text-[#ffc4c4] duration-300 hover:scale-105 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%]"

export const ConfirmButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode,
  onClick: MouseEventHandler<HTMLButtonElement> | undefined
}) => {
  return (
    <button
      className={confirmButtonStyle}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
