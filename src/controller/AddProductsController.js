const AddProductsModel = require('../models/AddProductModel');
const validator = require('../validation/validations');
const costumerModel = require('../models/CostumerModel');
const aws = require('../aws/aws');
const addProdcts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let data = req.body;
    let files = req.files;

    if (validator.isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter details to create Product' });
    }
    // if (!validator.isValidFiles(files)) {
    //     return res.status(400).send({ status: false, message: "productImage is required" })
    // }
    const {
      productName,
      category,
      subCategory,
      manufacturer,
      priceBeforeDiscount,
      price,
      withGST,
      description,
      shippingCharges,
      sizeUnit,
      productQuantity,
      availability,
      costumerID,
      selectImage1,
      selectImage2,
    } = data;

    //ProductName
    if (!productName)
      return res
        .status(400)
        .send({ status: false, message: 'productName is required' });
    if (validator.isValid(productName))
      return res
        .status(400)
        .send({ status: false, message: 'name should not be an empty string' });

    //Category
    if (!category)
      return res
        .status(400)
        .send({ status: false, message: 'category is required' });
    if (validator.isValid(category))
      return res.status(400).send({
        status: false,
        message: 'category should not be an empty string',
      });

    //SubCategory
    if (!subCategory)
      return res
        .status(400)
        .send({ status: false, message: 'subCategory is required' });
    if (validator.isValid(subCategory))
      return res.status(400).send({
        status: false,
        message: 'subCategory should not be an empty string',
      });

    //Manufacturer
    if (!manufacturer)
      return res
        .status(400)
        .send({ status: false, message: 'manufacturer is required' });
    if (validator.isValid(manufacturer))
      return res.status(400).send({
        status: false,
        message: 'manufacturer should not be an empty string',
      });

    //priceBeforeDiscount
    if (!validator.isValid1(priceBeforeDiscount)) {
      return res
        .status(400)
        .send({ status: false, message: 'price is required' });
    }
    if (!validator.isValidPrice(priceBeforeDiscount)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter a Valid priceBeforeDiscount' });
    }
    //Price
    if (!validator.isValid1(price)) {
      return res
        .status(400)
        .send({ status: false, message: 'price is required' });
    }
    if (!validator.isValidPrice(price)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter a Valid price' });
    }
    //WithGST
    if (!validator.isValid1(withGST)) {
      return res
        .status(400)
        .send({ status: false, message: 'withGST is required' });
    }
    if (!validator.isValidPrice(withGST)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter a Valid withGST' });
    }
    //Description
    if (!description)
      return res
        .status(400)
        .send({ status: false, message: 'description is required' });
    if (validator.isValid(description))
      return res.status(400).send({
        status: false,
        message: 'description should not be an empty string',
      });

    //ShippingCharges
    if (!validator.isValid1(shippingCharges)) {
      return res
        .status(400)
        .send({ status: false, message: 'shippingCharges is required' });
    }
    if (!validator.isValidPrice(shippingCharges)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter a Valid shippingCharges' });
    }
    //SizeUnit
    if (!sizeUnit)
      return res
        .status(400)
        .send({ status: false, message: 'sizeUnit is required' });
    if (validator.isValid(sizeUnit))
      return res.status(400).send({
        status: false,
        message: 'sizeUnit should not be an empty string',
      });

    //ProductQuantity
    if (!productQuantity)
      return res
        .status(400)
        .send({ status: false, message: 'productQuantity is required' });
    if (validator.isValid(productQuantity))
      return res.status(400).send({
        status: false,
        message: 'productQuantity should not be an empty string',
      });
    //Availability
    if (!availability)
      return res
        .status(400)
        .send({ status: false, message: 'availability is required' });
    if (validator.isValid(availability))
      return res.status(400).send({
        status: false,
        message: 'availability should not be an empty string',
      });

    if (!validator.isValid1(costumerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID is required' });
    }
    if (!validator.isValidObjectId(costumerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID not valid' });
    }
    let checkdata = await costumerModel.findById({ _id: costumerID });
    if (!checkdata)
      return res
        .status(201)
        .send({ status: false, message: 'costumer not found' });
    //SelectImage1
    // if (SelectImage1) {
    //     if (!SelectImage1) return res.status(400).send({ status: false, message: "SelectImage1 is required" });
    //     if (validator.isValid(SelectImage1)) return res.status(400).send({ status: false, message: "SelectImage1 should not be an empty string" });
    if (files && files.length > 0) {
      let productImgUrl = await aws.uploadFile(files[0]);
      data.selectImage1 = productImgUrl;
    }
    // }
    //SelectImage2
    // if (SelectImage2) {
    //     if (!SelectImage2) return res.status(400).send({ status: false, message: "SelectImage2 is required" });
    // if (validator.isValid(SelectImage2)) return res.status(400).send({ status: false, message: "SelectImage2 should not be an empty string" });
    if (files && files.length > 0) {
      let productImgUrl1 = await aws.uploadFile(files[1]);
      data.selectImage2 = productImgUrl1;
    }

    // }
    let saveData = await AddProductsModel.create(data);
    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//==================================product update======================================
const updateProduct = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const productID = req.params.productID;
    const data = req.body;
    let files = req.files;
    if (validator.isValidBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: 'Enter details to create Product' });
    }

    let {
      productName,
      category,
      subCategory,
      manufacturer,
      priceBeforeDiscount,
      price,
      withGST,
      description,
      shippingCharges,
      sizeUnit,
      productQuantity,
      availability,
      selectImage1,
      selectImage2,
    } = data;
    if (selectImage1 || selectImage2) {
      if (!validator.isValidFiles(files)) {
        return res
          .status(400)
          .send({ status: false, message: 'productImage is required' });
      }
    }
    if (productName) {
      if (!productName)
        return res
          .status(400)
          .send({ status: false, message: 'productName is required' });
      if (validator.isValid(productName))
        return res.status(400).send({
          status: false,
          message: 'name should not be an empty string',
        });
    }

    if (category) {
      if (!category)
        return res
          .status(400)
          .send({ status: false, message: 'Category is required' });
      if (validator.isValid(category))
        return res.status(400).send({
          status: false,
          message: 'Category should not be an empty string',
        });
    }

    if (subCategory) {
      if (!subCategory)
        return res
          .status(400)
          .send({ status: false, message: 'SubCategory is required' });
      if (validator.isValid(subCategory))
        return res.status(400).send({
          status: false,
          message: 'subCategory should not be an empty string',
        });
    }

    if (manufacturer) {
      if (!manufacturer)
        return res
          .status(400)
          .send({ status: false, message: 'manufacturer is required' });
      if (validator.isValid(manufacturer))
        return res.status(400).send({
          status: false,
          message: 'manufacturer should not be an empty string',
        });
    }

    if (priceBeforeDiscount) {
      if (!validator.isValid1(priceBeforeDiscount)) {
        return res
          .status(400)
          .send({ status: false, message: 'price is required' });
      }
      if (!validator.isValidPrice(priceBeforeDiscount)) {
        return res.status(400).send({
          status: false,
          message: 'Enter a Valid priceBeforeDiscount',
        });
      }
    }
    //Price
    if (price) {
      if (!validator.isValid1(price)) {
        return res
          .status(400)
          .send({ status: false, message: 'price is required' });
      }
      if (!validator.isValidPrice(price)) {
        return res
          .status(400)
          .send({ status: false, message: 'Enter a Valid price' });
      }
    }
    //WithGST
    if (withGST) {
      if (!validator.isValid1(withGST)) {
        return res
          .status(400)
          .send({ status: false, message: 'withGST is required' });
      }
      if (!validator.isValidPrice(withGST)) {
        return res
          .status(400)
          .send({ status: false, message: 'Enter a Valid withGST' });
      }
    }

    if (description) {
      if (!description)
        return res
          .status(400)
          .send({ status: false, message: 'description is required' });
      if (validator.isValid(description))
        return res.status(400).send({
          status: false,
          message: 'description should not be an empty string',
        });
    }

    if (shippingCharges) {
      if (!validator.isValid1(shippingCharges)) {
        return res
          .status(400)
          .send({ status: false, message: 'shippingCharges is required' });
      }
      if (!validator.isValidPrice(ShippingCharges)) {
        return res
          .status(400)
          .send({ status: false, message: 'Enter a Valid shippingCharges' });
      }
    }

    if (sizeUnit) {
      if (!sizeUnit)
        return res
          .status(400)
          .send({ status: false, message: 'sizeUnit is required' });
      if (validator.isValid(sizeUnit))
        return res.status(400).send({
          status: false,
          message: 'sizeUnit should not be an empty string',
        });
    }

    if (productQuantity) {
      if (!productQuantity)
        return res
          .status(400)
          .send({ status: false, message: 'productQuantity is required' });
      if (validator.isValid(productQuantity))
        return res.status(400).send({
          status: false,
          message: 'productQuantity should not be an empty string',
        });
    }
    if (availability) {
      if (!availability)
        return res
          .status(400)
          .send({ status: false, message: 'availability is required' });
      if (validator.isValid(availability))
        return res.status(400).send({
          status: false,
          message: 'availability should not be an empty string',
        });
    }

    if (selectImage1) {
      if (!selectImage1)
        return res
          .status(400)
          .send({ status: false, message: 'SelectImage1 is required' });
      if (validator.isValid(SelectImage1))
        return res.status(400).send({
          status: false,
          message: 'SelectImage1 should not be an empty string',
        });
    }
    //SelectImage2
    if (selectImage2) {
      if (!selectImage2)
        return res
          .status(400)
          .send({ status: false, message: 'SelectImage2 is required' });
      if (validator.isValid(SelectImage2))
        return res.status(400).send({
          status: false,
          message: 'SelectImage2 should not be an empty string',
        });
    }
    let productData = await AddProductsModel.findOneAndUpdate(
      { _id: productID },
      data,
      { new: true }
    );
    if (!productData) {
      return res
        .status(404)
        .send({ satus: false, message: 'no user found to update' });
    }
    return res
      .status(200)
      .send({ satus: true, message: 'success', data: productData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=======================product delete================================================

const DeleteProduct = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let productID = req.params.productID;
    if (!validator.isValidObjectId(productID)) {
      res
        .status(400)
        .send({ status: false, message: 'Please provide valid Product Id' });
    }
    let getId = await AddProductsModel.findOne({ _id: productID });
    if (!getId) {
      return res.status(404).send({
        status: false,
        message: 'Product Not Found for the request id',
      });
    }
    if (getId.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: 'Product is already deleted not found',
      });
    }

    await AddProductsModel.updateOne(
      { _id: productID },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res
      .status(200)
      .send({ status: true, message: 'Product is deleted' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================get products=======================================================
const getProducts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let filter = { isDeleted: false };
    let data = await AddProductsModel.find(filter);
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================get Individual products=======================================================
const getManufactureProducts = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    let customerID = req.params.customerID;
    if (!validator.isValid1(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID is required' });
    }
    if (!validator.isValidObjectId(customerID)) {
      return res
        .status(400)
        .send({ status: false, message: 'costumerID not valid' });
    }
    let getData = await AddProductsModel.find({ costumerID: customerID });
    if (getData.length===0) {
      return res
        .status(400)
        .send({ status: false, message: 'No data found.' });
    }
    return res.status(200).send({ status: true, data: getData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//======================================get product names ====================================
const getproductnames = async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', '*')
  try {
      let filter = { isDeleted: false }
      let data = await AddProductsModel.find(filter).distinct("productName")
      if(!data )
      return res.status(404).send({status:false,message:"no enquiries found"})
      res.status(200).send({ status: true, data: data })
  } catch (error) {
      return res.status(500).send({ status: false, message: error.message })
  }
}

module.exports = { addProdcts, updateProduct, DeleteProduct, getProducts, getManufactureProducts,getproductnames };
