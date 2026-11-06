import Logo from "./Logo";

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8">
        <a href="/">
          <div className="flex items-center gap-3">
            <Logo className="gap-3" />
          </div>
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-5">
          {[
            { name: "Accueil", href: "/" },
            { name: "Stage", href: "/postuler" },
            { name: "À propos", href: "/#about" },
            { name: "Bureau", href: "/#team" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* <Separator /> */}

      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          {`©${new Date().getFullYear()}`}{" "}
          <a href="/" className="hover:underline">
            ASEEST/D
          </a>
          , Made with ❤️ for Marday235 .
        </p>
      </div>
    </footer>
  );
};

export default Footer;
