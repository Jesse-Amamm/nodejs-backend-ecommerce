
module.exports = (app) => {
    const state = require('../controllers/states.js');
    let middleware = require('../helpers/middleware.js')

    app.post('/states', state.findAll);

    app.post('/states-paginated', state.findAllPaginated);
    
    // Retrieve a single state with state_id
    app.get("/state/:state_id", state.findOne);

    // Delete a state
    app.delete("/state/:state_id", middleware.checkRole, state.delete);   
}