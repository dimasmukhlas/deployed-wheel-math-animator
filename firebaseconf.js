<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyChGPxxqDj4beVMZ5JIWBaRVchRlvhvGMU",
    authDomain: "cognizowheel.firebaseapp.com",
    projectId: "cognizowheel",
    storageBucket: "cognizowheel.firebasestorage.app",
    messagingSenderId: "28176512279",
    appId: "1:28176512279:web:52882115cac71c7b76b352",
    measurementId: "G-XSRTGBRCMB"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>