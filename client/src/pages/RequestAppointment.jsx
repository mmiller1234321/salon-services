import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { GET_SERVICES } from '../utils/queries';
// When defined, import CREATE_APPOINTMENT query

import Auth from '../utils/auth';
import AppointmentCheckboxInput from '../components/AppointmentCheckboxInput';

const RequestAppointment = () => {
  const [formState, setFormState] = useState({
    user: '',
    services: [],
    apptDate: '',
    requests: '',
  });
  const { loading, data, error } = useQuery(GET_SERVICES);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const manicures = data.services.filter((service) => service.tags.includes('manicure'));
  const pedicures = data.services.filter((service) => service.tags.includes('pedicure'));

  // const [, { error, data }] = useMutation(CREATE_APPOINTMENT);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // console.log(formState);

    // try {
    //   const { data } = await addUser({
    //     variables: { ...formState },
    //   });

    //   Auth.login(data.addUser.token);
    // } catch (e) {
    //   console.error(e);
    // }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Request an Appointment </h4>
          <div className="card-body">
            {Auth.loggedIn() && data ? 
              (
              <form onSubmit={handleFormSubmit}>
              <h2>Services</h2>
              <h3>Manicure</h3>
               {manicures.map((service) => {
                return <AppointmentCheckboxInput
                className="form-input"
                key={service._id}
                _id={service._id}
                name={service.name}
                time={service.time}
                price={service.price}
                value
                onChange={handleChange}/>
              })}
             
              <h3>Pedicure</h3>
               {pedicures.map((service) => {
                return <AppointmentCheckboxInput
                key={service._id}
                _id={service._id}
                name={service.name}
                time={service.time}
                price={service.price}
                onChange={handleChange}/>
              })}
                 <input
                  className="form-input"
                  placeholder="Please detail special requests here!"
                  name="requests"
                  type="text"
                  value={formState.requests}
                  onChange={handleChange}
                />
                <label htmlFor="appt-date">Please select a date and time. Working hours are 9am-5pm CST</label>
                <input
                  className="form-input"
                  name="appt-date"
                  type="datetime-local"
                  min
                  value={formState.date}
                  onChange={handleChange}
                />
               
                <button
                  className="btn btn-block btn-info"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit your appointment request!
                </button>
              </form>
            ) : (
              <p>
                You need to be logged in to request a appointment. Please{' '}
                <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
              </p>
            )

            }

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RequestAppointment;