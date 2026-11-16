
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

    function applyTheme() {
        document.documentElement.dataset.theme = theme;

        button.textContent = theme === "dark"
            ? "Switch to Light Mode"
            : "Switch to Dark Mode";
    }

    if (document.startViewTransition) {
        document.startViewTransition(applyTheme);
    } else {
        applyTheme();
    }

    try {
        localStorage.setItem("theme", theme);
    } catch (error) {
        // The theme still works if storage is unavailable.
    }
});




