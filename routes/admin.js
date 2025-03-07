const express = require('express');
const router = express.Router();
const adminmodel = require('../models/admin');
const Ban = require('../models/Ban');
const usermodel = require('../models/user');
const scoresmodel = require('../models/scores');

router.get('/', (req,res)=>{
    res.json({mes: 'admin page'})

})

router.post('/getuser', async(req, res)=>{
    try{
        let user = await usermodel.find();
        let score =  await scoresmodel.find();
        res.status(200).render('admin', {user, score});
    }catch(err){
        console.error(err.message);
    }
})

router.post("/ban", async (req, res) => {
  const { Team_Name } = req.body;
  if (!Team_Name) return res.status(400).send("Team_Name is required");

  try {
    await Ban.create({ Team_Name });
    res
    .status(200)
    .redirect('/login');
  } catch (error) {
    res.status(500).send("Error banning.User might have been already banned.");
  }
});

router.post("/unban", async (req, res) => {
  const { Team_Name } = req.body;
  if (!Team_Name) return res.status(400).send("Team_Name is required");

  await Ban.deleteOne({ Team_Name });
  res.status(200).send(` ${Team_Name} has been unbanned. `);
});


module.exports = router;
