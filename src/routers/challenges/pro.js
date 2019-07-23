//Get latest list of Pro Challenges
router.get('/challenges/pro/latest', async (req, res) => {

  try {
    const pro = await Pro.findOne().sort({ startDate: -1 })
    res.send(pro)
  } catch (e) {
    res.status(500).send(e)
  }
  
})