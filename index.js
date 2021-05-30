// Un fetch recibe dos parametros,
// uno obligatorio y uno optativo

// El parametro obligatorio es un string que representa una URL

// Si no pongo un segundo parametro JS asume que quiero hacer un GET

// GET
// Traerme informacion para que yo pueda leerla

const obtenerUsuariosyHacerHTML = () => {
  fetch("https://601da02bbe5f340017a19d60.mockapi.io/users")
    .then((res) => res.json())
    .then((data) => {
      const lista = document.querySelector("ul");

      lista.innerHTML = "";
      data.map((usuario) => {
        lista.innerHTML += `<li>
          ${usuario.fullname}
          <button data-userId=${usuario.id} class="borrar">Borrar</button>
          <button data-userId=${usuario.id} class="editar">Editar</button>
          </li>`;
      });
      const listaDeBotones = document.querySelectorAll(".borrar");

      // tengo que usar forEach, en lugar de map, porque listaDeBotones es una lista de nodos
      // de HTML, que no se puede recorrer con map (pero si con forEach)
      listaDeBotones.forEach((boton) => {
        boton.onclick = () => {
          let id = boton.dataset.userid;
          // DELETE
          // Borra informacion de la API
          fetch(`https://601da02bbe5f340017a19d60.mockapi.io/users/${id}`, {
            method: "delete",
          })
            .then((res) => res.json())
            .then((usuarioBorrado) => {
              // funcion recursiva (se llama a si misma, para hacer de nuevo el HTML)
              obtenerUsuariosyHacerHTML();
            });
        };
      });

      const listaDeEdicion = document.querySelectorAll(".editar");
      const modalEdicion = document.getElementById("modal-editar");
      const aceptarCambios = document.getElementById("agregar");
      let nombre = document.getElementById("fullnameEdicion")
      let email = document.getElementById("emailEdicion")
      let direccion = document.getElementById("addressEdicion");
      let telefono = document.getElementById("phoneEdicion");


      listaDeEdicion.forEach((editar) => {
        editar.onclick = () => {
          modalEdicion.classList.remove("display");
          let id = editar.dataset.userid;

          fetch(`https://601da02bbe5f340017a19d60.mockapi.io/users/${id}`)
            .then((res) => res.json())
            .then((usuario) => {
              nombre.value = `${usuario.fullname}`;
              email.value = `${usuario.email}`;
              direccion.value = `${usuario.address}`;
              telefono.value = `${usuario.phone}`;

      

              aceptarCambios.onclick = (e) => {
                e.preventDefault();
                modalEdicion.classList.add("display");

                fetch(`https://601da02bbe5f340017a19d60.mockapi.io/users/${id}`, {
                  method: "put",
                  headers: {
                        'Content-Type': 'application/json',
                      },
                  body: JSON.stringify ({
                    fullname : nombre.value,
                    email : email.value,
                    address : direccion.value,
                    phone : telefono.value,
                  }),
                })
                  .then((res) => res.json())
                  .then((usuarioEditado) => {
                    // funcion recursiva (se llama a si misma, para hacer de nuevo el HTML)
                    obtenerUsuariosyHacerHTML();
                  });

              }

            });
        };
      });

    });
};

obtenerUsuariosyHacerHTML();

const formulario = document.querySelector("form");

formulario.onsubmit = (e) => {
  e.preventDefault();

  const fullname = document.querySelector("#fullname").value;
  const address = document.querySelector("#address").value;
  const phone = document.querySelector("#phone").value;
  const email = document.querySelector("#email").value;
  // POST
  fetch("https://601da02bbe5f340017a19d60.mockapi.io/users", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullname: fullname,
      addres: address,
      phone: phone,
      email: email,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      obtenerUsuariosyHacerHTML();
    });
};
