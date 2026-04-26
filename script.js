const noteColors = ["#fff9c4","#ffecb3","#ffcdd2","#bbdefb","#d1c4e9","#c8e6c9"];
const pinColors = ["#e53935","#1e88e5","#fdd835","#8e24aa","#43a047"];
const decors = ["⭐","💖","✨","🌸","🍀","🎀"];

let lastColors = [];

/* USER */
let userId = localStorage.getItem("userId");
if(!userId){
    userId = "u_" + Math.random().toString(36).substr(2,9);
    localStorage.setItem("userId", userId);
}

/* UTIL */
function rand(a){
    return a[Math.floor(Math.random()*a.length)];
}

function getColor(){
    let c;
    do{
        c = rand(noteColors);
    }while(lastColors.slice(-4).includes(c));
    lastColors.push(c);
    return c;
}

/* STORAGE */
function saveNotes(data){
    localStorage.setItem("notes9A1", JSON.stringify(data));
}

function loadNotes(){
    return JSON.parse(localStorage.getItem("notes9A1") || "[]");
}

/* FORM */
function openForm(){
    overlay.style.display = "flex";
}
function closeForm(e){
    if(e.target.id === "overlay"){
        overlay.style.display = "none";
    }
}

/* CREATE NOTE */
function createNote(noteData, index){
    const {name, msg, owner} = noteData;

    const note = document.createElement("div");
    note.className = "note";

    const color = getColor();
    note.style.background = color;
    note.style.setProperty("--rotate",(Math.random()*8-4)+"deg");

    const pin = document.createElement("div");
    pin.className = "pin";
    let pc;
    do{ pc = rand(pinColors); }while(pc===color);
    pin.style.background = pc;
    note.appendChild(pin);

    const c = document.createElement("div");
    c.className = "note-content";
    c.innerHTML = `<b>${name}</b><br><small>Xem lời chúc 🎁</small>`;
    note.appendChild(c);

    const pos = [[0,0],[80,0],[0,80],[80,80]];
    for(let i=0;i<3;i++){
        const d = document.createElement("div");
        d.className = "decor";
        d.innerText = rand(decors);
        const p = rand(pos);
        d.style.top = p[0]+"px";
        d.style.left = p[1]+"px";
        note.appendChild(d);
    }

    note.onclick = () => showPopup(name + ": " + msg);

    if(owner === userId){
        const del = document.createElement("div");
        del.innerText = "❌";
        del.className = "delete";

        del.onclick = (e)=>{
            e.stopPropagation();
            if(confirm("Xoá note này?")){
                const notes = loadNotes();
                notes.splice(index,1);
                saveNotes(notes);
                renderNotes();
            }
        };

        note.appendChild(del);
    }

    return note;
}

/* ADD */
function addNote(){
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if(!name || !msg){
        alert("Nhập đủ!");
        return;
    }

    const notes = loadNotes();
    notes.push({name, msg, owner: userId});
    saveNotes(notes);

    overlay.style.display="none";
    nameInput.value="";
    msgInput.value="";

    renderNotes();
}

/* RENDER */
function renderNotes(){
    board.innerHTML = "";
    lastColors = [];

    const notes = loadNotes();
    notes.forEach((n,i)=>{
        board.appendChild(createNote(n,i));
    });
}

/* POPUP */
function showPopup(t){
    popupText.innerText = t;
    popup.style.display="flex";
}
function closePopup(){
    popup.style.display="none";
}

/* INIT */
const board = document.getElementById("board");
const overlay = document.getElementById("overlay");
const nameInput = document.getElementById("name");
const msgInput = document.getElementById("msg");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");

renderNotes();
