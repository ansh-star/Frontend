import "./navbar.scss";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="items">
          <div className="item">
            {/* <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            /> */}
          </div>
          <button className="deleteButton" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
