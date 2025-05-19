export const Badge = ({children}: {children?: React.ReactNode}) => (
  <span className="bg-blue-950 text-gray-400 px-2 inline-block rounded-sm text-sm lowercase">
    {children}
  </span>
)