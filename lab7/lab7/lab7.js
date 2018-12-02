/*jslint browser: true */
/*jslint white: true */
"use strict";

var N = 4;                   // number of rows and columns of tiles on the board
var board_size = 400;                 // size of the (square) board in pixels
                                      // not including borders
var tile_size;                        // size of each (square) tile in pixels
var blank = { "row": 0, "col": 0 };   // initial position of the blank
var board = [ null ];                 // no tile at position 0
var num_shuffle_steps = 10;  // number of random moves when shuffling board

/* return true iff the given tile is directly to the right of the blank */
function is_to_the_right_of_blank(tile) {
  return ((tile.row == blank.row) && (tile.col === blank.col + 1))
}

/* return true iff the given tile is directly to the left of the blank */
function is_to_the_left_of_blank(tile) {
  return ((tile.row == blank.row) && tile.col === blank.col - 1)
}

/* return true iff the given tile is directly above the blank */
function is_above_blank(tile) {
  return ((tile.col === blank.col) && tile.row === blank.row - 1)

}

/* return true iff the given tile is directly under the blank */
function is_below_blank(tile) {
  return ((tile.col === blank.col) && tile.row === blank.row + 1)
}

/* return true iff the given tile is immediately adjacent to the blank */
function is_next_to_blank(tile) {
  return (is_below_blank(tile) || is_above_blank(tile) || is_to_the_left_of_blank(tile) || is_to_the_right_of_blank(tile))
}

/* return true iff the tiles are in their initial configuration */
function game_over() {
  var win = true;
  var order = document.getElementById("board").children;
  for (var i = 0; i < 4; i += 1) {
    for (var j = 0; j < 4; j += 1) {
      if (board[i*N + j] != order.item(((i*N)+j) - 1) && !(i === 0 && j === 0)) {
        win = false;
        break;
      }
    }
  }
  return win;
}

/* randomly select and return a tile that is adjacent to the blank */
function pick_tile() {
  var numChoices = 4;
  var up = 0;
  var down = 1;
  var right = 2;
  var left = 3;
  var choice = Math.floor(Math.random() * numChoices);
  var tile;
  if (choice == up && blank.row != 0) {
    tile = board[(blank.row - 1)*N + blank.col];
  }
  else if (choice == down && blank.row != N-1) {
    tile = board[(blank.row + 1)*N + blank.col];
  }
  else if (choice == left && blank.col != 0) {
    tile = board[blank.row*N + blank.col - 1];
  }
  else if (choice == right && blank.col != N-1) {
    tile = board[blank.row*N + blank.col + 1];
  }
  else {
    tile = pick_tile();
  }
  return tile;
}

/* position the given tile at the given position on the board
   must update the tile and the board
*/
function position_tile(tile,row,col) {
  board[row*N + col] = tile;
  tile.row = row;
  tile.col = col;
  var top = tile_size * row;
  var left = tile_size * col;
  if (!(tile.row === blank.row) || !(tile.col === blank.col)) {
    tile.style.left = left.toString() + "px";
    tile.style.top = top.toString() + "px";
    tile.style.width = tile_size.toString() + "px";
    tile.style.height = tile_size.toString() + "px";
  }
}

/* move the given tile to the blank location
   (assume that the given tile is adjacent to the blank before the move)
   must update the tile, the blank, and the board
*/
function swap_with_blank(tile) {
  var row = blank.row;
  var col = blank.col;
  blank.col = tile.col;
  blank.row = tile.row;
  position_tile(tile, row, col);
  position_tile(blank, blank.row, blank.col);
}

/* event handler for a click on a tile
   if the clicked tile is adjacent to the blank, move the tile into the blank
   position_tile (otherwise do nothing)
   if this move returns the board to its initial configuration, pop up a
   "Well done!" message
*/
function process_click() {
  if (is_next_to_blank(this))
  {
    swap_with_blank(this);
  }

  if (game_over()){
    alert("Well done!");
  }
}

/* empty the board of its tiles and recreate enough
   tiles to fill the board using the current value of N
*/
function clearAndRefillBoard() {
  var domBoard = document.getElementById("board");
  N = document.getElementById("N").value;
  var n2 = N*N; // N * N for size of board
  while (domBoard.hasChildNodes()) {
    domBoard.removeChild(domBoard.lastChild);
  }
  for (var i = 1; i < n2; i+= 1) { 
    var tile = document.createElement("div");
    tile.className = 'tile';
    domBoard.appendChild(tile);
    tile.append(i);
  }
  var tiles = document.getElementById("board").children;
  for (var i = 0; i < tiles.length; i+=1)
  {
    tiles.item(i).addEventListener("click", process_click);
  }
  tile_size = board_size / N;
  initialize_tile_positions();
}

/* update the value of the global N, call the previous function, and finally
   position all of the tiles to build the initial configuration of the board
   [must update the tiles (position, size, and font-size), the blank, and
   the board (size)]
*/
function initialize_tile_positions() {
  var tiles = document.getElementById("board").children;
  document.getElementById("board").style.width = board_size + "px";
  document.getElementById("board").style.height = board_size + "px";
  position_tile(blank, 0, 0);
  for (var i = 1; i <= tiles.length; i+=1)
  {
    var item = tiles.item(i - 1);
    position_tile(item, Math.floor(i / N), i % N);
    item.style.height = tile_size;
    item.style.width = tile_size;
    item.style.fontSize = (tile_size / 2).toString() + "px";
  }
}

/* perform num_shuffle_steps random legal moves starting from the current board
   configuration
*/
function shuffle_tiles() {
  for (var i = 0; i < num_shuffle_steps; i+=1) {
    swap_with_blank(pick_tile());
  }
}

/* attach all click event handlers (to the buttons and the tiles)
   furthermore, position all of the tiles in their initial configuration
*/
window.onload = function () {
  clearAndRefillBoard();
  var tiles = document.getElementById("board").children;
  //board[0][0] = blank;
  for (var i = 1; i < tiles.length; i+=1)
  {
    tiles.item(i - 1).addEventListener("click",process_click);
  }
  document.getElementById("shuffle").addEventListener("click", shuffle_tiles);
  document.getElementById("reset").addEventListener("click", clearAndRefillBoard);
};
