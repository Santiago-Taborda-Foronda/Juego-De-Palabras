document.addEventListener("DOMContentLoaded", () => {
    const addPlayerBtn = document.querySelector(".boton-añadir-participante");
    const startGameBtn = document.querySelector(".boton-iniciar-juego");
    const playerListContainer = document.querySelector(".nombres-participantes");
    const currentPlayerSpan = document.getElementById("current-player");
    const letterDisplay = document.querySelector(".letra-aleatoria");
    const timerSpan = document.getElementById("time");
    const wordInput = document.querySelector(".ingresar-palabra");
    const wordList = document.getElementById("word-list");
    const rankingList = document.getElementById("ranking-list");

    let players = [];
    let currentPlayerIndex = 0;
    let timeLeft = 60;
    let timer;
    let wordCount = {};
    let totalTurns = 0; // control de rondas
    let usedWords = new Set(); // Inicialización del conjunto de palabras usadas

   // Agregar jugador
    addPlayerBtn.addEventListener("click", () => {
    const playerName = prompt("Ingresa el nombre del jugador:");

    // Validar que el nombre no esté vacío y solo contenga letras y espacios
    if (playerName && /^[A-Za-z\s]+$/.test(playerName)) {
        // Verificar si el nombre ya existe
        if (players.includes(playerName)) {
            alert("Este nombre ya está en uso. Por favor, agrega algo para diferenciarlo (por ejemplo, un apellido o iniciales).");
            return; // Detener la función si el nombre ya existe
        }

        if (players.length < 4) {
            players.push(playerName);
            wordCount[playerName] = 0; // Inicializa el contador de palabras
            updatePlayerList();
        } else {
            alert("Solo se permiten 4 jugadores.");
        }
    } else {
        alert("Nombre inválido. Solo se permiten letras y espacios.");
    }
});

    function updatePlayerList() {
        playerListContainer.innerHTML = players.map(p => `<p>${p}</p>`).join("");
    }

    // Iniciar juego
    startGameBtn.addEventListener("click", () => {
        if (players.length < 2) {
            alert("Se necesitan al menos 2 jugadores.");
            return;
        }
        currentPlayerIndex = 0;
        totalTurns = 0; // reiniciar el contador de turnos al iniciar el juego
        startTurn();
    });

    // Iniciar turno
    function startTurn() {
        clearInterval(timer);
        timeLeft = 60;
        timerSpan.textContent = timeLeft;

        currentPlayerSpan.textContent = players[currentPlayerIndex];
        letterDisplay.textContent = getRandomLetter();

        timer = setInterval(() => {
            timeLeft--;
            timerSpan.textContent = timeLeft;
            if (timeLeft <= 0) {
                endTurn();
            }
        }, 1000);
    }

    // Finalizar turno
    function endTurn() {
        clearInterval(timer);
        totalTurns++;
    
        // Mostrar mensaje de cambio de turno
        alert(`Turno terminado. Ahora juega ${players[(currentPlayerIndex + 1) % players.length]}`);
    
        // Finalizar el juego después de que pasen todos los turnos
        if (totalTurns >= players.length) {
            endGame();
            return;
        }
    
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
        // Esperar 2 segundos antes de iniciar el nuevo turno
        setTimeout(startTurn, 2000);
    }
    
    function getRandomLetter() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Registrar palabra
    wordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const word = wordInput.value.trim().toUpperCase();
            if (word === "") return;
            const player = players[currentPlayerIndex];
            const currentLetter = letterDisplay.textContent;
    
            if (!word.startsWith(currentLetter)) {
                alert(`La palabra debe comenzar con la letra ${currentLetter}`);
                wordInput.value = "";
                return;
            }
    
            if (usedWords.has(word)) {
                alert("Esta palabra ya ha sido utilizada. Intenta otra.");
                wordInput.value = "";
                return;
            }
    
            usedWords.add(word);
    
            const li = document.createElement("li");
            li.textContent = `${player}: ${word}`;
            wordList.appendChild(li);
    
            wordCount[player] += 1;
            updateRanking();
            wordInput.value = "";
        }
    });

    function updateRanking() {
        rankingList.innerHTML = "";
        const sortedPlayers = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

        sortedPlayers.forEach(([player, words]) => {
            const li = document.createElement("li");
            li.textContent = `${player}: ${words} palabras`;
            rankingList.appendChild(li);
        });
    }
    
    function endGame() {
        const sortedPlayers = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
        const winner = sortedPlayers[0][0];
        const winnerWords = sortedPlayers[0][1];

        alert(`¡El juego ha terminado! El ganador es ${winner} con ${winnerWords} palabras.`);
    }
    

    
});