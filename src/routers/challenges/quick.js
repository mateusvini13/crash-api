//Get latest list of Quick Challenges
router.get('/challenges/quick/latest', async (req, res) => {

  try {
    const quick = await Quick.findOne().sort({ startDate: -1 })
    res.send(quick)
  } catch (e) {
    res.status(500).send(e)
  }
  
})