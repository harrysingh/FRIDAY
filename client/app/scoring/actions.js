import _ from 'underscore';

export const CUST_SCORING_REQ = 'Scoring.CUST_SCORING_REQ';
export const CUST_SCORING_RESULT = 'Scoring.CUST_SCORING_RESULT';
export const CUST_SCORING_ERR = 'Scoring.CUST_SCORING_ERR';

export const getCustomerScore = (inputOptions) => {
  const customerJson = inputOptions || {};

  if (_.isEmpty(customerJson.name)
      || _.isEmpty(customerJson.address)
      || _.isEmpty(customerJson.postalCode)
      || _.isEmpty(customerJson.accountNumber)
      || _.isEmpty(customerJson.contactName)) {
    throw new Error('Invalid options for scoring API.');
  }

  return {
    method: 'POST',
    type: CUST_SCORING_REQ,
    url: '/v1/scoring/customers',
    data: {
      customers: [ {
        kna1_name1: customerJson.name,
        kna1_stras: customerJson.address,
        kna1_pstlz: customerJson.postalCode,
        'knb1_props.knb1_akont': customerJson.accountNumber,
        'knvk_props.knvk_name1': customerJson.contactName,
      } ],
    },
  };
};
