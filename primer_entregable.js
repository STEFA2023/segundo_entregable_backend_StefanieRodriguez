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
        console.log ("Se ha agregado el producto de manera correcta.");
    }
    getProducts() {
        return this.products;
    }
    getProductsById(id){
        const findProduct = this.products.find(product => product.id === id);
        if (findProduct){
            return findProduct;
        } else {
            console.log ("No se encuentra el producto.");
        }
    }
}
