import React, { useEffect, Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import {
  getCurrentProfile,
  deleteAccount,
  uploadStory,
} from '../../actions/profile';
import Spinner from '../layout/Spinner';
import Friendreq from './Friendreq';
import Friends from './Friends';
import Modal from 'react-bootstrap/Modal';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
  deleteAccount,
  uploadStory,
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  const [formData, setFormData] = useState({
    file: null,
  });

  const { file } = formData;
  const onFChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    uploadStory({ file });
  };

  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h2 className='large text-primary'>Dashboard</h2>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome {user && user.name}{' '}
      </p>
      {profile !== null ? (
        <Fragment>
          <div className='p-2'>
            <form className='form' onSubmit={(e) => onSubmit(e)}>
              <input
                type='file'
                name='file'
                id='file1'
                onChange={(e) => {
                  onFChange(e);
                }}
              />

              <input
                type='submit'
                className='btn btn-primary'
                value='Upload Story'
              />
            </form>
          </div>
          <div className='p-2'>
            <DashboardActions />
          </div>

          <div className='p-2'>
            <button className='btn btn-primary p-2' onClick={showModal}>
              View Story
            </button>
            <Modal show={isOpen} onHide={hideModal} size='xl'>
              <Modal.Body>
                <img
                  src={'/api/profile/image/' + profile.story}
                  alt=''
                  width='100%'
                />
              </Modal.Body>
            </Modal>
          </div>
          <Friendreq request={profile.request} />
          <Friends friendsList={profile.friendsList} />

          <div className='my-2'>
            <button className='btn btn-danger' onClick={() => deleteAccount()}>
              <i className='fas fa-user-minus'></i>
              Delete Account
            </button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <p>No Profile Found</p>
          <Link to='/create-profile' className='btn btn-primary my-1'>
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteAccount,
  uploadStory,
})(Dashboard);
