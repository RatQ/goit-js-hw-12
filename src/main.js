import { fetchImages, PER_PAGE } from "./js/pixabay-api.js";
import { renderPhoto, clearGallery, toggleLoader } from "./js/render-functions.js";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");
let currentQuery = "";
let page = 1;
let totalHits = 0;

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);
function showError(message) {
  iziToast.error({
    title: "Помилка",
    message,
    position: "topRight",
    timeout: 3000,
  });
}

async function onSearch(event) {
  event.preventDefault();
  const query = event.target.elements.searchQuery.value.trim();
  if (!query) {
    showError("Будь ласка, введіть пошуковий запит");
    return;
  }
  currentQuery = query;
  page = 1;
  totalHits = 0;
  clearGallery();
  loadMoreBtn.classList.add("hidden");
  toggleLoader(true);

  try {
    const data = await fetchImages(currentQuery, page);
    if (!data.hits.length) {
      showError("Sorry, there are no images matching your search query.");
      return;
    }
    totalHits = data.totalHits;
    renderPhoto(data.hits);
    if (page * PER_PAGE < totalHits) {
      loadMoreBtn.classList.remove("hidden");
    }
  } catch (error) {
    showError("Помилка: " + error.message);
  } finally {
    toggleLoader(false);
  }
}

async function onLoadMore() {
  page += 1;
  loadMoreBtn.classList.add("hidden");
  toggleLoader(true);
  try {
    const data = await fetchImages(currentQuery, page);
    renderPhoto(data.hits);
    if (page * PER_PAGE < totalHits) {
      loadMoreBtn.classList.remove("hidden");
    } else {
      iziToast.info({
        title: "Info",
        message: "You've reached the end of the results.",
        position: "topRight",
      });
    }
  } catch (error) {
    showError("Помилка: " + error.message);
  } finally {
    toggleLoader(false);
  }
}