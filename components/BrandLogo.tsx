import Image from "next/image";

function BrandLogo() {
  return (
    <h1 className="text-2xl mx-4 pl-2 py-4 flex gap-6 items-center">
      <Image src="/logo.png" alt="Logo" width={35} height={35} />
      <p className="pl-1">CoolThings</p>
    </h1>
  );
}

export default BrandLogo;