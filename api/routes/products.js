const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products');

// multer is used for partner binary and uploading images
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        //        cb(null, Date.now() + file.originalname);
        cb(null, generateImageFileName(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// the default http GET for /products
router.get('/', ProductController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product);
 
router.get('/:productId', ProductController.products_get_product);

router.patch('/:productId',  checkAuth, ProductController.products_update_product);

router.delete('/:productId', checkAuth, ProductController.products_delete_product);

module.exports = router;

function generateImageFileName(inFileName) {
    const path = require('path');
    const fileParser = path.parse(inFileName);
    let dateString = replaceAll(new Date().toISOString(), ':', '-');
    return fileParser.name + '_' + dateString + fileParser.ext;
}

function replaceAll(inputString, search, replacement) {
    return inputString.split(search).join(replacement);
}