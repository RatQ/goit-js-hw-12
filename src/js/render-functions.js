import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = null;

export function renderPhoto(images) {
  const gallery = document.querySelector(".gallery");

  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<li class="gallery-item">
  <a class="gallery-link" href="${largeImageURL}">
    <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
  </a>
  <div class="info">
    <p class="info-item">Likes: <span class="info-span">${likes}</span></p>
    <p class="info-item">Views: <span class="info-span">${views}</span></p>
    <p class="info-item">Comments: <span class="info-span">${comments}</span></p>
    <p class="info-item">Downloads: <span class="info-span">${downloads}</span></p>
  </div>
</li>`
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox(".gallery a", {
      captionsData: "alt",
      captionDelay: 250,
      captionPosition: "bottom",
    });
  } else {
    lightbox.refresh();
  }
}

export function clearGallery() {
  document.querySelector(".gallery").innerHTML = "";
}

export function toggleLoader(isVisible) {
  const loader = document.querySelector(".loader");
  if (!loader) return;
  if (isVisible) {
    loader.classList.remove("hidden");
  } else {
    loader.classList.add("hidden");
  }
}

export function updateLoadMoreBtn(show) {
  const btn = document.querySelector(".load-more");
  if (!btn) return;
  if (show) {
    btn.classList.remove("hidden");
  } else {
    btn.classList.add("hidden");
  }
}

export function isLoadMoreVisible() {
  const btn = document.querySelector(".load-more");
  return btn && !btn.classList.contains("hidden");
}