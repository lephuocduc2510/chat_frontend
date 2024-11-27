import React, { useState } from 'react';
import './style.css';
import {
  MDBContainer,
  MDBNavbar,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBRow,
  MDBCol,
  MDBBadge,
  MDBCollapse,
  MDBListGroup,
  MDBListGroupItem,
} from 'mdb-react-ui-kit';

export default function Admin2() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [collapseOpened, setCollapseOpened] = useState('accordionCollapse1');

  const toggleAccordion = (value: string) => {
    value !== collapseOpened ? setCollapseOpened(value) : setCollapseOpened('');
  };

  return (
    <MDBContainer fluid>
    <MDBRow className="justify-content-center">
      <MDBCol md="12">
        <header style={{ position: 'relative', overflow: 'hidden', minHeight: '600px' }}>
          {/* Side nav */}
          <div className={`side-nav ${isSideNavOpen ? 'open' : 'closed'}`}>
            <MDBListGroup>
              <MDBListGroupItem>
                <MDBIcon fas icon="chart-area" className="me-2" />
                Website traffic
              </MDBListGroupItem>
              <MDBListGroupItem>
                <MDBIcon fas icon="chart-pie" className="me-2" />
                Sales
              </MDBListGroupItem>
              <MDBListGroupItem>
                <MDBIcon fas icon="chart-line" className="me-2" />
                Subscriptions
              </MDBListGroupItem>
              <MDBListGroupItem onClick={() => toggleAccordion('accordionCollapse1')}>
                <MDBIcon fas icon="cogs" className="me-2" />
                Settings
                <MDBIcon fas icon="angle-down" className="float-end" />
              </MDBListGroupItem>
              {/* <MDBCollapse show={collapseOpened === 'accordionCollapse1'}>
                <MDBListGroup className="ps-4">
                  <MDBListGroupItem>Profile</MDBListGroupItem>
                  <MDBListGroupItem>Account</MDBListGroupItem>
                </MDBListGroup>
              </MDBCollapse> */}
              <MDBListGroupItem onClick={() => toggleAccordion('accordionCollapse2')}>
                <MDBIcon fas icon="lock" className="me-2" />
                Password
                <MDBIcon fas icon="angle-down" className="float-end" />
              </MDBListGroupItem>
              {/* <MDBCollapse show={collapseOpened === 'accordionCollapse2'}>
                <MDBListGroup className="ps-4">
                  <MDBListGroupItem>Request password</MDBListGroupItem>
                  <MDBListGroupItem>Reset password</MDBListGroupItem>
                </MDBListGroup>
              </MDBCollapse> */}
            </MDBListGroup>
          </div>
  
          {/* Navbar */}
          <MDBNavbar expand="lg" light bgColor="light">
            <MDBContainer fluid>
              <MDBBtn
                onClick={() => setIsSideNavOpen(!isSideNavOpen)}
                color="none"
                className="btn shadow-0 p-0 me-3"
              >
                <MDBIcon icon="bars" size="lg" />
              </MDBBtn>
              <form className="d-none d-md-flex input-group w-auto my-auto">
                <input
                  autoComplete="off"
                  type="search"
                  className="form-control rounded"
                  placeholder="Search (ctrl + '/' to focus)"
                  style={{ minWidth: '225px' }}
                />
                <span className="input-group-text border-0">
                  <i className="fas fa-search"></i>
                </span>
              </form>
            </MDBContainer>
          </MDBNavbar>
  
          {/* Main content */}
          <MDBContainer className="pt-4 pt-lg-5">
            <h1>Dashboard</h1>
          </MDBContainer>
        </header>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
  );
}
