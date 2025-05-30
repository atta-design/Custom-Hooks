import React from 'react';
import { useForm } from './useForm';

type MyFormData = {
  name: string;
  email: string;
};

export default function MyForm() {
  const { values, handleChange, handleSubmit, resetForm } = useForm<MyFormData>({
    name: '',
    email: '',
  });

  const onSubmit = (data: MyFormData) => {
    console.log('Form submitted:', data);
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="name"
        value={values.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
