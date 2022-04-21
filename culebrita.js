/*Estados del juego*/

const STATE_RUNNING = 1;
const STATE_LOSING = 2;

const TICK = 80;
const SQUARE_SIZE = 10;
const BOARD_WIDTH = 50;
const BOARD_HEIGHT = 50;
const GROW_SCALE = 5;
const DIRECTIONS_MAP = {
    'A': [-1,  0],
    'D': [ 1,  0],
    'S': [ 0,  1],
    'W': [ 0, -1],
    'a': [-1,  0],
    'd': [ 1,  0],
    's': [ 0,  1],
    'w': [ 0, -1],
  };

/*Inicializacion*/

  let state = {
    canvas: null,
    context: null,
    snake: [{x: 0, y: 0}],
    direction: {x: 1, y: 0},
    prey: {x: 0, y: 0},
    growing: 0,
    runState: STATE_RUNNING
  };

/*Poner la comida en lugares aleatorios*/

  function randomXY() {
    return {
      x: parseInt(Math.random() * BOARD_WIDTH),
      y: parseInt(Math.random() * BOARD_HEIGHT)
    };
  }

  function tick() {
    const head = state.snake[0];
    const dx = state.direction.x;
    const dy = state.direction.y;
    const highestIndex = state.snake.length - 1;
    let tail = {};
    let interval = TICK;
      
      Object.assign(tail, state.snake[state.snake.length - 1]);  /*Copiar todas las propiedades de la serpiente a tail*/
      
      let didScore = (  /*Para saber si comio la serpiente*/
        head.x === state.prey.x 
          && head.y === state.prey.y
      );
      
      /*Desplazamiento de la serpiente*/
      
      if (state.runState === STATE_RUNNING) {
      for (let idx = highestIndex; idx > -1; idx--) {
        const sq = state.snake[idx];

        if (idx === 0) {    /*Si el indice es cero seguira su desplazamineto*/
          sq.x += dx;
          sq.y += dy;
        } else {    /*Si no es la cabeza, seguiran los siguientes cuadros recorriendo la cabeza*/
          sq.x = state.snake[idx - 1].x;
          sq.y = state.snake[idx - 1].y;
        }
      } 
      }else if(state.runState === STATE_LOSING){
          interval = 10;
          
          if(state.snake.length > 0){
              state.snake.splice(0,1);
          }
          
          if (state.snake.length === 0){
              state.runState = STATE_RUNNING;
              state.snake.push(randomXY());
              state.prey = randomXY();
          }
      }
      
      if(detectCollision()){
          state.runState = STATE_LOSING;
          state.growing = 0;
      }
      
      if (didScore){
          state.growing += GROW_SCALE;
          state.prey = randomXY();/*Si la comio aparece en un lugar nuevo*/
      }
      
      if(state.growing > 0){
          state.snake.push(tail);
          state.growing -= 1;
      }
      
      requestAnimationFrame(draw);  /*Llama la funcion de dibujo*/
      setTimeout(tick, interval);
    }

    function detectCollision(){ /*Colisison de la serpiente*/
        const head = state.snake[0];
        
        if(head.x < 0
           || head.x >= BOARD_WIDTH 
           || head.y >= BOARD_HEIGHT
           || head.y < 0
          ){
            return true;
        }
        
        for (var idx= 1; idx < state.snake.length; idx ++){
            const sq = state.snake[idx];
            
            if(sq.x === head.x && sq.y === head.y){
                return true;
            }
        }
        
        return false;
    }

/*Dibujar la comida*/

  function drawPixel(color, x, y) {
    state.context.fillStyle = color;
    state.context.fillRect(
      x * SQUARE_SIZE,
      y * SQUARE_SIZE,
      SQUARE_SIZE,
      SQUARE_SIZE
    );
  }

/*Limpiar el cuadro*/

  function draw() {
    state.context.clearRect(0, 0, 500, 500);
      
      /*Dibujar culebra*/

    for (var idx = 0; idx < state.snake.length; idx++) {
      const {x, y} = state.snake[idx];
      drawPixel('#f7d708', x, y);
    }

    const {x, y} = state.prey;
    drawPixel('#F0E402', x, y);
  }


/*Llamamos al canvas*/

  window.onload = function() {
    state.canvas = document.querySelector('canvas');
    state.context = state.canvas.getContext('2d');
      
      /*Registro de teclas y direcciones*/

    window.onkeydown = function(e) {
      const direction = DIRECTIONS_MAP[e.key];

      if (direction) {
        const [x, y] = direction;
        if (-x !== state.direction.x
          && -y !== state.direction.y)
        {
          state.direction.x = x;    /*Si la dirrecion es diferente a la inversa donde se encuentra cambia la direccion*/
          state.direction.y = y;
        }
      }
    }

    tick();
  };

