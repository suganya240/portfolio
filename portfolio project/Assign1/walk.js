const area = {
  element: document.getElementById('area'),
  width: 600,
  height: 400,
};

function initialize() {
  area.element.style.width = area.width + 'px';
  area.element.style.height = area.height + 'px';
  document.body.appendChild(area.element);
}
function moveTo(ball, x, y) {
  ball.element.style.left = x + 'px';
  ball.element.style.top = y + 'px';
}

function changeDirectionIfNecessary(ball, x, y) {
  if (x < 0 || x > area.width - ball.width) {
    ball.dx = -ball.dx;
  }
  if (y < 0 || y > area.height - ball.height) {
    ball.dy = -ball.dy;
  }
}

function create(color, dx, dy) {
  const newBall = {};
  newBall.dx = dx;
  newBall.dy = dy;

  const ballElem = document.createElement("div");
  ballElem.className = "ball";
  ballElem.style.backgroundColor = color;
  ballElem.style.width = "30px";
  ballElem.style.height = "30px";

  newBall.element = ballElem;
  newBall.width = parseInt(ballElem.style.width);
  newBall.height = parseInt(ballElem.style.height);

  area.element.appendChild(ballElem);

  return newBall;
}


function update(ball, x, y) {
  moveTo(ball, x, y);
  changeDirectionIfNecessary(ball, x, y);

  setTimeout(function () {
    update(ball, x + ball.dx, y + ball.dy);
  }, 16);
}


initialize();
const ball1 = create('blue', 4, 3);
const ball2 = create('red', 1, 5);
const ball3 = create('green', 2, 2);

moveTo(ball1, 1, 1);
moveTo(ball2, 10, 10);
moveTo(ball3, 20, 20);

update(ball1, 70, 0);
update(ball2, 20, 200);
update(ball3, 300, 330);
