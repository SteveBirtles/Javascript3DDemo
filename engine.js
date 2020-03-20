let vertices = [{x: 10 , y: 10, z: 10}, // 0
            {x: 10, y: -10, z: 10},     // 1
            {x: 10, y: -10, z: -10},    // 2
            {x: 10, y: 10, z: -10},     // 3
            {x: -10, y: 10, z: 10},     // 4
            {x: -10, y: -10, z: 10},    // 5
            {x: -10, y: -10, z: -10},   // 6
            {x: -10, y: 10, z: -10}];   // 7

let edges = [{start: vertices[0], end: vertices[1]},   // one square
             {start: vertices[1], end: vertices[2]},
             {start: vertices[2], end: vertices[3]},
             {start: vertices[3], end: vertices[0]},

             {start: vertices[4], end: vertices[5]},    // the other square
             {start: vertices[5], end: vertices[6]},
             {start: vertices[6], end: vertices[7]},
             {start: vertices[7], end: vertices[4]},

             {start: vertices[0], end: vertices[4]},  // the other bits
             {start: vertices[1], end: vertices[5]},
             {start: vertices[2], end: vertices[6]},
             {start: vertices[3], end: vertices[7]}];

let centres = [];

let theta = 0;
let psi = 0;

let pressedKeys = {};

function letsplay() {

  for (let i = 0; i < 100; i++ ) {
    centres.push({x: Math.random()*1000-500,
                  y: Math.random()*1000-500,
                  z: Math.random()*1000-500});
  }

  window.addEventListener("keydown", event => pressedKeys[event.key] = true);
  window.addEventListener("keyup", event => pressedKeys[event.key] = false);

  window.requestAnimationFrame(renderFrame);

}

function renderFrame (frameTime) {

  const canvas = document.getElementById("engineCanvas");
  const context = canvas.getContext("2d");

  const zoom = 500;
  const offset = 5;

  context.clearRect(0,0,1024,768);

  context.strokeStyle = "blue";

  if (pressedKeys["ArrowLeft"]) theta += 0.02;
  if (pressedKeys["ArrowRight"]) theta -= 0.02;

  if (pressedKeys["ArrowUp"]) psi += 0.02;
  if (psi > Math.PI/2) psi = Math.PI/2;

  if (pressedKeys["ArrowDown"]) psi -= 0.02;
  if (psi < -Math.PI/2) psi = -Math.PI/2;

    // SIMPLE ROTATION
  /* u0 = Math.cos(theta)*edge.start.x + Math.sin(theta)*edge.start.z;
  v0 = edge.start.y;
  w0 = -Math.sin(theta)*edge.start.x + Math.cos(theta)*edge.start.z + 40

  u1 = Math.cos(theta)*edge.end.x + Math.sin(theta)*edge.end.z;
  v1 = edge.end.y;
  w1 = -Math.sin(theta)*edge.end.x + Math.cos(theta)*edge.end.z + 40; */

  let matrix1 = [[1,0,0],
                 [0,Math.cos(psi), Math.sin(psi)],
                 [0,-Math.sin(psi), Math.cos(psi)]];

  let matrix2 = [[Math.cos(theta), 0, Math.sin(theta)],
                [0, 1, 0],
                [-Math.sin(theta), 0, Math.cos(theta)]];

                 let matrixProduct = [[matrix1[0][0]*matrix2[0][0] + matrix1[0][1]*matrix2[1][0] + matrix1[0][2]*matrix2[2][0],
                        matrix1[0][0]*matrix2[0][1] + matrix1[0][1]*matrix2[1][1] + matrix1[0][2]*matrix2[2][1],
                        matrix1[0][0]*matrix2[0][2] + matrix1[0][1]*matrix2[1][2] + matrix1[0][2]*matrix2[2][2]],

                       [matrix1[1][0]*matrix2[0][0] + matrix1[1][1]*matrix2[1][0] + matrix1[1][2]*matrix2[2][0],
                        matrix1[1][0]*matrix2[0][1] + matrix1[1][1]*matrix2[1][1] + matrix1[1][2]*matrix2[2][1],
                        matrix1[1][0]*matrix2[0][2] + matrix1[1][1]*matrix2[1][2] + matrix1[1][2]*matrix2[2][2]],

                       [matrix1[2][0]*matrix2[0][0] + matrix1[2][1]*matrix2[1][0] + matrix1[2][2]*matrix2[2][0],
                        matrix1[2][0]*matrix2[0][1] + matrix1[2][1]*matrix2[1][1] + matrix1[2][2]*matrix2[2][1],
                        matrix1[2][0]*matrix2[0][2] + matrix1[2][1]*matrix2[1][2] + matrix1[2][2]*matrix2[2][2]]];


      for (let i = 0; i < 100; i++) {

        for (let edge of edges) {

        let u0 = matrixProduct[0][0] * (edge.start.x - centres[i].x)
                + matrixProduct[0][1] * (edge.start.y - centres[i].y)
                + matrixProduct[0][2] * (edge.start.z - centres[i].z);
        let v0 = matrixProduct[1][0] * (edge.start.x - centres[i].x)
                + matrixProduct[1][1] * (edge.start.y - centres[i].y)
                + matrixProduct[1][2] * (edge.start.z - centres[i].z);
        let w0 = matrixProduct[2][0] * (edge.start.x - centres[i].x)
                + matrixProduct[2][1] * (edge.start.y - centres[i].y)
                + matrixProduct[2][2] * (edge.start.z - centres[i].z);

        let u1 = matrixProduct[0][0] * (edge.end.x - centres[i].x)
                + matrixProduct[0][1] * (edge.end.y - centres[i].y)
                + matrixProduct[0][2] * (edge.end.z - centres[i].z);
        let v1 = matrixProduct[1][0] * (edge.end.x - centres[i].x)
                + matrixProduct[1][1] * (edge.end.y - centres[i].y)
                  + matrixProduct[1][2] * (edge.end.z - centres[i].z);
        let w1 = matrixProduct[2][0] * (edge.end.x - centres[i].x)
                + matrixProduct[2][1] * (edge.end.y - centres[i].y)
                + matrixProduct[2][2] * (edge.end.z - centres[i].z);

        if (w0 > 0 && w1 > 0) {
          context.beginPath();
          context.moveTo(u0 * zoom / (w0 + offset) + 512, v0 * zoom / (w0 + offset) + 384);
          context.lineTo(u1 * zoom / (w1 + offset) + 512, v1 * zoom / (w1 + offset) + 384);
          context.stroke();
        }

    }

  }

  window.requestAnimationFrame(renderFrame);

}
