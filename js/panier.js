class Cart {
    static addProducts(products){

        products.forEach((product) => {
            const rowArticleTemplate = document.getElementById('rowArticleTemplate');
            const cloneTemplate = document.importNode(rowArticleTemplate.content, true);
            const productImage = cloneTemplate.querySelector('.product img');
            const productName = cloneTemplate.querySelector('.product-card p:first-child');
            const productPrice = cloneTemplate.querySelector('.product-card p:last-child');
            const productSubtotal = cloneTemplate.querySelector('.product-subtotal');
            productImage.src = product.imgURL;
            productName.textContent = "Nom du produit: " + product.name;
            productPrice.textContent = "Prix unitaire: " + product.price + "€";
            productSubtotal.textContent = product.price + ",00€";
            const quantity= cloneTemplate.querySelector(".quantityInput");
            
           
                
            
            document.querySelector('.table-articles').appendChild(cloneTemplate);
        });
    }
    static subtotal(products){
        let subtot = 0;
        products.forEach((product) => {
            subtot += product.price;
        });

        return subtot;

        

    }


}

const products = JSON.parse(localStorage.getItem('products'));
const nbArticles = document.getElementById('nb-articles');
nbArticles.textContent = "" + products.length;

Cart.addProducts(products);
let subtotal = Cart.subtotal(products);
document.getElementById('subtotal').textContent = subtotal + ",00€";

let tax;
//let total = subtotal + tax;

document.getElementById('tax').textContent = tax + "€";
document.getElementById('total').textContent = total + "€";

function CalculDistance(){
    let CountryInput= document.getElementById('country').value;
    let PostalCodeInput= document.getElementById('postalcode').value;
    let ANumberInput= document.getElementById('adressnumber').value;
    let ANameInput= document.getElementById('adressname').value;
    let Coordinates;
    fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/"+CountryInput+PostalCodeInput+ANumberInput+ANameInput+".json?access_token=pk.eyJ1IjoiZWxpdGVuZXQxMCIsImEiOiJja3ZyNWd6M2c2a2M1MnJvazY2andqbTJoIn0.8lUMtWhONmBdIfm7IaiKyg")
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        Coordinates=json.features[0].center;
        console.log(Coordinates);
        let MapboxUrl="https://api.mapbox.com/directions/v5/mapbox/driving/"+Coordinates[0]+","+Coordinates[1]+";45.783850,4.869060?geometries=geojson&access_token=pk.eyJ1IjoiZWxpdGVuZXQxMCIsImEiOiJja3ZyNWVhYW4wNGxoMm9tOW94bjhkaTlxIn0.ldlny4HqeBlMz0Om677T5g";
        fetch(MapboxUrl)
            .then(reponse =>{
                return reponse.json();
            })
            .then(distance =>{
                console.log(distance.waypoints[0].distance);
            })

    })
    
}



