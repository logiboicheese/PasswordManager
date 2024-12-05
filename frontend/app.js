import axios from 'axios';
require('dotenv').config();

const API_BASE_URL = process.env.REACT_APP_API_URL;

async function fetchPasswords() {
  try {
    const response = await axios.get(`${API_BASE_URL}/passwords`);
    displayPasswords(response.data);
  } catch (error) {
    console.error("Failed to fetch passwords:", error);
  }
}

async function addPassword(passwordData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/passwords`, passwordData);
    console.log('Password added:', response.data);
    fetchPasswords(); 
  } catch (error) {
    console.error("Failed to add password:", error);
  }
}

async function updatePassword(id, newPasswordData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/passwords/${id}`, newPasswordData);
    console.log('Password updated:', response.data);
    fetchPasswords(); 
  } catch (error) {
    console.error("Failed to update password:", error);
  }
}

async function deletePassword(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/passwords/${id}`);
    console.log('Password deleted:', response.data);
    fetchPasswords(); 
  } catch (error) {
    console.error("Failed to delete password:", error);
  }
}

function displayPasswords(passwords) {
  const passwordsList = document.getElementById('passwordsList');
  passwordsList.innerHTML = '';
  passwords.forEach((password) => {
    const passwordItem = document.createElement('div');
    passwordItem.textContent = password.name;
    passwordsList.appendChild(passwordItem);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchPasswords(); 
  
  const addPasswordForm = document.getElementById('addPasswordForm');
  addPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const passwordData = {};
    addPassword(passwordData);
  });
});