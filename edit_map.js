document.getElementById("back").addEventListener("click", function() {
    window.location.href = "mapview.html";
}); 

const firebaseConfig = {
    apiKey: "AIzaSyC8h1mCA5uLatlNevamS2sfUiNJ0_yZG5w",
    authDomain: "fitness-8d36a.firebaseapp.com",
    databaseURL: "https://fitness-8d36a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fitness-8d36a",
    storageBucket: "fitness-8d36a.appspot.com",
    messagingSenderId: "992203504745",
    appId: "1:992203504745:web:88bc0c79d254685dd776f8",
    measurementId: "G-EP44RZBSK3"
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();

var nameFitness = localStorage.getItem('nameFitness');
var id_state = localStorage.getItem('id_state');
const dataForm = document.getElementById("dataForm");

if(nameFitness !== null && id_state !== '0') {
    database.ref("fitness_database").orderByChild('name').equalTo(nameFitness).on('value', function(snapshot) {
        // Loop melalui hasil query
        snapshot.forEach(function(childSnapshot) {
            // Mendapatkan data dari snapshot
            var data = childSnapshot.val();
    
            // Mengisi nilai input dengan data dari Firebase
            document.getElementById('inputAlamat').value = data.alamat;
            document.getElementById('inputLatitude').value = data.latitude;
            document.getElementById('inputLongitude').value = data.longitude;
            document.getElementById('inputNama').value = data.name;
            document.getElementById('inputPhoto').value = data.photo;
            
            dataForm.addEventListener("submit", function(event) {
                event.preventDefault(); // Hindari pengiriman formulir default

                var newData = {
                    alamat: document.getElementById("inputAlamat").value,
                    photo: document.getElementById("inputPhoto").value,
                    name: document.getElementById("inputNama").value,
                    latitude: document.getElementById("inputLatitude").value,
                    longitude: document.getElementById("inputLongitude").value
                }; 

                var childRef = childSnapshot.ref;
            
                childRef.update(newData)   
            
                // Bersihkan formulir setelah pengiriman
                dataForm.reset();
            });
        });
    });
} 

else {
    dataForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Hindari pengiriman formulir default
    
        const name = document.getElementById("inputNama").value;
        const alamat = document.getElementById("inputAlamat").value;
        const photo = document.getElementById("inputPhoto").value;
        const latitude = document.getElementById("inputLatitude").value;
        const longitude = document.getElementById("inputLongitude").value;
        
        // Simpan data ke Firebase
        database.ref("fitness_database").push({
            alamat: alamat,
            latitude: latitude,
            longitude: longitude,
            name: name,
            photo: photo
        });
        
        // Bersihkan formulir setelah pengiriman
        dataForm.reset();
    });
}

function clearAllInputs() {
    // Mendapatkan semua elemen input di dokumen
    var inputFields = document.querySelectorAll('input[type="text"]');
    
    // Mengatur nilai semua elemen input menjadi string kosong
    inputFields.forEach(function(input) {
        input.value = '';
    });
}