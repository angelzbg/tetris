import React from 'react';
import './App.css';

export default class App extends React.Component {

  constructor() {
    super();
    let tiles = new Array(12);

    for(let i=0; i<12; i++)
    {
      tiles[i] = new Array(12);
      for(let j=0; j<12; j++){
        tiles[i][j] = {
          isFilled: false,
          color: j % 2 === 0 ? "#e6e6ff" : "#f2f2f2"
        };
      } // inner

    } // outer

    this.state = {
      gameState: 1, // 1 = not started (initial), 2 = started, 3 = win, 4 = lose
      isMoving: false,
      tiles: tiles,
      colors: [ "#3399ff", "#0000e6", "#ff9933", "#ffff4d", "#66ff66", "#cc33ff", "#e60000" ],
      currentFigure: {
        type: -1,
        blocks: []
      },
      pseudoBorderDiv: <div style={{position: "relative", width: "calc(100% - 2px)", height: "calc(100% - 2px)", border: "1px solid white",}} />,
      score: 0,
      currentSpeed: 500
    }

    this.keyHandling = this.keyHandling.bind(this);
  } // constructor()

  render() {
    const step = 8.333333333333333; // 100 / 12 (12 поленца)
    let _left = -8.333333333333333;
    let _bottom = -8.333333333333333;

    let figure = this.state.currentFigure;

    return (
      <center>
      <div style={{position: "relative", width: "100vmin", height: "100vmin"}}>

        {
          this.state.tiles.map( (array, i) => {
            _bottom+=step;
            _left = -8.333333333333333;
            return array.map( (item, j)=> {
              _left+=step;
            return <div key={"tile"+i+j} className="tile" style={{left: _left+"vmin", bottom: _bottom+"vmin", backgroundColor: item.color}}>{/*{i} {j}*/}
            {
              item.isFilled ? // za borderche
              this.state.pseudoBorderDiv
              : this.props.textOrHtml
            }
            </div>
            })
          })
        }

        {
          this.state.gameState === 2 && figure.type !== -1 && figure.hasOwnProperty('blocks') ?
          <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: figure.figWidth, height: figure.figHeight}}>
            {
              figure.blocks.map(
                ( (block, index) =>
                  <div key={index+"block"} className="block" style={{left: ((block.j-figure.left)*step)+"vmin", bottom: ((block.i-figure.bottom)*step)+"vmin", backgroundColor: this.state.currentFigure.color}}>{this.state.pseudoBorderDiv}</div>
                )
              )
            }
          </div>
          : this.props.textOrHtml
        }

