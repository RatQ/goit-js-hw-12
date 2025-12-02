import axios from "axios";

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "53387136-aec480b6b069bc63c101bbeda";

export const PER_PAGE = 15;

export async function fetchImages(query, page = 1) {
  const cleanedQuery = query.trim();

  if (!cleanedQuery) {
    throw new Error("Empty search query");
  }

  try {
    const { data } = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: cleanedQuery,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: PER_PAGE,
        page,
      },
    });

    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `API error: ${error.response.status} ${error.response.statusText}`
      );
    }
    if (error.request) {
      throw new Error("Network error: no response from server");
    }
    throw new Error(error.message);
  }
}