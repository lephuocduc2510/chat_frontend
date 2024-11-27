import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Header } from "antd/es/layout/layout";
import { faChartBar, faMap, faUser } from '@fortawesome/free-regular-svg-icons';
import { faMoneyBill, faTable } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { faFacebook, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import './style.css';
import { config } from "@fortawesome/fontawesome-svg-core";
import { useEffect, useState } from "react";
import { message } from "antd";
import { MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle, MDBListGroup, MDBListGroupItem, MDBNavbar, MDBNavbarItem } from "mdb-react-ui-kit";



const signOut = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

const HeaderAdmin = () => {
  const [checkLogin, setCheckLogin] = useState(false);
  const token = localStorage.getItem('token');
  const image = localStorage.getItem('image');
  const checkAuthentication = () => {
    //lấy role từ token
    if (token) {
      const role = JSON.parse(atob(token.split('.')[1])).role;
      if (role === 'admin') {
  
      }
      else {
        window.location.href = '/404-page';
      }
    }
  }

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <Header>

      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-white scrolling-navbar ">
        <div className="container-fluid ms-4">
         
          {/* Collapse */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{marginLeft: 254}}>
            {/* Left */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ">
              <li className="nav-item active">
                <Link className="nav-link waves-effect" to="/">
                  Home <span className="visually-hidden">(current)</span>
                </Link>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link waves-effect"
                  href="https://mdbootstrap.com/docs/jquery/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  About MDB
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link waves-effect"
                  href="https://mdbootstrap.com/docs/jquery/getting-started/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Free download
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link waves-effect"
                  href="https://mdbootstrap.com/education/bootstrap/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Free tutorials
                </a>
              </li>
            </ul>

            {/* Right */}
            <ul className="navbar-nav nav-flex-icons ">
              <li className="nav-item ">
                <a
                  href="https://www.facebook.com/mdbootstrap"
                  className="nav-link waves-effect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="https://twitter.com/MDBootstrap"
                  className="nav-link waves-effect"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              </li>
              <li className="nav-item">
              <MDBNavbarItem style={{ cursor: 'pointer' }}>
                    <MDBDropdown>
                      <MDBDropdownToggle tag="a" className="hidden-arrow nav-link d-flex align-items-center">
                        <img
                          src={image? image: "https://mdbootstrap.com/img/new/avatars/2.jpg"}
                          className="rounded-circle"
                          height="22"
                          alt="Avatar"
                          loading="lazy"
                        />
                      </MDBDropdownToggle>
                      <MDBDropdownMenu>
                        <MDBDropdownItem link>My profile</MDBDropdownItem>
                        <MDBDropdownItem link>Settings</MDBDropdownItem>
                        <MDBDropdownItem link onClick={signOut}>Log out</MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarItem>
              </li>
            </ul>
          </div>
        </div>
      </nav>



      <div className="sidebar-fixed position-fixed">
        <a href="#" className="logo-wrapper waves-effect">
          <img
            src="https://mdbootstrap.com/img/logo/mdb-email.png"
            className="img-fluid  mt-3"
            alt="Logo"
          />
        </a>

        <MDBListGroup className="list-group-flush mt-5">
      {/* Dashboard */}
      <MDBListGroupItem active className="waves-effect p-3">
        <FontAwesomeIcon icon={faChartBar} className="me-3" /> Dashboard
      </MDBListGroupItem>

      {/* Profile */}
      <MDBListGroupItem className="list-group-item-action waves-effect">
        <FontAwesomeIcon icon={faUser} className="me-3" /> Profile
      </MDBListGroupItem>

      {/* Managers with Dropdown */}
      <MDBListGroupItem className="list-group-item-action waves-effect" >
      <MDBDropdown>
      <MDBDropdownToggle tag="a" className="d-flex align-items-center px-5" style={{ color: "black" }}>
        <FontAwesomeIcon icon={faTable} className="me-3" /> Managers
      </MDBDropdownToggle>
      <MDBDropdownMenu className="dropdown-menu-end" style={{left: '-100px', inset: '-73px 0px auto ', transform: 'translate3d(200px, 64px, 0px)' }}>
        <MDBDropdownItem link onClick={ ()=> {
          window.location.href = '/users';
        }}>Users</MDBDropdownItem>
        <MDBDropdownItem link onClick={ ()=> {
          window.location.href = '/rooms';
        }}>Rooms</MDBDropdownItem>
        <MDBDropdownItem link>Roles</MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
      </MDBListGroupItem>

      {/* Maps */}
      <MDBListGroupItem className="list-group-item-action waves-effect">
        <FontAwesomeIcon icon={faMap} className="me-3" /> Maps
      </MDBListGroupItem>

      {/* Orders */}
      <MDBListGroupItem className="list-group-item-action waves-effect">
        <FontAwesomeIcon icon={faMoneyBill} className="me-3" /> Orders
      </MDBListGroupItem>
    </MDBListGroup>
      </div>
    </Header>
  );
};


export default HeaderAdmin;