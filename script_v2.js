const tileSize = 32;

const map = [
  "TTTTTTTTTTTTTTT",
  "TGGGGGGGGGGGGGT",
  "TGGGGGGGGGGGVGT",
  "TGGHPPPPEGGGGGT",
  "TGGGGGPGGGGGGGT",
  "TGGGGGPGGGGGGGT",
  "TGGUGGPPPPPPPRT",
  "TGGGGGGGGGGGGGT",
  "TTTTTTTTTTTTTTT"
];

const game = document.getElementById("map");
const messagePanel = document.getElementById("message");

if (!game) {
  throw new Error("Map element not found. Make sure #map exists in the HTML.");
}

const player = {
  x: 2,
  y: 2,
  direction: "down"
};

const playerEl = document.createElement("div");
playerEl.classList.add("player");
game.appendChild(playerEl);

let messageBox = null;
let messageVisible = false;

function createMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.style.left = `${x * tileSize}px`;
      tile.style.top = `${y * tileSize}px`;

      const type = map[y][x];
      if (type === "G") tile.classList.add("grass");
      if (type === "T") tile.classList.add("tree");
      if (type === "P") tile.classList.add("path");
      if (type === "H") tile.classList.add("house");
      if (type === "R") tile.classList.add("gift");
      if (type === "E") tile.classList.add("euclides");
      if (type === "U") tile.classList.add("gauss");
      if (type === "V") tile.classList.add("lhopital");

      game.appendChild(tile);
    }
  }
}

function renderPlayer() {
  playerEl.style.left = `${player.x * tileSize}px`;
  playerEl.style.top = `${player.y * tileSize}px`;
}

function getFrontTile() {
  let x = player.x;
  let y = player.y;

  if (player.direction === "up") y--;
  if (player.direction === "down") y++;
  if (player.direction === "left") x--;
  if (player.direction === "right") x++;

  return {
    x,
    y,
    type: map[y]?.[x]
  };
}

function canMoveTo(x, y) {
  return (
    y >= 0 &&
    y < map.length &&
    x >= 0 &&
    x < map[0].length &&
    map[y][x] !== "T"
  );
}

function openGift() {
  if (document.querySelector(".gift-screen")) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.classList.add("gift-screen");
  overlay.innerHTML = `
    <div class="gift-box">
      <h2>💌 Carta especial</h2>
      <p>¡¡Holaa Sara!!</p>
      <p> Primero de todo, muchas felicidades por tu cumpleaños. 🎉🎉 </p>
      <p> Segundo, esto no es una carta de despedida, sino una carta de agradecimiento.   </p>
      <p> Pues, quiero que sepas que estoy completamente satisfecha con el curso y ha sido un placer (dentro de toda la presión por la PAU y los exámenes...).   </p>
      <p> También, me alegro mucho de haber visto mis notas de la selectividad contigo. Sé que si lo hubiese visto sola en casa, aunque el resultado es bueno, yo me 
      acabaría exigiendo más y no estaría tan plena. Cuando estabamos sentadas calculando la nota y vi que iba sobrada, me sentí aliviada, pero la emoción al momento se
      la diste tú. Sigo pensando en que te hacía más ilusión verlas que a mí y esa ilusión me la contagiaste. Sentí la misma sensación de cuando era pequeña y abría los regalos 
      de navidad. Este recuerdo se quedará bien guardado en mi disco duro. 😉</p> 
      <p> Además, me gustaría contarte lo feliz que me hizo que vinieras a la graduación. Al principio, pensé que no ibas a llegar, pero en los últimos minutos antes de entrar 
      a la sala, te vi pasar y me hizo muchísima ilusión. Al fin y al cabo, sí, todos los profesores que me han dado clase, han estado y me han ayudado durante el curso, pero
      la que me ha acompañado de verdad, eres tú. ( Y literalmente, de un lado a otro del centro, jajaja). Ya tenía un motivo para subirme al escenario.  </p>
      <p> ¡¡¡Buaaah, encima me pillaste para bailar después de la cena!!! No he bailado en mi vida y me daba miedo pisarte. En verdad, me lo pasé genial y si pudiera 
      volver a repetirlo, lo haría. 💃 </p>
      <p> En fin, ojalá seguir charlando mientras vamos de un lado a otro del insti y ojalá poder seguir en tus guardias de la biblio los viernes. Que efímero todo.</p>
      <p> ¡Saraaaa, eres un soool! ☀️</p>
      <p> Con cariño, Alejandra. 💖</p>
      <button id="closeGift">Cerrar</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById("closeGift").onclick = () => {
    overlay.remove();
    hideMessage();
  };
}

function showMessage(text){
    if (messagePanel) {
        messagePanel.textContent = text;
        messageVisible = true;
        return;
    }

    if(!messageBox){
        messageBox = document.createElement("div");
        messageBox.classList.add("dialogue");
        document.body.appendChild(messageBox);
    }

    messageBox.textContent = text;
    messageBox.style.display = "block";
    messageVisible = true;
}

function hideMessage(){
    if (messagePanel) {
        messagePanel.textContent = "Usa las flechas para moverte";
    }

    if(messageBox){
        messageBox.style.display = "none";
    }

    messageVisible = false;
}

const npcDialogues = {
  "8,3": "Euclides: Los Elementos fue una de las obras matemáticas más influyentes de la historia.",
  "3,6": "Gauss: Prefería la calidad y el rigor antes que la publicación apresurada. Por ello, guardó en su diario matemático descubrimientos tan revolucionarios como las geometrías no euclidianas durante años, temiendo las críticas de la comunidad conservadora de su época.",
  "12,2": "L'Hôpital: Originalmente siguió la carrera militar, pero se vio obligado a abandonar el ejército debido a una grave miopía. Este cambio de rumbo lo llevó a dedicar su vida por completo a las matemáticas."

};

function interact() {
  const front = getFrontTile();

  if (front.type === "R") {
    openGift();
    return;
  }

  if (
    front.type === "E" ||
    front.type === "U" ||
    front.type === "V"
  ) {
    const text = npcDialogues[`${front.x},${front.y}`];
    if (text) {
      showMessage(text);
    }
    return;
  }
}

function handleKeyDown(event) {
  let newX = player.x;
  let newY = player.y;

  if (event.key === "ArrowUp") {
    newY--;
    player.direction = "up";
  }

  if (event.key === "ArrowDown") {
    newY++;
    player.direction = "down";
  }

  if (event.key === "ArrowLeft") {
    newX--;
    player.direction = "left";
  }

  if (event.key === "ArrowRight") {
    newX++;
    player.direction = "right";
  }

  if (canMoveTo(newX, newY)) {
    player.x = newX;
    player.y = newY;
    renderPlayer();
  }

  if (event.key.toLowerCase() === "e") {
    if (messageVisible) {
      hideMessage();
    } else {
      interact();
    }
  }
}

document.addEventListener("keydown", handleKeyDown);
createMap();
renderPlayer();

