import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import PostItem from './PostItem';
import PostForm from './PostForm';

const Posts = ({
  getPosts,
  getCurrentProfile,
  post: { posts, loading },
  profile: { profile },
}) => {
  useEffect(() => {
    getPosts();
    getCurrentProfile();
  }, [getPosts, getCurrentProfile]);

  let feed;
  if (profile !== null) {
    const friendL = profile.friendsList;
    feed = posts.filter((post) => {
      return (
        friendL.filter((friends) => {
          return friends.friendId === post.user;
        }).length > 0
      );
    });
  }

  return loading || profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to Feed
      </p>

      <PostForm />
      <div className='posts'>
        {feed.map((post) => (
          <PostItem key={post._id} post={post} />
        ))}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  profile: state.profile,
});

export default connect(mapStateToProps, { getPosts, getCurrentProfile })(Posts);
