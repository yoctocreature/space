document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImagesContainer = document.querySelector('.lightbox-images-container');

  // RESTORED — needed or JS breaks!
  const lightboxTextInner = document.querySelector('.lightbox-text-inner');

  // Inject Open Sans font
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.textContent = `
    body, button, input, textarea {
      font-family: 'Open Sans', sans-serif !important;
    }
    .lightbox-video {
      width: 90%;
      max-width: 1200px;
      aspect-ratio: 16/9;
      display: block;
      margin: 0 auto;
      border: none;
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('message', function(event) {
    if (event.data.type === 'openLightbox') {
      const clickedSrc = event.data.src;

      // Clear previous content
      lightboxImagesWrapper.innerHTML = "";

      const imgObj = images.find(img => img.src === clickedSrc);

      // Set text
      if (imgObj && imgObj.text) {
        lightboxTextInner.textContent = imgObj.text;
      } else {
        lightboxTextInner.textContent = "";
      }

      // Load group
      let sources = [];
      if (imgObj && imgObj.group && imgObj.group.length > 0) {
        sources = imgObj.group;
      } else {
        return;
      }

      sources.forEach((src, index) => {
        let element;

        const isVideo = src.includes("player.vimeo.com");

        if (isVideo) {
          // Vimeo iframe used INSTEAD of an <img>
          element = document.createElement('iframe');
          element.src = src;
          element.classList.add('lightbox-video');
          element.setAttribute('allow', 'autoplay; fullscreen');
        } else {
          // Image
          element = document.createElement('img');
          element.src = src;
          element.classList.add('lightbox-img');
        }

        lightboxImagesWrapper.appendChild(element);

        // Orientation logic only for images
        if (!isVideo) {
          element.onload = function() {
            if (index === 0) {
              const isLandscape = this.naturalWidth > this.naturalHeight;
              lightboxContainer.classList.remove('landscape', 'portrait');
              lightboxContainer.classList.add(isLandscape ? 'landscape' : 'portrait');
            }
          };
        } else {
          // Videos always treated as landscape
          if (index === 0) {
            lightboxContainer.classList.remove('landscape', 'portrait');
            lightboxContainer.classList.add('landscape');
          }
        }
      });

      lightbox.style.display = 'block';
      lightboxImagesContainer.scrollTop = 0;
    }
  });

  lightboxClose.onclick = () => {
    lightbox.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === lightbox) {
      lightbox.style.display = 'none';
    }
  };
});
