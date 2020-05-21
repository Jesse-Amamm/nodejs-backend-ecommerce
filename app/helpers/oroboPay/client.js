const fetch = require('node-fetch');
const operations = require('./operations').operations;
const configenv = require('../../../config/config-env');


const COUNTRY_CODE = "NG";
const CHANNEL = "CARD";
const CHARGE_BEARER = "";
const BASE_URL = configenv.variables.baseUrl;
const TKN: "AC_h4fuqVsvxBlqEGi7aezSDrEks";

//step 1
exports.getAccountsPaymentMethod = () => {

    let data;
    //set request header
    const requestHeaders = new Headers();
    headers.append("token", TKN);

    const requestOptions = {
        method: 'GET',
        headers: requestHeaders,
        redirect: 'follow'
    };

    fetch(`${BASE_URL}${operations.PAYMENT_METHOD}`, requestOptions)
    .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to fetch account payment methods.');
        }
        return res.json();
    }).then(responseData => {
        data = responseData;
    }).catch(err => {
        console.log(err);
    })

    return data;
};

//step 2
//options object should have the following
//amount, paymentReference, redirectUrl, pan, expiryMonth, expiryYear, cvv, payerName, payerEmail, payerPhoneNumber
exports.createPaymentRequest = (options) => {
    const amount = options.amount * 100 //convert to kobo or cents or whatever

    //set 
    const data = {
        "amount":amount,
        "payment_reference":options.paymentReference,
        "country_code":COUNTRY_CODE,
        "channel":CHANNEL,
        "channel_data":{
            "pan":options.pan,
            "exp_month":options.exp_month,
            "exp_year":options.expiryYear,
            "cvv":options.cvv
        },
        "capture":"true",
        "charge_bearer":CHARGE_BEARER,
        "redirect_url":options.redirectUrl,
        "payer_name":options.payerName,
        "payer_email_address":options.payerEmail,
        "payer_phone_number":options.payerPhoneNumber
    }
    const requestHeaders = new Headers();
    requestHeaders.append("token", TKN);
    requestHeaders.append("Content-Type", "application/json");

    const jsonData = JSON.stringify(data);
    const requestOptions = {
        method: 'POST',
        headers: requestHeaders,
        body: jsonData,
        redirect: 'follow'
    };

    fetch(`${BASE_URL}${operations.CREATE_PAYMENT_REQUEST}`, requestOptions)
    .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to create payment request.');
        }
        return res.json();
    }).then(responseData => {
        data = responseData;
    }).catch(err => {
        console.log(err);
    })

    return data;
}

//step 3 OPTIONAL
exports.authorizePaymentRequest = (oroboReference, authorizationToken) => {
    const requestHeaders = new Headers();
    requestHeaders.append("token", TKN);
    requestHeaders.append("Content-Type", "application/json");

    const data = {
        "orobo_reference": oroboReference,
         "authorization_token": authorizationToken
    }
    const jsonData = JSON.stringify(data);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: jsonData,
        redirect: 'follow'
    };

    fetch(`${BASE_URL}${operations.AUTHORIZE_PAYMENT_REQUEST}`, requestOptions)
    .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to authorize payment request.');
        }
        return res.json();
    }).then(responseData => {
        data = responseData;
    }).catch(err => {
        console.log(err);
    })

    return data;
}

//step 4
exports.paymentRequestStatus = (paymentReference) => {
    const requestHeaders = new Headers();
    requestHeaders.append("token", TKN);
    requestHeaders.append("Content-Type", "application/json");

    const data = {
        "payment_reference": paymentReference
    }
    const jsonData = JSON.stringify(data);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: jsonData,
        redirect: 'follow'
    };

    fetch(`${BASE_URL}${operations.PAYMENT_REQUEST_STATUS}`, requestOptions)
    .then(res => {
        if (res.status !== 200) {
          throw new Error('Failed to authorize payment request.');
        }
        return res.json();
    }).then(responseData => {
        data = responseData;
    }).catch(err => {
        console.log(err);
    })

    return data;
}