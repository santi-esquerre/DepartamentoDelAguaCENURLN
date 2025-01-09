form.addEventListener("submit", function (e) {
  const form = document.getElementById("form");
  const result = document.getElementById("resultado");

  e.preventDefault();
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);
  result.innerHTML = "Por favor espere...";
  console.log(json);
  fetch("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.classList.add("text-success");
        result.innerHTML = "Formulario enviado exitosamente!";
      } else {
        console.log(response);
        result.innerHTML = json.message;
      }
    })
    .catch((error) => {
      console.log(error);
      result.classList.add("text-danger");
      result.innerHTML = "Algo salió mal!";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        result.classList.remove("text-success");
        result.classList.remove("text-danger");
        result.innerHTML = "";
      }, 3000);
    });
});
