document.addEventListener("DOMContentLoaded", () => {
  const curriculumGrid = document.getElementById("curriculum-grid");
  const creditosInfo = document.getElementById("creditCounter"); // Agregar un elemento donde mostrar la información de créditos
  let pasantiaHabilitada = false;
  let proyectoFinalHabilitado = false;

  function fetchMaterias() {
    return fetch("/materias")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener las materias");
        }
        return response.json();
      })
      .then((savedMaterias) => {
        return savedMaterias;
      })
      .catch((error) => {
        console.error("Error al realizar el fetch:", error);
        return [];
      });
  }

  let materias = [];

  fetchMaterias().then((savedMaterias) => {
    materias = savedMaterias;

    // Inicializar
    verificarHabilitadas(); // Verificar estados iniciales
    renderMateriasPorSemestre(); // Renderizar la malla curricular
    calcularCreditos(); // Calcular créditos iniciales
  });

  // Renderizar malla curricular por semestres
  const renderMateriasPorSemestre = () => {
    curriculumGrid.innerHTML = "";
    const semestres = [...new Set(materias.map((materia) => materia.semestre))]; // Obtener semestres únicos

    semestres.forEach((semestre) => {
      const semesterDiv = document.createElement("div");
      semesterDiv.className = "semester";

      const semesterTitle = document.createElement("h4");
      semesterTitle.textContent = `Semestre ${semestre}`;
      semesterDiv.appendChild(semesterTitle);

      materias
        .filter((materia) => materia.semestre === semestre)
        .forEach((materia) => {
          if (materia.nombre === "Pasantía") {
            if (pasantiaHabilitada) {
              materia.estado = "habilitada";
            } else {
              materia.estado = "no-habilitada";
            }
          }

          if (materia.nombre === "Proyecto final") {
            if (proyectoFinalHabilitado) {
              materia.estado = "habilitada";
            } else {
              materia.estado = "no-habilitada";
            }
          }
          const card = document.createElement("div");
          card.className = `card ${materia.estado}`;
          card.dataset.id = materia.id;
          card.innerHTML = `
            <h5>${materia.nombre}</h5>
            <p>Créditos: ${materia.creditos}</p>
          `;

          // Evento de clic para cambiar estado
          card.addEventListener("click", () => {
            if (materia.estado === "habilitada") {
              materia.estado = "cursada";
            } else if (materia.estado === "cursada") {
              materia.estado = "exonerada";
            } else if (materia.estado === "exonerada") {
              materia.estado = "habilitada";
            }

            // Si vuelve a "habilitada", resetear dependientes
            if (materia.estado === "habilitada") {
              resetearDependientes(materia.id);
            }

            verificarHabilitadas(); // Actualizar estados
            renderMateriasPorSemestre(); // Re-renderizar
            calcularCreditos(); // Recalcular créditos
          });

          semesterDiv.appendChild(card);
        });

      curriculumGrid.appendChild(semesterDiv);
    });
  };

  // Verificar si las materias están habilitadas
  const verificarHabilitadas = () => {
    materias.forEach((materia) => {
      if (materia.estado === "no-habilitada") {
        let habilitada = true;

        // Verificar previas de curso
        if (materia.previasCurso.length > 0) {
          habilitada = materia.previasCurso.every((idPrevia) => {
            const previa = materias.find((m) => m.id === idPrevia);
            return (
              previa &&
              (previa.estado === "cursada" || previa.estado === "exonerada")
            );
          });
        }

        // Verificar previas de examen si aún está habilitada
        if (habilitada && materia.previasExamen.length > 0) {
          habilitada = materia.previasExamen.every((idPrevia) => {
            const previa = materias.find((m) => m.id === idPrevia);
            return previa && previa.estado === "exonerada";
          });
        }

        // Si cumple todas las previas, habilitar la materia
        if (habilitada) {
          materia.estado = "habilitada";
        }
      }
    });
  };

  // Resetear dependientes cuando una materia vuelve a "habilitada"
  const resetearDependientes = (idMateria) => {
    materias.forEach((materia) => {
      if (
        (materia.previasCurso.includes(idMateria) ||
          materia.previasExamen.includes(idMateria)) &&
        materia.estado !== "no-habilitada"
      ) {
        materia.estado = "no-habilitada";
        resetearDependientes(materia.id); // Resetear dependientes recursivamente
      }
    });
  };

  // Calcular créditos y verificar requisitos
  const calcularCreditos = () => {
    let totalCreditosExoneradas = 0;

    // Sumar los créditos de las materias exoneradas
    materias.forEach((materia) => {
      if (materia.estado === "exonerada") {
        totalCreditosExoneradas += materia.creditos;
      }
    });

    // Verificar requisitos de Pasantía y Proyecto Final
    pasantiaHabilitada = totalCreditosExoneradas >= 210;
    proyectoFinalHabilitado = totalCreditosExoneradas >= 250;

    // Mostrar los resultados
    creditosInfo.textContent = `
      Créditos exonerados: ${totalCreditosExoneradas}
    `;
  };
});
