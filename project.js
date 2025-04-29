const imagecontainer=document.querySelectorAll(".image-container a");
previewBox=document.querySelector(".preview-box");
previewImg=previewBox.querySelector("img");
closeicon=document.querySelector(".icon")


window.onload=()=>{
    for(let i=0; i<imagecontainer.length; i++){
        let newIndex = i
        imagecontainer[i].onclick = ()=>{
            console.log(i);
            previewBox.classList.add("show");
            function preview(){
                   let selectedImgurl= imagecontainer[newIndex].querySelector("img").src
                   previewImg.src=selectedImgurl
                   console.log(selectedImgurl)
            }
            preview();

            const prevbtn=document.querySelector(".prev")
            const nextbtn=document.querySelector(".next")
            prevbtn.onclick = ()=>{
                newIndex--;
                preview()
            }
            nextbtn.onclick= ()=>{
                newIndex++;
                preview()
            }
            closeicon.onclick = ()=>{
                previewBox.classList.remove("show");
            }
        }
    }
}


//icons 


document.querySelectorAll(".saved-icon").forEach((imageselector) => {
    imageselector.style.color = ""; // Initial color

    imageselector.onclick = function() {
        this.style.color = "green"; // Single-click action
        console.log("Single-click detected on:", this);
    };

    imageselector.ondblclick = function() {
        this.style.color = ""; // Double-click action
        console.log("Double-click detected on:", this);
    };
});
document.querySelectorAll(".liked").forEach((imageselector) => {
    imageselector.style.color = ""; // Initial color

    imageselector.onclick = function() {
        this.style.color = "red"; // Single-click action
        console.log("Single-click detected on:", this);
    };

    imageselector.ondblclick = function() {
        this.style.color = ""; // Double-click action
        console.log("Double-click detected on:", this);
    };
});


//icons liked share


const storage = {
    liked: new Set(JSON.parse(localStorage.getItem('likedImages') || '[]')),
    saved: new Set(JSON.parse(localStorage.getItem('savedImages') || '[]')),
    
    // Save to localStorage
    save() {
      localStorage.setItem('likedImages', JSON.stringify([...this.liked]));
      localStorage.setItem('savedImages', JSON.stringify([...this.saved]));
    }
  };
  
  // Initialize the UI state for all images in the gallery
  function initializeGalleryActions() {
    const images = document.querySelectorAll('.image');
    
    images.forEach(imageContainer => {
      const img = imageContainer.querySelector('img');
      const imgSrc = img.src;
      
      // Like button
      const likeBtn = imageContainer.querySelector('.liked');
      if (likeBtn) {
        likeBtn.classList.toggle('active', storage.liked.has(imgSrc));
        
        likeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (storage.liked.has(imgSrc)) {
            storage.liked.delete(imgSrc);
            likeBtn.classList.remove('active');
          } else {
            storage.liked.add(imgSrc);
            likeBtn.classList.add('active');
          }
          storage.save();
          updateProfileGalleries();
        });
      }
      
      // Save button
      const saveBtn = imageContainer.querySelector('.saved-icon');
      if (saveBtn) {
        saveBtn.classList.toggle('active', storage.saved.has(imgSrc));
        
        saveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (storage.saved.has(imgSrc)) {
            storage.saved.delete(imgSrc);
            saveBtn.classList.remove('active');
          } else {
            storage.saved.add(imgSrc);
            saveBtn.classList.add('active');
          }
          storage.save();
          updateProfileGalleries();
        });
      }
      
      // Share button
      const shareBtn = imageContainer.querySelector('.shared');
      if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (navigator.share) {
            navigator.share({
              title: 'Check out this image!',
              url: imgSrc
            });
          } else {
            navigator.clipboard.writeText(imgSrc).then(() => {
              alert('Image URL copied to clipboard!');
            });
          }
        });
      }
      
      // Download button
      const downloadBtn = imageContainer.querySelector('.downloaded');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const link = document.createElement('a');
          link.href = imgSrc;
          link.download = imgSrc.split('/').pop();
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      }
    });
  }
  
  // Function to update both saved and liked galleries in the profile page
  function updateProfileGalleries() {
    const savedTab = document.getElementById('saved');
    const likedTab = document.getElementById('tagged');
    
    if (savedTab) {
      updateGalleryTab(savedTab, storage.saved, 'saved-items');
    }
    
    if (likedTab) {
      updateGalleryTab(likedTab, storage.liked, 'liked-items');
    }
  }
  
  // Function to update a specific gallery tab
  function updateGalleryTab(tabElement, imageSet, containerClass) {
    // Create or get the posts container
    let postsContainer = tabElement.querySelector('.posts-container');
    if (!postsContainer) {
      postsContainer = document.createElement('div');
      postsContainer.className = 'posts-container';
      tabElement.innerHTML = ''; // Clear existing content
      tabElement.appendChild(postsContainer);
    }
    
    // Clear existing images
    postsContainer.innerHTML = '';
    
    // Add images to the container
    imageSet.forEach(imgSrc => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post-image';
      postDiv.innerHTML = `
        <img src="${imgSrc}" alt="Gallery Image">
        <div class="image-actions">
          <button class="remove-btn" data-src="${imgSrc}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      
      // Add remove functionality
      const removeBtn = postDiv.querySelector('.remove-btn');
      removeBtn.addEventListener('click', () => {
        imageSet.delete(imgSrc);
        storage.save();
        updateProfileGalleries();
        // Also update main gallery if we're on that page
        if (document.querySelector('.image-container')) {
          initializeGalleryActions();
        }
      });
      
      postsContainer.appendChild(postDiv);
    });
    
    // Show message if no images
    if (imageSet.size === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'text-center p-4';
      emptyMessage.textContent = `No ${containerClass === 'saved-items' ? 'saved' : 'liked'} images yet`;
      tabElement.appendChild(emptyMessage);
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    initializeGalleryActions();
    updateProfileGalleries();
    
    // Add tab change listener to refresh galleries
    const profileTabs = document.getElementById('profileTabs');
    if (profileTabs) {
      profileTabs.addEventListener('shown.bs.tab', updateProfileGalleries);
    }
  });


//searchbar


  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const images = document.querySelectorAll('.image');
    const noResults = document.querySelector('.no-results');

    function filterImages(searchTerm) {
        let hasResults = false;
        
        images.forEach(image => {
            // Get all classes of the image div
            const classes = Array.from(image.classList);
            // Remove 'image' from the classes to get just the categories
            const categories = classes.filter(cls => cls !== 'image');
            
            // Check if any category matches the search term
            const matches = categories.some(category => 
                category.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (matches || searchTerm === '') {
                image.classList.add('show');
                hasResults = true;
            } else {
                image.classList.remove('show');
            }
        });

        // Show/hide no results message
        noResults.style.display = hasResults ? 'none' : 'block';
    }

    // Search when button is clicked
    searchButton.addEventListener('click', () => {
        filterImages(searchInput.value);
    });

    // Also trigger search when Enter key is pressed
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterImages(searchInput.value);
        }
    });

    // Show all images initially
    filterImages('');
});


  // Check login status when page loads
  document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // User is logged in
        document.querySelector('.user-profile').style.display = 'flex';
        document.getElementById('loginLink').style.display = 'none';
    }
});