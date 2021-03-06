import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { useForm, ILoginValues } from '../utils/hooks';

interface IOutputs {
  onChange: any;
  onSubmit: any;
  values: ILoginValues;
}

const Login: React.FC = () => {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState<Partial<ILoginValues>>({});

  const { onChange, onSubmit, values }: IOutputs = useForm(() => loginUser(), {
    username: '',
    password: '',
  });
  const history = useHistory();

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      history.push('/');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0]?.extensions?.exception.errors);
    },
    variables: values,
  });

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors?.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors?.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value: any) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
