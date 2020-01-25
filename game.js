const btn = document.querySelector('button');

function random(number) {
  return Math.floor(Math.random() * (number+1));
}

btn.onclick = function() {
  const rndCol = 'rgb(' + random(255) + ',' + random(255) + ',' + random(255) + ')';
  document.body.style.backgroundColor = rndCol;
}

var counter = 1;
var blockSize = 10;
var maxspeed = 2;
var acceleration = 2
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - blockSize;
canvas.height = window.innerHeight - 100;
var width = canvas.width;
var height = canvas.height;

var widthInBlocks = Math.round(width / blockSize);
var heightInBlocks = Math.round(height / blockSize);

var score = 0;


var drawBorder = function() {
  ctx.fillStyle = "Gray";
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

var drawScore = function() {
  ctx.textBaseline = "top";
  ctx.textAlign = "top";
  ctx.fillStyle = "Black";
  ctx.font = "20px Courier";
  ctx.fillText(counter + ", Score: " + score + ", x: " + snake.block.col+ ", y: " + snake.block.row + ", xspeed: " + snake.xspeed + ", yspeed: " + snake.yspeed, blockSize, blockSize);

};

var gameOver = function() {
  clearInterval(intervalId);
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "Black";
  ctx.font = "60px Courier";
  ctx.fillText("Game Over", width / 2, height / 2);
};

var circle = function(x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};


// Block constructor
var Block = function(col, row) {
  this.col = col;
  this.row = row;
};

Block.prototype.drawSquare = function(color) {
  var x = this.col * blockSize;
  var y = this.row * blockSize;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
};

Block.prototype.drawCircle = function(color) {
  var centerX = this.col * blockSize + blockSize / 2;
  var centerY = this.row * blockSize + blockSize / 2;
  ctx.fillStyle = color;
  circle(centerX, centerY, blockSize / 2, true);
};

Block.prototype.equal = function(otherBlock) {
  return this.col === otherBlock.col && this.row === otherBlock.row;
};


// Snake constructor
var Snake = function() {
  this.block = new Block(7, 5);
  this.xspeed = 0;
  this.yspeed = 0;
  this.direction = "right";
};

Snake.prototype.draw = function() {
  this.block.drawSquare("Red");
};

Snake.prototype.move = function() {
  this.block.col += this.xspeed;
  this.block.row += this.yspeed;
  if (this.block.row > heightInBlocks - 2) {
    this.block.row = heightInBlocks - 2;
  }
};


Snake.prototype.setDirection = function(newDirection) {
    if (newDirection === "right" && snake.xspeed < maxspeed) {
        snake.xspeed += acceleration;
    } else if (newDirection === "left" && snake.xspeed > -maxspeed) {
        snake.xspeed -= acceleration;
    } else if (newDirection === "up" && snake.yspeed > -maxspeed) {
        snake.yspeed -= acceleration;
    };
};

Snake.prototype.fall = function() {
  // If not on Earth - falling!
  if (this.block.row < heightInBlocks - 2) {
    // this.block.row += this.yspeed;
    this.yspeed += 1;
  } else {
    this.yspeed = 0;
  }

  // Slow down!
  if (this.xspeed > 0) {
    this.xspeed -= 1;
  } else if (this.xspeed < 0) {
    this.xspeed += 1;
  }
}

var keys = {};

$(document).keydown(function (e) {
    keys[e.which] = true;
    // changeDirection();
    printKeys();
});

$(document).keyup(function (e) {
    delete keys[e.which];
    // changeDirection();
    printKeys();
});

// Handle key press
var directions = {
  37: "left",
  38: "up",
  32: "up",
  39: "right",
  40: "down"
}

function changeDirection() {
  for (var i in keys) {
      if (!keys.hasOwnProperty(i)) continue;

      var newDirection = directions[i];

      if (newDirection !== undefined) {
        snake.setDirection(newDirection);
        console.log(newDirection);
      } else {
        console.log(i + " - don't know the key!")
      }
  }
};

function printKeys() {
    var html = '';
    for (var i in keys) {
        //if (!keys.hasOwnProperty(i)) continue;
        html += '<p>' + i + '</p>';
    }
    $('#out').html(html);
}

// Prepare and start game

let sprites = [];
var snake = new Snake();
sprites.push(snake);

// var apple = new Apple();

var gameloop = function() {
  ctx.clearRect(0, 0, width, height);
  changeDirection()
  drawBorder();
  drawScore();

  // snake.fall();
  for (let sprite of sprites) {
    snake.move();
    sprite.fall();
    sprite.draw();
  }
  counter += 1;
};

var intervalId = setInterval(gameloop, 50);
