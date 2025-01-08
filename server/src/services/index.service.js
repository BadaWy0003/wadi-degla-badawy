const IndexService = {};

IndexService.apiTest = async () => {
  try {
    const respond = 'Welcome to Wadi-Degla API!';
    return respond;
  } catch (error) {
    return { error: 'Internal server error' };
  }
};

module.exports = IndexService;
