const form = document.querySelector("#updateForm");
if (form) {
    form.addEventListener("change", function () {
        const updateBtn = form.querySelector("button[type='submit'], input[type='submit']");
        if (updateBtn) updateBtn.removeAttribute("disabled");
    });
}
