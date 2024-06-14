import React from 'react';
import './CommonTable.css';

const CommonTable = props => {
  const { headersName, children } = props;

  return (
    <table className="common-table">
      <thead>
        <tr>
          {
            headersName.map((item, index) => (
              <th className="common-table-header-column" key={index}>{item}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
  )
}

export default CommonTable;
