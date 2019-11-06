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
      score: 0,
      colors: [ "#3399ff", "#0000e6", "#ff9933", "#ffff4d", "#66ff66", "#cc33ff", "#e60000" ],
      currentFigure: {
        type: -1,
        blocks: []
      },
      pseudoBorderDiv: <div style={{position: "relative", width: "100%", height: "100%", border: "1px solid white"}} />
    }

    this.keyHandling = this.keyHandling.bind(this);
  } // constructor()

  render() {
    const step = 8.333333333333333; // 100 / 12 (12 поленца)
    let _left = -8.333333333333333;
    let _bottom = -8.333333333333333;

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
          this.state.gameState === 2 && this.state.currentFigure.type !== -1 ?
          this.state.currentFigure.visual
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
          <p style={{position: "absolute", left: 0, top: "50px"}}>YOU WON</p>
          : this.state.gameState === 4 ?
          <p style={{position: "absolute", left: 0, top: "50px"}}>YOU LOST</p>
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
      score: 0
    }, () => {
      this.moveFigureDown();
    });

    

  } // startNewGame()

  moveFigureDown() {
    if(this.state.gameState !== 2) return;

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
        });
    }
    else { // move down
      this.moveDown();
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

    // tova tuk shte pomogne za chisteneto, shte vidq kude da go metna
    /*this.setState({
      currentFigure: {
        type: -1,
        blocks: []
      }
    });*/
    
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
    //da proverqva za celi redove i da gi opravq ()=> resetkam currentfigure
    let tiles = this.state.tiles;

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

        for(let r=i; r<11; r++) {
          for(let c=0; c<12; c++) {
            tiles[r][c] = {
              isFilled: tiles[r+1][c].isFilled,
              color: tiles[r+1][c].color
            }
          }
        }

        for(let c=0; c<12; c++) { // reskane na nai-gorniq red
          tiles[11][c] = {
            isFilled: false,
            color: c % 2 === 0 ? "#e6e6ff" : "#f2f2f2"
          }
        }
      }

    } // outer


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
      gameState: isWon ? 3 : isLose ? 4 : 2
    });

  } // checkLines()

  updateFigure(figureType, position) { // positions 0 - default  nagore, 1 - na dqsno, 2 - nadolu, 3 - nalqvo, 4 - nagore
    let figure = this.state.currentFigure;
    figure.type = figureType;
    const step = 8.333333333333333;

    let temp = <div></div>;
    let blocks = [];

    if(figureType === 0) {

      if(position === 0 || position === 2) {
        temp = 
          <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: (4*step)+"vmin", height: step+"vmin"}}>
            <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
            <div className="block" style={{left: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
            <div className="block" style={{left: (step*2)+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
            <div className="block" style={{left: (step*3)+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          </div>;
          blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left+2},{i: figure.bottom, j: figure.left+3} ];
      } else {
        temp = 
            <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: step+"vmin", height: (4*step)+"vmin"}}>
              <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
              <div className="block" style={{left: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
              <div className="block" style={{left: 0, top: (step*2)+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
              <div className="block" style={{left: 0, top: (step*3)+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
            </div>;
            blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left},{i: figure.bottom+3, j: figure.left} ];
      }

    }
    else if(figureType === 1) {


      if(position === 0) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: (3*step)+"vmin", height: (step*2)+"vmin"}}>
          <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: step+"vmin", bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: (step*2)+"vmin", bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom+1, j: figure.left}, {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left+2} ];
      }
      else if(position === 1) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: (2*step)+"vmin", height: (step*3)+"vmin"}}>
          <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, top: (step*2)+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom+2, j: figure.left+1}, {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left} ];
      }
      else if(position === 2) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: (3*step)+"vmin", height: (step*2)+"vmin"}}>
          <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: (step*2)+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: (step*2)+"vmin", bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j: figure.left+2}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+2} ];
      }
      else if(position === 3) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (3*step)+"vmin", width: (step*2)+"vmin"}}>
          <div className="block" style={{left: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: step+"vmin", top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: step+"vmin", top: (step*2)+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+2, j: figure.left+1} ];
      }

    }
    else if(figureType === 2) {
      
      if(position === 0) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: (3*step)+"vmin", height: (step*2)+"vmin"}}>
          <div className="block" style={{right: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: step+"vmin", bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: (step*2)+"vmin", bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom+1, j: figure.left+2}, {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left+2} ];
      }
      else if(position === 1) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", width: (2*step)+"vmin", height: (step*3)+"vmin"}}>
          <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, top: (step*2)+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{right: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j: figure.left+1}, {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left} ];
      }
      else if(position === 2) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (2*step)+"vmin", width: (step*3)+"vmin"}}>
          <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: (step*2)+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+1, j: figure.left+1}, {i:figure.bottom+1, j: figure.left+2} ];
      }
      else if(position === 3) {
        temp = 
        <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (3*step)+"vmin", width: (step*2)+"vmin"}}>
          <div className="block" style={{right: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{right: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{right: 0, top: (step*2)+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
          <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i:figure.bottom+2, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+2, j: figure.left+1} ];
      }

    }
    else if(figureType === 3) {

      temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (2*step)+"vmin", width: (step*2)+"vmin"}}>
      <div className="block" style={{right: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
      <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
      <div className="block" style={{right: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
      <div className="block" style={{left: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
      </div>;
      blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i:figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1} ];
      
    }
    else if(figureType === 4) {

      if(position === 0 || position === 2) {

        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (2*step)+"vmin", width: (step*3)+"vmin"}}>
        <div className="block" style={{left: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{left: step+"vmin", bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+2} ];
      }
      else {

        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (3*step)+"vmin", width: (step*2)+"vmin"}}>
        <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{left: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, bottom: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom+1, j: figure.left}, {i: figure.bottom+2, j: figure.left}, {i: figure.bottom, j: figure.left+1}, {i: figure.bottom+1, j: figure.left+1} ];
      }
      
    }
    else if(figureType === 5) {

      if(position === 0) {

        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (2*step)+"vmin", width: (step*3)+"vmin"}}>
        <div className="block" style={{bottom: 0, left: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{bottom: 0, left: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{bottom: 0, right: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom, j:figure.left+1}, {i: figure.bottom, j: figure.left+2}, {i: figure.bottom+1, j: figure.left+1} ];
      }
      else if(position === 1) {

        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (3*step)+"vmin", width: (step*2)+"vmin"}}>
        <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{left: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{left: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, bottom: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j: figure.left}, {i: figure.bottom+1, j: figure.left}, {i:figure.bottom+2, j:figure.left}, {i:figure.bottom+1, j: figure.left+1} ];
      }
      else if(position === 2) {

        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (2*step)+"vmin", width: (step*3)+"vmin"}}>
        <div className="block" style={{top: 0, left: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{top: 0, left: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{top: 0, right: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: step+"vmin", bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i:figure.bottom, j:figure.left+1}, {i:figure.bottom+1, j: figure.left}, {i:figure.bottom+1, j: figure.left+1}, {i:figure.bottom+1, j: figure.left+2} ];
      }
      else if(position === 3) {

        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (3*step)+"vmin", width: (step*2)+"vmin"}}>
        <div className="block" style={{right: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{lrgy: 0, bottom: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i:figure.bottom, j:figure.left+1}, {i:figure.bottom+1, j:figure.left+1}, {i:figure.bottom+2, j:figure.left+1}, {i:figure.bottom+1, j:figure.left} ];
      }
      
    }
    else if(figureType === 6) {
      if(position === 0 || position === 2) {

        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (2*step)+"vmin", width: (step*3)+"vmin"}}>
        <div className="block" style={{left: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{left: step+"vmin", top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: step+"vmin", top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i:figure.bottom, j:figure.left+1}, {i:figure.bottom, j:figure.left+2}, {i:figure.bottom+1, j: figure.left}, {i: figure.bottom+1, j: figure.left+1} ];
      }
      else if(position === 1 || position === 3) {
        temp = <div style={{position: "absolute", left: (figure.left*step)+"vmin", bottom: (figure.bottom*step)+"vmin", height: (3*step)+"vmin", width: (step*2)+"vmin"}}>
        <div className="block" style={{left: 0, bottom: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{left: 0, bottom: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, top: 0, backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        <div className="block" style={{right: 0, top: step+"vmin", backgroundColor: figure.color}}>{this.state.pseudoBorderDiv}</div>
        </div>;
        blocks = [ {i: figure.bottom, j:figure.left}, {i:figure.bottom+1, j:figure.left}, {i:figure.bottom+1, j: figure.left+1}, {i:figure.bottom+2, j:figure.left+1} ];
      }
      
    }


    figure.blocks = blocks;
    figure.visual = temp;

    this.setState({currentFigure: figure});
  } // updateFigure()


  keyHandling(event) {	    // Handle event
    //console.log("Key code: " + event.keyCode);
    if(this.state.gameState !== 2 || this.state.isMoving) return;

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
    if(code === 37) { // движение на фигурата едно квадратче в ляво
        let figure = this.state.currentFigure;
        if(figure.left === 0)  return;
        let blocks = figure.blocks;
        let tiles = this.state.tiles;

        for(let i=0; i<blocks.length; i++){
          if(tiles[blocks[i].i][blocks[i].j-1].isFilled) return;
        }

        this.setState({ isMoving: true },
          ()=>{
            figure.left--;
        
            this.setState({ currentFigure: figure, isMoving: false },
              () => this.updateFigure(figure.type, figure.position)
            );
          }
        );

      }
      if(code === 39) { // движение на фигурата едно квадратче в дясно
      let figure = this.state.currentFigure;
      let blocks = figure.blocks;
      let tiles = this.state.tiles;

      for(let i=0; i<blocks.length; i++)
      {
        if(blocks[i].j === 11) return;
      }

      for(let i=0; i<blocks.length; i++){
        if(tiles[blocks[i].i][blocks[i].j+1].isFilled) return;
      }

      this.setState({ isMoving: true },
        () => {
          figure.left++;
      
          this.setState({ currentFigure: figure, isMoving: false },
            () => this.updateFigure(figure.type, figure.position)
          );
        }
      )
    }

  }
  componentDidMount() { // Add Event Listener on compenent mount
    window.addEventListener("keyup", this.keyHandling);
    setInterval( () => this.moveFigureDown(), 400);
  }
  componentWillUnmount() { // Remove event listener on compenent unmount
     window.removeEventListener("keyup", this.keyHandling);
  }

  
} // App {}