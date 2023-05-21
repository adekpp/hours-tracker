import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex flex-col h-16 flex-none items-center justify-center bg-teal-900 md:rounded-md text-white text-xs md:text-sm px-3">
      <p>Created by <Link className="underline font-semibold" href={"https://github.com/adekpp"} target="_blank">Adrian Pietryga</Link></p>
      <p>This project is licensed under the MIT License</p>

    </div>
  );
}
