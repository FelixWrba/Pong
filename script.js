//Variables-----------------------------------------------------
let titleScreen = document.getElementById('titleScreen');
let gameScreen = document.getElementById('gameScreen');
let winScreen = document.getElementById('winScreen');
let settingsScreen = document.getElementById('settingsScreen');
let settings = {
    "maxPoints": [localStorage.getItem('maxPoints'), document.getElementById('maxPoints')],
    "bot": [JSON.parse(localStorage.getItem('bot')), document.getElementById('bot')],
    "botMode": [localStorage.getItem('botMode'), document.getElementById('botMode')],
    "uiScale": [localStorage.getItem('uiScale'), document.getElementById('uiScale')]
};
let botMultiplier = 100;
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let key = {};
let id;
let points = [0, 0];
let gameObjects = {
    "player1": {
        x: 10,
        y: 10
    },
    "player2": {
        x: 700,
        y: 10
    },
    "ball": {
        x: 100,
        y: 100,
        velX: 5,
        velY: 1
    }
}

//prevent body from vanishing due to undefined scale-----------------------------
if(!settings.uiScale[0]) {
    localStorage.setItem('uiScale', 10);
}

//UI-Menu functions---------------------------
const Menu = {
    goMainMenu: function () {
        titleScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        winScreen.style.display = 'none';
        settingsScreen.style.display = 'none';
    },
    goWinScreen: function (player, point) {
        clearInterval(id);
        titleScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        winScreen.style.display = 'block';
        settingsScreen.style.display = 'none';
        document.getElementById('winnerHeading').innerHTML = player + ' won!';
        document.getElementById('winPoints').innerHTML = `${point[0]} : ${point[1]}`;
    },
    goSettings: function () {
        titleScreen.style.display = 'none';
        gameScreen.style.display = 'none';
        winScreen.style.display = 'none';
        settingsScreen.style.display = 'block';
    },
    saveSettings: function () {
        localStorage.setItem('maxPoints', settings.maxPoints[1].value);
        localStorage.setItem('bot', settings.bot[1].checked);
        localStorage.setItem('botMode', settings.botMode[1].value);
        localStorage.setItem('uiScale', settings.uiScale[1].value);
        document.querySelector('body').style.scale = settings.uiScale[0] / 10;
        settings = {
            "maxPoints": [localStorage.getItem('maxPoints'), document.getElementById('maxPoints')],
            "bot": [localStorage.getItem('bot'), document.getElementById('bot')],
            "botMode": [localStorage.getItem('botMode'), document.getElementById('botMode')],
            "uiScale": [localStorage.getItem('uiScale'), document.getElementById('uiScale')]
        };
    },
    loadSettings: function () {
        settings.maxPoints[1].value = localStorage.getItem('maxPoints');
        settings.bot[1].checked = JSON.parse(localStorage.getItem('bot'));
        settings.botMode[1].value = localStorage.getItem('botMode');
        settings.uiScale[1].value = localStorage.getItem('uiScale');
        document.querySelector('body').style.scale = settings.uiScale[0] / 10;
    },
    quitGame: function () {
        document.querySelector('body').innerHTML = '';
    },
    startGame: function () {
        titleScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        winScreen.style.display = 'none';
        settingsScreen.style.display = 'none';
        points = [0, 0];
        //initialise bot, physics and draw intervals-------------------------------
        if(settings.botMode[0] == 'easy') {
            botMultiplier = 250;
        }
        else if(settings.botMode[0] == 'normal') {
            botMultiplier = 200;
        }
        else if(settings.botMode[0] == 'hard') {
            botMultiplier = 150;
        }
        else {
            botMultiplier = 105;
        }
        id = setInterval(physics, 1000 / 60);
        draw();
    }
}

//add key listeners which apply key code to key variable---------------------
document.addEventListener('keydown', e => key[e.keyCode] = true);
document.addEventListener('keyup', e => key[e.keyCode] = false);
document.addEventListener('mousemove', e => {if(settings.maxPoints[0] == 4) {
    gameObjects.player1.y = e.y;
}});

//draws gameObjects onto canvas----------------------------------------------
function draw() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 720, 480);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(gameObjects.player1.x, gameObjects.player1.y, 10, 100);
    ctx.fillRect(gameObjects.player2.x, gameObjects.player2.y, 10, 100);
    ctx.fillRect(gameObjects.ball.x, gameObjects.ball.y, 10, 10);
    ctx.fillRect(359, 10, 2, 460);
    ctx.font = '20px sans-serif';
    ctx.fillText(`${points[0]}   ${points[1]}`, 340, 450, 100);
    requestAnimationFrame(draw);
}

