import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Item from './Item';

//Create Table Of added Customers List
const HomePage = () => {
  const items = useSelector((state) => state.items.items);
  
  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Customer List</h1>
        <Link to="/add-customer">
          <button className="btn btn-primary">Add Customer</button>
        </Link>
      </div>
  
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Mobile No</th>
              <th>PAN No</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No data available
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.firstName}</td>
                  <td>{item.middleName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.pan}</td>
                  <td>
                    <Item key={index} item={item} index={index} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};

export default HomePage;
