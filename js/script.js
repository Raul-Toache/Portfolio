function toggleMenu() {
    const navUl = document.querySelector('nav ul');
    navUl.classList.toggle('open');
}

function filterProjects(category, event) {
    const articles = document.querySelectorAll('#projects article');
    const buttons = document.querySelectorAll('#projects .filter-buttons button');

    // Remove active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked button
    event.target.classList.add('active');

    // Show/hide articles
    articles.forEach(article => {
        if (category === 'all' || article.dataset.category === category) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

// Modal functions
function openModal(imgSrc, altText) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const caption = document.getElementById('modal-caption');

    modal.style.display = 'flex';
    modalImg.src = imgSrc;
    modalImg.alt = altText;
    caption.textContent = altText;
}

function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

// Add click listeners to project images
const projectImages = document.querySelectorAll('#projects img');
projectImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        openModal(this.src, this.alt);
    });
});

// Close modal on click outside or close button
const modal = document.getElementById('image-modal');
const closeBtn = document.querySelector('.close-modal');
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

// Close on ESC key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Form validation
const form = document.querySelector('#contact form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const successMessage = document.getElementById('success-message');

// Name validation (no numbers)
nameInput.addEventListener("input", () => {
    if (nameInput.value.trim() === "") {
        nameError.textContent = "Name is required.";
    } else if (/\d/.test(nameInput.value)) {
        nameError.textContent = "Name cannot contain numbers.";
    } else {
        nameError.textContent = "";
    }
});

// Email validation
emailInput.addEventListener("input", () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput.value.trim() === "") {
        emailError.textContent = "Email is required.";
    } else if (!emailRegex.test(emailInput.value)) {
        emailError.textContent = "Please enter a valid email address.";
    } else {
        emailError.textContent = "";
    }
});

// Message validation
messageInput.addEventListener("input", () => {
    if (messageInput.value.trim() === "") {
        messageError.textContent = "Message is required.";
    } else {
        messageError.textContent = "";
    }
});

// Helper functions
function showError(input, errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.classList.add('invalid');
}

function clearError(input, errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    input.classList.remove('invalid');
}

// Validation functions
function validateName() {
    const value = nameInput.value.trim();

    if (value === '') {
        showError(nameInput, nameError, 'Name is required.');
        return false;
    }

    if (/\d/.test(value)) {
        showError(nameInput, nameError, 'Name cannot contain numbers.');
        return false;
    }

    clearError(nameInput, nameError);
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value === '') {
        showError(emailInput, emailError, 'Email is required.');
        return false;
    }

    if (!emailRegex.test(value)) {
        showError(emailInput, emailError, 'Please enter a valid email address.');
        return false;
    }

    clearError(emailInput, emailError);
    return true;
}

function validateMessage() {
    const value = messageInput.value.trim();

    if (value === '') {
        showError(messageInput, messageError, 'Message is required.');
        return false;
    }

    clearError(messageInput, messageError);
    return true;
}

// Real-time validation
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
messageInput.addEventListener('input', validateMessage);

// Submit handler
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const isValid =
        validateName() &&
        validateEmail() &&
        validateMessage();

    if (isValid) {
        // Send form data using Formspree
        const formData = new FormData(form);
        fetch('https://formspree.io/f/xjgkqdvk', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                successMessage.textContent = 'Message sent successfully!';
                successMessage.style.display = 'block';

                form.reset();

                // Clear UI state
                [nameInput, emailInput, messageInput].forEach(input =>
                    input.classList.remove('invalid')
                );

                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 4000);
            } else {
                successMessage.textContent = 'Failed to send message. Please try again.';
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 4000);
            }
        })
        .catch(error => {
            successMessage.textContent = 'Failed to send message. Please try again.';
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 4000);
        });
    }
});
