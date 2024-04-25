const fs = require('fs');


class ProductManager{
    constructor(){
        this.path = 'products.json';
        this.products =[];
        this.nextProductId = 1;
        this.loadProducts();

    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (this.products.length > 0) {
                const lastProduct = this.products[this.products.length - 1];
                this.nextProductId = lastProduct.id + 1;
            }
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar los productos:", error);
        }
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
        this.saveProducts();
        console.log ("Se ha agregado el producto de manera correcta.");
    }
    getProducts(limit) {
        return limit ? this.products.slice(0, limit) : this.products;
    }
    getProductById(id){
        const findProduct = this.products.find(product => product.id === id);
        if (findProduct){
            return findProduct;
        } else {
            console.log ("No se encuentra el producto.");
        }
    }
    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProducts();
            console.log("Producto actualizado correctamente.");
        } else {
            console.log("No se encontró el producto para actualizar.");
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            console.log("Producto eliminado correctamente.");
        } else {
            console.log("No se encontró el producto para eliminar.");
        }
    }
}

const productManager = new ProductManager('products.json');

const product1 = {
    title: "Remera",
    description: "Elaborada en algodon",
    price: 1500,
    thumbnail: "https://res.cloudinary.com/deed7lfnh/image/upload/v1709419942/samples/woman-on-a-football-field.jpg",
    code: "c01",
    stock: 5
};
productManager.addProduct(product1);

const product2 = {
    title: "Pantalon",
    description: "Elaborado en gabardina",
    price: 2000,
    thumbnail: "https://res.cloudinary.com/deed7lfnh/video/upload/v1709419927/samples/cld-sample-video.mp4",
    code: "c02",
    stock: 8
};
productManager.addProduct(product2);


console.log(productManager.getProducts());
console.log(productManager.getProductById(2));


module.exports = ProductManager;