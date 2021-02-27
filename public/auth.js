const auth = firebase.auth()

auth.onAuthStateChanged((user) => {
  if (user) {
    setupUI(user)
    setUserInfo(user)
    fetchAndSetUserData(user)
  } else {
    setupUI()
  }
})

const logUserOut = () => {
  auth.signOut()
  window.location.reload()
}

const logUserIn = (e) => {
  e.preventDefault()
  const email = loginForm["loginEmail"].value
  const password = loginForm["loginPassword"].value

  auth
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      loginModal.hide()
      window.location.reload()
    })
    .catch((error) => {
      loginAlert.classList.remove("display-none")
    })
}

const createUser = (e) => {
  e.preventDefault()
  const userEmail = emailInput.value
  const userPassword = passwordInput.value
  const confirmUserPassword = confirmPasswordInput.value

  if (userPassword !== confirmUserPassword) {
    alert.innerHTML = `<h6 class="alert-warning p-3"> Make sure your passwords match! </h6>`
  } else {
    auth.createUserWithEmailAndPassword(userEmail, userPassword).then(
      (userCredential) => {
        const user = userCredential.user
        const docData = {
          perfumes: [],
        }
        /* prettier-ignore */
        return usersCollection.doc(user.uid).set(docData)
          .then(() => {
            registerModal.hide()
            window.location.reload()
          })
      },
      (err) => {
        registrationAlert.innerHTML = `<h1 class="h5 alert alert-warning"> ${err.message} </h1>`
      }
    )
  }
}

const sendPasswordResetLink = (e) => {
  e.preventDefault()
  const email = loginEmail.value
  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      passwordResetAlert.innerHTML = `<h1 class='h6 alert alert-success password-reset-alert'>Email was sent to ${email}</h1>`
    })
    .catch((error) => {
      passwordResetAlert.innerHTML = `<h1 class='h6 alert alert-warning password-reset-alert'>${error.message}</h1>`
    })
}

// LISTENERS

logoutButton.addEventListener("click", logUserOut)
registerForm.addEventListener("submit", createUser)
loginForm.addEventListener("submit", logUserIn)
passwordReset.addEventListener("click", sendPasswordResetLink)
