const { getAccessToken, generateTimestamp, generatePassword, formatPhoneNumber, BASE_URL } = require('./utils/daraja');
const { db } = require('./utils/firebaseAdmin');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { studentId, admissionNumber, phoneNumber, amount, term, year } = JSON.parse(event.body);
    if (!studentId || !phoneNumber || !amount || !term || !year) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const timestamp = generateTimestamp();
    const password = generatePassword(timestamp);
    const accessToken = await getAccessToken();

    const stkRes = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: admissionNumber || studentId,
        TransactionDesc: `Fee payment Term ${term} ${year}`,
      }),
    });
    const stkData = await stkRes.json();

    if (stkData.ResponseCode !== '0') {
      return { statusCode: 400, body: JSON.stringify({ error: stkData.ResponseDescription || stkData.errorMessage || 'STK push failed' }) };
    }

    await db.collection('payments').add({
      studentId, admissionNumber: admissionNumber || null,
      amount: Math.round(amount), term, year,
      method: 'mpesa', status: 'pending',
      phoneNumber: formattedPhone,
      merchantRequestId: stkData.MerchantRequestID,
      checkoutRequestId: stkData.CheckoutRequestID,
      mpesaReceiptNumber: null, resultDesc: null,
      createdAt: new Date().toISOString(), completedAt: null,
    });

    return { statusCode: 200, body: JSON.stringify({ message: 'STK push sent — check your phone', checkoutRequestId: stkData.CheckoutRequestID }) };
  } catch (err) {
    console.error('mpesa-stk-push error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
