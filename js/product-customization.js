// ------------------- DOM -------------------
    //LES CANVAS
const canvasMeme = document.getElementById('generator-canvas-meme');
const canvasProduct = document.getElementById('generator-canvas-product');
    //LES CONTEXTES
const ctxProduct = canvasProduct.getContext('2d');
const ctxMeme = canvasMeme.getContext('2d');



const downloadBtn = document.getElementById("download-btn");
const memeText = document.getElementById('generator-text');
const textsContainer = document.getElementById('texts-container');
const textOptionsNodeList = document.querySelectorAll('input[name=textOption]');
const textOptions = Array.prototype.slice.call(textOptionsNodeList);
const textPositionContainer = document.getElementById('text-position-container');

const sliderX = document.getElementById('sliderX');
const sliderY = document.getElementById('sliderY');
const memeTextSize = document.getElementById('meme-text-size');

const generateMenuBtn = document.querySelector('.generator-button-generate');
const insertMenuBtn = document.querySelector('.generator-button-insert');
const orText = document.querySelector('.generator-or');

const btnContainer = document.querySelector('.generator-buttons');

const memeCreationZone = document.querySelector('.generator-creation');

const modeTitle = document.getElementById('generator-mode-title');

const generateBtn = document.getElementById('generator-generateBtn');
const insertBtn = document.querySelector("label[for='generator-insertBtn']");
const insertBtnFileInput = document.getElementById('generator-insertBtn');

const positionOptionsLabels = document.querySelectorAll('.generator-text-choice-item label');
const positionTitle = document.querySelector('.generator-positionText');
const rangeSliders = document.querySelectorAll('.generator-rangeSlider');




//Constantes
memeTextSize.min = 16;
memeTextSize.max = 96;
const blue = '#168aad';
const border = "1px solid " + blue;

//Valeurs par défaut
let isGenerate;
memeText.value = "";
let isMeme = false;
const texts = [
  {
    text: " ",
    fontSize: 24,    //Texte 1
    x: 0,
    y: 0
  },

  {
    text: " ",
    fontSize: 24,   //Texte 2
    x: 0,
    y: 0
  },
  {
    text: " ",
    fontSize: 24,   //Texte 3
    x: 0,
    y: 0
  },
  {
    text: " ",
    fontSize: 24,   //Texte 4
    x: 0,
    y: 0
  }
];

/*

const id = location.href.split('=')[1];
async function displayProduct(id){
    const product = await findProductById(+id);
    const productImg = new Image();
    productImg.src = "img/" + product[0].img;
    console.log(productImg.src);

    productImg.onload = () =>{
        canvasProduct.width = productImg.width;
        canvasProduct.height= productImg.height;
        ctxProduct.drawImage(productImg, 0,0);
        console.log("image produit");
    }



}

displayProduct(id);

*/










//--------------------- PROGRAMME --------------------
  // ---------- RECHERCHE DU PRODUIT

  const id = location.href.split('=')[1];
  const canvasChangeEvent = new Event('canvasChange');
  displayProduct(id)
      .then(()=> {
        console.log("produit trouvé et affiché !")
        document.addEventListener('canvasChange', () =>{
          console.log("canvas onchange event activated! ")
          const memeImg = new Image();
          memeImg.src = canvasMeme.toDataURL();
          memeImg.onload = () =>{
            ctxProduct.clearRect(0,0,canvasProduct.width, canvasProduct.height);
            const productImg = new Image();
            productImg.src = localStorage.getItem('selectedProductSrc');
            productImg.onload = () =>{
              //les dimensions du canvas sont toujours celle du produit selectionné;
              ctxProduct.drawImage(productImg, 0,0);
              const dynamicCanvas = document.createElement('canvas');
              const dynamicContext = dynamicCanvas.getContext("2d");
              dynamicCanvas.width = memeImg.width;
              dynamicCanvas.height = memeImg.height;
              dynamicContext.drawImage(memeImg, 0,0);
              ctxProduct.drawImage(dynamicCanvas,0,0);

            }
          }
          
        })
      })
      .catch((erreur)=> console.error(erreur))




  //---------------------  DEFINITIONS DES EVENENEMENTS 
//MENU "GENERER OU UPLOADER" 
generateMenuBtn.addEventListener('click', () => {
    insertMenuBtn.style.pointerEvents = 'none';
    orText.style.pointerEvents = 'none';
    generateMenuBtn.style.pointerEvents = 'none';
    btnContainer.classList.add('generator-animate-fadeout');
    isGenerate = true;
    if(isGenerate){
        generateBtn.addEventListener('click', generateMeme);
    }else{
        insertBtnFileInput.addEventListener('change', uploadImg);
    }
    //Changement du contenu + css
    modeTitle.textContent = "Générer votre meme !";
    generateBtn.textContent = 'Générer un meme';
    insertBtn.style.display = "none";
    setTimeout(() =>{
        btnContainer.style.display = "none";
        memeCreationZone.style.display = "flex";
    }, 1000); 
}, true)

