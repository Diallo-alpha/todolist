// Récupération des éléments du DOM
let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let timeInput = document.getElementById("timeInput");
let textarea = document.getElementById("textarea");
let imageInput = document.getElementById("imageInput");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let add = document.getElementById("add");

// Ajout d'un événement de soumission au formulaire
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le comportement par défaut de la soumission du formulaire
    formValidation(); // Appel de la fonction de validation du formulaire
});

// Fonction de validation du formulaire
let formValidation = () => {
    if (textInput.value === "") {
        // Affiche un message d'erreur si le champ de texte est vide
        console.log("échec");
        msg.innerHTML = "La tâche ne peut pas être vide";
    } else {
        // Efface le message d'erreur et accepte les données si le champ de texte n'est pas vide
        console.log("succès");
        msg.innerHTML = "";
        acceptData();
        // Ferme le modal après l'ajout des données
        add.setAttribute("data-bs-dismiss", "modal");
        add.click();

        // Réinitialise l'attribut data-bs-dismiss après la fermeture du modal
        (() => {
            add.setAttribute("data-bs-dismiss", "");
        })();
    }
};

// Tableau pour stocker les données des tâches
let data = JSON.parse(localStorage.getItem("data")) || [];

// Fonction pour accepter et stocker les données des tâches
let acceptData = () => {
    const reader = new FileReader();
    reader.onload = () => {
        data.push({
            text: textInput.value,
            date: dateInput.value,
            time: timeInput.value,
            description: textarea.value,
            image: reader.result,
        });

        // Stocke les données dans le localStorage
        localStorage.setItem("data", JSON.stringify(data));
        createTasks();
        console.log(data); // Affiche les données dans la console pour vérification
    };
    if (imageInput.files[0]) {
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        data.push({
            text: textInput.value,
            date: dateInput.value,
            time: timeInput.value,
            description: textarea.value,
            image: "",
        });
        // Stocke les données dans le localStorage
        localStorage.setItem("data", JSON.stringify(data));
        createTasks();
        console.log(data); // Affiche les données dans la console pour vérification
    }
};

let createTasks = () => {
    tasks.innerHTML = "";
    data.map((x, y) => {
        const currentDate = new Date();
        const taskDate = new Date(`${x.date}T${x.time}`);
        const expiredClass = taskDate < currentDate ? 'expired' : '';
        return (tasks.innerHTML += `
        <div id=${y} class="task ${expiredClass}">
                ${x.image ? `<img src="${x.image}" alt="Image de la tâche">` : ''}
                <span class="fw-bold">${x.text}</span>
                <span class="small text-secondary">${x.date} ${x.time}</span>
                <p>${x.description}</p>
        
                <span class="options">
                  <i onClick="editTask(${y})" data-bs-toggle="modal" data-bs-target="#form" class="fas fa-edit"></i>
                  <i onClick="deleteTask(${y})" class="fas fa-trash-alt"></i>
                </span>
              </div>
        `);
    });

    resetForm();
};

let resetForm = () => {
    textInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    textarea.value = "";
    imageInput.value = "";
};

// Fonction pour éditer une tâche
let editTask = (index) => {
    const task = data[index];
    textInput.value = task.text;
    dateInput.value = task.date;
    timeInput.value = task.time;
    textarea.value = task.description;
    // Ne pas réinitialiser l'image ici pour éviter de la perdre

    deleteTask(index);
};

// Fonction pour supprimer une tâche
let deleteTask = (index) => {
    data.splice(index, 1);
    localStorage.setItem("data", JSON.stringify(data));
    createTasks();
};

// Initialiser les tâches à partir du localStorage
document.addEventListener("DOMContentLoaded", createTasks);
