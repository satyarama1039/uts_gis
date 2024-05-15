

var map = L.map('map').setView([-8.8008012, 115.1612023], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 100,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.getCurrentPosition(position => {
    const { coords: { latitude, longitude }} = position;

    var myIcon = L.icon({
        iconUrl: 'user.png',
        iconSize: [35, 40],
        iconAnchor: [16, 10],
    });
    
    var marker = new L.marker([latitude, longitude], {
    draggable: false,
    icon: myIcon,
    autoPan: true
    }).addTo(map);

    map.setView([latitude, longitude], 10);

    marker.bindPopup("<b>You're here!").openPopup();
    console.log(marker);
})

var popup = L.popup()
    .setLatLng([-8.8008012, 115.1612023])
    .setContent("I am a standalone popup.")
    .openOn(map);

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

var circle = L.circle([-8.8008012, 115.1612023], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

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

database.ref("fitness_database").on("value", getData);

var nameFitness = null;

function getData(snapshoot) {
    snapshoot.forEach((element) => {
        var data = element.val();
        
        var myIcon = L.icon({
            iconUrl: 'icon-jantung.png',
            iconSize: [40, 40],
            iconAnchor: [16, 10],
        });
   
        var marker = L.marker([data.latitude, data.longitude],{
            icon: myIcon
            }).addTo(map);
        marker.bindPopup(data.name).openPopup();;

        // Function to show the overlay
        function showOverlay() {
            document.getElementById('overlayImage').src = data.photo;
            document.getElementById('overlayTitle').textContent = data.name;
            document.getElementById('overlayDescription').textContent = data.alamat;
            document.getElementById('overlay').style.display = 'block';
        }

        // Function to hide the overlay
        function hideOverlay() {
            document.getElementById('overlay').style.display = 'none';
        }

        // Add a click event listener to the marker
        marker.on('click', function() {
            showOverlay();
            nameFitness = data.name;
            id_state = 1;
            document.getElementById("delete").addEventListener("click", function() {
                database.ref("fitness_database").orderByChild("name").equalTo(nameFitness).once("value", function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        // Mendapatkan referensi ke data yang cocok
                        var dataRef = childSnapshot.ref;
                
                        // Menghapus data
                        dataRef.remove()
                            .then(function() {
                                console.log("Data berhasil dihapus");
                                location.reload(); 
                            })
                            .catch(function(error) {
                                console.error("Error menghapus data:", error);
                            });
                    });
                });
            });

            localStorage.setItem('nameFitness', nameFitness);
            localStorage.setItem('id_state', id_state);
        });

        // Close the overlay when clicking outside of it
        window.addEventListener('click', function(event) {
            if (event.target == document.getElementById('overlay') || event.target == document.getElementById('overlayImage') || event.target == document.getElementById('overlayTitle') || event.target == document.getElementById('overlayDescription')) {
                hideOverlay();
            }
        });
    });
}

document.getElementById("edit").addEventListener("click", function() {
    window.location.href = "edit_map.html";
});

document.getElementById("fab").addEventListener("click", function() {
    nameRumahSakit = null;
    id_state = 0
    localStorage.setItem('nameFitness', nameFitness);
    localStorage.setItem('id_state', id_state);
    window.location.href = "edit_map.html";
});

window.onscroll = function() {scrollFunction()};
    
function scrollFunction() {
    var scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

document.getElementById("logout").addEventListener("click", function() {
    localStorage.setItem("token", "");
    window.location.href = "index.html";
});