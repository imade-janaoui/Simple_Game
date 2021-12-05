startTime = 0;
var elem = document.getElementById("gameCanvas");
elem.addEventListener('webkitfullscreenchange', function(e) {
    config.isFullScreen = (!config.isFullScreen);
    if (config.isFullScreen) {
        var elem = document.getElementById("gameCanvas");
        elem.setAttribute("width", screen.width);
        elem.setAttribute("height", screen.height);
        container.width = screen.width;
        container.height = screen.height;
        config.font="30px arial";
    } else {
        var elem = document.getElementById("gameCanvas");
        elem.setAttribute("width", 800);
        elem.setAttribute("height", 500);
        container.width = 800;
        container.height = 500;
         config.font="25px arial";
    }
}, false);
var config = {isFullScreen: false,font:"25px arial",fontColor:"#fff"};
function fullScreen() {
    var elem = document.getElementById("gameCanvas");
    elem.setAttribute("width", screen.width);
    elem.setAttribute("height", screen.height);
    container.width = screen.width;
    container.height = screen.height;
    ctx.fillStyle = config.fontColor;
    ctx.fillText("Click Here To Start Game", container.width / 2 - 5 * 25, container.height / 2);
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
}
function playAgain() {
    startTime = new Date();
    gameLoop = setInterval(moveBalls, 20);
    enemyIncrementLoop = setInterval(incrementEnemy, 5000);
    init();
    $("#gameCanvas").attr("onclick", "");
}

var container = {id: "container", width: 1500, height: 700};
var player = {id: "player", x: container.width / 2, y: container.height - 50, width: 50, height: 80, speedX: 20, speedY: 5};

var objects;
function init() {
    objects = [
    ];
    incrementEnemy();
}
function incrementEnemy() {
    if (objects.length < 10) {
        r = Math.ceil(Math.random() * 255);
        g = Math.ceil(Math.random() * 255);
        b = Math.ceil(Math.random() * 255);
        color = "rgba(" + r + "," + g + "," + b + ")";
        xPosition = container.width * Math.random();
        xRadius = 50;
        xRadius = Math.ceil(Math.random() * 40) + 10;
        xSpeed = Math.ceil(Math.random() * 6) + 2;
        ySpeed = Math.ceil(Math.random() * 6) + 2;
        if (xPosition <= 2 * xRadius || xPosition + 2 * xRadius >= container.width) {
            xPosition = container.width / 2;
        }
        objects.push({id: "#circle", radius: xRadius, speedX: xSpeed, speedY: ySpeed, color: color, centerX: xPosition, centerY: 80});
    }
}
var c = document.getElementById("gameCanvas");
var ctx = c.getContext("2d");
ctx.font = config.font;
ctx.fillText("Click Here To Start Game", container.width / 2 - 5 * 25, container.height / 2);
window.addEventListener("keydown", gamekeyboardlistener);
document.getElementById("gameCanvas").addEventListener("mousemove", gamemousemove);
mouseOffset = 1;
currentLoopCountOffset = 0;
function gamemousemove() {
    if (currentLoopCountOffset == mouseOffset) {
        currentLoopCountOffset = 0;
        if (config.isFullScreen) 
        {
            if (event.pageX - this.offsetLeft > player.width / 2 && event.pageX - this.offsetLeft <= container.width - player.width / 2) {
                player.x = event.pageX - player.width / 2;
            }
            if (event.pageY > player.height / 2 && event.pageY <= container.height - player.height / 2) {
                player.y = event.pageY - player.height / 2;
            }
        } else {
            if (event.pageX - this.offsetLeft > player.width / 2 && event.pageX - this.offsetLeft <= container.width - player.width / 2) {
                player.x = event.pageX - player.width / 2 - this.offsetLeft;
            }
            if (event.pageY - this.offsetTop > player.height / 2  && event.pageY - this.offsetTop <= container.height - player.height / 2) {
                player.y = event.pageY - player.height / 2 - this.offsetTop;
            }
        }
      

    }
    currentLoopCountOffset++;
}
function gamekeyboardlistener() {
    if (event.keyCode == 37) {
        e("Left");
        if (player.x > 0)
            player.x -= player.speedX;
    }
    if (event.keyCode == 38) {
        e("Top");
    }
    if (event.keyCode == 39) {
        e("Right");
        if (player.x + player.width + player.speedX < container.width)
            player.x += player.speedX;
    }
    if (event.keyCode == 40) {
        e("Bottom");
    }
}
function moveBalls() {
    var c = document.getElementById("gameCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, container.width, container.height);
    for (i in objects) {
        object = objects[i];
        //put collision detection
        if (
                (object.centerY + object.radius * 0.75 >= player.y && object.centerY + object.radius * 0.75 <= player.y + player.height)
                ||
                (object.centerY - object.radius * 0.75 >= player.y && object.centerY - object.radius * 0.75 <= player.y + player.height)
                ) {
            if (
                    (object.centerX + object.radius * 0.75 > player.x && object.centerX + object.radius * 0.75 < player.x + player.width)
                    ||
                    (object.centerX - object.radius * 0.75 > player.x && object.centerX - object.radius * 0.75 < player.x + player.width)

                    ) {
                var finishTime=new Date();
                score = Math.ceil((finishTime - startTime) / 1000);
                if (score < 0)
                    score *= -1;
                ctx.fillStyle = config.fontColor;
                ctx.fillText("Game Over", container.width / 2 - 3 * 25, container.height / 2);
                ctx.fillText("Score : " + score + " seconds", container.width / 2 - 4 * 25, container.height / 2 + 35);
                var imgRestart= document.getElementById("restart");
                var restart = {x:container.width *0.5-50,y:container.height*0.75-50,width:100,height:100};
                ctx.drawImage(imgRestart, restart.x,  restart.y, restart.width, restart.height);
                clearInterval(gameLoop);
                clearInterval(enemyIncrementLoop);
                $("#gameCanvas").attr("onclick", "playAgain()");
            }
        }
        if (object.centerX + object.radius > container.width || object.centerX - object.radius < 0) {
            object.speedX *= -1;
        }
        if (object.centerY + object.radius > container.height || object.centerY - object.radius < 0) {
            object.speedY *= -1;
        }
        ctx.beginPath();
        ctx.fillStyle = object.color;
        ctx.arc(object.centerX, object.centerY, object.radius, 0, 2 * Math.PI);
        ctx.fill();
        object.centerX += object.speedX;
        object.centerY += object.speedY;
    }
    var img = document.getElementById("scream");
    
    ctx.drawImage(img, player.x, player.y, player.width, player.height);
    cloud.x = cloud.x + cloud.speedX;
    if (cloud.x > container.width) {
        cloud.x = (cloud.width * -1) - 20;
    }
    ctx.font = config.font;
    ctx.fillStyle = config.fontColor;
    ctx.fillText("Sec : " + (new Date()-startTime) + "", container.width *0.8, 40);
    
}