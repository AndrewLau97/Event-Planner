import NavBar from "./NavBar";

const Header = () => {
  return (
    <>
        <header
  class="sticky top-0 flex w-full flex-wrap items-center justify-between bg-zinc-50 py-2 shadow-dark-mild dark:bg-neutral-700 lg:py-4">
  <NavBar/>
</header>
    </>
  );
};

export default Header;
