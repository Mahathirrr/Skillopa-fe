import Link from "next/link";
import Image from "next/image";

const Logo = (props) => {
  const { variant } = props;
  const variants = {
    main: {
      width: 180,
      height: 70,
    },
    header: {
      width: 70,
      height: 70,
    },
    "header-md": {
      width: 145,
      height: 35,
    },
    footer: {
      width: 180,
      height: 50,
    },
  };

  return (
    <Link href="/">
      <a className="inline-flex items-center">
        <div
          className="logo-wrapper flex items-center justify-center"
          style={{
            width: `${variants[variant].width}px`,
            height: `${variants[variant].height}px`,
          }}
        >
          <Image
            src="/assets/skillopa.svg"
            alt="skillopa"
            layout="intrinsic"
            width={variants[variant].width}
            height={variants[variant].height}
            objectFit="contain"
            priority
          />
        </div>
      </a>
    </Link>
  );
};

export default Logo;
