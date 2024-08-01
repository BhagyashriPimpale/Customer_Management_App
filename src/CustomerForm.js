import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addItem, updateItem } from './actions';

//Create Customer Form
const CustomerForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customers = useSelector((state) => state.items.items);
  const isEdit = id !== undefined;
  const [customer, setCustomer] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    pan: '',
    email: '',
    phone: '',
    addresses: [{ line1: '', line2: '', city: '', state: '', zip: '' }],
  });

  const [errors, setErrors] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    fullName: '',
    pan: '',
    email: '',
    phone: '',
  });

  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [isFetchingPostcode, setIsFetchingPostcode] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const existingCustomer = customers[id];
      if (existingCustomer) {
        setCustomer(existingCustomer);
      }
    }
  }, [id, isEdit, customers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    setErrors({ ...errors, [name]: '' });

    if (name === 'pan' && validatePAN(value)) {
      verifyPan(value);
    }
  };

  //  address change
  const handleAddressChange = (index, fieldName, value) => {
    const newAddresses = [...customer.addresses];
    newAddresses[index] = { ...newAddresses[index], [fieldName]: value };
    setCustomer({ ...customer, addresses: newAddresses });
    if (fieldName === 'zip' && value.length === 6) {
      fetchPostcodeDetails(value, index);
    }
  };

  // address field
  const addAddressField = () => {
    if (customer.addresses.length < 10) {
      setCustomer((prevState) => ({
        ...prevState,
        addresses: [...prevState.addresses, { line1: '', line2: '', city: '', state: '', zip: '' }],
      }));
    }
  };

  // validation of email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // validation of Mobile No
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // validation of PAN No
  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  // check PAN number enter by the user
  const verifyPan = async (pan) => {
    setIsVerifyingPan(true);
    try {
      const response = await fetch('https://lab.pixel6.co/api/verify-pan.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ panNumber: pan }),
      });

      const data = await response.json();

      if (data.status === 'Success' && data.isValid) {
        const [firstName, lastName] = data.fullName.split(' ');
        setCustomer((prevCustomer) => ({
          ...prevCustomer,
          firstName: firstName || '',
          middleName: '',
          lastName: lastName || '',
        }));
        setErrors((prevErrors) => ({ ...prevErrors, pan: '' }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, pan: 'Invalid PAN' }));
      }
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, pan: 'Error verifying PAN' }));
    }
    setIsVerifyingPan(false);
  };

  // check valid postcode then api call for the city and state
  const fetchPostcodeDetails = async (postcode, index) => {
    setIsFetchingPostcode(true);
    try {
      const response = await fetch('https://lab.pixel6.co/api/get-postcode-details.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postcode }),
      });

      const data = await response.json();

      if (data.status === 'Success') {
        const newAddresses = [...customer.addresses];
        newAddresses[index] = {
          ...newAddresses[index],
          city: data.city[0]?.name || '',
          state: data.state[0]?.name || '',
        };
        setCustomer({ ...customer, addresses: newAddresses });
      } else {
        console.log('Postcode details not found');
      }
    } catch (error) {
      console.log('Error fetching postcode details', error);
    }
    setIsFetchingPostcode(false);
  };

  // validation messages
  const handleSubmit = () => {
    const fullName = `${customer.firstName?.trim() || ''} ${customer.middleName?.trim() || ''} ${customer.lastName?.trim() || ''}`.trim();
    let validationErrors = {};
    let isValid = true;

    if (!customer.firstName?.trim()) {
      validationErrors.firstName = 'First Name is required';
      isValid = false;
    }
    if (!customer.lastName?.trim()) {
      validationErrors.lastName = 'Last Name is required';
      isValid = false;
    }
    if (fullName.length > 140) {
      validationErrors.fullName = 'Full Name cannot exceed 140 characters';
      isValid = false;
    }
    if (!customer.email?.trim()) {
      validationErrors.email = 'Email is required';
      isValid = false;
    } else if (customer.email.length > 255) {
      validationErrors.email = 'Email cannot exceed 255 characters';
      isValid = false;
    } else if (!validateEmail(customer.email)) {
      validationErrors.email = 'Invalid email format';
      isValid = false;
    }
    if (!customer.phone.trim()) {
      validationErrors.phone = 'Mobile number is required';
      isValid = false;
    } else if (!validatePhone(customer.phone)) {
      validationErrors.phone = 'Invalid mobile number format';
      isValid = false;
    }

    if (!customer.pan.trim()) {
      validationErrors.pan = 'PAN is required';
      isValid = false;
    } else if (!validatePAN(customer.pan)) {
      validationErrors.pan = 'Invalid PAN format';
      isValid = false;
    } else if (customer.pan.length !== 10) {
      validationErrors.pan = 'PAN must be exactly 10 characters';
      isValid = false;
    }

    setErrors(validationErrors);

    if (isValid) {
      if (isEdit) {
        dispatch(updateItem(parseInt(id), customer));
      } else {
        dispatch(addItem(customer));
      }
      navigate('/');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const formHeight = {
    height: '80vh'
  };

  const formStyle = {
    border: '1px solid black',
    gap: '10px',
    overflowY: 'scroll',
    height: '75vh',
  };


  // customer form page
  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="d-flex" style={formHeight}>
          <div className="m-auto w-75 p-2" style={formStyle}>
            <h1>Customer Details</h1>

            <div className="row p-1">
              <div className="form-group col-4">
                <label>First Name <span style={{ color: 'red' }}>*</span> : </label>
                <input type="text" name="firstName" value={customer.firstName} onChange={handleChange} placeholder="Enter first name" className="form-control" required />
                {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
              </div>
              <div className="form-group col-4">
                <label>Middle Name:</label>
                <input type="text" name="middleName" value={customer.middleName} onChange={handleChange} placeholder="Enter middle name" className="form-control" />
              </div>
              <div className="form-group col-4">
                <label>Last Name <span style={{ color: 'red' }}>*</span> : </label>
                <input type="text" name="lastName" value={customer.lastName} onChange={handleChange} placeholder="Enter last name" className="form-control" required />
                {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
              </div>
            </div>
            {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}

            <div className="row p-1">
              <div className="form-group col-8">
                <label>Email <span style={{ color: 'red' }}>*</span> : </label>
                <input type="text" name="email" value={customer.email} onChange={handleChange} placeholder="Enter email" className="form-control" required />
                {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
              </div>
              <div className="form-group col-4">
                <label>PAN <span style={{ color: 'red' }}>*</span> : </label>
                <input type="text" name="pan" value={customer.pan} onChange={handleChange} placeholder="Enter PAN" className="form-control" required />
                {isVerifyingPan && <p>Verifying PAN...</p>}
                {errors.pan && <p style={{ color: 'red' }}>{errors.pan}</p>}
              </div>
            </div>

            <div className="row p-1">
              <div className="form-group col-8">
              <label>Phone <span style={{ color: 'red' }}>*</span> : </label>
                <input type="text" name="phone" value={customer.phone} onChange={handleChange} placeholder="Enter phone" className="form-control" required />
                {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
              </div>
            </div>

{/* Add address */}
            <div className="p-1">
              <label style={{fontWeight: '600'}}>Addresses:</label>
              {customer.addresses.map((address, index) => (
                <div key={index} className="address-field mb-3">
                  <label>Address {index+1}</label>
                  <div className="row p-1">
                    <div className="form-group col-4 mb-3">
                      <input type="text" name={`line1-${index}`} value={address.line1} onChange={(e) => handleAddressChange(index, 'line1', e.target.value)} placeholder="Enter line 1" className="form-control" />
                    </div>
                    <div className="form-group col-4 mb-3">
                      <input type="text" name={`line2-${index}`} value={address.line2} onChange={(e) => handleAddressChange(index, 'line2', e.target.value)} placeholder="Enter line 2" className="form-control" />
                    </div>
                    <div className="form-group col-4 mb-3">
                      <input type="text" name={`city-${index}`} value={address.city} onChange={(e) => handleAddressChange(index, 'city', e.target.value)} placeholder="Enter city" className="form-control" />
                    </div>
                    <div className="form-group col-4">
                      <input type="text" name={`state-${index}`} value={address.state} onChange={(e) => handleAddressChange(index, 'state', e.target.value)} placeholder="Enter state" className="form-control" />
                    </div>
                    <div className="form-group col-4">
                      <input type="text" name={`zip-${index}`} value={address.zip} onChange={(e) => handleAddressChange(index, 'zip', e.target.value)} placeholder="Enter ZIP" className="form-control" />
                      {isFetchingPostcode && <p>Fetching postcode details...</p>}
                    </div>
                  </div>
                </div>

              ))}
              {customer.addresses.length < 10 && (
                <button type="button" onClick={addAddressField} className="btn btn-secondary">Add Address</button>
              )}
            </div>
{/* Add and Cancel Button */}
            <div className="p-2 d-flex justify-content-center" style={{gap:'10px'}}>
              <button type="button" onClick={handleSubmit} className="btn btn-primary mr-2">{isEdit ? 'Update' : 'Add'}</button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
