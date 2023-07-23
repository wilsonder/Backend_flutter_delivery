const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');


module.exports = {

   findByCategory (req, res) {
    const id_category = req.params.id_category;
        Product.findByCategory( id_category, (err,data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las categorias',
                    error: err
                });
            }

            return res.status(201).json(data);
            
        });
    },

    findByNameAndCategory (req, res) {
        const id_category = req.params.id_category;
        const name = req.params.name;

            Product.findByNameAndCategory(name, id_category, (err,data) => {
    
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error al momento de listar los p´roductos',
                        error: err
                    });
                }
    
                return res.status(201).json(data);
                
            });
        },

    create(req, res) {

        const product = JSON.parse(req.body.product); //capturo los datos que envia el cliente por el metodo json

        const files = req.files; //constante para el llamado de los archivos los cuales van a contener las fotografias

        let inserts = 0; //varaiable para guardar cada una de las imagenes

        if (files.length === 0) {

            return res.status(501).json({
                success: false,
                message: 'Error al registrar el producto no tiene imagenes',
                
            });

        }else{

            Product.create(product, (err, id_product) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del producto',
                        error: err
                    });
                }

                product.id = id_product;

                //cargue de las imagenes correspondientes a cada producto
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;//path -> constante con el nombre con el que se va a guardar la imagen en firebase
                        const url = await storage(file, path);

                        if (url != undefined && url != null) { // se creo la imagen en firebase y nos retorno la URL

                            if(inserts == 0) {  //imagen numero 1 cargada
                                product.image1 = url;
                            }
                            else if (inserts == 1) { //imagen numero 2 cargada
                                product.image2 = url;
                            }
                            else if (inserts == 2) { //imagen numero 3 cargada
                                product.image3 = url;
                            }
                    
                        }

                        await Product.update(product, (err, data) => {

                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con el registro del producto',
                                    error: err
                                });
                            }

                            inserts = inserts + 1; //incremento de la variable encargada de almacenar las imagenes para realizar el proceso de cargue

                            if (inserts == files.length) { //terminó de almacenar las imagenes

                                return res.status(201).json({
                                    success: true,
                                    message: 'El producto se almacenó correctamente',
                                    data: data 
                                });

                            }

                        });

                    });
                }

                start();
                                    
            });
        }
                         
    }
        
}