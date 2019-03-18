import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import DVUtils from 'shared/utils';

import { logout } from './actions';

import './style.less';

const getWorkspaces = (workspaces) => {
  return DVUtils.isUserAdmin(window.DV.user)
    ? workspaces
    : workspaces.filter(workspace => !workspace.admin);
};

class Header extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.logout) {
      window.location.href = '/login';
    }
  }

  handleLogout() {
    this.props.dispatch(logout());
  }

  render() {
    return (
      <div className="page-header">
        <img className="logo" src="images/dv_logo.png" alt="Da Vinci" />
        <ul className="workspaces">
          {
            getWorkspaces(this.props.workspaces).map((workspace) => {
              return (
                <li
                  className="workspace"
                  data-selected={ window.location.pathname.indexOf(workspace.href) === 0 }
                >
                  <a href={ workspace.href } title={ DVUtils.capitalizeFirstLetter(workspace.name) }>
                    { DVUtils.capitalizeFirstLetter(workspace.name) }
                  </a>
                </li>
              );
            })
          }
        </ul>
        { !_.isEmpty(window.DV.user.email)
          && <button type="button" className="logout-button" onClick={ this.handleLogout }>Logout</button>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  logout: state.headerReducer.logout,
});

export default connect(mapStateToProps)(Header);
