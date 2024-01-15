const IndexService = require("../services/index.service");
const IndexController = {};

IndexController.index = async (req, res) => {
  try {
    const respond = await IndexService.apiTest();

    res.status(200).send(respond);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = IndexController;
