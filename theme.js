
const button = document.querySelector("#theme-toggle");

let theme = "light";

try {
    theme = localStorage.getItem("theme") || "light";
} catch (error) {
    theme = "light";
}

document.documentElement.dataset.theme = theme;

button.textContent = theme === "dark"
    ? "Switch to Light Mode"
    : "Switch to Dark Mode";

button.hidden = false;

button.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";

    document.documentElement.dataset.theme = theme;

    button.textContent = theme === "dark"
        ? "Switch to Light Mode"
        : "Switch to Dark Mode";
// this error if the heme still changes if storage is unavailable.
    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        /
    }
});