function physics() {
    //check for keypresses and update player?.y position----------
    if (key[87]) {
        gameObjects.player1.y -= 5;
    }
    if (key[83]) {
        gameObjects.player1.y += 5;
    }
    if (key[38] && settings.bot[0] != true) {
        gameObjects.player2.y -= 5;
    }
    if (key[40] && settings.bot[0] != true) {
        gameObjects.player2.y += 5;
    }
    if (key[27]) {
        window.location.href = '';
    }

    //prevent players from going outside the screen-----------------
    if (gameObjects.player1.y < 0) {
        gameObjects.player1.y = 0;
    }
    else if (gameObjects.player1.y > 380) {
        gameObjects.player1.y = 380;
    }
    if (gameObjects.player2.y < 0) {
        gameObjects.player2.y = 0;
    }
    else if (gameObjects.player2.y > 380) {
        gameObjects.player2.y = 380;
    }

    // update the balls position relativly to its velocity--------------
    gameObjects.ball.x += gameObjects.ball.velX;
    gameObjects.ball.y += gameObjects.ball.velY;

    //resets the ball and updates the points if the player misses the ball-----------
    if (gameObjects.ball.x <= 0) {
        gameObjects.ball = {
            x: 200,
            y: 200,
            velX: 5,
            velY: 1
        }
        points[1] += 1;
    }
    if (gameObjects.ball.x >= 720) {
        gameObjects.ball = {
            x: 200,
            y: 200,
            velX: 5,
            velY: 1
        }
        points[0] += 1;
    }
    //if the ball touches the top or bottom it will bounce of it-------------------
    if (gameObjects.ball.y < 0 || gameObjects.ball.y > 480) {
        gameObjects.ball.velY = -gameObjects.ball.velY;
    }

    //calculates the angle that the ball will bounce of the player---------------------------------------------------------
    if (gameObjects.ball.x < 20 && gameObjects.ball.y > gameObjects.player1.y && gameObjects.ball.y < gameObjects.player1.y + 100) {
        if (gameObjects.ball.y > gameObjects.player1.y || gameObjects.ball.y < gameObjects.player1.y + 30) {
            gameObjects.ball.velY = (gameObjects.ball.y - gameObjects.player1.y - 40) * 0.1;
        }
        else if (gameObjects.ball.y > gameObjects.player1.y + 70 || gameObjects.ball.y < gameObjects.player1.y + 100) {
            gameObjects.ball.velY = -(gameObjects.ball.y - gameObjects.player1.y - 40) * 0.1;
        }
        gameObjects.ball.velX = -gameObjects.ball.velX;
    }
    else if (gameObjects.ball.x > 700 && gameObjects.ball.y > gameObjects.player2.y && gameObjects.ball.y < gameObjects.player2.y + 100) {
        if (gameObjects.ball.y > gameObjects.player2.y || gameObjects.ball.y < gameObjects.player2.y + 30) {
            gameObjects.ball.velY = (gameObjects.ball.y - gameObjects.player2.y - 40) * 0.1;
        }
        else if (gameObjects.ball.y > gameObjects.player2.y + 70 || gameObjects.ball.y < gameObjects.player2.y + 100) {
            gameObjects.ball.velY = -(gameObjects.ball.y - gameObjects.player2.y - 40) * 0.1;
        }
        gameObjects.ball.velX = -gameObjects.ball.velX;
    }

    //Calculate position of Bot-----------------------------------------------------
    if (settings.bot[0] == true) {
        if (gameObjects.player2.y + Math.random() * botMultiplier - (botMultiplier - 100) / 2 < gameObjects.ball.y) {
            gameObjects.player2.y += 5;
        }
        else if (gameObjects.player2.y + Math.random() * botMultiplier - (botMultiplier - 100) / 2 > gameObjects.ball.y) {
            gameObjects.player2.y -= 5;
        }
    }

    //if points are higher than max points show win screen----------------------------------
    if (points[0] >= settings.maxPoints[0]) {
        Menu.goWinScreen('Player 1', points);
    }
    else if (points[1] >=  settings.maxPoints[0]) {
        Menu.goWinScreen('Player 2', points);
    }
    if (points[1] >= settings.maxPoints[0] && settings.bot[0]) {
        Menu.goWinScreen('Player 2(Bot)', points);
    }
}
//display Menu and loadSettings
Menu.loadSettings();
Menu.goMainMenu();