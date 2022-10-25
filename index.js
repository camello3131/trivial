/**---------------------------NOMBRE form--------------------------- */
/**---------------------------NOMBRE form--------------------------- */
/**---------------------------NOMBRE form--------------------------- */

  function validarNombre() {
    const $form = document.querySelector(".nombreForm")
    const $containerSpan = document.querySelector(".containerError")
    const $input = document.querySelectorAll(".inputNombre");

    $input.forEach(input => {
      const $span = document.createElement("span");
      $span.id = input.name;
      $span.textContent = input.title;
      $span.classList.add("nombreForm-error", "none")

      $containerSpan.appendChild($span)
    })

    document.addEventListener("keyup", e => {
      if(e.target.matches(".nombreForm [required]")){
        let $input = e.target;
        let pattern = $input.pattern

        if(pattern && $input.value !== "") {
          let regex = new RegExp(pattern);
          return !regex.exec($input.value)
          ? document.getElementById($input.name).classList.add("is-active")
          : document.getElementById($input.name).classList.remove("is-active")
        }
      }
    })

    document.addEventListener("submit", e => {
      e.preventDefault()

      const $loader = document.querySelector(".formLoader")
      const $response = document.querySelector(".form-response")

      $loader.classList.remove("none")

      const $divInputs = document.querySelector(".containerInputs")
      
      
      setTimeout(() => {
        $loader.classList.add("none")
        $response.classList.remove("none")
        $divInputs.classList.add("none")
        
        function guardarLS() {
          let nombre = document.getElementById("inputNombre").value

          localStorage.setItem("nombre", nombre)
        }
        guardarLS()
      }, 3000);
    })

    
  }


validarNombre()



/*------------------------JUEGO------------------------ */
/*------------------------JUEGO------------------------ */
/*------------------------JUEGO------------------------ */


let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;

window.onload = function () {
  base_preguntas = readText("base-preguntas.json");
  interprete_bp = JSON.parse(base_preguntas);
  escogerPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;
function escogerPreguntaAleatoria() {
    let resultadoAnterior = preguntas_correctas
    if(npreguntas.length >= 5){
        if (mostrar_pantalla_juego_términado) {
            swal.fire({
                title: "Juego finalizado",
                text:
                "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas),
                icon: "success"
            });
        }
        if (reiniciar_puntos_al_reiniciar_el_juego) {
            preguntas_correctas = 0
            preguntas_hechas = 0
        }
        npreguntas = [];
        const $panel = d.querySelector(".scores-panel")
        const $div = document.querySelector(".puntajeAnterior")
        const $ultimoPuntajeContenedor = document.createElement("div")
        const $ultimoPuntaje = document.createElement("li")
        $ultimoPuntaje.classList.add("resultados")
        
        $ultimoPuntaje.textContent = resultadoAnterior
        
        $ultimoPuntajeContenedor.appendChild($ultimoPuntaje)
        $div.appendChild($ultimoPuntajeContenedor)
        $panel.appendChild($ultimoPuntaje)
    }
    
    let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }
  
  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
    if (npreguntas.length == interprete_bp.length) {
        //Aquí es donde el juego se reinicia
        
      if (mostrar_pantalla_juego_términado) {
        swal.fire({
          title: "Juego finalizado",
          text:
            "Puntuación: " + preguntas_correctas + "/" + (preguntas_hechas - 1),
          icon: "success"
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0
        preguntas_hechas = 0
      }
      npreguntas = [];
    }
  }
  npreguntas.push(n);
  preguntas_hechas++;

  escogerPregunta(n);
}

function escogerPregunta(n) {
  const $preguntas = d.querySelector(".puntaje")
  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = n;
  style("categoria").color = "white";
  style("categoria").zIndex = "18000";
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
    $preguntas.classList.add("is-active")
  } else {
    $preguntas.classList.remove("is-active")
    select_id("puntaje").innerHTML = "";
  }


  desordenarRespuestas(pregunta);

}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];

  style("btn1").background= "#1C1F23"
  style("btn2").background= "#1C1F23"
  style("btn3").background= "#1C1F23"
  style("btn4").background= "#1C1F23"

  style("btn1").color= "#FFFFFF"
  style("btn2").color= "#FFFFFF"
  style("btn3").color= "#FFFFFF"
  style("btn4").color= "#FFFFFF"
  
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] == pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "rgb(46, 185, 190)";
    btn_correspondiente[i].style.color = "#fff";
  } else {
    btn_correspondiente[i].style.background = "var(--colorTr)";
    btn_correspondiente[i].style.color = "#fff";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] == pregunta.respuesta) {
      btn_correspondiente[j].style.background = "rgb(46, 185, 190)";
      btn_correspondiente[j].style.color = "#fff";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 1500);
}

