document.addEventListener('DOMContentLoaded', function() {
    const settingsOverlay = document.getElementById('settingsOverlay');
    const profileMenu = document.getElementById('profileMenu');
    const fileInput = document.getElementById('fileInput');
    const cameraInput = document.getElementById('cameraInput');
    const removePhoto = document.getElementById('removePhoto');
    const profilePic = document.getElementById('profilePic');
    const defaultImage = 'https://via.placeholder.com/150';

    // Toggle menu
    settingsOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileMenu.contains(e.target) && !settingsOverlay.contains(e.target)) {
            profileMenu.classList.remove('show');
        }
    });

    // Handle file upload
    fileInput.addEventListener('change', handleImageSelect);
    cameraInput.addEventListener('change', handleImageSelect);

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
                // Store in localStorage for persistence
                localStorage.setItem('profileImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
        profileMenu.classList.remove('show');
    }

    // Handle photo removal
    removePhoto.addEventListener('click', () => {
        profilePic.src = defaultImage;
        localStorage.removeItem('profileImage');
        profileMenu.classList.remove('show');
    });

    // Load saved image on page load
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profilePic.src = savedImage;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Keep your existing profile picture related code

    // Profile editing functionality
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editButtons = document.getElementById('editButtons');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    const username = document.getElementById('username');
    const fullName = document.getElementById('fullName');
    const bio = document.getElementById('bio');

    let originalContent = {
        username: username.textContent,
        fullName: fullName.textContent,
        bio: bio.textContent
    };

    // Load saved profile content
    const savedProfile = localStorage.getItem('profileContent');
    if (savedProfile) {
        const content = JSON.parse(savedProfile);
        username.textContent = content.username;
        fullName.textContent = content.fullName;
        bio.textContent = content.bio;
        originalContent = content;
    }

    function createInput(element, placeholder) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = element.textContent;
        input.placeholder = placeholder;
        input.style.fontSize = window.getComputedStyle(element).fontSize;
        input.style.fontWeight = window.getComputedStyle(element).fontWeight;
        return input;
    }

    function makeEditable(element, placeholder) {
        const input = createInput(element, placeholder);
        element.replaceWith(input);
        return input;
    }

    function saveContent(input, originalElement) {
        const newContent = input.value.trim();
        originalElement.textContent = newContent || originalElement.textContent;
        input.replaceWith(originalElement);
    }

    let currentInputs = [];

    editProfileBtn.addEventListener('click', function() {
        if (editProfileBtn.textContent === 'Edit profile') {
            editProfileBtn.textContent = 'Editing...';
            editButtons.classList.add('show');
            
            currentInputs = [
                { input: makeEditable(username, 'Username'), original: username },
                { input: makeEditable(fullName, 'Full Name'), original: fullName },
                { input: makeEditable(bio, 'Bio'), original: bio }
            ];
        } else {
            editProfileBtn.textContent = 'Edit profile';
            editButtons.classList.remove('show');
            
            currentInputs.forEach(({input, original}) => {
                saveContent(input, original);
            });
            originalContent = {
                username: username.textContent,
                fullName: fullName.textContent,
                bio: bio.textContent
            };
            localStorage.setItem('profileContent', JSON.stringify(originalContent));
            currentInputs = [];
        }
    });

    saveBtn.addEventListener('click', function() {
        editProfileBtn.textContent = 'Edit profile';
        editButtons.classList.remove('show');
        
        currentInputs.forEach(({input, original}) => {
            saveContent(input, original);
        });
        originalContent = {
            username: username.textContent,
            fullName: fullName.textContent,
            bio: bio.textContent
        };
        localStorage.setItem('profileContent', JSON.stringify(originalContent));
        currentInputs = [];
    });

    cancelBtn.addEventListener('click', function() {
        editProfileBtn.textContent = 'Edit profile';
        editButtons.classList.remove('show');
        
        username.textContent = originalContent.username;
        fullName.textContent = originalContent.fullName;
        bio.textContent = originalContent.bio;
        
        currentInputs.forEach(({input, original}) => {
            input.replaceWith(original);
        });
        currentInputs = [];
    });
});



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