      </div>
      {
          this.state.gameState !== 2 ?
          <button style={{position: "absolute", left: 0, top: 0}} onClick={ () => this.startNewGame()}>NEW GAME</button>
          : this.props.textOrHtml
      }
      {
          this.state.gameState === 3 ?
          <p style={{position: "absolute", left: 0, top: "40px"}}>You won at level {this.state.level}</p>
          : this.state.gameState === 4 ?
          <p style={{position: "absolute", left: 0, top: "40px"}}>YOU LOST</p>
          : this.props.textOrHtml
      }
      <p style={{position: "absolute", left: 0, top: "60px"}}>Rotation - SPACEBAR</p>
      <p style={{position: "absolute", left: 0, top: "80px"}}>Movement - Arrows R L D</p>
      {
        this.state.gameState !== 1 ?
        <div style={{position: "absolute", left:"10px", top: "120px", backgroundColor: "#0099ff", paddingLeft: "10px", paddingRight: "10px", borderRadius: "5px"}}>
          <p>Score: {this.state.score}</p>
          <p>Current speed: {this.state.currentSpeed}</p>
        </div>
        : this.props.textOrHtml
      }
      </center>
    )
  } // render()


  startNewGame() {
    let tiles = new Array(12);
    for(let i=0; i<12; i++)
    {
      tiles[i] = new Array(12);
      for(let j=0; j<12; j++){
        tiles[i][j] = {
          isFilled: false,
          color: j % 2 === 0 ? "#e6e6ff" : "#f2f2f2"
        };
      } // inner
    } // outer

    this.setState({
      gameState: 2, // 1 = not started (initial), 2 = started, 3 = win, 4 = lose
      tiles: tiles,
      score: 0,
      currentSpeed: 500
    }, () => {
      this.interval = setInterval( () => this.checkInterval(), this.state.currentSpeed);
      this.moveFigureDown();
    });

    

  } // startNewGame()

  moveFigureDown() {
    if(this.state.gameState !== 2) {
      
      return;
    }

    if(this.state.currentFigure.type === -1) { // трябва да се създаде нова фигура
      const figureType = Math.floor(Math.random() * Math.floor(7));
      let figure = {
        left: Math.floor(Math.random() * Math.floor(8)), // максималната ширина на фигура е 4 блока, следователно това ще бъде оптималната позиция за която и да е фигура
        bottom: 11,
        position: 0, // 0
        color: this.state.colors[figureType]
      };

        this.setState({currentFigure: figure}, () => {
          this.updateFigure(figureType, figure.position)
        }, ()=> this.moveDown());
    }
    else { // move down
      this.moveDown()
    }
  } // moveParts()

  moveDown() {
    let figure = this.state.currentFigure;
    let blocks = figure.blocks;

    for(let i=0; i<blocks.length; i++){
      if(blocks[i].i === 0) { // blok ot figurata e na posleden kvadrat
        this.fillTiles();
        
        return;
      }
    }


    let tiles = this.state.tiles;

    for(let i=0; i<blocks.length; i++){
      if(blocks[i].i > 11) continue;
      if(tiles[blocks[i].i-1][blocks[i].j].isFilled) {
        this.fillTiles();
        
        return;
      }
    }

    figure.bottom--;
      this.setState({
        currentFigure: figure
      }, () => this.updateFigure(figure.type, figure.position));
  
  } // moveDown()

  fillTiles() {
    let currentFigure = this.state.currentFigure;
    let blocks = currentFigure.blocks;

    let tiles = this.state.tiles;

    for(let i=0; i<blocks.length; i++){
      if(blocks[i].i > 11) continue;
      tiles[blocks[i].i][blocks[i].j] = {
        isFilled: true,
        color: currentFigure.color
      }
    }

    this.setState({tiles: tiles},
      () => this.checkLines()
    )
  } // fillTiles()

  checkLines() {
    let tiles = this.state.tiles;

    let scoresEarned = 0;

    for(let topline=11; topline>-1; topline--) {
    for(let i=0; i<12; i++)
    {
      let isLine = true;
      for(let j=0; j<12; j++){
        if(!tiles[i][j].isFilled) {
          isLine = false;
          break;
        }
      } // inner
      if(isLine) {
        scoresEarned+=12;
        for(let r=i; r<11; r++) {
          for(let c=0; c<12; c++) {
            tiles[r][c] = {
              isFilled: tiles[r+1][c].isFilled,
              color: tiles[r+1][c].color
            }
          }
        }

        for(let c=0; c<12; c++) { // reskane na nai-gorniq red
          tiles[topline][c] = {
            isFilled: false,
            color: c % 2 === 0 ? "#e6e6ff" : "#f2f2f2"
          }
        }
      }

    } // outer
    } // topline outer


    let isWon = true;
    for(let i=0; i<12; i++){
      if(tiles[0][i].isFilled){
        isWon = false;
        break;
      }
    }

    let isLose = false;

    let blocks = this.state.currentFigure.blocks;
    for(let i=0; i<blocks.length; i++) {
      if(blocks[i].i >= 11) {
        isLose = true;
        break;
      }
    }


    this.setState({
      tiles: tiles,
      currentFigure: {
        type: -1,
        blocks: []
      },
      score: this.state.score+scoresEarned,
      gameState: isWon ? 3 : isLose ? 4 : 2
    });

  } // checkLines()

  updateFigure(figureType, position) { // positions 0 - default  nagore, 1 - na dqsno, 2 - nadolu, 3 - nalqvo, 4 - nagore
    let figure = this.state.currentFigure;
    const step = 8.333333333333333;

    let blocks = [];
    let figWidth = "", figHeight = "";

    if(figureType === 0) {
      if(position === 0 || position === 2) {
        figWidth = (4*step)+"vmin";
        figHeight = step+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left+2},{i: figure.bottom, j: figure.left+3} ];
      } else {
        figWidth = step+"vmin";
        figHeight = (4*step)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left},{i: figure.bottom+3, j: figure.left} ];
      }
    }
    else if(figureType === 1) {
      if(position === 0) {
        figWidth = (3*step)+"vmin";
        figHeight = (step*2)+"vmin";
        blocks = [ {i: figure.bottom+1, j: figure.left}, {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left+2} ];
      }
      else if(position === 1) {
        figWidth = (2*step)+"vmin";
        figHeight = (step*3)+"vmin";
        blocks = [ {i: figure.bottom+2, j: figure.left+1}, {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left} ];
      }
      else if(position === 2) {
        figWidth = (3*step)+"vmin";
        figHeight = (step*2)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left+2}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+2} ];
      }
      else if(position === 3) {
        figWidth = (step*2)+"vmin";
        figHeight = (3*step)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+2, j: figure.left+1} ];
      }
    }
    else if(figureType === 2) {
      if(position === 0) {
        figWidth = (3*step)+"vmin";
        figHeight = (step*2)+"vmin";
        blocks = [ {i: figure.bottom+1, j: figure.left+2}, {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left+2} ];
      }
      else if(position === 1) {
        figWidth = (2*step)+"vmin";
        figHeight = (step*3)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left} ];
      }
      else if(position === 2) {
        figWidth = (step*3)+"vmin";
        figHeight = (2*step)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+1, j: figure.left+1}, {i:figure.bottom+1, j: figure.left+2} ];
      }
      else if(position === 3) {
        figWidth = (step*2)+"vmin";
        figHeight = (3*step)+"vmin";
        blocks = [ {i:figure.bottom+2, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+2, j: figure.left+1} ];
      }
    }
    else if(figureType === 3) {
      figWidth = (step*2)+"vmin";
      figHeight = (2*step)+"vmin";
      blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i:figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1} ];
    }
    else if(figureType === 4) {
      if(position === 0 || position === 2) {
        figWidth = (step*3)+"vmin";
        figHeight = (2*step)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+2} ];
      }
      else {
        figWidth = (step*2)+"vmin";
        figHeight = (3*step)+"vmin";
        blocks = [ {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1} ];
      }
    }
    else if(figureType === 5) {
      if(position === 0) {
        figWidth = (step*3)+"vmin";
        figHeight = (2*step)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j:figure.left+1}, {i: figure.bottom, j: figure.left+2}, {i: figure.bottom+1, j: figure.left+1} ];
      }
      else if(position === 1) {
        figWidth = (step*2)+"vmin";
        figHeight = (3*step)+"vmin";
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i:figure.bottom+2, j:figure.left}, {i:figure.bottom+1, j: figure.left+1} ];
      }
      else if(position === 2) {
        figWidth = (step*3)+"vmin";
        figHeight = (2*step)+"vmin";
        blocks = [ {i:figure.bottom, j:figure.left+1}, {i:figure.bottom+1, j: figure.left}, {i:figure.bottom+1, j: figure.left+1}, {i:figure.bottom+1, j: figure.left+2} ];
      }
      else if(position === 3) {
        figWidth = (step*2)+"vmin";
        figHeight = (3*step)+"vmin";
        blocks = [ {i:figure.bottom, j:figure.left+1}, {i:figure.bottom+1, j:figure.left+1}, {i:figure.bottom+2, j:figure.left+1}, {i:figure.bottom+1, j:figure.left} ];
      }
    }
    else if(figureType === 6) {
      if(position === 0 || position === 2) {
        figWidth = (step*3)+"vmin";
        figHeight = (2*step)+"vmin";
        blocks = [ {i:figure.bottom, j:figure.left+1}, {i:figure.bottom, j:figure.left+2}, {i:figure.bottom+1, j: figure.left}, {i: figure.bottom+1, j: figure.left+1} ];
      }
      else if(position === 1 || position === 3) {
        figWidth = (step*2)+"vmin";
        figHeight = (3*step)+"vmin";
        blocks = [ {i: figure.bottom, j:figure.left}, {i:figure.bottom+1, j:figure.left}, {i:figure.bottom+1, j: figure.left+1}, {i:figure.bottom+2, j:figure.left+1} ];
      }
    }

    /*
    blocks.forEach( block => {
      if(block.i > 11 || block.i < 0 || block.j > 11 || block.j < 0) {
        
        return;
      }
    });
    //*/

    if(figure.type !== -1) {
    for(let i=0; i<blocks.length; i++) {
      if(blocks[i].i < 0 || blocks[i].j > 11 || blocks[i].j < 0) {
        
        return;
      }
    }
    }


    figure.blocks = blocks;
    figure.figHeight = figHeight;
    figure.figWidth = figWidth;
    figure.type = figureType;

    this.setState({currentFigure: figure}, ()=> this.isMoving = false);
  } // updateFigure()

  keyHandling(event) {	    // Handle event
    //console.log("Key code: " + event.keyCode);
    if(this.state.gameState !== 2 && this.state.currentFigure === -1) return;

    let blocks = this.state.currentFigure.blocks;
    for(let i=0; i<blocks.length; i++) {
      if(blocks[i].i > 11) return;
    }

    const code = event.keyCode;
    if(code === 32) { // завъртане
      
        let figure = this.state.currentFigure;

        if(figure.position < 3) figure.position++;
        else figure.position = 0;

        this.setState({currentFigure: figure},
          () => this.updateFigure(figure.type, figure.position)
        );

    }
    else if(code === 37) { // движение на фигурата едно квадратче в ляво
      
            let figure = this.state.currentFigure;
            if(figure.left === 0)  {
              
              return;
            }
            let blocks = figure.blocks;
            let tiles = this.state.tiles;

            for(let i=0; i<blocks.length; i++){
              if(tiles[blocks[i].i][blocks[i].j-1].isFilled) {
                
                return;
              }
            }
            figure.left--;
        
            this.setState({ currentFigure: figure, isMoving: false },
              () => this.updateFigure(figure.type, figure.position)
            );

      }
      else if(code === 39) { // движение на фигурата едно квадратче в дясно
          let figure = this.state.currentFigure;
          let blocks = figure.blocks;
          let tiles = this.state.tiles;

          for(let i=0; i<blocks.length; i++)
          {
            if(blocks[i].j === 11) {
              
              return;
            }
          }

          for(let i=0; i<blocks.length; i++){
            if(tiles[blocks[i].i][blocks[i].j+1].isFilled) {
              
              return;
            }
          }
          figure.left++;
      
          this.setState({ currentFigure: figure},
            () => this.updateFigure(figure.type, figure.position)
          );
    }
    else if(code === 40) { // движение на фигурата квадратче надолу
      
      this.moveFigureDown();
      
    }

  }
  componentDidMount() { // Add Event Listener on compenent mount
    window.addEventListener("keyup", this.keyHandling);
    //setTimeout( ()=> this.moveFigureDown(), this.state.currentSpeed);
    this.interval = setInterval( () => this.checkInterval(), this.state.currentSpeed);
    //setInterval( () => this.moveFigureDown(), 400);
    
  }
  componentWillUnmount() { // Remove event listener on compenent unmount
     window.removeEventListener("keyup", this.keyHandling);
     clearInterval(this.interval);
  }

  checkInterval() {
    this.moveFigureDown();

    let speed = 500;
    let score = this.state.score;
    if(score < 20) speed = 500;
    else if(score < 40) speed = 450;
    else if(score < 60) speed = 400;
    else if(score < 100) speed = 300;
    else if(score < 150) speed = 200;
    else speed = 100;

    if(this.state.currentSpeed !== speed) {
      clearInterval(this.interval);
      this.setState({
        currentSpeed: speed
      }, ()=> this.interval = setInterval( () => this.checkInterval(), this.state.currentSpeed) );
    }
    
  }

  
} // App {}