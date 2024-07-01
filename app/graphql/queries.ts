import { gql } from "@apollo/client";

export const GET_USER_DREAMS = gql`
query GetUserDreams($userId: ID!) {
  getUserDreams(userId: $userId) {
    id
    title
    content
    date
    emotions
    themes
  }
}
`;

