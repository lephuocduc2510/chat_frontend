import React from 'react';
import './style.css';
import avatar from '../../../image/admin/profile_1.webp'

const AccountSettings: React.FC = () => {
  return (
    <div className="container " style={{marginTop: 100, backgroundColor: '#4e657a'}}>
      <div className="row tm-content-row">
        <div className="col-12 tm-block-col">
          <div className="tm-bg-primary-dark tm-block tm-block-h-auto">
            <h2 className="tm-block-title" style={{textAlign: 'left'}}>List of Accounts</h2>
            <p className="text-white" style={{textAlign: 'left'}}>Accounts</p>
            <select className="custom-select">
              <option value="0">Select account</option>
              <option value="1">Admin</option>
              <option value="2">Editor</option>
              <option value="3">Merchant</option>
              <option value="4">Customer</option>
            </select>
          </div>
        </div>
      </div>

      <div className="row tm-content-row">
        <div className="tm-block-col tm-col-avatar">
          <div className="tm-bg-primary-dark tm-block tm-block-avatar">
            <h2 className="tm-block-title">Change Avatar</h2>
            <div className="tm-avatar-container">
              <img
                src={avatar}
                alt="Avatar"
                className="tm-avatar img-fluid mb-4"
              />
              <a href="#" className="tm-avatar-delete-link">
                <i className="far fa-trash-alt tm-product-delete-icon"></i>
              </a>
            </div>
            <button className="btn btn-primary btn-block text-uppercase">
              Upload New Photo
            </button>
          </div>
        </div>

        <div className="tm-block-col tm-col-account-settings">
          <div className="tm-bg-primary-dark tm-block tm-block-settings">
            <h2 className="tm-block-title">Account Settings</h2>
            <form action="" className="tm-signup-form row">
              <div className="form-group col-lg-6">
                <label htmlFor="name">Account Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder='Your Name'
                  className="form-control validate"
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="email">Account Email</label>
                <input
                  id="email"
                  placeholder='Your Email'
                  name="email"
                  type="email"
                  className="form-control validate"
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  placeholder='Your Password'
                  name="password"
                  type="password"
                  className="form-control validate"
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="password2">Re-enter Password</label>
                <input
                  id="password2"
                  placeholder='Re-enter Password'
                  name="password2"
                  type="password"
                  className="form-control validate"
                />
              </div>
              <div className="form-group col-lg-6">
                <label htmlFor="phone">Phone</label>
                <input
                  id="phone"
                  placeholder='Your Phone'
                  name="phone"
                  type="tel"
                  className="form-control validate"
                />
              </div>
              <div className="form-group col-lg-6">
                <label className="tm-hide-sm">&nbsp;</label>
                <button
                  type="submit"
                  className="btn btn-primary btn-block text-uppercase"
                >
                  Update Your Profile
                </button>
              </div>
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-primary btn-block text-uppercase"
                >
                  Delete Your Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
