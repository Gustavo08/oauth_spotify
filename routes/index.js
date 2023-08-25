const { Router } = require('express');

const { mainPage, loginSpotify, callbackSpotify, dashboard } = require('../controllers');

const router = Router();

router.get('/', mainPage);
router.get('/api/login', loginSpotify);
router.get('/api/callback', callbackSpotify);
router.get('/dashboard', dashboard);

module.exports = router;