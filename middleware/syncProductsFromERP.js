import mongoose from "mongoose";
import Product from "../models/Product.js";


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
    console.log(products,"hi");
    

    if (!Array.isArray(products)) throw new Error('Invalid ERP API response: not an array');

    let updatedCount = 0;

    for (const product of products) {
      if (!validateProduct(product)) {
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
    console.error('❌ Failed to sync products from ERP:', err.message);
    return { success: false, error: err.message };
  }
}

export default syncProductsFromERP;
