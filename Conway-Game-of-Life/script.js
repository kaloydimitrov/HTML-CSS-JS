const table = document.querySelector("table");

let size = 50;
let speed = 500;
let zoom = 10;

let map = Array(size).fill(false).map(() => Array(size).fill(false));
let nmap = Array(size).fill(false).map(() => Array(size).fill(false));

let index = size - 1;

function Start(randomize = false)
{
    for (let i = 1; i < index; i++)
    {
        const tr = document.createElement("tr");

        for (let j = 1; j < index; j++)
        {
            const td = document.createElement("td");

            const switchCell = (currentElement) => {
                if (mouseDown || currentElement.type === 'click') {
                    if (run) { throwError(); return; } // validation

                    const currentTd = currentElement.currentTarget;
                    const [i, j] = currentTd.id.split(".");
                    
                    if (currentTd.className == "black") {
                        currentTd.className = "white";
                        map[Number(i)][Number(j)] = true;
                    } else {
                        currentTd.className = "black";
                        map[Number(i)][Number(j)] = false;
                    }
                }
            }
            
            td.addEventListener("mouseover", switchCell);
            td.addEventListener("click", switchCell);

            td.style.width = `${zoom}px`; td.style.height = `${zoom}px`

            td.setAttribute("id", `${i}.${j}`);
            tr.appendChild(td);

            if (randomize) {
                map[i][j] = rng(1, 2) == 2;
            }
            
            if (map[i][j]) 
                td.className = "white";
            else
                td.className = "black";
        }

        table.appendChild(tr);
    }
}

function Update()
{
    for (let i = 1; i < index; i++)
    {
        for (let j = 1; j < index; j++)
        {
            let neighbors = 0;
            if (map[i - 1][j - 1]) neighbors++;
            if (map[i - 1][j]) neighbors++;
            if (map[i - 1][j + 1]) neighbors++;
            if (map[i][j - 1]) neighbors++;
            if (map[i][j + 1]) neighbors++;
            if (map[i + 1][j - 1]) neighbors++;
            if (map[i + 1][j]) neighbors++;
            if (map[i + 1][j + 1]) neighbors++;

            const td = document.getElementById(`${i}.${j}`);

            switch (neighbors)
            {
                case 2:
                    nmap[i][j] = map[i][j];
                    break;
                case 3:
                    nmap[i][j] = true;
                    td.className = "white";
                    break;
                default:
                    nmap[i][j] = false;
                    td.className = "black";
                    break;
            }
        }
    }
    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            map[i][j] = nmap[i][j];
}

function throwError() {
    const el = document.getElementById("fadeout");
    el.style.display = "flex";

    let opacity = parseFloat(el.style.opacity) || 1;

    setTimeout(() => {
        const intervalId = setInterval(() => {
            if (opacity > 0) {
                opacity -= 0.01;
                el.style.opacity = opacity;
            } else {
                clearInterval(intervalId);
                el.style.display = "none";
                el.style.opacity = 1;
            }
        }, 5);
    }, 4000);
}


const mainButton = document.querySelector(".main-button");
let run = false; let int;
mainButton.addEventListener("click", () => { 
    run = !run;
    if (run) {
        int = setInterval(Update, speed);
        mainButton.textContent = "Stop"; mainButton.style.backgroundColor = "greenyellow";
    }
    else {
        clearInterval(int);
        mainButton.textContent = "Start"; mainButton.style.backgroundColor = "orangered";
    }
});


const randomizeButton = document.querySelector(".randomize-button");
randomizeButton.addEventListener("click", () => {
    if (run) { throwError(); return; } // validation

    table.innerHTML = "";
    Start(true);
});


const clearButton = document.querySelector(".clear-button");
clearButton.addEventListener("click", () => {
    if (run) { throwError(); return; } // validation

    table.innerHTML = "";
    
    map = Array(size).fill(false).map(() => Array(size).fill(false));
    nmap = Array(size).fill(false).map(() => Array(size).fill(false));

    Start();
});


const nextButton = document.querySelector(".next-button");
nextButton.addEventListener("click", () => {
    if (run) { throwError(); return; } // validation

    Update();
});


const sizeSlider = document.getElementById("size-slider");
sizeSlider.oninput = () => {
    if (run) { throwError(); sizeSlider.value = size; return; } // validation

    table.innerHTML = "";
    size = Number(sizeSlider.value);
    index = size - 1;

    map = Array(size).fill(false).map(() => Array(size).fill(false));
    nmap = Array(size).fill(false).map(() => Array(size).fill(false));
    
    Start();

    document.getElementById("dimensions-p").textContent = `${size - 2}x${size - 2}`;
}


const speedSlider = document.getElementById("speed-slider");
speedSlider.oninput = () => {
    if (run) { throwError(); speedSlider.value = speed; return; } // validation

    speed = Number(speedSlider.value);
}


const zoomSlider = document.getElementById("zoom-slider");
zoomSlider.oninput = () => {
    const tdElements = document.querySelectorAll("td");

    zoom = zoomSlider.value;

    tdElements.forEach((td) => {
        td.style.width = `${zoomSlider.value}px`;
        td.style.height = `${zoomSlider.value}px`;
    });
}


// ------------------- Additional stuff -------------------
let mouseDown = false;
document.body.onmousedown = function() { mouseDown = true; }
document.body.onmouseup = function() { mouseDown = false; }

function rng(min, max) {
    return Number(Math.floor(Math.random() * (max - min + 1) + min));
}

Start();
