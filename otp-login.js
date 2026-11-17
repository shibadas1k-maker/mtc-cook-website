
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

// MTC COOK Firebase Settings
const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "mtc-cook-894e2.firebaseapp.com",
  projectId: "mtc-cook-894e2",
  appId: "PASTE_FIREBASE_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

auth.languageCode = "hi";

// मोबाइल नंबर पर OTP भेजें
window.mtcSendOTP = async function () {
  try {
    const phone = document
      .getElementById("mtcPhone")
      .value.trim();

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      alert("सही 10 अंकों का मोबाइल नंबर डालें");
      return;
    }

    if (!window.mtcRecaptcha) {
      window.mtcRecaptcha = new RecaptchaVerifier(
        auth,
        "mtc-recaptcha",
        { size: "normal" }
      );
    }

    window.mtcConfirmation =
      await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        window.mtcRecaptcha
      );

    alert("OTP भेज दिया गया है");

  } catch (error) {
    alert("OTP भेजने में समस्या: " + error.message);
  }
};

// OTP सत्यापित करके लॉगिन करें
window.mtcVerifyOTP = async function () {
  try {
    if (!window.mtcConfirmation) {
      alert("पहले OTP भेजें");
      return;
    }

    const code = document
      .getElementById("mtcOTP")
      .value.trim();

    await window.mtcConfirmation.confirm(code);

    alert("MTC COOK में लॉगिन सफल!");

  } catch (error) {
    alert("OTP सही नहीं है: " + error.message);
  }
};
