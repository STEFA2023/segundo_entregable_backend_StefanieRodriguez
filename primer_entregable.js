class ProductManager{
    constructor(){
        this.products =[];
        this.nextProductId = 1;
    }

    addProduct(product){
        if (!product.title|| !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            console.error ("Los campos son obligatorios");
            return;
        }
        if(this.products.some(existingProduct =>existingProduct.code === product.code)){
            console.log("El codigo pertenece a otro producto ingresado.");
            return;
        }
        product.id = this.nextProductId++;
        this.products.push(product);
        console.log ("Se ha agregado el producto de manera correcta.");
    }
    getProducts() {
        return this.products;
    }
    getProductById(id){
        const findProduct = this.products.find(product => product.id === id);
        if (findProduct){
            return findProduct;
        } else {
            console.log ("No se encuentra el producto.");
        }
    }
}

const productManager = new ProductManager();
const product1 = {
    title: "Remera",
    description: "Elaborada en algodon",
    price: 1500,
    thumbnail: "thumbnail1.jpg",
    code: "c01",
    stock: 5
};
productManager.addProduct(product1);

const product2 = {
    title: "Pantalon",
    description: "Elaborado en gabardina",
    price: 2000,
    thumbnail: "thumbnail1.jpg",
    code: "c02",
    stock: 8
};
productManager.addProduct(product2);


console.log(productManager.getProducts());
console.log(productManager.getProductById(2));
