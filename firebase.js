 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAODMr_rNzPz2tWXv3hi_l_SOkjXsbJWA8",
  authDomain: "cultunica-62c4f.firebaseapp.com",
  projectId: "cultunica-62c4f",
  storageBucket: "cultunica-62c4f.firebasestorage.app",
  messagingSenderId: "320924758775",
  appId: "1:320924758775:web:0bcd9a276aa1bef784d9f2",
  measurementId: "G-GMDKFNPWBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 

// ...existing code...
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs, Timestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth(app);

// REGISTRO DE USUARIO
export async function registrarUsuario({ nombre, correo, telefono, password }) {
  // Registro en Auth
  const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
  const uid = userCredential.user.uid;
  // Guarda datos en Firestore
  await setDoc(doc(db, "usuarios", uid), {
    nombre,
    correo,
    telefono,
    fecha_registro: Timestamp.now()
  });
  return uid;
}

// INICIO DE SESIÓN
export async function iniciarSesion(correo, password) {
  const userCredential = await signInWithEmailAndPassword(auth, correo, password);
  const uid = userCredential.user.uid;
  // Obtén datos del usuario
  const userSnap = await getDoc(doc(db, "usuarios", uid));
  return userSnap.exists() ? userSnap.data() : null;
}

// GUARDAR POST
export async function crearPost({ tipo_post, lugar_ubicacion, texto_tipo, autorId }) {
  const postRef = await addDoc(collection(db, "posts"), {
    tipo_post,
    fecha_publicacion: Timestamp.now(),
    lugar_ubicacion,
    texto_tipo,
    autorId
  });
  return postRef.id;
}

// GUARDAR COMENTARIO EN UN POST
export async function comentarPost(postId, { tipo_comentario, nombre_comentario, autorId }) {
  const comentariosRef = collection(db, "posts", postId, "comentarios");
  await addDoc(comentariosRef, {
    tipo_comentario,
    fecha_comentario: Timestamp.now(),
    nombre_comentario,
    autorId
  });
}

// AGREGAR AMIGO (subcolección)
export async function agregarAmigo(currentUserUid, friendUserUid, datosDelAmigo) {
  const amigoDocRef = doc(db, "usuarios", currentUserUid, "amigos", friendUserUid);
  await setDoc(amigoDocRef, {
    ...datosDelAmigo,
    fecha_amistad: Timestamp.now()
  });
}

// CONSULTAR POSTS DE UN USUARIO
export async function obtenerPostsDeUsuario(uid) {
  const postsSnap = await getDocs(collection(db, "posts"));
  return postsSnap.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(post => post.autorId === uid);
}

// CONSULTAR COMENTARIOS DE UN POST
export async function obtenerComentariosDePost(postId) {
  const comentariosSnap = await getDocs(collection(db, "posts", postId, "comentarios"));
  return comentariosSnap.docs.map(doc => doc.data());
}

// CONSULTAR AMIGOS DE UN USUARIO
export async function obtenerAmigos(uid) {
  const amigosSnap = await getDocs(collection(db, "usuarios", uid, "amigos"));
  return amigosSnap.docs.map(doc => doc.data());
}

// ...existing code...