import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SIGNUP, LOGIN } from './graphql/mutation';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export const signup = async (username: string, email: string, password: string) => {
  const { data } = await client.mutate({
    mutation: SIGNUP,
    variables: { username, email, password },
  });

  return data.signup;
};

export const login = async (email: string, password: string) => {
  const { data } = await client.mutate({
    mutation: LOGIN,
    variables: { email, password },
  });

  return data.login;
};

