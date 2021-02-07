const BING_API_KEY = "3d02b295e14a4051b3ae9c0a025ca460"
//  SELECTORS
const output = document.querySelector(".output")
const perfumes = document.querySelector(".perfumes")
const pickBtn = document.querySelector(".pick-button")
const showBtn = document.querySelector(".show-button")
const addBtn = document.querySelector(".add-button")
const image1 = document.querySelector(".image1")
const loggedInBtn = document.querySelectorAll(".logged-in")
const loggedOutBtn = document.querySelectorAll(".logged-out")
const searchInput = document.querySelector(".searchInput")
const searchForm = document.querySelector(".searchForm")
const searchImage = document.querySelector(".searchImage")
const myModal = new bootstrap.Modal(document.getElementById("searchModal"))
let searchImageURL
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
const usersCollection = store.collection("USERS")

const randomInt = (num) => {
  let randomNum = Math.floor(Math.random() * num)
  return randomNum
}

const searchFormSubmitHandler = async (e) => {
  e.preventDefault()
  try {
    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/images/search?q=${searchInput.value}`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": BING_API_KEY,
        },
      }
    )
    const data = await response.json()
    searchImageURL = data.value[0].contentUrl
    searchImage.src = searchImageURL
  } catch (err) {
    console.log(err)
  }
}

// OUTPUT THE DATA IN THE DOM
const outputQueryData = (e) => {
  e.preventDefault()
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const doc = await usersCollection.doc(user.uid).get()
      const perfumeList = await doc.data().perfumes
      const randomFrag = perfumeList[randomInt(perfumeList.length)]
      output.innerHTML = randomFrag.name
      image1.src = randomFrag.image_url
    } else {
      return
    }
  })
}

const getImageURL = (array, name) => {
  array.forEach((element) => {
    let url
    if (element.name !== name) {
      console.log("didnt find matching names")
    } else {
      url = element.image_url
    }
    return url
  })
}

const addPerfumeToCollection = (e) => {
  e.preventDefault()
  auth.onAuthStateChanged((user) => {
    if (user) {
      const data = {
        name: searchInput.value,
        image_url: searchImageURL,
      }
      usersCollection.doc(user.uid).update({
        perfumes: firebase.firestore.FieldValue.arrayUnion(data),
      })
    } else {
      return
    }
  })
}
const deletePerfumeFromCollection = () => {
  auth.onAuthStateChanged(async (user) => {
    const targetName = event.target.parentNode.textContent.slice(0, -1)
    const snapshot = await usersCollection.doc(user.uid).get()
    const data = snapshot.data().perfumes
    let imageURL
    data.forEach((element) => {
      if (element.name === targetName) {
        imageURL = element.image_url
      }
    })
    let object = {
      image_url: imageURL,
      name: targetName,
    }
    console.log(object)
    if (user) {
      usersCollection.doc(user.uid).update({
        perfumes: firebase.firestore.FieldValue.arrayRemove(object),
      })
    }
  })
}

// SHOW THE LIST
const displayList = (e) => {
  e.preventDefault()
  perfumes.classList.toggle("display-none")
  auth.onAuthStateChanged((user) => {
    if (!user) {
      perfumes.innerHTML = `<h5>Please log in to see your list!</h5>`
    } else {
      usersCollection.doc(user.uid).onSnapshot((doc) => {
        const perfumeList = doc.data().perfumes
        let html = ""
        if (perfumeList.length > 0) {
          for (let i = 0; i < perfumeList.length; i++) {
            html += `<li class="list-group-item">${perfumeList[i].name}<button class="close delete-button" onclick="deletePerfumeFromCollection()">&times;</button></li>`
          }
          perfumes.innerHTML = html
        } else {
          perfumes.innerHTML = `<h5>Your list is empty please add items to your collection</h5>`
        }
      })
    }
  })
}

const getPerfumeListFromUser = (user) => {}

const setupUI = (user) => {
  if (user) {
    loggedOutBtn.forEach((item) => {
      item.style.display = "none"
    })
    loggedInBtn.forEach((item) => {
      item.style.display = "block"
    })
  } else {
    loggedInBtn.forEach((item) => {
      item.style.display = "none"
    })
    loggedOutBtn.forEach((item) => {
      item.style.display = "block"
    })
  }
}

// EVENT LISTENERS
searchForm.addEventListener("submit", searchFormSubmitHandler)
showBtn.addEventListener("click", displayList)
pickBtn.addEventListener("click", outputQueryData)
addBtn.addEventListener("click", addPerfumeToCollection)
