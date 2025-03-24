const avatarUpload = document.querySelector('#avatar-upload');
const dropArea = document.querySelector('#drop-area');
const avatarPreview = document.querySelector('#avatar-preview');
const defaultUploadImage = avatarPreview.src;

const removeButton = document.querySelector('.remove-btn');
const updateImageButtonsWrapper = document.querySelector('.button-wrapper');

const form = document.querySelector('#ticket-form');
const ticketSuccess = document.querySelector('#ticket-success');

let currentImage;

// Hide the update image buttons
updateImageButtonsWrapper.style.display = 'none';

const handleClick = () => {
  avatarUpload.click();
}

dropArea.addEventListener('click', handleClick);

avatarUpload.addEventListener('change', handleFiles);

dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropArea.classList.add('border-neutral-300');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('border-neutral-300');
});

dropArea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();
  dropArea.classList.remove('border-neutral-300');
  const files = event.dataTransfer.files;

  // Create a DataTransfer to hold the file
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(files[0]);
  avatarUpload.files = dataTransfer.files;

  handleFiles({ target: { files } });
});

removeButton.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  
  avatarUpload.value = '';
  avatarPreview.src = defaultUploadImage;
  avatarPreview.classList.remove('user-image');
  avatarPreview.classList.add('default-image');

  updateImageButtonsWrapper.style.display = 'none';

  document.querySelector('.file-message').classList.add('hidden');
  document.querySelector('.info-image-message').classList.remove('hidden');

  currentImage = undefined;
});

function handleFiles(event) {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/') && file.size <= 500 * 1024) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.src = e.target.result;
      avatarPreview.classList.remove('default-image');
      avatarPreview.classList.add('user-image');

      updateImageButtonsWrapper.style.display = 'block';

      document.querySelector('.file-message').classList.add('hidden');
      document.querySelector('.info-image-message').classList.remove('hidden');

      currentImage = file;
    };
    reader.readAsDataURL(file);
  } else {
    avatarUpload.value = '';
    avatarPreview.src = defaultUploadImage;
    avatarPreview.classList.remove('user-image');
    avatarPreview.classList.add('default-image');
    updateImageButtonsWrapper.style.display = 'none';

    document.querySelector('.file-message').classList.remove('hidden');
    document.querySelector('.info-image-message').classList.add('hidden');

    currentImage = undefined;
  }
}

form.addEventListener('submit', (event) => {
  event.stopPropagation();
  event.preventDefault();

  let isValid = true;

  if (!avatarUpload.value || currentImage === undefined) {
    const fileMessage = document.querySelector('.file-message p');

    fileMessage.innerHTML = '<span class="mr-2">ⓘ</span>Please, upload a photo.';

    updateImageButtonsWrapper.style.display = 'none';

    avatarPreview.classList.remove('user-image');
    avatarPreview.classList.add('default-image');

    avatarPreview.src = defaultUploadImage;

    document.querySelector('.file-message').classList.remove('hidden');
    document.querySelector('.info-image-message').classList.add('hidden');

    isValid = false;
  }

  const emailInput = document.getElementById('email');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value)) {
    document.querySelector('.email-input').classList.add('error-border');
    document.querySelector('.email-message').classList.remove('hidden');
    isValid = false;
  } else {
    document.querySelector('.email-input').classList.remove('error-border');
    document.querySelector('.email-message').classList.add('hidden');
  }

  if (isValid) {
    ticketSuccess.style.display = 'block';
    form.style.display = 'none';
    generateTicket();
  }
});

function generateTicket() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const avatarSrc = avatarPreview.src;

  const randomId = Math.floor(Math.random() * 1000000);
  const ticketHtml = `
  <h2 class="text-white font-extrabold text-xl md:text-3xl lg:text-4xl text-center mt-12">
        Congrats, <span class="font-extrabold bg-gradient-to-r from-orange-500 to-neutral-0 bg-clip-text text-transparent">${name}</span>!
        <br>
        Your ticket is ready.
      </h2>

      <div class="flex justify-center mt-8 p-4">
        <p class="text-white text-center text-lg">
          We've emailed your ticket to <br> <span class="text-orange-500">${email}</span> and will send updates in <br> the run up to the event.
        </p>
      </div>

      <div class="relative ticket-container mt-6 md:mt-24 flex justify-center h-52 w-80 md:w-max lg:w-max mr-auto ml-auto">
        <img src="./assets/images/pattern-ticket.svg" alt="Ticket">

        <img class="h-7 absolute left-0 mt-12 md:mt-5 lg:mt-6 ml-5" src="./assets/images/logo-full.svg" alt="Logo">

        <p class="absolute text-neutral-300 text-sm md:text-lg top-20 md:top-14 lg:top-15 left-16 md:left-[4rem]">Jan 31, 2025 / Austin, TX</p>

        <div class="absolute flex bottom-0 left-0 mb-10 md:mb-5 ml-5">
          <img class="h-10 w-10 md:h-16 md:w-16 rounded-xl" src="${avatarSrc}" alt="Avatar">

          <div class="ml-3">
            <h3 class="text-white text-sm md:text-2xl">${name}</h3>

            <div class="flex items-center gap-2">
              <img class="h-5" src="./assets/images/icon-github.svg" alt="Icon GitHub">

              <span class="text-neutral-300 text-xs md:text-lg">${username}</span>
            </div>
          </div>
        </div>

        <p class="absolute text-neutral-500 font-medium text-lg rotate-90 right-[-1rem] sm:right-[-0.938rem] md:right-[-0.13rem] top-1/2 bottom-1/2">#${randomId}</p>
        
      </div> 
  `; 
  ticketSuccess.innerHTML = ticketHtml;
}