"use strict";
const form_errors = [];
const form = document.querySelector("form");
const comments = document.querySelector("#comments");
const nameInput = document.querySelector("#name");
console.log(nameInput.validity.valid);
const counter = document.querySelector("#character-counter");
counter.hidden = false;
counter.textContent = comments.maxLength + " characters remaining";

form.addEventListener("submit", function(event) {
    console.log("Form submitted!");
});

/*comments.addEventListener("input", function() {
    console.log(comments.value);
});*/

comments.addEventListener("input", function() {
    const messageLength = comments.value.length;
    const remaining = comments.maxLength - messageLength;
    counter.classList.toggle("warning", remaining <= 100);
    counter.textContent = remaining + " characters remaining";
    if (remaining === 0) {
    counter.textContent = "Oops!Character limit reached.";
} else if (remaining <= 100) {
    counter.textContent = "Warning: Only " + remaining + " characters remaining.";
}
});

function validateField(field) {
    field.setCustomValidity("");

    if (field.validity.valueMissing) {
        field.setCustomValidity("This field is required.");
    } else if (field.validity.typeMismatch) {
        field.setCustomValidity("Please enter a valid email address.");
    } else if (field.validity.tooShort) {
        field.setCustomValidity(
            "Please enter at least " + field.minLength + " characters."
        );
    }
}

const fields = form.querySelectorAll("#name, #email, #comments");

fields.forEach(function(field) {
    field.addEventListener("blur", function() {
        if (field.value.length > 0) {
            validateField(field);
        }
    });
});

function showErrors() {
    const errorArea = document.querySelector("#error-area");
    const errorList = document.querySelector("#error-list");

    errorList.replaceChildren();

    fields.forEach(function(field) {
        if (!field.validity.valid) {
            const item = document.createElement("li");
            item.textContent = field.labels[0].textContent.trim()
                + ": " + field.validationMessage;
            errorList.appendChild(item);
        }
    });

    errorArea.hidden = errorList.children.length === 0;
}
