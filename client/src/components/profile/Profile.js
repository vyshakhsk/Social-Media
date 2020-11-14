import React, { useEffect, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById, sendreq } from '../../actions/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import Modal from 'react-bootstrap/Modal';

const Profile = ({
  getProfileById,
  sendreq,
  profile: { profile, loading },
  auth,
  match,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match]);

  const [isOpen, setIsOpen] = useState(false);

  const showModal = () => {
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back to Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Fragment>
                <Link to='/edit-profile' className='btn btn-dark'>
                  Edit Profile
                </Link>
                <>
                  <button className='btn btn-primary' onClick={showModal}>
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
                </>
              </Fragment>
            )}
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id !== profile.user._id &&
            (profile.friendsList.filter((f) => {
              return auth.user._id === f.friendId;
            }).length > 0 ? (
              <Fragment>
                <button className='btn btn-dark my-1'>Friends</button>
                <>
                  <button className='btn btn-primary' onClick={showModal}>
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
                </>
              </Fragment>
            ) : profile.request.filter((f) => {
                return auth.user._id === f.userId;
              }).length > 0 ? (
              <button className='btn btn-dark my-1'>Requested</button>
            ) : (
              <button
                className='btn btn-dark my-1'
                onClick={() => sendreq(match.params.id)}
              >
                Send Request
              </button>
            ))}

          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  sendreq: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById, sendreq })(Profile);
