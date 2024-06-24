import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

export const signup = async (username: string, email: string, password: string) => {
  const mutation = gql`
    mutation Signup($username: String!, $email: String!, $password: String!) {
      signup(username: $username, email: $email, password: $password) {
        token
        user {
          id
          username
          email
        }
      }
    }
  `;

  const { data } = await client.mutate({
    mutation,
    variables: { username, email, password },
  });

  return data.signup;
};

export const login = async (email: string, password: string) => {
  const mutation = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          id
          username
          email
        }
      }
    }
  `;

  const { data } = await client.mutate({
    mutation,
    variables: { email, password },
  });

  return data.login;
};