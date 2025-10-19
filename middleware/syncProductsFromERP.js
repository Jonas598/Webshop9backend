import mongoose from "mongoose";
import Product from "../models/Product.js";
import Error from "../models/Error.js";


function validateProduct(product) {
  return (
    product.productID &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.price === 'number' &&
    typeof product.stock === 'number'
  );
}




async function syncProductsFromERP() {
  try {
    const apires = await fetch(`http://localhost:4004/rest/api/products`, {
      method: "GET",
      headers: {
        'Authorization': 'Basic ' + btoa('service-user:service-user'),
        "Content-Type": "application/json",
      },
    });

    const products = await apires.json();
    console.log(products);
    
    if(!products){
        await Error.create({
            errorCode:"PRODUCTS_DO_NOT_EXIST",
            errorMessage:"ERP API is returning empty array, NO Products Present in the response",
            errorTag:'minor'
        })
    }
    if (!Array.isArray(products)){ 
        await Error.create({
            errorCode:"ARRAY_DO_NO_EXIST",
            errorMessage:"ERP API is not returning array",
            errorTag:'critical'
        })
        throw new Error('Invalid ERP API response: not an array');
    }

    let updatedCount = 0;

    for (const product of products) {
      if (!validateProduct(product)) {
        await Error.create({
            errorCode:"PRODUCT_INFO_MISSING",
            errorMessage:`Product has missing Informaation : ${JSON.stringify(product)}`,
            errorTag:'minor'
        })
        console.warn(`⚠️ Skipping invalid product: ${JSON.stringify(product)}`);
        continue;
      }
      const findProdut = await Product.findOne({productId: product.productID});

      if(findProdut){
      await Product.findOneAndUpdate(
        { productId: product.productID },
        {
          productId: product.productID,
          name: product.name,
          desc: product.description,
          price: product.price,
          avl_peices: product.stock,
        },
        { upsert: true, new: true }
      );

      updatedCount++;
    }
    else{
        await Product.create({
      name: product.name,
      desc:product.description,
      price:product.price,
      avl_peices:product.stock,
      productId:product.productID
    });
    }
    }

    return { success: true, updatedCount }; 
  } catch (err) {
     await Error.create({
            errorCode:"FAILED_TO_FETCH",
            errorMessage:"failed to fetch the ERP API's, this is due to internet connection error",
            errorTag:'critical'
        })
    console.error('❌ Failed to sync products from ERP:', err.message);
    return { success: false, error: err.message };
  }
}

export default syncProductsFromERP;
