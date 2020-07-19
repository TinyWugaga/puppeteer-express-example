const express = require('express');
const router = express.Router();

const fetchAllDiscography = require('../lib/lib-puppeteer');

/* GET users listing. */
router.get('/', function(req, res, next) {

  fetchAllDiscography().then(result =>{

    const discographyList = result;

    res.json({
      msg:'Success to get list of discography',
      data:{
        discographyList
      }
    });
  });
  
});

module.exports = router;
