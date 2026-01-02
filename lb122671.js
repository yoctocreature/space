document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImagesWrapper = document.querySelector('.lightbox-images');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxContainer = document.querySelector('.lightbox-container');
  const lightboxImagesContainer = document.querySelector('.lightbox-images-container');
  const lightboxTextInner = document.querySelector('.lightbox-text-inner');

  window.addEventListener('message', function(event) {
    if (event.data.type === 'openLightbox') {
      const clickedSrc = event.data.src;
      lightboxImagesWrapper.innerHTML = "";
      
      // Assumes 'images' array is globally available (e.g., from data.js)
      const imgObj = images.find(img => img.src === clickedSrc);

      lightboxTextInner.textContent = (imgObj && imgObj.text) ? imgObj.text : "";

      let sources = (imgObj && imgObj.group && imgObj.group.length > 0) ? imgObj.group : [];

      sources.forEach((src, index) => {
        let element;
        const isVideo = src.includes("player.vimeo.com");

        if (isVideo) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('video-wrapper');

          const loaderUI = document.createElement('div');
          loaderUI.classList.add('pixel-loader-ui');
          
          const label = document.createElement('div');
          label.classList.add('pixel-label');
          label.innerText = "LOADING...";
          
          const barOutline = document.createElement('div');
          barOutline.classList.add('pixel-bar-outline');
          const barFill = document.createElement('div');
          barFill.classList.add('pixel-bar-fill');
          
          barOutline.appendChild(barFill);
          loaderUI.appendChild(label);
          loaderUI.appendChild(barOutline);
          wrapper.appendChild(loaderUI);

          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.setAttribute('allow', 'autoplay; fullscreen');
          iframe.setAttribute('frameborder', '0');
          
          iframe.onload = function() {
            setTimeout(() => {
              iframe.classList.add('loaded');
              loaderUI.style.display = 'none';
            }, 600);
          };
          
          wrapper.appendChild(iframe);
          element = wrapper;
        } else {
          element = document.createElement('img');
          element.src = src;
          element.classList.add('lightbox-img');
        }

        lightboxImagesWrapper.appendChild(element);

        // Landscape/Portrait orientation detection
        if (!isVideo) {
          element.onload = function() {
            if (index === 0) {
              const isLandscape = this.naturalWidth > this.naturalHeight;
              lightboxContainer.classList.remove('landscape', 'portrait');
              lightboxContainer.classList.add(isLandscape ? 'landscape' : 'portrait');
            }
          };
        } else if (index === 0) {
          lightboxContainer.classList.remove('landscape', 'portrait');
          lightboxContainer.classList.add('landscape');
        }
      });

      lightbox.style.display = 'block';
      lightboxImagesContainer.scrollTop = 0;
    }
  });

  lightboxClose.onclick = () => { lightbox.style.display = 'none'; };
  window.onclick = (event) => { if (event.target === lightbox) { lightbox.style.display = 'none'; } };
});
