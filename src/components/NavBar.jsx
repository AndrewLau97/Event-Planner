import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <>
      <nav className="w-full">
        <div>
          <ul className="border-1 flex justify-end">
            <li className="pr-5">
              <Link to="/">Homepage</Link>
            </li>
            <li className="pr-5">
              <Link to="/Events">Events</Link>
            </li>
            <li className="pr-5">
              <Link to="/About">About</Link>
            </li>
            <li className="pr-5">
              <Link to="/Contact">Contact</Link>
            </li>
            <li className="pr-5">
              {/* make this dependent on if they are logged in - if they are dashboard, if not sign up/log in */}
              <Link to="/Dashboard">Dashboard</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
