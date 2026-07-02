import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const COLLECTION = "students";

export async function getStudents() {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addStudent(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateStudent(id, data) {
  return updateDoc(doc(db, COLLECTION, id), data);
}

export async function deleteStudent(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