insertMenuBtn.addEventListener('click', () => {
    insertMenuBtn.style.pointerEvents = 'none';
    orText.style.pointerEvents = 'none';
    generateMenuBtn.style.pointerEvents = 'none';
    btnContainer.classList.add('generator-animate-fadeout');
    isGenerate = false;
    if(isGenerate){
        generateBtn.addEventListener('click', generateMeme);
    }else{
        insertBtnFileInput.addEventListener('change', uploadImg);
    }
    //Changement du contenu + css
    modeTitle.textContent = "Uploader votre meme !";
    modeTitle.style.backgroundColor = blue;
    generateBtn.style.display = 'none';
    generateBtn.style.color = blue;
    positionOptionsLabels.forEach(label => {label.style.color = blue});
    memeText.style.border = border ;
    textPositionContainer.style.border =  border;
    positionTitle.style.color = blue;
    downloadBtn.style.color = blue;
    rangeSliders.forEach(rangeSlider => {
        rangeSlider.style.backgroundColor = blue;
        rangeSlider.classList.add('generator-rangeSliderBlue');
    });
    insertBtn.style.color = blue;
    setTimeout(() =>{
        btnContainer.style.display = "none";
        memeCreationZone.style.display = "flex";
    }, 1000);

    
},true);




downloadBtn.addEventListener('click', downloadMeme);






























// ----------- FONCTIONS -----------

async function displayProduct(id){
  const product = await findProductById(+id);
  const productImg = new Image();
  productImg.src = "img/" + product.image;
  console.log(productImg);
  localStorage.setItem('selectedProductSrc', productImg.src);
  productImg.onload = () =>{
      
      canvasProduct.width = productImg.width;
      canvasProduct.height= productImg.height;
      ctxProduct.drawImage(productImg, 0,0);
      console.log("image produit");
  }



}

async function findProductById(id){
    const reponse = await fetch('../json/boutique.json');
    const produits = await reponse.json();
    const produit = produits.products.filter(element => element.id === +id);
    console.log(produit[0])
    return produit[0];
}

function findActiveText(){
  return +textOptions.filter(text => text.checked == 1)[0].id;
}

function updateTextsObjects(id){
  console.log(memeText.value,memeTextSize.value,sliderX.value, sliderY.value);
  texts.forEach(text => text.fontSize = memeTextSize.value);
  console.log(texts);
  switch(id){
    case 0:
      console.log('0 !');
      texts[0].text = memeText.value;
      texts[0].x = sliderX.value;
      texts[0].y = sliderY.value;
      break;
    case 1:
      console.log('1 !');
      texts[1].text = memeText.value;
      texts[1].x = sliderX.value;
      texts[1].y = sliderY.value;
      break;
    case 2:
      console.log('2 !');
      texts[2].text = memeText.value;
      texts[2].x = sliderX.value;
      texts[2].y = sliderY.value;
      break;
    case 3:
      console.log('3 !');
      texts[3].text = memeText.value;
      texts[3].x = sliderX.value;
      texts[3].y = sliderY.value;
      break;
  }
}

function updateCanvas(img){
  ctxMeme.clearRect(0,0, canvasMeme.width, canvasMeme.height);
  ctxMeme.drawImage(img, 0,0);
  ctxMeme.lineWidth = Math.floor(texts[0].fontSize/4);
  ctxMeme.lineJoin = 'round';
  ctxMeme.fillStyle = "#fff";
  ctxMeme.font =  texts[0].fontSize + "px sans-serif";


  for (let i=0; i < texts.length; i++){
    ctxMeme.strokeText(texts[i].text, texts[i].x,texts[i].y);
    ctxMeme.fillText(texts[i].text, texts[i].x,texts[i].y);
  }

  isMeme = true;
}

