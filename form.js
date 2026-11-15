
"use strict";

// Find the contact form and the fields the customer needs to fill out.
const form = document.querySelector("form");
const fields = form.querySelectorAll("#name, #email, #comments");

// Find the message box and the area that shows remaining characters.
const comments = document.querySelector("#comments");
const counter = document.querySelector("#character-counter");

// Find the area where customers will see error messages.
const errorArea = document.querySelector("#error-area");
const errorList = document.querySelector("#error-list");

// Store the errors customers make when trying to submit the form.
const form_errors = [];

// Remember which fields customers have edited and left.
const touchedFields = new Set();

// Keep track of whether the customer has tried to submit the form.
let submitted = false;


// --------------------------------------------------
// 1. SHOW THE INFORMATION AREA
// --------------------------------------------------

// Show the information area and character counter when JavaScript is enabled,
// so customers can see how many characters they have left while typing.
document.querySelector("#info-area").hidden = false;
counter.hidden = false;


// --------------------------------------------------
// 2. UPDATE THE CHARACTER COUNTER
// --------------------------------------------------

// Keep track of how many characters the customer has left.
// When the customer gets close to the limit, show a warning.
// When the limit is reached, let the customer know they cannot type more.
function updateCounter() {
    const remaining = comments.maxLength - comments.value.length;

    // Add warning styling when 100 or fewer characters remain.
    counter.classList.toggle("warning", remaining <= 100);

    // Change the message depending on how many characters remain.
    if (remaining === 0) {
        counter.textContent = "Character limit reached.";
    } else if (remaining <= 100) {
        counter.textContent = "Warning: Only " + remaining + " characters remaining.";
    } else {
        counter.textContent = remaining + " characters remaining.";
    }
}

// Show the remaining characters when the page first loads.
updateCounter();

// Update the counter every time the customer types, deletes, or pastes text.
comments.addEventListener("input", updateCounter);


// --------------------------------------------------
// 3. CHECK WHETHER A FIELD IS VALID
// --------------------------------------------------

// Check one field to make sure the customer entered valid information.
// If something is wrong, prepare a message explaining what needs to be fixed.
function validateField(field) {

    // Remove any previous custom error message before checking again.
    field.setCustomValidity("");

    // Check whether the customer left a required field empty.
    if (field.validity.valueMissing) {
        field.setCustomValidity("This field is required.");

    // Check whether the customer entered an invalid email address.
    } else if (field.validity.typeMismatch) {
        field.setCustomValidity("Please enter a valid email address.");

    // Check whether the customer entered fewer characters than required.
    } else if (field.validity.tooShort ||
               (field.value.length > 0 &&
                field.value.length < field.minLength)) {
        field.setCustomValidity(
            "Please enter at least " + field.minLength + " characters."
        );
    }
}


// --------------------------------------------------
// 4. DISPLAY ERROR MESSAGES TO THE CUSTOMER
// --------------------------------------------------

// Show customers which fields have errors and what they need to correct.
// Only show errors after a submission attempt or after editing and leaving a field.
function showErrors() {

    // Clear the previous list so old errors are not displayed twice.
    errorList.replaceChildren();

    // Go through the name, email, and comments fields one at a time.
    fields.forEach(function(field) {

        // Create an ID for this field's error message.
        const errorId = field.id + "-error";

        // Get the IDs of any descriptions already connected to this field.
        const oldDescription = field.getAttribute("aria-describedby") || "";
        const descriptions = oldDescription.split(" ").filter(Boolean);
        const index = descriptions.indexOf(errorId);

        // Remove the old error reference before updating it.
        if (index !== -1) {
            descriptions.splice(index, 1);
        }

        // Show an error if the field is invalid and the customer
        // has already tried to submit or has edited and left the field.
        if ((submitted || touchedFields.has(field)) && !field.validity.valid) {

            // Create a new error message in the list.
            const item = document.createElement("li");
            item.id = errorId;

            // Show the field's label and explain what is wrong.
            item.textContent =
                field.labels[0].textContent.trim() +
                ": " + field.validationMessage;

            // Add the error message to the webpage.
            errorList.appendChild(item);

            // Connect the error message to the field for screen readers.
            descriptions.push(errorId);
        }

        // Update the field's accessible descriptions.
        if (descriptions.length > 0) {
            field.setAttribute("aria-describedby", descriptions.join(" "));
        } else {
            field.removeAttribute("aria-describedby");
        }
    });

    // Hide the error area when there are no errors to display.
    // Show it when at least one error exists.
    errorArea.hidden = errorList.children.length === 0;
}


