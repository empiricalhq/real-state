import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <>
      <Image
        src={"/images/header/dark-logo.svg"}
        alt="logo"
        width={150}
        height={68}
        unoptimized={true}
        className="dark:hidden"
      />
      <Image
        src={"/images/header/logo.svg"}
        alt="logo"
        width={150}
        height={68}
        unoptimized={true}
        className="hidden dark:block"
      />
    </>
  );
};

export default Logo;
