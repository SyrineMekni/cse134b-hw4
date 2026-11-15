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
