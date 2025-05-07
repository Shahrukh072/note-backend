module.exports = {
    sendOk: (res, message = 'Success', data = {}) => {
      res.status(200).json({ status: true, message, data });
    },
  
    serviceError: (res, message = 'Internal server error', error = {}) => {
      console.error('[Service Error]', message, error);
      res.status(500).json({ status: false, message, error: error.message || error });
    },
  
    badRequest: (res, message = 'Bad request') => {
      res.status(400).json({ status: false, message });
    },
  
    notFound: (res, message = 'Not found') => {
      res.status(404).json({ status: false, message });
    }
  };
  