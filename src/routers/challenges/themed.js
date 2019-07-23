//Get latest list of Themed Challenges
router.get('/challenges/themed/latest', async (req, res) => {

  try {
    const themed = await Themed.findOne().sort({ startDate: -1 })
    res.send(themed)
  } catch (e) {
    res.status(500).send(e)
  }
  
})