// --------------------------------------------------
// 5. CHECK FIELDS WHILE CUSTOMERS FILL OUT THE FORM
// --------------------------------------------------

// Watch each field as the customer types or moves to another field.
fields.forEach(function(field) {

    // Remember whether the customer has changed this field.
    let edited = false;

    // Run this code when the customer types, deletes, or pastes text.
    field.addEventListener("input", function() {
        edited = true;

        // Check whether the new information is valid.
        validateField(field);

        // Update visible errors if the customer has already
        // tried to submit or previously edited and left this field.
        if (submitted || touchedFields.has(field)) {
            showErrors();
        }
    });

    // Run this code when the customer leaves the field.
    field.addEventListener("blur", function() {

        // Only show feedback if the customer edited this field.
        if (edited) {

            // Remember that the customer edited and left this field.
            touchedFields.add(field);

            // Check the field and display any errors.
            validateField(field);
            showErrors();
        }
    });
});


// --------------------------------------------------
// 6. DETECT INVALID FORM SUBMISSIONS
// --------------------------------------------------

// When the browser finds an invalid field during submission,
// remember that the customer tried to submit and show the errors.
form.addEventListener("invalid", function(event) {

    // Remember that a submission attempt happened.
    submitted = true;

    // Check the field that triggered the invalid event.
    validateField(event.target);

    // Display the errors to help the customer correct them.
    showErrors();

}, true);


// --------------------------------------------------
// 7. SAVE THE CUSTOMER'S VALIDATION ERRORS
// --------------------------------------------------

// Record the errors found during a failed submission attempt.
// Save the field name and error message, not the customer's personal information.
function recordErrors() {

    // Check each field separately.
    fields.forEach(function(field) {
        validateField(field);

        // If a field is invalid, save its error information.
        if (!field.validity.valid) {
            form_errors.push({
                field: field.name,
                error: field.validationMessage
            });
        }
    });
}


// --------------------------------------------------
// 8. CHECK WHEN THE CUSTOMER TRIES TO SUBMIT
// --------------------------------------------------

// Check the entire form when the customer tries to submit it.
// If there are errors, record them and show what needs to be corrected.
function attemptSubmit() {

    // Check all fields before deciding whether the form is valid.
    fields.forEach(validateField);

    // Find out whether at least one field contains an error.
    if (Array.from(fields).some(function(field) {
        return !field.validity.valid;
    })) {

        // Remember that the customer attempted to submit the form.
        submitted = true;

        // Save the errors from this failed attempt.
        recordErrors();

        // Display the errors so the customer can fix them.
        showErrors();
    }
}

// Check the form when the customer clicks the Submit button.
form.querySelector('button[type="submit"]').addEventListener("click", attemptSubmit);

// Also check the form when the customer submits using the Enter key.
form.addEventListener("keydown", function(event) {

// --------------------------------------------------
// 9. SEND THE ERROR HISTORY WITH A VALID FORM
// --------------------------------------------------

// When the customer successfully submits a valid form,
// attach the saved error history so it can be sent with the form.
form.addEventListener("submit", function() {

    // Look for the hidden field that stores the error history.
    let history = form.querySelector('[name="form-errors"]');

    // If the hidden field does not exist, create it.
    if (!history) {
        history = document.createElement("input");
        history.type = "hidden";
        history.name = "form-errors";

        // Add the hidden field to the contact form.
        form.appendChild(history);
    }

    // Convert the saved errors into JSON text.
    // The hidden field will be included when HTML sends the form to the server.
    history.value = JSON.stringify(form_errors);
});
