import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, where, query, orderBy, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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
// getDocs(cafesCollection).then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc)
//     });
// }).catch((error) => {
//     console.error("Error getting documents: ", error);
// });

// getDataByQueries();
// getDataByOrder();
getRealtimeData()

const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

function renderCafe(_doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', _doc.id);
    name.textContent = _doc.data().name;
    city.textContent = _doc.data().city;
    cross.textContent = 'x'

    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);

    cafeList.appendChild(li);

    // DELETE DATA
    cross.addEventListener('click', event => {
        event.stopPropagation();
        let id = event.target.parentElement.getAttribute('data-id');
        const docRef = doc(db, 'cafes', id);
        deleteDoc(docRef).then(() => console.log('delete success')).catch(err => console.error('delete error', err));
        // updateData(id);
    });
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

function getDataByQueries(value) {
    const queryTemp = query(cafesCollection, where("city", "==", "Malang"));

    getDocs(queryTemp).then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderCafe(doc)
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

function getDataByOrder() {
    const queryTemp = query(cafesCollection, orderBy('name', 'desc'));

    getDocs(queryTemp).then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderCafe(doc)
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

// FUNCTION INI MEMERLUKAN INDEX DI DALAM COLLECTIONNYA
function getDataByOrderAndQueries() {
    const queryTemp = query(cafesCollection, orderBy('name', 'desc'), where("city", "==", "Malang"));

    getDocs(queryTemp).then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderCafe(doc)
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
}

function getRealtimeData() {
    const queryTemp = query(cafesCollection, orderBy('name', 'desc'));

    onSnapshot(queryTemp, snapshot => {
        let changes = snapshot.docChanges();
        console.log(changes)
        changes.forEach(change => {
            if (change.type == 'added') {
                renderCafe(change.doc);
            } else if (change.type == 'removed') {
                let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
                cafeList.removeChild(li);
            } else {
                let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
                cafeList.removeChild(li);
                renderCafe(change.doc);
            }
        })
    }, error => {
        console.error("Error getting documents: ", error);
    });
}

function updateData(_id) {
    const docRef = doc(db, 'cafes', _id);
    updateDoc(docRef, {
        name: 'Boogie',
        city: 'Boogieland'
    }).then(() => console.log('update success'))
        .catch(err => console.error('update error', err))
}