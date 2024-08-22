document.addEventListener("DOMContentLoaded", function () {
  // Fetch the HTML content from navbar.html
  fetch("rsc/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      // Insert the HTML content into the element with id 'nav'
      document.getElementById("nav").innerHTML = data;
    })
    .catch((error) => console.error("Error fetching the navbar:", error));
});
