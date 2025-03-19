import LoginButton from "./LoginButton";

function LoginContainer({page}: Readonly<{page: string}>) {
  return (
    <div className="bg-zinc-900 p-2 sm:pl-32 h-screen rounded-r-xl overflow-y-scroll no-scrollbar w-full flex justify-center items-center flex-col">
      <h1 className="text-4xl text-center py-5">Login to access {page}!</h1>
      <div className="relative flex justify-center">
        <LoginButton />
      </div>
    </div>
  );
}

export default LoginContainer;