import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addreq } from '../../actions/profile';

function Friendreq({ request, addreq }) {
  const requests = request.map((req) => (
    <tr key={req._id}>
      <td>{req.username}</td>
      <td>
        <button onClick={() => addreq(req._id)} className='btn btn-success'>
          Accept
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className='my-2 p-2'>Friend Requests</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th />
          </tr>
        </thead>
        <tbody>{requests}</tbody>
      </table>
    </Fragment>
  );
}

Friendreq.propTypes = {
  request: PropTypes.array.isRequired,
  addreq: PropTypes.func.isRequired,
};

export default connect(null, { addreq })(Friendreq);
