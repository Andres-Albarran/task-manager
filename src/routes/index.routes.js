const {Router} = require('express')
const router = Router();
const { renderIndex, renderAbout, renderUsuarios} = require('../controllers/index.controller');
const {isAuthenticated} = require('../helpers/auth');

router.get('/', renderIndex);

router.get('/about', renderAbout);

router.get('/usuarios', isAuthenticated, renderUsuarios);


module.exports = router;
