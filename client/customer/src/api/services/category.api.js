import api from "@api/client/interceptors";

import { ENDPOINTS } from "@api/config/endpoints";

export const getAllCategories = async () => {
  const response = await api.get(
    ENDPOINTS.CATEGORY.GET_ALL,
  );

  return response.data;
};

export const getFeaturedCategories =
  async () => {
    const response = await api.get(
      ENDPOINTS.CATEGORY.GET_FEATURED,
    );

    return response.data;
  };

export const getCategoryBySlug = async (
  slug,
) => {
  const response = await api.get(
    ENDPOINTS.CATEGORY.GET_BY_SLUG(slug),
  );

  return response.data;
};