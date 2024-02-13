const IndexService = {};

IndexService.apiTest = async () => {
  try {
    const respond = "Welcome to ICreate API!";
    return respond;
  } catch (error) {
    console.log(error);
    return { error: "Internal server error" };
  }
};

module.exports = IndexService;
