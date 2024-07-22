import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBS14Pt_L6qxC8gE-s62ERLZa79z9cyaTE",
    authDomain: "fir-firestore-learning-21ede.firebaseapp.com",
    projectId: "fir-firestore-learning-21ede",
    storageBucket: "fir-firestore-learning-21ede.appspot.com",
    messagingSenderId: "698792780836",
    appId: "1:698792780836:web:aff4cbbeaba86ecea124b1",
    measurementId: "G-3N6G80C3L5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Get a reference to the cafes collection
const cafesCollection = collection(db, 'cafes');

// Fetch the documents in the cafes collection
getDocs(cafesCollection).then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderCafe(doc)
    });
}).catch((error) => {
    console.error("Error getting documents: ", error);
});

const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;

    li.appendChild(name);
    li.appendChild(city);

    cafeList.appendChild(li);
}

form.addEventListener('submit', event => {
    // AGAR HALAMAN TIDAK TER RELOAD
    event.preventDefault();
    if (form.name.value === "" && form.city.value === "") {
        console.log("Please Add Cafe's name and Cafe's City")
    } else {
        addDoc(cafesCollection, {
            name: form.name.value,
            city: form.city.value
        });
    }
    form.name.value = '';
    form.city.value = '';
});