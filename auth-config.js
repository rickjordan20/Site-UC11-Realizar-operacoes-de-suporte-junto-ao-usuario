// Identificadores públicos do aplicativo Firebase Web (não são credenciais privadas).
export const firebaseConfig = {
  apiKey: "AIzaSyCI7AgQVvsZVLh7xJA4m94iEAQlH2Uu77Q",
  authDomain: "uc11---central-de-suporte.firebaseapp.com",
  projectId: "uc11---central-de-suporte",
  storageBucket: "uc11---central-de-suporte.firebasestorage.app",
  messagingSenderId: "205903190617",
  appId: "1:205903190617:web:5cea13a685d9eeb94bef48",
  measurementId: "G-G8E0QZ6X26"
};
// Pendente: endpoint HTTPS que valida o token e a matrícula no Google Classroom.
// Sem ele, o acesso permanece bloqueado por segurança.
export const authorizationEndpoint = "";

// ID público da turma no Google Classroom (extraído do link /c/).
// A verificação de matrícula deve ocorrer exclusivamente no servidor.
export const classroomCourseId = "689889762928";
