//  SELECTORS
const output = document.querySelector(".output")
const perfumes = document.querySelector(".perfumes")
const alert1 = document.querySelector(".alert")
const box = document.querySelector(".box")
const pickBtn = document.querySelector(".pick-button")
const image1 = document.querySelector(".image1")
const showBtn = document.querySelector(".show-button")

const imageUrl =
  "https://media.istockphoto.com/vectors/no-image-available-sign-vector-id922962354?k=6&m=922962354&s=612x612&w=0&h=_KKNzEwxMkutv-DtQ4f54yA5nc39Ojb_KPvoV__aHyU="
const arr = []
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCC_MQl3-dk3_1NfN4_jnrGHChXpyjV9Qw",
  authDomain: "newproject-4eb07.firebaseapp.com",
  databaseURL: "https://newproject-4eb07-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "newproject-4eb07",
  storageBucket: "newproject-4eb07.appspot.com",
  messagingSenderId: "868970255147",
  appId: "1:868970255147:web:5abc85faa78b4eec41ab6e",
}
firebase.initializeApp(firebaseConfig)
const store = firebase.firestore()
const frags = store.collection("frags")

const randomInt = (num) => {
  let randomNum = Math.floor(Math.random() * num)
  return randomNum
}

// OUTPUT THE DATA IN THE DOM
const checkQuery = async (frag) => {
  if (frag.img !== undefined) {
    output.innerHTML = frag.name
    image1.src = await frag.img
  }
}

// GETTING DATA FROM FIREBASE
const showFrags = (() => {
  frags.get().then((query) => {
    query.forEach((doc) => (perfumes.innerHTML += `<li class="list-group-item"> ${doc.data().name}</li>`))
  })
})()

// GETTING RANDOM PERFUME FROM DATABASE
const displayData = () => {
  frags.get().then((query) => {
    query.forEach((doc) => arr.push(doc.data()))
    let randomObject = arr[randomInt(arr.length)]
    checkQuery(randomObject)
  })
}

// SHOW THE LIST
const displayList = (e) => {
  e.preventDefault()
  perfumes.classList.toggle("display-none")
}

// EVENT LISTENERS
showBtn.addEventListener("click", displayList)
pickBtn.addEventListener("click", displayData)
