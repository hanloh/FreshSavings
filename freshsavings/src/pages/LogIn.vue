<script setup>
import axios from "axios";
// import GSignInButton from 'vue-google-signin-button'
// import getGoogleUrl from '../auth/getGoogleUrl.js';
import { ref, onMounted } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import router from "../router/index.js";
import { useAccountStorage } from "../main.js";
const accountStorage = useAccountStorage();

const from = ref("default");

const handleLogin = async () => {
  errorMessage.value = "";

  const email = document.querySelector("input[type='text']").value;
  const password = document.querySelector("input[type='password']").value;

  try {
    const response = await axios.post("http://localhost:3000/login", {
      email: email,
      password: password,
    });

    if (response && response.data && response.status === 200) {
      const user = response.data.user;
      const sessionData = response.data.session;

      localStorage.setItem("user", JSON.stringify(user));
      console.log("User data stored in local storage:", user);
      console.log("Session data from the response:", response.data.session);
      accountStorage.set(
        response.data.session.user.aid,
        response.data.session.user.fname,
        response.data.session.user.a_lat,
        response.data.session.user.a_long
      );

      localStorage.setItem("session", JSON.stringify(sessionData));
      console.log("Session data stored in local storage:", sessionData);
      router.push("/inventory-tracker");
    } else {
      errorMessage.value = "Invalid credentials";
    }
  } catch (error) {
    if (error.response && error.response.data.error) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = "Login request failed";
    }
    console.error("Login error:", error);
  }
};

const errorMessage = ref("");

onMounted(() => {
  const inputs = document.querySelectorAll(".input");

  const addcl = (event) => {
    let parent = event.target.parentNode.parentNode;
    parent.classList.add("focus");
  };

  const remcl = (event) => {
    let parent = event.target.parentNode.parentNode;
    if (event.target.value === "") {
      parent.classList.remove("focus");
    }
  };

  inputs.forEach((input) => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
  });

  const userSelection = "example"; 
  from.value = userSelection;
  const script = document.createElement("script");
  // script.src = 'https://apis.google.com/js/api:client.js';
  document.head.appendChild(script);
});
</script>

<template>
  <header>
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer" />
  </header>

  <body>
    <section class="container-fluid row">
      <img class="col-4 vh-100" :src="require('@/assets/img/loginbg.jpg')" />
      <div class="col-8 d-flex justify-content-center align-items-center">
        <div
          class="login-content d-flex justify-content-center align-items-center">
          <form @submit.prevent="handleLogin">
            <img :src="require('@/assets/img/avatar.svg')" />
            <h2 class="title">Login</h2>
            <div class="text subtitle">Welcome back to FreshSavings!</div>

            <div class="input-div one">
              <div class="i">
                <i class="fas fa-user"></i>
              </div>
              <div class="div">
                <h5>Email Address</h5>
                <input type="text" class="input" />
              </div>
            </div>
            <div class="input-div pass">
              <div class="i">
                <i class="fas fa-lock"></i>
              </div>
              <div class="div">
                <h5>Password</h5>
                <input type="password" class="input" />
              </div>
            </div>
            <div class="login-container">
              <p v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </p>
              <div class="link-and-button">
                <a href="#" class="forgot-password">Forgot Password?</a>
                <input
                  type="submit"
                  class="btn"
                  value="Login"
                  @click="handleLogin" />
              </div>
            </div>

            <div class="line-text">or</div>
            <div class="social-container">
              <a href="#" class="social"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="social"><i class="fab fa-google-plus-g"></i></a>
              <a href="#" class="social"><i class="fab fa-linkedin-in"></i></a>
            </div>
            <div
              class="flex items-center justify-center h-screen dark:bg-gray-800">
              <div class="text create">
                New here?
                <a href="/signup" class="create-account-link"
                  >Create an Account</a
                >
              </div>
            </div>
          </form>
        </div>
        <div></div>
      </div>
    </section>
  </body>
</template>

<script>
export default {
  name: "LogIn",
  components: {
    // GSignInButton,
  },
  setup() {
    // const googleSignInParams = {
    // 	clientId: process.env.VITE_GOOGLE_OAUTH_CLIENT_ID,
    // };

    // const onSignInSuccess = (googleUser) => {
    // 	const profile = googleUser.getBasicProfile(); // etc etc
    // };

    // const onSignInError = (error) => {
    // 	console.log('OH NOES', error);
    // };

    return {
      // googleSignInParams,
      // onSignInSuccess,
      // onSignInError,
      from,
      // getGoogleUrl,
      handleLogin,
    };
  },
};
</script>

