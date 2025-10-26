import seoFragment from "./seo";

export const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    id
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
    image {
      url
      altText
    }
  }
  ${seoFragment}
`;