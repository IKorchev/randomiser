//  SELECTORS
let index = 0
let arrayOfData = []
let searchResult = {
  image_url: "",
  name: "",
}

const store = firebase.firestore()
const usersCollection = store.collection("USERS")

// Create random number

const randomInt = (num) => {
  let randomNum = Math.floor(Math.random() * num)
  return randomNum
}
// prettier-ignore
const searchFormSubmitHandler = async (e) => {
  e.preventDefault()
  // clear the alerts if there were any
  searchAlert.classList.add("display-none")
  addedAlert.classList.add("display-none") 
  inCollectionAlert.classList.add("display-none")
  searchImage.src = ""
  arrayOfData = [] // CLEAR ARRAY
  index = 0 // always start from the first item of the array

  // MAKE A CALL TO THE SERVER ( SERVER MAKES THE API REQUEST AND GIVES BACK DATA TO CLIENT )
  try {
  const response = await fetch(`search/${searchInput.value}`)
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
    }
  })
  // IF THERE IS ANY RESULT
  if (arrayOfData.length > 0) {
    // GET THE FIRST IMAGE FROM THE ARRAY
    searchResult.name = searchInput.value.toLowerCase()
    searchImage.src = arrayOfData[index]
    searchResult.image_url = searchImage.src
    previousAndNextImageButton.classList.remove('display-none')
  } else {
    // IN CASE NO RESULT
    previousAndNextImageButton.classList.add('display-none')
    showAlert(searchAlert, 3500)
    searchResult = {
      image_url: "",
      name: "",
    }
  }
} catch(err) {
  console.log(err)
} finally {
  searchForm.reset()
  
}
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

      // MAKE A DELAY BETWEEN EACH ITTERATION OF THE LOOP SO EVERY IMAGE SHOWS FOR A BRIEF MOMENT

      const sleep = (milliseconds) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds))
      }

      ;(async (user) => {
        for (const item of perfumeList) {
          if (item.name === randomFrag.name) {
            // prettier-ignore
            output.innerHTML = `<h1 class="display-6 fw-bolder p-3"> ${item.name} </h1>`
            image1.src = randomFrag.image_url
            return
          } else {
            await sleep(110)
            image1.src = item.image_url
          }
        }
      })(user)
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
    if (user && searchResult.name !== "" && !checkExists(array)) {
      usersCollection.doc(user.uid).update({
        perfumes: firebase.firestore.FieldValue.arrayUnion(searchResult),
      })
      searchImage.src = ""
      showAlert(addedAlert, 2000)
    } else {
      showAlert(inCollectionAlert, 3000)
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

const showTheCollection = (e) => {
  e.preventDefault()
  perfumeContainer.classList.toggle("display-none")
}

const setUserInfo = (user) => {
  if (user) {
    accountInfo.innerHTML = `
      <h1 class="h4"> Account details: </h1>
      <h2 class="h6"> Name: ${user.displayName}</h2>
      <h2 class="h6"> Email: ${user.email} </h6>
    `
  } else {
    accountInfo.innerHTML = `<p> Log in to see your details. </p>`
  }
}

const fetchAndSetUserData = async (user) => {
  if (!user) {
    perfumes.innerHTML = `<h5>Please log in to see your list!</h5>`
  } else {
    usersCollection.doc(user.uid).onSnapshot((doc) => {
      const perfumeList = doc.data().perfumes
      let html = ""
      if (perfumeList.length > 0) {
        fragAmount.textContent = `You have ${perfumeList.length} fragrances in your collection!`
        for (let i = perfumeList.length - 1; i >= 0; i--) {
          // prettier-ignore
          html += `
            <div class="card m-2 px-0 d-flex justify-content-between">
              <div class="row g-0 d-flex align-items-center">
                <div class="col-auto ms-2 mt-2 d-flex justify-content-around align-items-center">
                  <img src="${perfumeList[i].image_url}" class="card-img" alt="perfume">
                </div>
                <div class="col d-flex justify-content-end align-items-center mt-1 ms-2">
                    <h5 class="text-center mx-1 my-0 frag-title">${perfumeList[i].name}</h5>
                    <button type="button" class="mx-1 p-1 btn delete-btn" onClick="deletePerfumeFromCollection()"><i class="bi bi-trash"></i></button>
                </div>
              </div>
            </div>`
        }
        perfumes.innerHTML = html
      } else {
        perfumes.innerHTML = `<h3 class="w-50">Your list is empty please add items to your collection</h3>`
        fragAmount.textContent = ""
      }
    })
  }
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

// GET AND DISPLAY THE PREVIOUS IMAGE

const getPreviousImage = (e) => {
  e.preventDefault()
  if (index > 0) {
    index--
    searchImage.src = arrayOfData[index]
    searchResult.image_url = searchImage.src
  }
}

// GET AND DISPLAY THE NEXT IMAGE

const getNextImage = (e) => {
  e.preventDefault()
  if (index < arrayOfData.length - 1) {
    index++
    searchImage.src = arrayOfData[index]
    searchResult.image_url = searchImage.src
  }
  searchResult.image_url = searchImage.src
}

const showAlert = (selector, milliseconds) => {
  selector.classList.remove("display-none")
  setTimeout(() => {
    selector.classList.add("display-none")
  }, milliseconds)
}

// EVENT LISTENERS
showBtn.addEventListener("click", showTheCollection)
searchForm.addEventListener("submit", searchFormSubmitHandler)
pickBtn.addEventListener("click", outputQueryData)
addBtn.addEventListener("click", addPerfumeToCollection)
previous.addEventListener("click", getPreviousImage)
next.addEventListener("click", getNextImage)
