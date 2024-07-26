import React, { useState, useContext } from 'react';
import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const Booking = ({ tour, avgRating }) => {
   const { price, reviews, title } = tour;
   const navigate = useNavigate();

   const { user } = useContext(AuthContext);

   const [booking, setBooking] = useState({
      userId: user && user._id,
      userEmail: user && user.email,
      tourName: title,
      fullName: '',
      phone: '',
      guestSize: 1,
      bookAt: '',
      gender: 'male',
      usedWebsite: false,
      passportPic: null,
   });

   const [errors, setErrors] = useState({});

   const handleChange = (e) => {
      setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
      setErrors((prev) => ({ ...prev, [e.target.id]: '' }));
   };

   const handleCheckboxChange = (e) => {
      setBooking((prev) => ({ ...prev, [e.target.id]: e.target.checked }));
   };

   const validateForm = () => {
      const newErrors = {};

      // Validate Full Name
      if (!booking.fullName.trim()) {
         newErrors.fullName = 'Full Name is required';
      }

      // Validate Phone
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(booking.phone.trim())) {
         newErrors.phone = 'Please enter a valid 10-digit phone number';
      }

      // Validate Date
      if (!booking.bookAt.trim()) {
         newErrors.bookAt = 'Date is required';
      }

      // Validate Guest Size
      if (!booking.guestSize || isNaN(booking.guestSize) || booking.guestSize < 1) {
         newErrors.guestSize = 'Please enter a valid guest size';
      }

      // Validate Gender
      if (!booking.gender) {
         newErrors.gender = 'Gender is required';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const serviceFee = 1200;
   const totalAmount = Number(price) * Number(booking.guestSize) + Number(serviceFee);

   const handleClick = async (e) => {
      e.preventDefault();

      if (!validateForm()) {
         return;
      }

      try {
         if (!user || user === undefined || user === null) {
            setErrors({ authentication: 'Please sign in' });
            return;
         }

         const formData = new FormData();
         for (const key in booking) {
            formData.append(key, booking[key]);
         }

         const res = await fetch(`${BASE_URL}/booking`, {
            method: 'post',
            credentials: 'include',
            body: formData,
         });

         const result = await res.json();

         if (!res.ok) {
            setErrors({ api: result.message });
            return;
         }
         navigate('/thank-you');
      } catch (error) {
         setErrors({ api: error.message });
      }
   };

   return (
      <div className='booking'>
         <div className="booking__top d-flex align-items-center justify-content-between">
            <h3>₹{price} <span>/per person</span></h3>
            <span className="tour__rating d-flex align-items-center">
               <i className='ri-star-fill' style={{ 'color': 'var(--secondary-color)' }}></i>
               {avgRating === 0 ? null : avgRating} ({reviews?.length})
            </span>
         </div>

         <div className="booking__form">
            <h5>Information</h5>
            <Form className='booking__info-form' onSubmit={handleClick}>
               <FormGroup>
                  <input
                     type="text"
                     placeholder='Full Name'
                     id='fullName'
                     required
                     className={errors.fullName ? 'error' : ''}
                     onChange={handleChange}
                  />
                  {errors.fullName && <div className="error">{errors.fullName}</div>}
               </FormGroup>
               <FormGroup>
                  <input
                     type="tel"
                     placeholder='Phone'
                     id='phone'
                     required
                     className={errors.phone ? 'error' : ''}
                     onChange={handleChange}
                  />
                  {errors.phone && <div className="error">{errors.phone}</div>}
               </FormGroup>
               <FormGroup className='d-flex align-items-center gap-3'>
                  <input
                     type="date"
                     placeholder=''
                     id='bookAt'
                     required
                     className={errors.bookAt ? 'error' : ''}
                     onChange={handleChange}
                  />
                  {errors.bookAt && <div className="error">{errors.bookAt}</div>}
                  <input
                     type="number"
                     placeholder='Guest'
                     id='guestSize'
                     required
                     className={errors.guestSize ? 'error' : ''}
                     onChange={handleChange}
                  />
                  {errors.guestSize && <div className="error">{errors.guestSize}</div>}
               </FormGroup>

               <FormGroup>
                  <label>Gender</label>
                  <div className='d-flex gap-3 align-items-center'>
                     <div className='d-flex align-items-center'>
                        <input
                           type='radio'
                           id='male'
                           name='gender'
                           value='male'
                           checked={booking.gender === 'male'}
                           onChange={handleChange}
                        />
                        <label htmlFor='male'>Male</label>
                     </div>
                     <div className='d-flex align-items-center'>
                        <input
                           type='radio'
                           id='female'
                           name='gender'
                           value='female'
                           checked={booking.gender === 'female'}
                           onChange={handleChange}
                        />
                        <label htmlFor='female'>Female</label>
                     </div>
                  </div>
                  {errors.gender && <div className="error">{errors.gender}</div>}
               </FormGroup>

               <FormGroup>
               <label>Have you used this website before?</label>
   <div className='d-flex gap-3 align-items-center'>
      <div className='d-flex align-items-center'>
         <input
            type='checkbox'
            id='usedWebsiteYes'
            checked={booking.usedWebsite === true}
            onChange={() => setBooking(prev => ({ ...prev, usedWebsite: true }))}
         />
         <label htmlFor='usedWebsiteYes'>Yes</label>
      </div>
      <div className='d-flex align-items-center'>
         <input
            type='checkbox'
            id='usedWebsiteNo'
            checked={booking.usedWebsite === false}
            onChange={() => setBooking(prev => ({ ...prev, usedWebsite: false }))}
         />
         <label htmlFor='usedWebsiteNo'>No</label>
      </div>
      <div className='d-flex align-items-center'>
         <input
            type='checkbox'
            id='usedWebsiteOther'
            checked={booking.usedWebsite === 'other'}
            onChange={() => setBooking(prev => ({ ...prev, usedWebsite: 'other' }))}
         />
         <label htmlFor='usedWebsiteOther'>Other</label>
      </div>
   </div>
               </FormGroup>

               <FormGroup>
                  <label>Passport Picture</label>
                  <input
                     type='file'
                     id='passportPic'
                     onChange={(e) => setBooking((prev) => ({ ...prev, passportPic: e.target.files[0] }))}
                  />
               </FormGroup>
            </Form>
         </div>

         <div className="booking__bottom">
            <ListGroup>
               <ListGroupItem className='border-0 px-0'>
                  <h5 className='d-flex align-items-center gap-1'>₹{price} <i className='ri-close-line'></i> 1 person</h5>
                  <span>₹{price}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0'>
                  <h5>Service charge</h5>
                  <span>₹{serviceFee}</span>
               </ListGroupItem>
               <ListGroupItem className='border-0 px-0 total'>
                  <h5>Total</h5>
                  <span>₹{totalAmount}</span>
               </ListGroupItem>
            </ListGroup>

            <Button className='btn primary__btn w-100 mt-4' onClick={handleClick}>Book Now</Button>

            {errors.authentication && <div className="error">{errors.authentication}</div>}
            {errors.api && <div className="error">{errors.api}</div>}
         </div>
      </div>
   );
};

export default Booking;
