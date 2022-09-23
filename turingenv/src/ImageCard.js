import React from "react";
import Sketch from "react-p5";

//This componnent contains the bulk of the visualization logic

let grid;
let next;

let dA = 1; 
let dB = 0.5;
let feed = 0.03799; 
let k = 0.05888;

export class ImgMediaCard extends React.Component {
  constructor() {
    super();
    this.setup = this.setup.bind(this);
    this.draw = this.draw.bind(this);
  }

  setup(p5, canvasParentRef) {
    // create the canvas for the visualization
    p5.createCanvas(400, 400).parent(canvasParentRef);
    p5.pixelDensity(1);
    grid = [];
    next = [];
 
    for (let x = 0; x < p5.width; x++) {
        grid[x] = [];
        next[x] = [];
        for (let y = 0; y < p5.height; y++) {
            grid[x][y] = {a:1, b:0};
            next[x][y] = {a:1, b:0};
        }
    }

    //seed an area of pixels to start the reaction, try something different here, contours etc
    for (let i = 100; i < 120; i++) {
        for (let j = 100; j < 120; j++) {
            grid[i][j].b = 1;
        }
        }

        for (let i = 200; i < 220; i++) {
            for (let j = 200; j < 220; j++) {
                grid[i][j].b = 1;
            }
            }

  }

  draw(p5) {
    p5.background(51);

    for (let x = 1; x < p5.width-1; x++) {
        for (let y = 1; y < p5.height-1; y++) {
            let a = grid[x][y].a
            let b = grid[x][y].b
            next[x][y].a = a + 
                        (dA * this.laplaceA(x, y)) - 
                        (a * b * b) + 
                        (feed * (1-a));
            next[x][y].b = b + 
                        (dB * this.laplaceB(x, y)) + 
                        (a * b * b) - 
                        (k + feed) * b;

            next[x][y].a = p5.constrain(next[x][y].a, 0, 1); 
            next[x][y].b = p5.constrain(next[x][y].b, 0, 1);

          }
        }

    p5.loadPixels();
    for (let x = 0; x < p5.width; x++) {
        for (let y = 0; y < p5.height; y++) {
            let pix = (x + y * p5.width)*4;
            let a = next[x][y].a;
            let b = next[x][y].b; 
            let c = p5.floor((a-b)*255);
            c = p5.constrain(c, 0, 255);
            p5.pixels[pix +0] = c;
            p5.pixels[pix +1] = c;
            p5.pixels[pix +2] = c;
            p5.pixels[pix +3] = 255; 
          }
        }
    p5.updatePixels();

    this.swap();
  }

  swap() {
    let temp = grid;
    grid = next; 
    next = temp;
  }

  laplaceA(x,y) {
    let sumA = 0;
    sumA += grid[x][y].a * -1;
    sumA += grid[x - 1][y].a * 0.2;
    sumA += grid[x + 1][y].a * 0.2 ;
    sumA += grid[x][y - 1].a * 0.2;
    sumA += grid[x][y + 1].a * 0.2;
    sumA += grid[x  - 1][y - 1].a * 0.05;
    sumA += grid[x + 1][y - 1].a * 0.05;
    sumA += grid[x + 1][y + 1].a * 0.05;
    sumA += grid[x  - 1][y + 1].a * 0.05;
    return sumA;
  }


  laplaceB(x,y) {
    let sumB = 0;
    sumB += grid[x][y].b * -1;
    sumB += grid[x - 1][y].b * 0.2;
    sumB += grid[x + 1][y].b * 0.2 ;
    sumB += grid[x][y - 1].b * 0.2;
    sumB += grid[x][y + 1].b * 0.2;
    sumB += grid[x  - 1][y - 1].b * 0.05;
    sumB += grid[x + 1][y - 1].b * 0.05;
    sumB += grid[x + 1][y + 1].b * 0.05;
    sumB += grid[x  - 1][y + 1].b * 0.05;
    return sumB;
  } 

  render() {
    
    return (
      //render the P5 elements on the card with data details
      <div className="card">
        <div className="visualization-image">
          <Sketch setup={this.setup} draw={this.draw} />
        </div>
      </div>
    );
  }
}