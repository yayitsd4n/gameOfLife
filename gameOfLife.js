var Game = (function() {
  var domBoard = document.getElementsByClassName('js-board')[0];
  var playBtn = document.getElementsByClassName('js-play')[0];
  var ticks = 50;
  var world = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ];

  function setTicks(num) {
    ticks = num;
  }

  function createWorld(y,x) {
    var newWorld = [];
    for (var i=0; i<y; i++) {
      var row = [];
      for (var j=0; j<x; j++) {
        row.push(0);
      }
      newWorld.push(row);
    }
    world = newWorld;
    drawWorld();
    setListeners();
  };

  function setListeners() {
    domBoard.addEventListener('click', userSeed, false);
    playBtn.addEventListener('click', function(){
      htmlWorldToJsWorld();
      play(ticks);
    }, false);
  }

  function userSeed(e) {
    var elementClicked = e.target;
    if (elementClicked.tagName != 'TD') return;
    if (e.target.className == 'dead') {
      e.target.className = 'live';
    } else {
      e.target.className = 'dead';
    }
  }

  function htmlWorldToJsWorld() {
    var newWorld = [];
    var columns = Array.prototype.slice.call(domBoard.getElementsByTagName('tr'));

    columns.forEach(function(row) {
      row = Array.prototype.slice.call(row.getElementsByTagName('td'));
      var newRow = [];
      row.forEach(function(cell) {
        if (cell.className == 'live') {
          newRow.push(1);
        } else {
          newRow.push(0);
        }
      });
      newWorld.push(newRow);
    });
    world = newWorld;
  }

  function play(ticks) {
    for (let i=0; i<ticks; i++) {
      setTimeout(function(){
        world = tick();
        drawWorld();
      }, i * 200);
    }
  };

  function drawWorld() {
    var domBoard = document.getElementsByClassName('js-board')[0];
    domBoard.innerHTML = '';
    
    world.forEach(function drawRow(row) {
      var newRow = document.createElement('tr');
      row.forEach(function drawCell(cell) {
        var newCell = document.createElement('td');
        if (cell == 1) {
          newCell.className = 'live';
        } else {
          newCell.className = 'dead';
        }
        
        newRow.appendChild(newCell);
      });
      domBoard.appendChild(newRow);
    });
  }

  function tick() {
    var newWorld = [];
    world.forEach(function(row, rowIndex) {
      var newRow = [];
      row.forEach(function(cell, cellIndex) {
        var totalNeighbors = getTotalNeighbors(rowIndex, cellIndex);
        newRow.push(getNewState(cell, totalNeighbors));
      });
      newWorld.push(newRow);
    });
    return newWorld;
  };

  function getNewState(state, totalNeighbors) {
    if (state == 1) {
      if (totalNeighbors < 2) {
        return 0;
      } else if (totalNeighbors > 3) {
        return 0;
      } else {
        return 1
      }
    } else {
      if (totalNeighbors == 3) {
        return 1;
      } else {
        return 0
      }
    }
  };

  function getTotalNeighbors(y, x) {
    var total = 0;
    for (var i = -1; i<=1; i++) {
      for (var j = -1; j<=1; j++) {
        if(y + i < 0 || x + j < 0) continue;
        if(y + i > world.length - 1 || x + j > world[0].length - 1) continue;
        if(i == 0 && j == 0) continue;
        if (world[y + i][x + j] == 1) {
          total++;
        }
      }
    }
    return total;
  };

  return {
    setTicks: setTicks,
    createWorld: createWorld
  };
})();

Game.setTicks(100);
Game.createWorld(40,40);

