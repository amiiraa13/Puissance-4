let table = [
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
  ["", "", "", "", "", ""],
];
let tableContainer = document.querySelector("#table");
let lap = 1;
let gameOver = false;
let seulMode = false;

function verif() {
    for (let i = 0; i < table.length; i++) {
       for (let j = 0; j < table[i].length; j++) {
        if (table[i][j+3] && table[i][j] != "") {
          if (table[i][j] == table[i][j+1] && table[i][j+1] == table[i][j+2] && table[i][j+2] == table[i][j+3]) {
            gameOver=true
            tableContainer.textContent = "Félicitation vous avez gagné !"
            tableContainer.classList.add("bg")
          }  
        }
        if (table[i+3] && table [i][j] != "") {
            if (table[i][j] == table[i+1][j] && table[i+1][j] == table[i+2][j] && table[i+2][j] == table[i+3][j]) {
                gameOver=true
                tableContainer.textContent = "Félicitation vous avez gagné !"
                tableContainer.classList.add("bg")
            } 
        }
        if (table[i+3] && table[i+3][j+3]&& table[i][j] != "") {
            if (table[i][j] == table[i+1][j+1] && table[i+1][j+1] == table[i+2][j+2] && table[i+2][j+2] == table[i+3][j+3]) {
                gameOver=true
                tableContainer.textContent = "Félicitation vous avez gagné !"
                tableContainer.classList.add("bg")
            } 
        }
        if (table[i+3] && table[i+3][j-3]&& table[i][j] != "") {
            if (table[i][j] == table[i+1][j-1] && table[i+1][j-1] == table[i+2][j-2] && table[i+2][j-2] == table[i+3][j-3]) {
                gameOver=true
                tableContainer.textContent = "Félicitation vous avez gagné !"
                
                tableContainer.classList.add("bg")
            } 
        }
        if (gameOver == true) {
            document.querySelector("#reply").classList.remove("hidden");
            
          }
    }
        
    }

}
function aff() {
  tableContainer.innerHTML = "";
  table.forEach((row, index) => {
    let element = document.createElement("div");
    element.classList.add("row");
    tableContainer.appendChild(element);
    row.forEach((cel, indew) => {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      element.appendChild(cell);
      cell.addEventListener(
        "click",
        () => {
          tape(cell, index, indew);
        },
        { once: true }
      );
    });
  });
}
function tape(cell, index, indew) {
  if (gameOver == false) {
    if (lap % 2 == 0) {
      
      cell.classList.add("yel")
      table[index][indew] = "O";
      lap++;
    } else {
      
      cell.classList.add("red")
      table[index][indew] = "X";
      lap++;
      if (seulMode == true) {
        seul();
      }
    }
    verif()
  }
  
}
function seul() {
    if (lap <= 42) {
      let random = randomize(0, 8);
      while (document.querySelectorAll(".cell")[random].textContent != "") {
        random = randomize(0, 8);
      }
      document.querySelectorAll(".cell")[random].click();
    }
  }
  function setCpuMode(izCpuMode) {
    seulMode = izCpuMode;
  }
  function replay() {
    tableContainer.textContent = "";
    document.querySelector("#reply").classList.add("hidden");
    gameOver = false;
    table = [
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
        ["", "", "", "", "", ""],
      ];
    aff();
    lap = 1;
    tableContainer.classList.remove("bg")
  }
  function randomize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
aff();
