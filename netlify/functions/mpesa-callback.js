import { db } from "./utils/firebaseAdmin.js";

export const handler = async (event) => {
  try {
    const callback = JSON.parse(event.body)?.Body?.stkCallback;

    if (!callback) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ResultCode: 0,
          ResultDesc: "Accepted",
        }),
      };
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = callback;

    const snap = await db
      .collection("payments")
      .where("checkoutRequestId", "==", CheckoutRequestID)
      .limit(1)
      .get();

    if (snap.empty) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ResultCode: 0,
          ResultDesc: "Accepted",
        }),
      };
    }

    const doc = snap.docs[0];
    const payment = doc.data();

    if (payment.status !== "pending") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ResultCode: 0,
          ResultDesc: "Already processed",
        }),
      };
    }

    if (ResultCode === 0) {
      const items = callback.CallbackMetadata?.Item || [];
      const getValue = (name) =>
        items.find((i) => i.Name === name)?.Value;

      const paidAmount = getValue("Amount") || payment.amount;
      const receipt = getValue("MpesaReceiptNumber") || null;

      await doc.ref.update({
        status: "completed",
        amount: paidAmount,
        mpesaReceiptNumber: receipt,
        resultDesc: ResultDesc,
        completedAt: new Date().toISOString(),
      });

      if (payment.studentId) {
        await db.collection("students").doc(payment.studentId).update({
          lastPaymentDate: new Date().toISOString(),
          lastPaymentAmount: paidAmount,
        });
      }
    } else {
      await doc.ref.update({
        status: "failed",
        resultDesc: ResultDesc,
        completedAt: new Date().toISOString(),
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        ResultCode: 0,
        ResultDesc: "Accepted",
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ResultCode: 0,
        ResultDesc: "Accepted",
      }),
    };
  }
};