async function generateMeme(){
  console.log("generation !!!");
  //RESET INPUTS
  texts.forEach(text => {
    text.text = '';
    text.fontSize = 24;
    text.x = 0;
    text.y = 0;
  })
  memeText.value = '';

  //REQUETE A L'API

  const response = await fetch('https://api.imgflip.com/get_memes', {mode:"cors"});
  const data = await response.json();
  const memes = data.data.memes;
  const randomNumber = Math.floor(Math.random() * memes.length);
  const imgURL = memes[randomNumber].url;
  
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgURL;

  img.addEventListener('load', () =>{
    //On néttoie le canvas
    ctxMeme.clearRect(0,0, canvasMeme.width, canvasMeme.height);
    
    //Le canvas prend les dimensions de l'image à charger
    canvasMeme.width = img.width;
    canvasMeme.height = img.height;
    texts.forEach(text => {
      text.x = canvasMeme.width/2;
      text.y = canvasMeme.height/2;
    });
    //Les extremums des sliders sont définis à partir des dimensions du canvas
    sliderX.min = 0;
    sliderX.max = canvasMeme.width;
    sliderY.min = 0;
    sliderY.max = canvasMeme.height;

    downloadBtn.style.display = 'block';
    textsContainer.style.display = 'flex';
    //On déssine l'image sur le canvas
    ctxMeme.drawImage(img, 0,0);

    //dès qu'on a choisi un texte on affiche ses options
    textOptions.forEach((text,id) => {
      text.addEventListener('click', () =>{
        text.checked = 'true';
        memeText.style.display = 'block';
        textPositionContainer.style.display = 'block';
        memeText.value = texts[id].text;
        memeTextSize.value = texts[id].fontSize;
        sliderX.value = texts[id].x;
        sliderY.value = texts[id].y;
        
      });
    });

    //dès qu'on modifie un texte on cherche lequel c'est puis on le réactualise dans le canvas
    memeText.addEventListener('input', ()=> {
      const activeText = findActiveText();
      console.log('activeText:', activeText);
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
      document.dispatchEvent(canvasChangeEvent);

    });

    sliderX.addEventListener('input', ()=> {
      const activeText = findActiveText();
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
      document.dispatchEvent(canvasChangeEvent);
    });

    sliderY.addEventListener('input', ()=> {
      const activeText = findActiveText();
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
      document.dispatchEvent(canvasChangeEvent);
    });

    memeTextSize.addEventListener('input', ()=> {
      const activeText = findActiveText();
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
      document.dispatchEvent(canvasChangeEvent);
    });

    isMeme = true;
    

  });
  
}

function uploadImg(){
  console.log('uploading !!');
  //RESET INPUTS 
  texts.forEach(text => {
    text.text = '';
    text.fontSize = 24;
    text.x = 0;
    text.y = 0;
  })
  memeText.value = '';

  const imgURL = URL.createObjectURL(insertBtnFileInput.files[0]);
  console.log(imgURL);
  
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imgURL;

  activeImg = img;


  img.addEventListener('load', () =>{
    //On néttoie le canvas
    ctxMeme.clearRect(0,0, canvasMeme.width, canvasMeme.height);
    
    //Le canvas prend les dimensions de l'image à charger
    canvasMeme.width = img.width;
    canvasMeme.height = img.height;
    texts.forEach(text => {
      text.x = canvasMeme.width/2;
      text.y = canvasMeme.height/2;
    });
    //Les extremums des sliders sont définis à partir des dimensions du canvas
    sliderX.min = 0;
    sliderX.max = canvasMeme.width;
    sliderY.min = 0;
    sliderY.max = canvasMeme.height;

    downloadBtn.style.display = 'block';
    textsContainer.style.display = 'flex';
    //On déssine l'image sur le canvas
    ctxMeme.drawImage(img, 0,0);

    //dès qu'on a choisi un texte on affiche ses options
    textOptions.forEach((text,id) => {
      text.addEventListener('click', () =>{
        text.checked = 'true';
        memeText.style.display = 'block';
        textPositionContainer.style.display = 'block';
        memeText.value = texts[id].text;
        memeTextSize.value = texts[id].fontSize;
        sliderX.value = texts[id].x;
        sliderY.value = texts[id].y;
        
      });
    });

    //dès qu'on modifie un texte on cherche lequel c'est puis on le réactualise dans le canvas
    memeText.addEventListener('change', ()=> {
      const activeText = findActiveText();
      console.log('activeText:', activeText);
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
      canvasMeme.toDataURL()

    });

    sliderX.addEventListener('input', ()=> {
      const activeText = findActiveText();
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
    });

    sliderY.addEventListener('input', ()=> {
      const activeText = findActiveText();
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
    });

    memeTextSize.addEventListener('input', ()=> {
      const activeText = findActiveText();
      updateTextsObjects(activeText);
      console.log(texts);
      updateCanvas(img);
    });

    isMeme = true;
    

  });
  
}

function downloadMeme(e){
  if(isMeme){
    downloadBtn.download = 'yourMeme.png';
    downloadBtn.href = canvasMeme.toDataURL();
  }else{
    e.preventDefault();
    console.log("Vous ne pouvez pas télécharger l'image")
  }
  

}
