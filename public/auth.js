const registerForm = document.querySelector(".registerForm")
const loginForm = document.querySelector(".loginForm")
const formContainer = document.querySelector(".formContainer")
const logoutButton = document.querySelector(".logout")
const loginAlert = document.querySelector(".loginAlert")
const modal = document.querySelector(".modal")
const auth = firebase.auth()

auth.onAuthStateChanged((user) => {
  if (user) {
    setupUI(user)
  } else {
    setupUI()
  }
})

const logUserOut = () => {
  auth
    .signOut()
    .then(() => console.log("user logged out"))
    .catch((err) => console.log(err))
  window.location.reload()
}

const logUserIn = (e) => {
  e.preventDefault()
  const email = loginForm["loginEmail"].value
  const password = loginForm["loginPassword"].value

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      window.location.reload()
    })
    .catch((error) => {
      loginAlert.classList.remove("display-none")
    })
}

const createUser = (e) => {
  e.preventDefault()
  const email = document.querySelector("#email").value
  const password = document.querySelector("#password").value
  const confirmPassword = document.querySelector("#confirmPassword").value
  if (password !== confirmPassword) {
    alert.innerHTML = `<h6 class="alert-warning p-3"> Make sure your passwords match! </h6>`
  } else {
    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
      const user = userCredential.user
      const docData = {
        perfumes: [],
      }
      return usersCollection
        .doc(user.uid)
        .set(docData)
        .then(() => {
          window.location.reload()
        })
    })
  }
}

logoutButton.addEventListener("click", logUserOut)
registerForm.addEventListener("submit", createUser)
loginForm.addEventListener("submit", logUserIn)
