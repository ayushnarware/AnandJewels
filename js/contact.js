// Contact form validation 
/**
 * contact.js - कांटेक्ट पेज फॉर्म वैलिडेशन
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('main-contact-form');
    const successMsg = document.getElementById('contact-success');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // सभी एरर हटाएं
        clearErrors(form);
        
        // इनपुट्स
        const name = document.getElementById('contact-name');
        const email = document.getElementById('contact-email');
        const subject = document.getElementById('contact-subject');
        const message = document.getElementById('contact-message');
        
        let isValid = true;

        // वैलिडेशन
        if (!validateRequired(name)) isValid = false;
        if (!validateEmail(email)) isValid = false;
        if (!validateRequired(subject)) isValid = false;
        if (!validateRequired(message)) isValid = false;

        if (isValid) {
            // डेमो: फॉर्म सबमिट करें
            console.log('Form submitted:', {
                name: name.value,
                email: email.value,
                subject: subject.value,
                message: message.value
            });
            
            form.style.display = 'none';
            successMsg.style.display = 'block';
            
            // (असली प्रोजेक्ट में, यहाँ fetch() से API कॉल होगी)
        }
    });

    // --- वैलिडेशन हेल्पर फंक्शन्स ---

    function validateRequired(input) {
        if (input.value.trim() === '') {
            setError(input, 'This field is required.');
            return false;
        }
        setSuccess(input);
        return true;
    }

    function validateEmail(input) {
        if (!validateRequired(input)) return false;
        
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if (!re.test(String(input.value).toLowerCase())) {
            setError(input, 'Please enter a valid email address.');
            return false;
        }
        setSuccess(input);
        return true;
    }

    function setError(input, message) {
        const formGroup = input.parentElement;
        const errorEl = formGroup.querySelector('.form-error');
        
        formGroup.classList.add('invalid');
        errorEl.textContent = message;
    }

    function setSuccess(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('invalid');
    }

    function clearErrors(form) {
        form.querySelectorAll('.form-group.invalid').forEach(group => {
            group.classList.remove('invalid');
        });
        successMsg.style.display = 'none';
        form.style.display = 'block';
    }
});