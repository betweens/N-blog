const express = require('express')
const router = express.Router()

router.get('/:name', function (req, res) {
  res.render('users', {
    name: req.params.name,
    supplies: ['mop', 'broom', 'duster'],
  });
  // console.log(req.query);
  // console.log(req.params);
  // console.log(req.body);
});

module.exports = router;