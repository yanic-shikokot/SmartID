const { db } = require('./utils/firebaseAdmin');

exports.handler = async (event) => {
  try {
    const callback = JSON.parse(event.body)?.Body?.stkCallback;

    if (!callback) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
      };
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = callback;

    const snap = await db
      .collection('payments')
      .where('checkoutRequestId', '==', CheckoutRequestID)
      .limit(1)
      .get();

    if (snap.empty) {
      console.warn('No matching payment for', CheckoutRequestID);
      return {
        statusCode: 200,
        body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
      };
    }

    const doc = snap.docs[0];
    const paymentData = doc.data();

    if (paymentData.status !== 'pending') {
      return {
        statusCode: 200,
        body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Already processed' })
      };
    }

    if (ResultCode === 0) {
      const items = callback.CallbackMetadata?.Item || [];
      const getValue = (name) => items.find((i) => i.Name === name)?.Value;
      const paidAmount = getValue('Amount') || paymentData.amount;
      const receiptNumber = getValue('MpesaReceiptNumber') || null;

      await doc.ref.update({
        status: 'completed',
        mpesaReceiptNumber: receiptNumber,
        amount: paidAmount,
        completedAt: new Date().toISOString(),
        resultDesc: ResultDesc,
      });

      if (paymentData.studentId) {
        const studentRef = db.collection('students').doc(paymentData.studentId);
        const studentSnap = await studentRef.get();

        if (studentSnap.exists) {
          await studentRef.update({
            lastPaymentDate: new Date().toISOString(),
            lastPaymentAmount: paidAmount,
          });
        }
      }
    } else {
      await doc.ref.update({
        status: 'failed',
        resultDesc: ResultDesc,
        completedAt: new Date().toISOString()
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
    };
  } catch (err) {
    console.error('mpesa-callback error:', err);
    return {
      statusCode: 200,
      body: JSON.stringify({ ResultCode: 0, ResultDesc: 'Accepted' })
    };
  }
};
