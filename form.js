"use strict";
const form_errors = [];
const form = document.querySelector("form");
const comments = document.querySelector("#comments");

form.addEventListener("submit", function(event) {
    console.log("Form submitted!");
});

/*comments.addEventListener("input", function() {
    console.log(comments.value);
});*/

comments.addEventListener("input", function() {
    const messageLength = comments.value.length;
    const remaining = comments.maxLength - messageLength;
    console.log(remaining);
});
