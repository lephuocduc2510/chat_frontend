import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
import 'ionicons/dist/ionicons.js';

// Add this line to declare the custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { name: string };
    }
  }
}

export default function NavList() {
  // Hàm cuộn xuống
  function ScrollDown() {
    const value = window.innerHeight;
    window.scrollTo({ top: value, behavior: "smooth" });
  }

  // Hàm toggle menu
  function onToggleMenu(e: React.MouseEvent<HTMLElement>) {
    const target = e.target as HTMLElement;

    if (target.getAttribute("name") === "grid") {
      target.setAttribute("name", "close");
    } else {
      target.setAttribute("name", "grid");
    }

    const menulinks = document.querySelector(".menulinks") as HTMLElement;
    menulinks.classList.toggle("top-[8%]");
  }

  return (
    <div>
      <div
        id="menulinks"
        className="menulinks duration-500 md:static md:min-h-fit absolute min-h-[28vh] left-[0%] top-[-100%] md:w-auto w-[100%] flex justify-center py-5 fixed"
      >
        <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 text-white font-Roboto font-semibold">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "text-[#FFCC33]" : "")}
            >
              Product
            </NavLink>
          </li>
          <li>
            <NavLink
              to="#"
              onClick={() => {
                ScrollDown();
              }}
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-6">
        <ion-icon
          name="grid"
          className="cursor-pointer md:hidden"
          onClick={onToggleMenu}
        />
      </div>
    </div>
  );
}