<style scoped lang="scss">
.error-message {
  color: red;
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
}

// .g-signin-button {
// 	/* This is where you control how the button looks. Be creative! */
// 	display: inline-block;
// 	padding: 4px 8px;
// 	border-radius: 3px;
// 	background-color: #3c82f7;
// 	color: #fff;
// 	box-shadow: 0 3px 0 #0f69ff;
// }

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.text {
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-account-link {
  text-decoration: underline;
  color: #32be8f;
  padding-left: 2px;
}

.create {
  margin-top: 10%;
  text-align: center;
  color: #b7bdbf;
  font-weight: bold;
}

.subtitle {
  margin-top: 0%;
  margin-bottom: 8%;
  text-align: center;
  color: #9ea4a6;
  font-weight: bold;
}

img {
  object-fit: cover !important;
}

.bg {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: 0;
  width: 40%;
  max-width: 50%;
}

.social-container {
  margin: 20px 0;
}

a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}

a:hover {
  color: #38d39f;
}

.social-container a {
  border: 1px solid #dddddd;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

.container {
  width: 100vw;
  height: 100vh;
  display: grid;
  place-items: center;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15rem;
  padding: 0 1rem;
}

.login-content {
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

form {
  width: 360px;
}

.login-content img {
  height: 100px;
  justify-content: center;
}

.login-content h2 {
  margin: 15px 0;
  color: #333;
  font-size: 2.9rem;
}

.login-content .input-div {
  position: relative;
  display: grid;
  grid-template-columns: 7% 93%;
  margin: 25px 0;
  padding: 5px 0;
  border-bottom: 2px solid #d9d9d9;
}

.login-content .input-div.one {
  margin-top: 0;
}

.i {
  color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
}

.i i {
  transition: 0.3s;
}

.input-div > div {
  position: relative;
  height: 45px;
}

.input-div > div > h5 {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
  transition: 0.3s;
}

.input-div:before,
.input-div:after {
  content: "";
  position: absolute;
  bottom: -2px;
  width: 0%;
  height: 2px;
  background-color: #38d39f;
  transition: 0.4s;
}

.input-div:before {
  right: 50%;
}

.input-div:after {
  left: 50%;
}

.input-div.focus:before,
.input-div.focus:after {
  width: 50%;
}

.input-div.focus > div > h5 {
  top: -5px;
  font-size: 15px;
}

.input-div.focus > .i > i {
  color: #508e46;
}

.input-div > div > input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  background: none;
  padding: 0.5rem 0.7rem;
  font-size: 1.2rem;
  color: #555;
  font-family: "poppins", sans-serif;
}

.input-div.pass {
  margin-bottom: 4px;
}

a {
  display: block;
  text-align: right;
  text-decoration: none;
  color: #999;
  font-size: 0.9rem;
  transition: 0.3s;
}

a:hover {
  color: #508e46;
}

.btn {
  display: block;
  width: 100%;
  height: 50px;
  border-radius: 25px;
  outline: none;
  border: none;
  background-image: linear-gradient(to right, #32be8f, #38d39f, #32be8f);
  background-size: 200%;
  font-size: 1.2rem;
  color: #fff;
  font-family: "Poppins", sans-serif;

  margin: 1rem 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-position: right;
}

.line-text {
  display: flex;
  flex-direction: row;
  margin: 1rem 0;
  font-weight: 600;
  color: #b7bdbf;
}

.line-text:before,
.line-text:after {
  content: "";
  flex: 1 1;
  border-bottom: 1px solid;
  margin: auto;
  background-color: #b7bdbf;
}

.line-text:before {
  margin-right: 15px;
}

.line-text:after {
  margin-left: 15px;
}

@media screen and (max-width: 1629px) {
  .container {
    grid-gap: 5rem;
  }

  // .login-content {
  //   margin-right: 60%;
  // }
}

@media screen and (max-width: 1050px) {
  .container {
    grid-gap: 5rem;
  }

  // .login-content {
  //   margin-right: 100%;
  // }
}

@media screen and (max-width: 1000px) {
  form {
    width: 290px;
  }

  // .login-content {
  // margin-right: 100%;
  // }
}

@media screen and (max-width: 999px) {
  .container {
    grid-template-columns: 1fr;
  }

  .bg {
    display: none;
  }

  .login-content {
    justify-content: center;
    // margin-right: 90%;
  }
}
</style>
