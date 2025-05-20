export const Avatar = ({user}: {user: {fullName?: string, imageUrl?: string}}) => (
  <div className="min-h-30 text-center flex flex-col gap-4 justify-center items-center">
    <img src={user?.imageUrl} alt={user?.fullName || ""} className="rounded-full w-20 h-20 object-cover" />
    <h1 className="text-2xl">{user?.fullName || ""}</h1>
  </div>
)