
module.exports = (app) => {
    const country = require('../controllers/countries.js');
    let middleware = require('../helpers/middleware.js')

    app.get('/countries', country.findAll);

    app.get('/countries-paginated', country.findAllPaginated);
    
    // Retrieve a single country with country_id
    app.get("/country/:country_id", country.findOne);

    // Delete a country
    app.delete("/country/:country_id", middleware.checkRole, country.delete);   
}