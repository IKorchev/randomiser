
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
const searchAlert = document.querySelector(".searchAlert")
const inCollectionAlert = document.querySelector(".inCollectionAlert")
const addedAlert = document.querySelector(".addedAlert")
let arrayOfData = []
const searchResult = {
  image_url: "",
  name: "",
}

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

// Create random number

const randomInt = (num) => {
  let randomNum = Math.floor(Math.random() * num)
  return randomNum
}

// prettier-ignore

const capitalize = (str) => str.toLowerCase().split(" ").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")

const searchFormSubmitHandler = async (e) => {
  e.preventDefault()
  addedAlert.classList.add("display-none")

  // MAKE A CALL TO THE SERVER ( SERVER MAKES THE API REQUEST AND GIVES BACK DATA TO CLIENT )

  const name = searchInput.value
  const response = await fetch(`search/${name}`)
  const data = await response.json()

  console.log(data)
  // MAKING SURE THE USER SEARCHED FOR
  // A PERFUME OR SOMETHING RELATED

  data.value.forEach((item) => {
    if (
      item.contentUrl.includes("perfume") ||
      item.contentUrl.includes("parfum") ||
      item.contentUrl.includes("fragrance")
    ) {
      arrayOfData.push(item.contentUrl)
    } else {
      return
    }
  })
  // IF THERE IS ANY RESULT
  if (arrayOfData.length > 0) {
    searchAlert.classList.add("display-none")
    // GET THE FIRST IMAGE FROM THE ARRAY
    searchResult.image_url = arrayOfData[0]
    searchResult.name = searchInput.value
    searchImage.src = searchResult.image_url
  } else {
    // IN CASE NO RESULT
    searchAlert.classList.remove("display-none")
    searchImage.src = ""
  }
  inCollectionAlert.classList.add("display-none")
  searchForm.reset()
  arrayOfData = []
}

// CHECK IF THE ITEM THEY TRY TO ADD ALREADY EXISTS IN THE USER'S DATABASE

const checkExists = (arr) => {
  let exists = false
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === searchResult.name) {
      exists = true
    }
  }
  return exists
}

// CHOOSE RANDOM ITEM FROM DB AND OUTPUT THE DATA IN THE DOM
const outputQueryData = (e) => {
  e.preventDefault()
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const doc = await usersCollection.doc(user.uid).get()
      const perfumeList = await doc.data().perfumes
      const randomFrag = perfumeList[randomInt(perfumeList.length)]

      // MAKE A DELAY BETWEEN EACH ITTERATION OF THE LOOP SO EVERY IMAGE SHOWS FOR A BRIEF MOMENT FOR A UI EFFECT

      const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds))
      }

      const goOverAndStop = async () => {
        for (const item of perfumeList) {
          if (item.name === randomFrag.name) {
            // prettier-ignore
            output.innerHTML = `<h1 class="display-6 fw-bolder p-3 border border-5 rounded border-success"> ${capitalize(item.name)} </h1>`
            image1.src = randomFrag.image_url
            return
          } else {
            await sleep(110)
            image1.src = item.image_url
            output.innerHTML = `<h5 m-3> ${capitalize(item.name)} </h5>`
          }
        }
      }
      goOverAndStop()
    } else {
      return
    }
  })
}

// ADD WHATEVER USER SEARCHED FOR TO THEIR COLLECTION

const addPerfumeToCollection = (e) => {
  e.preventDefault()
  auth.onAuthStateChanged(async (user) => {
    const response = await usersCollection.doc(user.uid).get()
    const array = response.data().perfumes

    console.log(checkExists(array))
    if (user && searchResult.name !== "" && !checkExists(array)) {
      usersCollection.doc(user.uid).update({
        perfumes: firebase.firestore.FieldValue.arrayUnion(searchResult),
      })
      searchImage.src = ""
      addedAlert.classList.remove("display-none")
    } else {
      inCollectionAlert.classList.remove("display-none")
    }
  })
}

// DELETE THE ITEM FROM COLLECTION

const deletePerfumeFromCollection = () => {
  event.preventDefault()
  auth.onAuthStateChanged(async (user) => {
    const targetName = event.target.parentNode.parentNode.childNodes[1].textContent.toLowerCase()
    const collection = await usersCollection.doc(user.uid).get()
    const data = collection.data().perfumes
    data.forEach((element) => {
      if (element.name === targetName) {
        let object = {
          image_url: element.image_url,
          name: element.name,
        }
        usersCollection.doc(user.uid).update({
          perfumes: firebase.firestore.FieldValue.arrayRemove(object),
        })
      } else {
        return
      }
    })
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
            // prettier-ignore
            html += `
            <div class="card border border-2 border-dark m-2 px-0 d-flex justify-content-between" style="height:100px; width:auto;">
              <div class="row g-0 d-flex align-items-center">
                <div class="col-auto ms-2 mt-2 d-flex justify-content-start align-items-center">
                  <img src="${perfumeList[i].image_url}" style="height:80px; width:auto;" alt="...">
                </div>
                <div class="col d-flex justify-content-end align-items-center mt-1 ms-2">
                    <h5 class="text-center mx-1 my-0 frag-title">${capitalize(perfumeList[i].name)}</h5>
                    <button type="button" class="mx-1 p-1 btn text-danger" onClick="deletePerfumeFromCollection()"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            </div>`
          }
          perfumes.innerHTML = html
        } else {
          perfumes.innerHTML = `<h3 class="w-50">Your list is empty please add items to your collection</h3>`
        }
      })
    }
  })
}

const setupUI = (user) => {
  if (user) {
    loggedOutBtn.forEach((item) => {
      item.classList.add("display-none")
    })
    loggedInBtn.forEach((item) => {
      item.classList.remove("display-none")
    })
  } else {
    loggedInBtn.forEach((item) => {
      item.classList.add("display-none")
    })
    loggedOutBtn.forEach((item) => {
      item.classList.remove("display-none")
    })
  }
}

// EVENT LISTENERS
// searchForm.addEventListener("submit", searchFormSubmitHandler)
showBtn.addEventListener("click", displayList)
searchForm.addEventListener("submit", searchFormSubmitHandler)
pickBtn.addEventListener("click", outputQueryData)
addBtn.addEventListener("click", addPerfumeToCollection)
