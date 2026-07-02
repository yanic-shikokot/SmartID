import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  orderBy,
  where,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const FEES_COLLECTION = "fees";
const PAYMENTS_COLLECTION = "payments";

export async function getFees({ studentId, term, year, status } = {}) {
  let q = query(collection(db, FEES_COLLECTION), orderBy("createdAt", "desc"));

  if (studentId) {
    q = query(q, where("studentId", "==", studentId));
  }
  if (term) {
    q = query(q, where("term", "==", term));
  }
  if (year) {
    q = query(q, where("year", "==", year));
  }
  if (status) {
    q = query(q, where("status", "==", status));
  }

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getStudentFees(studentId) {
  const q = query(
    collection(db, "students", studentId, "fees"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addFee(data) {
  const feeData = {
    ...data,
    status: data.status || "pending",
    paidAmount: data.paidAmount || 0,
    balance: (data.amount || 0) - (data.paidAmount || 0),
    payments: data.payments || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const feeRef = await addDoc(
    collection(db, "students", data.studentId, "fees"),
    feeData
  );

  await addDoc(collection(db, FEES_COLLECTION), {
    ...feeData,
    feeId: feeRef.id,
  });

  return feeRef.id;
}

export async function recordPayment(feeId, studentId, paymentData) {
  const studentFeeRef = doc(db, "students", studentId, "fees", feeId);
  const feeSnap = await getDoc(studentFeeRef);

  if (!feeSnap.exists()) {
    throw new Error("Fee record not found");
  }

  const feeData = feeSnap.data();
  const newPaidAmount = (feeData.paidAmount || 0) + paymentData.amount;
  const newBalance = (feeData.amount || 0) - newPaidAmount;
  const newStatus = newBalance <= 0 ? "paid" : newPaidAmount > 0 ? "partial" : "pending";

  const payment = {
    ...paymentData,
    date: new Date().toISOString(),
    recordedAt: serverTimestamp(),
  };

  const payments = [...(feeData.payments || []), payment];

  await updateDoc(studentFeeRef, {
    paidAmount: newPaidAmount,
    balance: Math.max(0, newBalance),
    status: newStatus,
    payments,
    updatedAt: serverTimestamp(),
  });

  await addDoc(collection(db, PAYMENTS_COLLECTION), {
    feeId,
    studentId,
    ...payment,
    status: "completed",
    createdAt: serverTimestamp(),
  });

  return { newBalance, newStatus };
}

export async function getFeeSummary(year, term) {
  const q = query(
    collection(db, FEES_COLLECTION),
    where("year", "==", year),
    where("term", "==", term)
  );
  const snap = await getDocs(q);

  let total = 0;
  let collected = 0;
  let pending = 0;
  let overdue = 0;
  let count = 0;

  snap.docs.forEach((d) => {
    const data = d.data();
    total += data.amount || 0;
    collected += data.paidAmount || 0;
    count++;

    if (data.status === "paid") {
    } else if (data.status === "overdue") {
      pending += data.balance || 0;
      overdue++;
    } else {
      pending += data.balance || 0;
    }
  });

  return { total, collected, pending, overdue, count, balance: total - collected };
}
