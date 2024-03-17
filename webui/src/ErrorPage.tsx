import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="bg-white dark:bg-black h-screen flex items-center justify-center">
      <div className="dark:text-white flex flex-col items-center">
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
