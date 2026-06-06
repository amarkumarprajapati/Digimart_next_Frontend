 
import { Link } from "next/navigation";

export default function ErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-16">
      <img
        src="https://source.unsplash.com/collection/190727/700x400"
        alt="Lost in space"
        className="mb-10 w-full max-w-xl rounded-2xl shadow-lg"
      />

      <h1 className="text-6xl font-extrabold tracking-tight text-gray-800">
        404
      </h1>

      <p className="mt-4 text-center text-lg text-gray-600">
        Uh-oh… we couldn’t find that page.
      </p>

      <img
        src="https://source.unsplash.com/collection/190727/200x150"
        alt="Astronaut floating"
        className="mt-8 rounded-lg shadow-md"
      />

      <Link
        to="/"
        className="mt-10 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Go back home
      </Link>
    </main>
  );
}
