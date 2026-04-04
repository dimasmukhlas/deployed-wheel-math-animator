import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { firebaseConfig } from "./firebaseconf";

export const app = initializeApp(firebaseConfig);

void isSupported().then((supported) => {
  if (supported) getAnalytics(app);
});
