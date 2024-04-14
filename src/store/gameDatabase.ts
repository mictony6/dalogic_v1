import {initializeApp } from "firebase/app";
import {getDatabase, get, ref, set} from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkosep1u-KWx23YzaFHfXR5un2Nok5jjA",
  authDomain: "dalogic-1f7c9.firebaseapp.com",
  databaseURL: "https://dalogic-1f7c9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dalogic-1f7c9",
  storageBucket: "dalogic-1f7c9.appspot.com",
  messagingSenderId: "618470258680",
  appId: "1:618470258680:web:74c92e108a7faf7bad080d",
  measurementId: "G-E47ZBW4LSM"
};


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const gameDatabase = getDatabase(firebaseApp);


function addUser(userID: string){
  userID = userID.toLowerCase();
  if (userID === "") {
    console.error("User ID cannot be empty!");
    return;
  }

  const db = getDatabase();
  const userRef = ref(db, 'users/' + userID);

  const newUserData = {
    gamesPlayed: 0,
    gamesWon: 0,
    highestScore: 0
  };

  // check if user already exists
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.error("User already exists!");
      return;
    }
    set(userRef, newUserData)
      .then(() => {
        console.log("New user added successfully!");
      })
      .catch((error) => {
        console.error("Error adding user:", error);
      });
  }).catch((error) => {
    console.error("Error checking user:", error);
  });



}


export { addUser}