document.addEventListener('DOMContentLoaded', () => {
    const filterModal = document.getElementById('filterModal');
    const filterButtons = document.getElementById('filterButtons');
    const editButtons = document.querySelectorAll('.edit-btn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const saveBtn = document.getElementById('saveBtn');  // Ensure this matches the HTML
    const drawingCanvas = document.getElementById('drawingCanvas');
    const ctx = drawingCanvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSizeInput = document.getElementById('brushSizeInput');
    const eraserSizeInput = document.getElementById('eraserSizeInput');
    const resetCanvasBtn = document.getElementById('resetCanvasBtn');

    // Filters dictionary
    const filters = {
        'vintage': 'sepia(40%) brightness(110%) contrast(95%)',
        'faded': 'brightness(110%) contrast(90%) saturate(85%)',
        'warmth': 'sepia(20%) brightness(105%) saturate(110%)',
        'cool': 'hue-rotate(350deg) brightness(100%) saturate(90%)',
        'dramatic': 'contrast(110%) brightness(110%) saturate(110%)',
        'morning': 'brightness(105%) saturate(105%) hue-rotate(350deg)',
        'sunset': 'sepia(30%) brightness(105%) saturate(120%)',
        'forest': 'hue-rotate(340deg) saturate(110%) brightness(95%)',
        'desert': 'sepia(20%) brightness(105%) contrast(105%) saturate(110%)',
        'noir': 'grayscale(90%) contrast(120%) brightness(90%)',
        'clarity': 'contrast(105%) brightness(105%) saturate(105%)',
        'none': 'none'
    };

    let currentImage = null;
    let originalImage = null;
    let isDrawing = false;
    let lastX = 0, lastY = 0;
    let pressTimeout;
    let currentFilter = 'none';
     let brushSize = 5;
    let eraserSize = 20;

    // Open modal
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postImage = e.target.closest('.post-image');
            currentImage = postImage.querySelector('img');
            
            // Load image to canvas
            const tempImg = new Image();
            tempImg.onload = () => {
                drawingCanvas.width = tempImg.width;
                drawingCanvas.height = tempImg.height;
                ctx.drawImage(tempImg, 0, 0);
                
                // Store original image for reference
                originalImage = tempImg;
            };
            tempImg.src = currentImage.src;

            filterModal.style.display = 'flex';
        });
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        filterModal.style.display = 'none';
    });

    // Filter buttons
    filterButtons.addEventListener('click', (e) => {
        const filterBtn = e.target.closest('.filter-btn');
        if (filterBtn) {
            // Remove active class from all buttons
            filterButtons.querySelectorAll('.filter-btn').forEach(btn => 
                btn.classList.remove('active'));
            
            // Add active class to clicked button
            filterBtn.classList.add('active');

            // Apply filter to canvas in real-time
            const filter = filters[filterBtn.dataset.filter];
            currentFilter = filterBtn.dataset.filter;
            
            // Redraw original image with filter
            ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            ctx.drawImage(originalImage, 0, 0);
            
            // Apply filter using CSS filter on canvas
            drawingCanvas.style.filter = filter;
        }
    });

    // Reset Canvas
    resetCanvasBtn.addEventListener('click', () => {
        // Clear canvas and redraw original image
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        ctx.drawImage(originalImage, 0, 0);
        drawingCanvas.style.filter = 'none';
        currentFilter = 'none';
        
        // Reset filter buttons
        filterButtons.querySelectorAll('.filter-btn').forEach(btn => 
            btn.classList.remove('active'));
        filterButtons.querySelector('.filter-btn[data-filter="none"]').classList.add('active');
    });

    // Hard press drawing
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        pressTimeout = setTimeout(() => {
            const rect = drawingCanvas.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
            
            isDrawing = true;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
        }, 200);  // 200ms hard press duration
    }

    function draw(e) {
        if (!isDrawing) return;

        const rect = drawingCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();

        lastX = x;
        lastY = y;
    }

    function stopDrawing() {
        clearTimeout(pressTimeout);
        isDrawing = false;
        ctx.beginPath();
    }

    // Save changes - Added console logging and direct modal closing
    saveBtn.addEventListener('click', () => {
        console.log('Save button clicked'); // Debug log
        
        // Verify the button exists
        if (!saveBtn) {
            console.error('Save button not found!');
            return;
        }
        try{
        // Update image source with canvas content
        currentImage.src = drawingCanvas.toDataURL();
        
        // Apply the current filter to the image
        currentImage.style.filter = filters[currentFilter];
        
        // Explicitly set modal display to none
        filterModal.style.display = 'none';
        }catch(error){
            console.error('Error saving image:', error);
        }
        
        // console.log('Modal should be closed now'); // Debug log
    });
});


// Initialize the editor when the DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
// const imageEditor = new ImageEditor();
// });


// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// When the page loads, set the username
document.addEventListener('DOMContentLoaded', function() {
    const usernameElement = document.getElementById('username');
    
    // First try to get the username from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.fullname) {
        usernameElement.textContent = currentUser.fullname;
    } else {
        usernameElement.textContent = 'User';
    }
});

//saving images in the posts option
document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('posts-container');

    // Load images from localStorage
    const images = JSON.parse(localStorage.getItem('uploadedImages')) || [];
    if (images.length === 0) {
        console.log("No uploaded images found.");
        return;
    }

    images.forEach((image, index) => {
        const newPost = document.createElement('div');
        newPost.className = 'post-image';
        newPost.setAttribute('data-index', index);

        newPost.innerHTML = `
            <img src="${image.dataUrl}" alt="${image.name}">
            <div class="edit-overlay">
                <button class="btn btn-sm btn-outline-light edit-btn">
                    <iconify-icon icon="line-md:edit-full-filled"></iconify-icon>
                </button>
            </div>
        `;

        postsContainer.appendChild(newPost);
    });
});



