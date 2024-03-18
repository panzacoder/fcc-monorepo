/** @jsxImportSource react */

export default function AuthenticatedRouteLayout({ children }) {
  return (
    <div className="bg-muted flex h-screen w-screen">
      <div className="grid-rows-layout grid w-full grid-cols-12 flex-col">
        <header className="bg-primary col-span-12 row-span-1 flex items-center justify-between p-4 text-white">
          <h1 className="text-2xl">Family Care Circle</h1>
          <div className="flex items-center space-x-4">
            <a href="/logout">Logout</a>
          </div>
        </header>
        <nav className="bg-secondary col-span-2 flex max-w-xs flex-col gap-4 p-4 text-white">
          <a href="/home">Dashboard</a>
          <a href="/circles">Doctors</a>
          <a href="/planner">Facilities</a>
          <a className="flex basis-full items-end self-end" href="/logout">
            Logout
          </a>
        </nav>
        <main className="col-span-10">{children}</main>
      </div>
    </div>
  )
}
