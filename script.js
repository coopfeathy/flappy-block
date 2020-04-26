
var myGamePiece;
var myObstacles = [];
var myScore;
var paused = true;
var started = false

function startGame() {  
    myGamePiece = new component(30, 30, "red", 500, 120);
    myGamePiece.gravity = 0.05;
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        var rockTop = 0;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
        if (this.y < rockTop) {
            this.y = rockTop;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        if(crash){
            openNav("endScreen");
        }
        return crash;
    }
}

function updateGameArea() {
    if(!paused){
        var x, height, gap, minHeight, maxHeight, minGap, maxGap;
        for (i = 0; i < myObstacles.length; i += 1) {
            if (myGamePiece.crashWith(myObstacles[i])) {
                return;
            } 
        }
        myGameArea.clear();
        myGameArea.frameNo += 1;
        if (myGameArea.frameNo == 1 || everyinterval(150)) {
            x = myGameArea.canvas.width;
            minHeight = 20;
            maxHeight = 200;
            height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
            minGap = 50;
            maxGap = 200;
            gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
            myObstacles.push(new component(10, height, "green", x, 0));
            myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        }
        for (i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].x += -1;
            myObstacles[i].update();
        }
        myScore.text="SCORE: " + myGameArea.frameNo;
        myScore.update();
        myGamePiece.newPos();
        myGamePiece.update();
    }
   
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}



function openNav(x) {
    document.getElementById(x).style.display = "block";
    if(x == "endScreen"){
        started = false;
    }
}
  
function closeNav(x) {
    document.getElementById(x).style.display = "none";
    paused = false;
    if(x == "introScreen"){
        started = true;
    }
}

function togglePause(){
    if(!paused){
        paused = true;
        openNav("pauseScreen");
    } else if (paused){
        paused= false;
        closeNav("pauseScreen");
    }
}


function yes(){
    if(!paused){
        accelerate(-0.2)
    }
}
function no(){
    if(!paused){
        accelerate(0.1)
    }
}

document.onmousedown = yes;
document.onmouseup = no;



document.onkeypress = (e) => {
    if(!paused){
        if(e.key == " "){
            accelerate(-0.2)
        };
    };

    if(started){
        if(e.key == "p"){
            togglePause();
        }
    }

    if(!started){
        if(e.key == " "){
            startGame(); 
            closeNav('introScreen');
        }
    }
}

document.onkeyup = (e) => {
    if(!paused){
        if(e.key == " "){
            accelerate(0.1)
        }
    }
}


//Make sure that the button isnt active
document.addEventListener('click', function(e) {
    if(document.activeElement.toString() == '[object HTMLButtonElement]'){
        document.activeElement.blur(); 
    } 
});