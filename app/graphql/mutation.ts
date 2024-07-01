import { useMutation, gql } from '@apollo/client';

export const CREATE_DREAM = gql`
  mutation CreateDream($title: String!, $content: String!, $date: String!, $emotions: [String!]!, $themes: [String!]!) {
    createDream(title: $title, content: $content, date: $date, emotions: $emotions, themes: $themes) {
      id
      title
      content
      date
      emotions
      themes
    }
  }
`;

export const DELETE_DREAM = gql`
mutation DeleteDream($id: ID!) {
  deleteDream(id: $id)
}
`;


export const SIGNUP = gql`
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

export const LOGIN = gql`
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