// let p = prompt("numero")

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "white";
  }

  escogerPreguntaAleatoria();

}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}
/*--------------------------SCORES BTN----------------------------*/
const d = document

d.addEventListener("DOMContentLoaded", (e)=>{
  scoreBtn(".scoresButton", ".scores-panel")
})

function scoreBtn(btnScores, resultados){
  d.addEventListener("click", e => {
    if(e.target.matches(btnScores) || e.target.matches(`${btnScores} *`)){
      document.querySelector(resultados).classList.toggle("is-active")
    }
  })
}

/*------------------------ FINAL MAYOR RESULTADO ----------------------------- */


d.addEventListener("DOMContentLoaded", (e)=>{
  scoreMenu(".btn-estadisticas", ".tablero");
  closeMenu(".closeMenu", ".tablero")
})

function scoreMenu(btn, tablero){
  const d = document;
  d.addEventListener("click", (e)=>{
      if(e.target.matches(btn) || e.target.matches(`${btn} *`)){

          document.querySelector(tablero).classList.toggle("is-active")
      }
  })
}
let nombre = localStorage.getItem("nombre")
let $tablero = document.querySelector(".tableroNav")
let $titulo = document.createElement("h3")

function closeMenu(btn, tablero) {
  d.addEventListener("click", (e) => {
    if(e.target.matches(btn) || e.target.matches(`${btn} *`)){
      document.querySelector(tablero).classList.toggle("is-active")
      $titulo.textContent = ""
    }
  })
}
const maximo = 0;

function scores() {
  const resArray = [];
  const $resultados = document.querySelectorAll(".resultados")
  
  $resultados.forEach(r =>{
    resArray.push(Number(r.innerHTML))
  })
  
  const resultadoMaximo = Math.max.apply(null, resArray);
  const resultadoPromedio = promedio()
  
  function promedio(){
    let suma= 0
    for(let i = 0; i < resArray.length; i++) {
      suma += resArray[i];
    }
    return (suma/resArray.length)
  }
  console.log(resultadoPromedio)
  const $estadisticas = d.getElementById("container-estadisticas")
  const $maxResult = d.createElement("h5")
  const $promedio = d.createElement("h5")

if(resultadoMaximo && resultadoPromedio){
  if(resultadoMaximo < 2.5) {
    $maxResult.textContent = "Tu puntaje máximo es : " + resultadoMaximo + " 👎"
  } else {
    $maxResult.textContent = "Tu puntaje máximo es : " + resultadoMaximo + "👍"
  }
  
  if(resultadoPromedio < 2.5) {
    $promedio.textContent = "Tu puntaje promedio es : " + resultadoPromedio + " 👎"
  } else {
    $promedio.textContent = "Tu puntaje promedio es : " + resultadoPromedio + "👍"
  }
} else {
  $maxResult.textContent = "Debes jugar para obtener tus primeros resultados."
  $maxResult.style.margin = "0 auto"
  $maxResult.style.fontSize = "3rem"
  $promedio.classList.add("none")
}

  
  function mostrarEstadisticas(btn) {
    d.addEventListener("click", (e) => {

      if(e.target.matches(btn) || e.target.matches(`${btn} *`)){
        $estadisticas.innerHTML = ``;
        $estadisticas.appendChild($maxResult)
        $estadisticas.appendChild($promedio)

        function obtenerNombre() {

          $titulo.textContent = "Estadisticas de " + nombre

          $tablero.appendChild($titulo)
        }
        obtenerNombre()
      }
    })
  }
  mostrarEstadisticas(".btn-estadisticas")

}
