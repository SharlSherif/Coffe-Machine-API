const pods = [
    'COFFEE_POD_LARGE',
    'COFFEE_POD_SMALL',
    'ESPRESSO_POD',
]
const machines = [
    'COFFEE_MACHINE_LARGE',
    'COFFEE_MACHINE_SMALL',
    'ESPRESSO_MACHINE'
]

const Middleware = (req, res, next) => {
    let originalQuery = req.query;
    let product_type = originalQuery.product_type;
    /*
        if the product_type is not specified, we should return the entire data in the Product schema
        not sure if it's a good idea to do that in the same route,
        it's an easier decision when the app frontend is layed out
    */
    if (product_type == undefined || product_type.length < 1) {
        req.structuredQuery = {}
    }

    //? if product_type is a machine
    //? the filters is only restricted to water_line_compatible (BOOLEAN) based on the technical requirements document
    if (machines.indexOf(product_type) !== -1) {
        req.structuredQuery = {
            product_type,
        }
        //? ensures that the value water_line_compatible is passed in the query before using it as a filter
        // ? the reason for this is because by default req.query.water_line_compatible would equal undefined if water_line_compatible was not passed
        //? that would make the database query to filter by all values where water_line_compatible equals undefined, which is not going to return anything ever since water_line_compatible is a boolean

        if (originalQuery.water_line_compatible !== undefined) {
            req.structuredQuery.water_line_compatible = originalQuery.water_line_compatible
        }

    }

    //? if product_type is a pod
    if (pods.indexOf(product_type) !== -1) {
        // ? ensures that the water_line_compatible cannot be used in this case
        delete originalQuery.water_line_compatible;

        req.structuredQuery = {
            product_type,
            //? makes this code easily extendible to new filters in the future
            ...originalQuery,
        }
    }


    next();
}

module.exports = Middleware