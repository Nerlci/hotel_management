import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center dark:text-white">
        <h1 className="text-3xl">Oops!</h1>
        <p className="text-xl">Sorry, an unexpected error has occurred.</p>
        <p className="">
          {/*@ts-expect-error no type here*/}
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
