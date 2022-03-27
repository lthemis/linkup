import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { InputTextField, InputTextArea } from '../../../components/Form/InputTextField/InputTextField';
import InputPhoto from '../../../components/Form/InputPhoto/InputPhoto';
import HeaderReturn from '../../../components/HeaderReturn/HeaderReturn';
import './SignUp.css';
import { User } from '../../../utilities/types/User';
import ButtonLarge from '../../../components/Form/ButtonLarge/ButtonLarge';
import authApi from '../../../utilities/api/auth.api';

function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      profile_picture: 'none',
      bio: '',
    },
  });

  const onSubmit = async (formData: User) => {
    const response = await authApi.register(formData);
    if (response.ok === false) {
      if (response.status === 400) setErrorMessage('Wrong e-mail or password');
      if (response.status === 404) setErrorMessage('404 not found');
      if (response.status === 409) setErrorMessage('E-Mail already taken');
      if (response.status === 500) setErrorMessage('500 server error');
      if (response.status === 503) setErrorMessage('503 service unavailable');
    } else if (response.data) {
      navigate('/login');
    }
  };

  return (
    <div>
      <HeaderReturn
        text="Signup with E-mail"
      />
      <div className="su__container">
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputPhoto />
          <InputTextField
            type="text"
            label="First Name"
            errorMessage={errors.first_name?.message}
            {...register('first_name', {
              required: 'This field is required',
              onChange: () => {
                setErrorMessage('');
              },
            })}
          />
          <InputTextField
            type="text"
            label="Last Name"
            errorMessage={errors.last_name?.message}
            {...register('last_name', {
              required: 'This field is required',
              onChange: () => {
                setErrorMessage('');
              },
            })}
          />

          <InputTextArea
            type="text"
            label="Bio"
            errorMessage={errors.bio?.message}
            rows={3}
            {...register('bio', {
              required: 'This field is required',
              onChange: () => {
                setErrorMessage('');
              },
            })}
          />

          <InputTextField
            type="text"
            label="Email"
            errorMessage={errors.email?.message}
            {...register('email', {
              required: 'This field is required',
              pattern: {
                value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Please enter valid E-mail',
              },
              onChange: () => {
                setErrorMessage('');
              },
            })}
          />

          <InputTextField
            type="password"
            label="Password"
            errorMessage={errors.password?.message}
            {...register('password', {
              required: 'This field is required',
              minLength: {
                value: 8,
                message: 'Minimun length 8 characters',
              },
              onChange: () => {
                setErrorMessage('');
              },
            })}
          />
          <ButtonLarge
            type="submit"
            value="Sign up"
            style="fill"
          />
          {(errorMessage !== '')
          && <text>{errorMessage}</text>}
        </form>
      </div>
    </div>
  );
}

export default SignUp;
