function getInfo() {
    // Get info from data base and change each input's value
}

function toggleChange(event) {
    let form = document.getElementById("profileForm");
    for (let element of form.elements) {
        element.disabled = false; // Enable each element
    }

    event.preventDefault();
}