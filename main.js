document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menu');
  const menuToggle = document.getElementById('menuToggle');
  const contentArea = document.getElementById('contentArea');
  const homeBtn = document.getElementById('homeBtn');
  const workBtn = document.querySelector('#workItem .menu-btn');
  // Updated to the Vimeo URL you provided
  const initialVideoURL = "https://player.vimeo.com/video/1150973406?background=1&autoplay=1&loop=1&muted=1";
  const headerWorkMenu = document.getElementById('headerWorkMenu'); 
  const aboutItem = document.getElementById('aboutItem');
  const contactItem = document.getElementById('contactItem');

  function syncButton() {
    const open = !menu.classList.contains('collapsed');
    menuToggle.classList.toggle('active', open);
    if (open) {
      aboutItem.classList.add('open');
      contactItem.classList.add('open');
    } else {
      aboutItem.classList.remove('open');
      contactItem.classList.remove('open');
      document.getElementById('workItem').classList.remove('open');
    }
  }

  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('collapsed');
    syncButton();
  });

  menu.addEventListener('click', (e) => {
    const btn = e.target.closest('.menu-btn');
    if (!btn) return;
    if (btn === workBtn) {
      loadWorkContent('all');
      btn.closest('li').classList.add('open');
      return;
    }
    if (menu.classList.contains('collapsed')) {
      menu.classList.remove('collapsed');
      syncButton();
    }
  });

  // UPDATED: Uses iframe for Vimeo instead of <video> tag
  function loadHomeContent() {
    contentArea.innerHTML = `
      <div class="align-wrapper">
        <div class="video-wrapper">
           <iframe 
            src="${initialVideoURL}" 
            frameborder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowfullscreen
            style="position:absolute; top:0; left:0; width:100%; height:100%;"
          ></iframe>
        </div>
      </div>`;
    headerWorkMenu.classList.remove('is-active');
  }

  // UPDATED: Handles both Images and Videos in the gallery grid
  function loadWorkContent(filter = 'all') {
    const filteredImages = getFilteredImages(filter);

    const imagesHTML = filteredImages.map(img => {
      const isVideo = img.src.includes("player.vimeo.com");
      
      if (isVideo) {
        // Render a placeholder block for videos (Black box with "VIDEO" text)
        return `
          <div class="video-thumb" data-src="${img.src}" style="background:#000; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; cursor:pointer; margin-bottom:5px; position:relative;">
             <span style="color:white; font-family:'Open Sans', sans-serif; font-size:12px; letter-spacing:1px;">VIDEO</span>
          </div>
        `;
      } else {
        // Render standard image
        return `<img src="${img.src}" alt="${img.alt}">`;
      }
    }).join('');

    const workHTML = `
      <html><head><style>
        body { margin: 0; padding: 20px 20px 10px 0; background: white; font-family: 'Open Sans', sans-serif; }
        .work-gallery { column-count: 3; column-gap: 5px; }
        .work-gallery img, .work-gallery .video-thumb { 
          width: 100%; 
          margin-bottom: 5px; 
          display: block; 
          cursor: pointer; 
          break-inside: avoid; 
        }
        @media (max-width: 1024px) { .work-gallery { column-count: 2; } }
        @media (max-width: 768px) { .work-gallery { column-count: 1; } }
      </style></head>
      <body>
        <div class="work-gallery">${imagesHTML}</div>
        <script>
          // Listen for clicks on Images AND Video Thumbnails
          document.body.addEventListener('click', function(e) {
             const target = e.target.closest('img, .video-thumb');
             if (!target) return;
             
             // Get src from img tag OR data-src from div
             const src = target.tagName === 'IMG' ? target.src : target.dataset.src;
             
             window.parent.postMessage({
               type: 'openLightbox',
               src: src
             }, '*');
          });
        <\/script>
      </body></html>`;

    const workDataURL = "data:text/html;charset=utf-8," + encodeURIComponent(workHTML);
    contentArea.innerHTML = `<div class="align-wrapper"><div class="work-iframe-wrapper"><iframe src="${workDataURL}"></iframe></div></div>`;
    headerWorkMenu.classList.add('is-active');
  }

  homeBtn.onclick = loadHomeContent;
  document.getElementById('logoLink').onclick = (e) => { e.preventDefault(); loadHomeContent(); };
  workBtn.onclick = () => loadWorkContent('all');

  document.querySelectorAll('.submenu-btn').forEach(btn => {
    btn.onclick = () => loadWorkContent(btn.dataset.filter);
  });

  loadHomeContent();
});
