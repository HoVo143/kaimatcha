import imageFragment from "./image";
import seoFragment from "./seo";

export const productFragment = /* GraphQl */ `
    fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          sku         
          weight  
          weightUnit
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    collections(first: 10) {
      edges {
        node {
          id
          handle
          title
        }
      }
    }
    metafields(identifiers: [
      {namespace: "custom", key: "ceremonial_type"},
      {namespace: "custom", key: "origin"},
      {namespace: "custom", key: "notes"},
      {namespace: "custom", key: "appellation"}
      {namespace: "custom", key: "capacity"}
      {namespace: "custom", key: "medium"}
      {namespace: "custom", key: "size"}
    ]) {
      id
      key
      value
      type
    }
    }
    ${imageFragment}
    ${seoFragment}
`;