import { Outlet, createRootRoute, useRouter } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => {
    const router = useRouter()
    return (
      <div className="max-w-4xl mx-auto p-4 ">
        <nav className="mb-6 flex gap-4">
          {/* <Link to="/posts" className="[&.active]:font-bold text-white bg-cyan-600 hover:bg-emerald-300 p-2"> */}

          <button
            onClick={() => router.navigate({ to: '/posts' })}
            className="mx-2 my-2 px-4 py-2 bg-cyan-600 text-white  rounded hover:bg-green-200 "
          >
            See All Post
          </button>

          {/* </Link> */}
        </nav>

        <Outlet />
      </div>
    )
  },
})
