
module.exports = (app) => {
    const color = require('../controllers/colors.js');
    let middleware = require('../helpers/middleware.js')

    app.get('/colors', middleware.checkToken, color.findAll);

    app.get('/colors-paginated', middleware.checkToken, color.findAllPaginated);
    
    // Retrieve a single color with color_id
    app.get("/color/:color_id", middleware.checkToken, color.findOne);

    // Delete a color
    app.delete("/color/:color_id", middleware.checkRole, color.delete);   
}