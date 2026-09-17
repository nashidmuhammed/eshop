export const baseUrl = 'http://127.0.0.1:8000';
export const AccountsBaseUrl = 'http://127.0.0.1:8000/accounts';
export const EshopBaseUrlV1 = 'http://127.0.0.1:8000/e_shop/v1';
export const FlashBaseUrl = 'http://127.0.0.1:8000/flash_notes';
export const DotzBaseUrl = 'http://127.0.0.1:8000/dotz';
export const DotzBaseUrlV1 = 'http://127.0.0.1:8000/dotz/v1';

// PRODUCTION (Uncomment when deploying)
// export const baseUrl = 'https://api.nfour.jesyfoods.com'
// export const AccountsBaseUrl = 'https://api.nfour.jesyfoods.com/accounts'
// export const EshopBaseUrlV1 = 'https://api.nfour.jesyfoods.com/e_shop/v1'
// export const FlashBaseUrl = 'https://api.nfour.jesyfoods.com/flash_notes'
// export const DotzBaseUrl = 'https://api.nfour.jesyfoods.com/dotz'
// export const DotzBaseUrlV1 = 'https://api.nfour.jesyfoods.com/dotz/v1'

// Centralized API Endpoint Builders for Dotz & Product Module
export const API_ENDPOINTS = {
  // Main settings & code generation
  settings: (orgId, moduleCode = 'PRD') => `${DotzBaseUrlV1}/main/settings/${orgId}/${moduleCode}`,
  generateCode: (orgId, moduleCode = 'PRD') => `${DotzBaseUrlV1}/main/generate-code/${orgId}/${moduleCode}`,

  // Base Product CRUD
  products: (orgId, productId = '') => `${DotzBaseUrlV1}/product/products/${orgId}${productId ? `/${productId}` : ''}`,
  productCode: (orgId) => `${DotzBaseUrlV1}/product/product-code/${orgId}`,

  // Catalog master tables
  categories: (orgId) => `${DotzBaseUrlV1}/product/categories/${orgId}/category/`,
  brands: (orgId) => `${DotzBaseUrlV1}/product/brands/${orgId}/brand/`,
  units: (orgId) => `${DotzBaseUrlV1}/product/units/${orgId}/unit/`,
  taxes: (orgId) => `${DotzBaseUrlV1}/product/taxes/${orgId}/tax/`,

  productDetails: () => `${EshopBaseUrlV1}/admin/catalog/product-details/`,
  // Catalog & Variant Management (E-Shop Admin)
  attributesList: () => `${EshopBaseUrlV1}/admin/catalog/attributes/`,
  attributeCreate: () => `${EshopBaseUrlV1}/admin/catalog/attributes/create/`,
  attributeUpdate: () => `${EshopBaseUrlV1}/admin/catalog/attributes/update/`,
  attributeDelete: () => `${EshopBaseUrlV1}/admin/catalog/attributes/delete/`,
  attributeValuesCreate: () => `${EshopBaseUrlV1}/admin/catalog/attributes/values/create/`,
  attributeValuesUpdate: () => `${EshopBaseUrlV1}/admin/catalog/attributes/values/update/`,
  attributeValuesDelete: () => `${EshopBaseUrlV1}/admin/catalog/attributes/values/delete/`,
  variantsList: () => `${EshopBaseUrlV1}/admin/catalog/variants/`,
  variantCreate: () => `${EshopBaseUrlV1}/admin/catalog/variants/create/`,
  variantUpdate: () => `${EshopBaseUrlV1}/admin/catalog/variants/update/`,
  variantImageUpload: () => `${EshopBaseUrlV1}/admin/catalog/variants/images/upload/`,
};