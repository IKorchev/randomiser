const registerForm = document.querySelector(".registerForm")
const loginForm = document.querySelector(".loginForm")
const formContainer = document.querySelector(".formContainer")
const logoutButton = document.querySelector(".logout")
const alert = document.querySelector(".alert")
const modal = document.querySelector(".modal")
const auth = firebase.auth()

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user.uid)
  } else {
    console.log("not signed in yet")
  }
})

const logUserOut = (e) => {
  e.preventDefault()
  auth
    .signOut()
    .then(() => console.log("Log out successful"))
    .catch((err) => console.log(err))
}

const logUserIn = (e) => {
  e.preventDefault()
  const email = loginForm["loginEmail"].value
  const password = loginForm["loginPassword"].value

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {})
    .catch((error) => {
      console.log(error.message)
    })
}

const createUser = (e) => {
  e.preventDefault()
  const email = document.querySelector("#email").value
  const password = document.querySelector("#password").value
  const confirmPassword = document.querySelector("#confirmPassword").value
  password !== confirmPassword
    ? (alert.innerHTML = `<h6 class="alert-warning p-3"> Make sure your passwords match! </h6>`)
    : auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          var user = userCredential.user
          alert.innerHTML = `<h6 class="alert-success p-3"> You have been registered. </h6>`
          console.log(user)
          registerForm.reset()
        })
        .catch((error) => {
          alert.innerHTML = `<h6 class="alert-warning p-3">${error.message}</h6>`
          console.log(error)
        })
}

logoutButton.addEventListener("click", logUserOut)
registerForm.addEventListener("submit", createUser)
loginForm.addEventListener("submit", logUserIn)
