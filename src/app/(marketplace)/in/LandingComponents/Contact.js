"use client"
import { AccountsBaseUrl } from '@/utils/GlobalVariables';
import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(AccountsBaseUrl+'/v1/user/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Thank you for reaching out! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' }); // Clear form fields
      } else {
        toast.error('Oops! Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <section id="contact" className="py-16 bg-gray-100 text-primary px-4">
      <h3 className="text-3xl font-bold text-center mb-8">Contact Us</h3>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto grid grid-cols-1 gap-4">
        <div className="mb-1">
          {/* <label htmlFor="name" className="block text-sm font-medium">Name</label> */}
          <input
            type="text"
            placeholder='Name'
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
        <div className="mb-1">
          {/* <label htmlFor="name" className="block text-sm font-medium">Name</label> */}
          <input
            type="text"
            placeholder='Phone'
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            // required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
        <div className="mb-1">
          {/* <label htmlFor="email" className="block text-sm font-medium">Email</label> */}
          <input
            type="email"
            placeholder='Email'
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
        <div className="mb-1">
          {/* <label htmlFor="message" className="block text-sm font-medium">Message</label> */}
          <textarea
            placeholder='Message'
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md"
            rows="4"
          />
        </div>
        <button disabled={isSubmitting} className="px-6 py-3 bg-primary text-white rounded-lg">{isSubmitting ? 'Sending...' : 'Submit'}</button>
      </form>
    </section>
    </div>
  )
}

export default Contact
