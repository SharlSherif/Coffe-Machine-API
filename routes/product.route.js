const { Router } = require('express');
const router = Router();

const ProductController = require('../controllers/product.controller');
const Middleware = require('../middlewares/product.middleware');

// use this route for seeding the database with the required data based on the Product schema model
router.post(
    '/',
    ProductController.seed
);

router.get('/', Middleware, ProductController.getData)

module.exports = router;
