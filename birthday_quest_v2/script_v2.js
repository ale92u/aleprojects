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
      <h4>💌 Carta especial</h4>
      <p>¡¡Holaa Sara!!</p>
      <p>Llevaba unos días pensando en hacerte un regalo. Ya te veo diciendo que no hace falta, pero a mi me nace, de
      verdad.</p>
      <p> Sara, eres una profesora excelente, y no solo eso, sino que eres una persona increíble. Cada momento que paso
      contigo, me lo paso en grande. Además, no tengo ninguna necesidad de actuar o intentar encajar y me das un respiro
      muy grande. </p>
      <p> Tengo la satisfacción de poder decir que cada pregunta que he tenido y cada error que he cometido en los exámenes,
      ha valido la pena para no cometerlos en selectividad. </p>
      <p> También, me alegro mucho de que me dijeras mis notas de las PAU. Al principio, cuando me preguntaste si quiería
      que fueras a apuntártelas, dudé por si no me salia bien la cosa. Menos mal que te dije que sí, porque sé que si me
      hubiese esperado a llegar a casa y verlas sola, no me habría alegrado tanto. Al final, me ha hecho mucha ilusión
      ver las notas juntas. </p> 
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

