import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";

const Header = () => {
  const navigate=useNavigate()
  function clickLogo(){
    navigate("/")
  }

  return (
    <>
        <header
  className="sticky flex items-center top-0 w-full justify-between bg-beige  shadow-sm shadow-dark-mild z-1">
    <h1 className="text-charcoal font-logo text-3xl ml-5 flex flex-row hover:cursor-pointer" onClick={clickLogo}>Quest Together</h1>
  <NavBar/>
</header>
    </>
  );
};

export default Header;
