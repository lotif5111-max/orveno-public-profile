import { initializeApp } from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    limit
} from
    "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBl4Yfq9cCWVPshp2gBodp1UEjGV2l8qao",
    authDomain: "orveno-7f6c8.firebaseapp.com",
    projectId: "orveno-7f6c8",
    storageBucket: "orveno-7f6c8.firebasestorage.app",
    messagingSenderId: "717630124670",
    appId: "1:717630124670:web:4dfd6a4352c472b8c05e2f",
    measurementId: "G-L90ZV1ZRDL"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const loading = document.getElementById("loading");
const profile = document.getElementById("profile");
const notFound = document.getElementById("notFound");
const errorBox = document.getElementById("error");

const profileImage = document.getElementById("profileImage");
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profileLevel = document.getElementById("profileLevel");
const profileDescription = document.getElementById("profileDescription");

const followers = document.getElementById("followers");
const following = document.getElementById("following");
const likes = document.getElementById("likes");

const verifiedBadge = document.getElementById("verifiedBadge");


function getUsernameFromUrl() {

    const pathParts = window.location.pathname
        .split("/")
        .filter(part => part.length > 0);

    const userIndex = pathParts.indexOf("u");

    if (userIndex === -1) {
        return null;
    }

    if (!pathParts[userIndex + 1]) {
        return null;
    }

    return decodeURIComponent(
        pathParts[userIndex + 1]
    ).trim();
}


async function loadProfile() {

    const username = getUsernameFromUrl();

    if (!username) {
        showNotFound();
        return;
    }

    try {

        const profilesRef = collection(
            db,
            "publicProfiles"
        );

        const profileQuery = query(
            profilesRef,
            where("username", "==", username),
            limit(1)
        );

        const snapshot = await getDocs(profileQuery);

        if (snapshot.empty) {
            showNotFound();
            return;
        }

        const profileData = snapshot.docs[0].data();

        renderProfile(profileData);

    } catch (err) {

        console.error(
            "Failed to load profile:",
            err
        );

        showError();
    }
}


function renderProfile(data) {

    profileName.textContent =
        data.name || "Orveno User";

    profileUsername.textContent =
        data.username
            ? "@" + data.username
            : "";

    profileDescription.textContent =
        data.description || "";

    profileLevel.textContent =
        data.level || "Bronze";

    followers.textContent =
        formatNumber(data.followers);

    following.textContent =
        formatNumber(data.following);

    likes.textContent =
        formatNumber(
            data.likes ?? data.Likes
        );

    if (data.profileImageUrl) {

        profileImage.src =
            data.profileImageUrl;

    } else {

        profileImage.removeAttribute("src");

    }

    if (data.isVerified === true) {

        verifiedBadge.hidden = false;

    } else {

        verifiedBadge.hidden = true;
    }

    loading.hidden = true;
    notFound.hidden = true;
    errorBox.hidden = true;
    profile.hidden = false;

    document.title =
        (data.name || "Orveno Profile") +
        " | Orveno";
}


function formatNumber(value) {

    const number = Number(value || 0);

    if (number >= 1000000000) {
        return (
            (number / 1000000000)
                .toFixed(1)
                .replace(".0", "") +
            "B"
        );
    }

    if (number >= 1000000) {
        return (
            (number / 1000000)
                .toFixed(1)
                .replace(".0", "") +
            "M"
        );
    }

    if (number >= 1000) {
        return (
            (number / 1000)
                .toFixed(1)
                .replace(".0", "") +
            "K"
        );
    }

    return number.toString();
}


function showNotFound() {

    loading.hidden = true;
    profile.hidden = true;
    errorBox.hidden = true;
    notFound.hidden = false;
}


function showError() {

    loading.hidden = true;
    profile.hidden = true;
    notFound.hidden = true;
    errorBox.hidden = false;
}


loadProfile();