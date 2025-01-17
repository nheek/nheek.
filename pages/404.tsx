import Link from "next/link";

export default function Custom404() {
  return (
    <main
      className={
        "flex flex-col items-center justify-center min-h-screen h-full"
      }
    >
      <h1 className="block text-5xl w-[70%] h-1/2">
        {"Ooops. Can't find what you're looking for. Fancy going back home?"}
      </h1>
      <Link href="/">
        <button className="text-3xl mt-4 px-4 py-2 border-2 border-solid border-gray-200 text-center leading-[normal] rounded-3xl hover:bg-gray-200 hover:text-blue-950 duration-500">
          Home
        </button>
      </Link>
    </main>
  );
}
