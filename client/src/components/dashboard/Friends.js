import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Friends({ friendsList }) {
  const friends = friendsList.map((f) => (
    <tr key={f._id}>
      <td>{f.friendName}</td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className='my-2 p-2'>Friends</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>{friends}</tbody>
      </table>
    </Fragment>
  );
}

Friends.propTypes = {
  friendsList: PropTypes.array.isRequired,
};

export default connect(null, {})(Friends);
