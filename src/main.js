import { fetchImages, PER_PAGE } from "./js/pixabay-api.js";
import {
  renderPhoto,
  clearGallery,
  toggleLoader,
  updateLoadMoreBtn,
} from "./js/render-functions.js";
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
  toggleLoader(true);

  try {
    const data = await fetchImages(currentQuery, page);

    if (!data.hits.length) {
      showError("Немає зображень за вашим запитом.");
      updateLoadMoreBtn(false);
      return;
    }

    totalHits = data.totalHits;
    renderPhoto(data.hits);
    const showButton = page * PER_PAGE < totalHits;
    updateLoadMoreBtn(showButton);

    if (!showButton) {
      iziToast.info({
        title: "Info",
        message: "Ви переглянули всі результати.",
        position: "topRight",
      });
    }
  } catch (error) {
    showError("Помилка: " + error.message);
    updateLoadMoreBtn(false);
  } finally {
    toggleLoader(false);
  }
}

async function onLoadMore() {
  page += 1;
  toggleLoader(true);

  try {
    const data = await fetchImages(currentQuery, page);
    renderPhoto(data.hits);
    const showButton = page * PER_PAGE < totalHits;
    updateLoadMoreBtn(showButton);

    if (!showButton) {
      iziToast.info({
        title: "Info",
        message: "Ви переглянули всі результати.",
        position: "topRight",
      });
    }

    const firstCard = document.querySelector(".gallery .gallery-item");
    if (firstCard) {
      const { height: cardHeight } = firstCard.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }
  } catch (error) {
    showError("Помилка: " + error.message);
  } finally {
    toggleLoader(false);
  }
}