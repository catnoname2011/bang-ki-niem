const noteColors = ["#fff9c4","#ffecb3","#ffcdd2","#bbdefb","#d1c4e9","#c8e6c9","#ffe0b2","#f8bbd0"];
const pinColors = ["#e53935","#1e88e5","#fdd835","#8e24aa","#43a047","#fb8c00"];

let userId = localStorage.getItem("userId") || ("u_"+Math.random().toString(36).substr(2,9));
localStorage.setItem("userId", userId);

function rand(a){ return a[Math.floor(Math.random()*a.length)]; }

function getColor(){ return rand(noteColors); }
function getPin(c){ let p; do{ p=rand(pinColors);}while(p===c); return p; }

/* NOTES */
function saveNotes(n){ localStorage.setItem("notes9A1", JSON.stringify(n)); }
function loadNotes(){ return JSON.parse(localStorage.getItem("notes9A1")||"[]"); }

function openForm(){ overlay.style.display="flex"; }
function closeForm(e){ if(e.target.id==="overlay") overlay.style.display="none"; }

function createNote(n,i){
    const note = document.createElement("div");
    note.className="note";
    note.style.background=n.color;
    note.style.left=n.x+"px";
    note.style.top=n.y+"px";

    const pin=document.createElement("div");
    pin.className="pin";
    pin.style.background=n.pinColor;
    note.appendChild(pin);

    note.innerHTML+=`<b>${n.name}</b><br><small>Xem 🎁</small>`;

    note.onclick=()=>showPopup(n.name,n.msg);

    note.onmousedown = function(e){
        let shiftX=e.clientX-note.offsetLeft;
        let shiftY=e.clientY-note.offsetTop;

        note.style.zIndex = 10;

        function move(x,y){
            note.style.left=x-shiftX+"px";
            note.style.top=y-shiftY+"px";
        }

        function onMove(e){
            move(e.pageX,e.pageY);
        }

        document.addEventListener("mousemove",onMove);

        document.onmouseup=()=>{
            document.removeEventListener("mousemove",onMove);
            document.onmouseup=null;

            note.style.zIndex = 1;

            const notes=loadNotes();
            notes[i].x=parseInt(note.style.left);
            notes[i].y=parseInt(note.style.top);
            saveNotes(notes);
        };
    };

    return note;
}

function addNote(){
    if(!nameInput.value||!msgInput.value) return alert("Nhập đủ!");

    const notes=loadNotes();
    const color=getColor();

    notes.push({
        name:nameInput.value,
        msg:msgInput.value,
        owner:userId,
        color,
        pinColor:getPin(color),
        x:100,
        y:100
    });

    saveNotes(notes);
    renderNotes();

    overlay.style.display="none";
    nameInput.value="";
    msgInput.value="";
}

function renderNotes(){
    board.innerHTML="";
    loadNotes().forEach((n,i)=>board.appendChild(createNote(n,i)));
}

function showPopup(name,msg){
    popupText.innerHTML=`<h3>${name}</h3><p>${msg}</p>`;
    popup.style.display="flex";
}
function closePopup(){ popup.style.display="none"; }

/* MEDIA */
function saveMedia(d){ localStorage.setItem("film9A1", JSON.stringify(d)); }
function loadMedia(){ return JSON.parse(localStorage.getItem("film9A1")||"[]"); }

function renderMedia(){
    filmList.innerHTML="";
    loadMedia().forEach(m=>{
        const div=document.createElement("div");
        div.className="film-item";

        if(m.type==="image"){
            div.innerHTML=`<img src="${m.src}">`;
        }else{
            div.innerHTML=`<video src="${m.src}"></video>`;
        }

        div.onclick=()=>openMedia(m);
        filmList.appendChild(div);
    });
}

fileInput.onchange=function(){
    const file=this.files[0];
    if(!file) return;

    const reader=new FileReader();
    reader.onload=function(e){
        const data=loadMedia();

        data.push({
            src:e.target.result,
            type:file.type.startsWith("video")?"video":"image"
        });

        saveMedia(data);
        renderMedia();
    };
    reader.readAsDataURL(file);
};

function openMedia(m){
    if(m.type==="image"){
        mediaContent.innerHTML=`<img src="${m.src}" style="width:100%">`;
    }else{
        mediaContent.innerHTML=`<video src="${m.src}" controls autoplay style="width:100%"></video>`;
    }
    mediaPopup.style.display="flex";
}

function closeMedia(){
    mediaPopup.style.display="none";
}

/* PARTICLES */
const canvas=document.getElementById("bgCanvas");
const ctx=canvas.getContext("2d");
canvas.width=innerWidth;
canvas.height=innerHeight;

let p=[];
for(let i=0;i<40;i++){
    p.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*2});
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    p.forEach(a=>{
        a.y+=0.2;
        if(a.y>canvas.height) a.y=0;
        ctx.beginPath();
        ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
        ctx.fillStyle="rgba(255,255,255,0.5)";
        ctx.fill();
    });
    requestAnimationFrame(draw);
}
draw();

/* INIT */
const board=document.getElementById("board");
const overlay=document.getElementById("overlay");
const nameInput=document.getElementById("name");
const msgInput=document.getElementById("msg");
const popup=document.getElementById("popup");
const popupText=document.getElementById("popupText");

const filmList=document.getElementById("filmList");
const fileInput=document.getElementById("fileInput");
const mediaPopup=document.getElementById("mediaPopup");
const mediaContent=document.getElementById("mediaContent");

renderNotes();
renderMedia();
