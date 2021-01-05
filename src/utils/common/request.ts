import request from 'request-promise-native';

export default {
  get(uri: string) {
    // lazy require
    
    const reqOpts = {
      method: 'GET',
      timeout: 30000,
      resolveWithFullResponse: true,
      json: true,
      uri,
    };

    return request(reqOpts);
  },
};
