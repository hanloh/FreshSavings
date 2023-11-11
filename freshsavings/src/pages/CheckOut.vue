<script setup>
  import { ref, toHandlers } from 'vue';
  import axios from 'axios';
  import { useAccountStorage } from '../main.js';
  const accountStorage = useAccountStorage();
</script>


<template>
  
  <div>
    
    <section class="h-100 p-5">
      <h2 class="pb-3" id="heading">Cart</h2>
      
      <div class="container py-2 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-lg-12">
            <div class="row">
              <div class="col-lg-7" id="cart-section">                

                <!-- 2.Delivery Options -->
                <div class="accordion mb-3" :id="'accordianSelf1'">
                  <div class="accordion-item">
                    <div class="accordion-header">
                      <button type="button" class="accordion-button d-flex align-items-center" data-bs-toggle="collapse"
                        :data-bs-target="'#product'" aria-expanded="false" :aria-controls="'collapse'">
                        <img class="category-image" style="width:100px;height:100px" :src="imageUrl('shoppingcartgif.gif')" />
                        <p class="mx-3 my-auto text-capitalize">
                          Products
                        </p>
                      </button>
                    </div>
                    <div :id="'product'" class="accordion-collapse collapse show">
                      <div class="accordion-body d-flex flex-wrap">
                        <div class="empty-container" v-if="accountStorage.cart.length == 0">
                        
                        <img id='empty' class='mx-auto' :src="imageUrl('empty.gif')">
                      </div>
                        <div v-else class="container">
                          <div class="header-container">
                  <p class="mb-1 custom-text">Product</p>
                  <p class="mb-1 custom-text">Quantity</p>
                  <p class="mb-1 custom-text">Price</p>
                </div>
                
                <div v-for="(product, idx) of productList" :key="idx">
                
                <div class="card mb-3">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div class="d-flex flex-row align-items-center">
                        <div>
                          <img :src="imageUrl(product.Image)" class="img-fluid rounded-3" alt="Shopping item"
                            style="width: 65px;">
                        </div>
                        <div class="ms-3" style="text-align:left;">
                          <b>
                            <h6>{{ product.Name }}</h6>
                          </b>
                          <p class="small mb-0">Address: {{ product.Address }}</p>
                        </div>
                      </div>
                      <div class="d-flex flex-row align-items-center">
                        <div style="width: 90px;">
                          <h6 class="fw-normal mb-0">{{ product.Quantity }}</h6>
                        </div>
                        <div style="width: 90px;">
                          <h6 class="mb-0">{{CalculatePrice(product.Price, product.Quantity)}}</h6>
                        </div>
                        <div style="width: 50px;">
                          <svg @click="deleteCard(idx)" id="delete1" xmlns="http://www.w3.org/2000/svg" width="16"
                            height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path
                              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                            <path
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


                      </div>
                    </div>
                    </div>
                  </div>
                </div>
                <div class="header-container">
                  <p class="mb-1 custom-text">Delivery Options</p>
                </div>
                  
                <div class="accordion my-3" :id="'accordianSelf2'" v-if="AddressList.length <= 1">
                  <div class="accordion-item">
                    <div class="accordion-header">
                      <button type="button" class="accordion-button d-flex align-items-center collapsed" data-bs-toggle="collapse"
                        :data-bs-target="'#self'" aria-expanded="false" :aria-controls="'collapse'">
                        <img class="category-image" style="width:100px;height:100px" :src="imageUrl('pickup.gif')" />
                        <p class="mx-3 my-auto text-capitalize">
                          Self Pick Up
                        </p>
                      </button>
                    </div>
                    <div :id="'self'" class="accordion-collapse collapse" >
                      <div class="accordion-body d-flex flex-wrap">
                        <div class="container">
                          <div>
                        <p> Store Name, Address, Opening Hours </p>
                      </div>
                      <div>
                        <p>
                          Choose a pickup time!
                        </p>
                      </div>

                      <!-- Calendar -->
                      <section>
                        <input v-if="dateError != ''" class="mb-1" type="date" v-model="date" @input="validateDate" inline auto-apply/>
                        <input v-else type="date" class="mb-3" v-model="date" @input="validateDate" inline auto-apply/>
                          <p v-if="dateError != ''" class='mt-0 pt-0 mb-1' style="color: red;">{{ dateError }}</p>
                        <select required name="timing" id="timing" v-model="timing">
                          <option value="9am-12pm">9am-12pm</option>
                          <option value="12pm-3pm">12pm-3pm</option>
                          <option value="3pm-6pm">3pm-6pm</option>
                          <option value="6pm-9pm">6pm-9pm</option>
                          <option value="9pm-11pm">9pm-11pm</option>
                        </select>
                        <span> Your selected day is {{date}} and selected timeslot is </span> <span><strong>{{timing}}</strong></span>

                      </section>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
                <div class="accordion my-3" :id="'accordionDelivery'">
                  <div class="accordion-item">
                    <div class="accordion-header">
                      <button type="button" class="accordion-button d-flex align-items-center collapsed" data-bs-toggle="collapse"
                        :data-bs-target="'#delivery'" aria-expanded="false" :aria-controls="'collapse'">
                        <img class="category-image" style="width:100px;height:100px" :src="imageUrl('cycling.gif')" />
                        <p class="mx-3 my-auto text-capitalize">
                          Delivery
                        </p>
                      </button>
                    </div>
                    <div :id="'delivery'" class="accordion-collapse collapse">
                      <div class="accordion-body d-flex flex-wrap">
                        <div class="container">
                        <h5> Contact Details </h5>
                      <div class=" col input" >
                        <label
                          class="font-semibold"
                          for="fullName">Full Name</label>
                        <input
                          class="block inner-shadow rounded border-2 w-full mt-2 p-1"
                          type="text"
                          id="fullName"
                          name="fullName"  
                        />
                      </div>
                      <div class="input mt-4">
                        <label class="font-semibold" for="email">Email</label>
                        <input 
                          class="block inner-shadow rounded border-2 w-3/5 mt-2 p-1"
                          type="text"
                          id="email"
                          v-model="DeliveryEmail"
                          @input="validateDelivery"
                        />
                        <p v-if="DeliveryEmailError != ''" class="m-0 p-0 text-danger">{{ DeliveryEmailError }}</p>
                      </div>
                      <div class="input mt-4">
                        <label class="font-semibold" for="phoneNumber">Phone Number</label>
                        <input
                          class="block inner-shadow rounded border-2 w-1/2 mt-2 p-1"
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          v-model="DeliveryContactNumber"
                          @input="validateDelivery"
                        />
                        <p v-if="DeliveryContactNumberError != ''" class="m-0 p-0 text-danger">{{ DeliveryContactNumberError }}</p>
                      </div>
                      <br/>
                      <h5> Address Details </h5>
                      <div class="input">
                        <label class="font-semibold" for="address">Address</label>
                        <input
                          class="block inner-shadow rounded border-2 w-full mt-2 p-1"
                          type="text"
                          id="address"
                          name="address"
                        />
                      </div>
                      <div class="input mt-4">
                        <label class="font-semibold" for="city">Postal Code</label>
                        <input
                          class="block inner-shadow rounded border-2 w-full mt-2 p-1"
                          type="text"
                          id="city"
                          name="city"
                          v-model="DeliveryPostalCode"
                          @input="validateDelivery"
                        />
                        <p v-if="DeliveryPostalCodeError != ''" class="m-0 p-0 text-danger">{{ DeliveryPostalCodeError }}</p>
                      </div>
                      <div class="input mt-4">
                        <label class="font-semibold" for="state">Unit No.</label>
                        <input
                          class="block inner-shadow rounded border-2 w-1/2 mt-2 p-1"
                          type="text"
                          id="state"
                          name="state"
                          v-model="Unit"
                          @input="validateDelivery"
                        />
                        <p v-if="UnitError != ''" class="m-0 p-0 text-danger">{{ UnitError }}</p>
                        
                      </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
                <div class="header-container">
                  <p class="mb-1 custom-text">Show on Map</p>
                </div>
                <div class="accordion my-3" :id="'accordionMap'">
                  <div class="accordion-item">
                    <div class="accordion-header">
                      <button type="button" class="accordion-button d-flex align-items-center collapsed" data-bs-toggle="collapse"
                        :data-bs-target="'#collapseMap'" aria-expanded="false" :aria-controls="'collapse'">
                        <img class="category-image" style="width:100px;height:100px" :src="imageUrl('maps.gif')" />
                        <p class="mx-3 my-auto text-capitalize">
                          Display Locations on Maps
                        </p>
                      </button>
                    </div>
                    <div :id="'collapseMap'" class="accordion-collapse collapse">
                      <div class="accordion-body d-flex flex-wrap">
                        <div class='map-container'>
                          <GoogleMap id="map"
                          api-key="AIzaSyBaK6fapQE5NMhxj0ZZdKcQsn9o1xhZf3M"
                            :center="center"
                            :zoom="14"
                            map-type-id="terrain"
                            
                          >
                          <Marker :options="{ position: center }"></Marker>
                          <CustomMarker :options="{position: marking.position}" v-for="(marking, idx) of productList" :key="idx">
                                <div style="text-align: center">
                                  <img :src="imageUrl(marking.Image)" width="50" height="50" />
                                </div>
                              </CustomMarker>
                          </GoogleMap>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>


              </div>
              <div id="sticky" class="col-lg-5" >
                <div class="payment-info bg-success-subtle text-black">
                  <div class="d-flex justify-content-between align-items-center">
                    <span>Card details</span>
                  </div>
                  <span class="type d-block mt-3 mb-1">Card type</span>
                  <label class="radio">
                    <input type="radio" name="card" value="payment" checked>
                    <span><img width="30" src="https://img.icons8.com/color/48/000000/mastercard.png" /></span>
                  </label>

                  <label class="radio" > <input type="radio" name="card" value="payment"> <span><img width="30"
                        src="https://img.icons8.com/officel/48/000000/visa.png" /></span> </label>

                  <label class="radio"> <input type="radio" name="card" value="payment"> <span><img width="30"
                        src="https://img.icons8.com/ultraviolet/48/000000/amex.png" /></span> </label>

                  <label class="radio"> <input type="radio" name="card" value="payment"> <span><img width="30"
                        src="https://img.icons8.com/officel/48/000000/paypal.png" /></span> </label>

                  <div>
                    <label class="credit-card-label">Name on card</label><input type="text"
                      class="form-control credit-inputs bg-white mb-1" v-model="cardName" placeholder="Name">
                  </div>
                  <div v-if="cardName != '' && cardName_errormsg.length != 0" class='m-0 p-0'>
                    <div>
                      <p v-for="err of cardName_errormsg" :key="err" class='text-danger mb-1' style="font-size: 13px;">{{ err }}</p>
                      
                    </div>
                  </div>
                  <div>
                    <label class="credit-card-label ">Card number</label><input type="text"
                      class="form-control credit-inputs bg-white mb-1" v-model="cardNumber" placeholder="0000000000000000">
                  </div>
                  <div v-if="cardNumber != '' && cardNumber_errormsg.length != 0" class='m-0 p-0'>
         
                    <p v-for="err of cardNumber_errormsg" :key="err" class='text-danger mb-1' style="font-size: 13px;">{{ err }}</p>
                    
                    </div>
                  <div class="row">
                    <div class="col-md-6">
                      <label class="credit-card-label  mb-0">Date</label><input v-model="cardDate" type="text" class="form-control credit-inputs bg-white mb-1"
                        placeholder="12/24">
                        <div v-if="cardDate != '' && cardDate_errormsg.length != 0" >
                    <div>
                      
                      <p v-for="err of cardDate_errormsg" :key="err" class='text-danger m-1 p-0' style="font-size: 10px;">{{ err }}</p>
                    </div>
                    </div>
                    </div>
                    <div class="col-md-6">
                      <label class="credit-card-label mb-0">CVV</label><input type="text" v-model="cardCVV" class="form-control credit-inputs bg-white mb-1"
                        placeholder="342">
                        <div v-if="cardCVV != '' && cardCVV_errormsg.length != 0" >
                    <div>
                      <p v-for="err of cardCVV_errormsg" :key="err" class='text-danger m-1 p-0' style="font-size: 10px;">{{ err }}</p>
                    </div>
                    </div>
                    </div>
                  </div>
                  
                  
                  <hr class="line">
                  <div class="d-flex justify-content-between information"><span>Subtotal</span><span>${{parseFloat(calculateTotalPrice).toFixed(2)}}</span></div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length == 2 "><span>Shipping</span><span>$2.00</span></div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length == 2">
                    <span>Total(Incl. taxes)</span>
                    <span>${{ parseFloat(calculateTotalPrice + 2).toFixed(2)}}</span>
                  </div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length == 3 "><span>Shipping</span><span>$4.00</span></div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length == 3">
                    <span>Total(Incl. taxes)</span>
                    <span>${{ parseFloat(calculateTotalPrice + 4).toFixed(2) }}</span>
                  </div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length >= 4 "><span>Shipping</span><span>$6.00</span></div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length >= 4">
                    <span>Total(Incl. taxes)</span>
                    <span>${{parseFloat(calculateTotalPrice + 6).toFixed(2)}}</span>
                  </div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length == 1 && Unit !== ''"><span>Shipping</span><span>$2.00</span></div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length == 1 && Unit !== ''">
                    <span>Total(Incl. taxes)</span>
                    <span>${{parseFloat(calculateTotalPrice + 2).toFixed(2)}}</span>
                  </div>
                  <div class="d-flex justify-content-between information" v-if="AddressList.length == 1 && Unit === ''">
                    <span>Total(Incl. taxes)</span>
                    <span>${{ parseFloat(calculateTotalPrice).toFixed(2)}}</span>
                  </div>
                  <a href="./confirmation-page" v-if='products.length >= 1 && CheckCardDetails() && validateDelivery() && checkOptions()'>
                  <button  type="button" class="btn btn-block btn-lg btn-work btn-outline-success" @click='afterCheckOut(accountStorage.aid, products)'>
                    <div class="d-flex justify-content-between">
                      <span id="checkout">Checkout</span>
                    </div>
                  </button>
                </a>
                  <button v-else type="button" class="btn btn-block btn-lg btn-work btn-outline-success disabled">
                    <div class="d-flex justify-content-between">
                      <span id="checkout">Checkout</span>
                    </div>
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>         
      </div>     
    </section>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import { GoogleMap, Marker, CustomMarker } from "vue3-google-map";
import ConfirmationPage from './ConfirmationPage.vue';


export default {
  
  name: "CheckOut",
  components: {
    NavBar,
    
  },
  data: () => ({
    DeliveryPostalCode: "",
    DeliveryPostalCodeError: "",
    DeliveryEmail: "",
    DeliveryEmailError: "",
    DeliveryContactNumber: "",
    DeliveryContactNumberError: "",
    Unit: "",
    UnitError: "",
    dateError: '',
    isLoggedIn: false,
    loading: false,
    timing:"", 
    date:"",
    checked: false,
    products: useAccountStorage().cart,
    totalCost: [],
    productList: {},
    AddressList: [],
    subtotalCost: 0,
    
    cardName: "",
    cardName_errormsg: [],
    cardNumber_errormsg : [],
    cardDate_errormsg : [],
    cardCVV_errormsg : [],
    cardNumber: "",
    cardDate: "",
    cardCVV: "",
    

    center: {lat: useAccountStorage().lat, lng: useAccountStorage().lng},
    markers: {},
          
  }),
  created() {
		this.checkLoginStatus();
    this.RetrieveAll(this.products)
    
    
	},
  mounted(){
    
    
  },
  
  computed: {
    
    calculateTotalPrice(){
      let total = 0
      for(let i of this.totalCost){
        total += parseFloat(i)
      }
      return total
    },
    cart(){
      return this.carts.cart;
    }
  },

  methods: {
    checkOptions(){
      if(this.date != "" || this.DeliveryPostalCode != ""){
        return true
      }
      return false
    },
    validateDelivery(){
      this.DeliveryContactNumberError = ""
      this.DeliveryPostalCodeError = ""
      this.DeliveryEmailError = ""
      this.UnitError = ""
      const alphabets= "abcdefghijklmnopqrstuvwuxyzABCDEFGHIJKLMNOPQRSTUVWUXYZ"
      const specialCharacters = "!@#$%^&*()-_=+?|<>~";
      if(this.DeliveryContactNumber != ""){
        if(this.DeliveryContactNumber.length != 8){
          this.DeliveryContactNumberError = "Invalid number"
        }
        else{
          for(let i of alphabets){
            if(this.DeliveryContactNumber.indexOf(i) != -1){
              this.DeliveryContactNumberError = "Remove alphabets"
              break
            }
            else{
              for(let i of specialCharacters){
            if(this.DeliveryContactNumber.indexOf(i) != -1){
              this.DeliveryContactNumberError = "Remove special characters"
              break
            }
          }
            }
          }
        }

      }
      if(this.DeliveryPostalCode != ""){
        if(this.DeliveryPostalCode.length != 6){
          this.DeliveryPostalCodeError = "Invalid postal code"
        }
        else{
          for(let i of alphabets){
            if(this.DeliveryPostalCode.indexOf(i) != -1){
              this.DeliveryPostalCodeError = "Remove alphabets"
              break
            }
            else{
              for(let i of specialCharacters){
            if(this.DeliveryPostalCode.indexOf(i) != -1){
              this.DeliveryPostalCodeError = "Remove special characters"
              break
            }
          }
            }
          }
        }

      }
      if(this.DeliveryEmail != ""){
        if(this.DeliveryEmail.indexOf("@") == -1){

          this.DeliveryEmailError = "Invalid email";
        }
    }
    if(this.Unit != ""){
      if(this.Unit.indexOf("#") == -1){
        this.UnitError = "Invalid unit";
      }
    }
    if(this.UnitError != "" || this.DeliveryContactNumberError != "" || this.DeliveryEmailError != "" || this.DeliveryPostalCodeError != ""){
      return false
    }
    return true
    },
    validateDate() {
      const selectedDate = new Date(this.date);
      const today = new Date();

      if (selectedDate < today) {
        this.dateError = 'Please choose a date equal to or after today.';
        this.date = "";
      } else {
        this.dateError = '';
        
      }
    },
    
    CheckCardDetails(){
      
      this.cardName_errormsg = [];
      this.cardNumber_errormsg = [];
      this.cardDate_errormsg = [];
      this.cardCVV_errormsg = [];
      const alphabets= "abcdefghijklmnopqrstuvwuxyzABCDEFGHIJKLMNOPQRSTUVWUXYZ"
      const specialCharacters = "!@#$%^&*()-_=+?|<>~";
      if(this.cardName == ""){
        this.cardName_errormsg.push("Empty Name");
      }
      else if(this.cardName != ""){
        for(let i of specialCharacters){
          
          if(this.cardName.indexOf(i) != -1){
            this.cardName_errormsg.push("Remove special characters");
            break
          }
        }
      }
      
      if(this.cardNumber.length != 16 ){
        this.cardNumber_errormsg.push("Invalid card number")
      }
      else if(this.cardNumber.length == 16){
        for(let i of specialCharacters){
          if(this.cardNumber.indexOf(i) != -1){
            console.log(i)
            this.cardNumber_errormsg.push("Remove special characters");
            break
          }
        }
        for(let i of alphabets){
          if(this.cardNumber.indexOf(i) != -1){
            console.log(i)
            this.cardNumber_errormsg.push("Remove alphabets");
            break
          }
        }
      }

      if(!this.cardDate.includes("/")){
        this.cardDate_errormsg.push("Invalid expiry date")
      }

      else if(this.cardDate.includes("/")){
        let twoparts = this.cardDate.split("/")
        for(let i of specialCharacters){
          if(this.cardDate.indexOf(i) != -1){
            this.cardDate_errormsg.push("Remove special characters");
            break
          }
        }
        if(parseInt(twoparts[0]) >= 13 || parseInt(twoparts[0]) < 1){
          
          this.cardDate_errormsg.push("Invalid expiry month")
          
        }
        if(parseInt(twoparts[1]) >= 30 || parseInt(twoparts[1]) <= 22){
          this.cardDate_errormsg.push("Invalid expiry year")
        }
      }
      if(this.cardCVV == ""){
        this.cardCVV_errormsg.push("Please key in your CVV")
      }
      if(parseInt(this.cardCVV) >= 1000 || parseInt(this.cardCVV) <= 99){
        this.cardCVV_errormsg.push("Invalid card CVV")
      }
      for(let i of specialCharacters){
          if(this.cardCVV.indexOf(i) != -1){
            this.cardCVV_errormsg.push("Remove special characters");
            break
          }
        }
        for(let i of alphabets){
          if(this.cardCVV.indexOf(i) != -1){
            this.cardCVV_errormsg.push("Remove alphabets");
            break
          }
        }
      if(this.cardCVV_errormsg.length > 0 || this.cardDate_errormsg.length > 0 || this.cardNumber_errormsg.length > 0 || this.cardName_errormsg.length > 0){
        return false
      }
      return true
      },
    CalculatePrice(p, qty){
      
      console.log("after..")
      return parseFloat(parseFloat(p).toFixed(2) * qty).toFixed(2)
    },
    checkLoginStatus() {
			const sessionData = JSON.parse(localStorage.getItem('session'));
			if (sessionData && sessionData.user && sessionData.user.email) {
			// Assuming that the presence of the user's email indicates a valid login session
			this.isLoggedIn = true;
			} else {
			this.isLoggedIn = false;
			}
		},
    deleteCard(pid) {
      let arr = [];
      for(let i of this.products){
        if(i != pid){
          arr.push(i)
        }
      }
      useAccountStorage().cart = arr
      this.products = arr;
      console.log('after delete')
      console.log(this.products)
      this.RetrieveAll(this.products)
      
      
    },
    
    imageUrl(name) {
      return require(`@/assets/img/${name}`);
      // console.log(name);
    },
    
    Retrieval(pid){
      axios
        .get("http://localhost:3000/get_product_description/" + pid)
        .then((response) => {
          
          let prod = {};
          let add = {}
          prod['Address'] = response.data[0].postalcode;
          prod['Name'] = response.data[0].iname;
          prod['Price'] = response.data[0].selling_price;
          prod['Quantity'] = response.data[0].selling_quantity;
          prod['Image'] = response.data[0].image;
          add['lat'] = parseFloat(response.data[0].a_lat);
          add['lng'] = parseFloat(response.data[0].a_long);
          prod['position'] = add
          if(!this.AddressList.includes(response.data[0].postalcode)){
            this.AddressList.push(response.data[0].postalcode)
          }
          this.totalCost.push(this.CalculatePrice(response.data[0].selling_price, response.data[0].selling_quantity))
          this.productList[pid] = prod
          console.log(this.totalCost)
          
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    RetrieveAll(prods){
      console.log("RetrievalAll here")
      console.log(prods);
      this.productList = {};
      this.subtotalCost = 0;
      this.AddressList = [];
      this.totalCost = [];
      for(let pid of prods){
        this.Retrieval(pid);
      }
    },
    async afterCheckOut(aid, arrPid) {
      try {
        useAccountStorage().cart = [];
        const response = await axios.post(`http://localhost:3000/afterCheckOut/${aid}/${arrPid.join(',')}`, {
          arrPid,
        });
        

      } catch (error) {
        console.error('Error:', error);
      }
          
    },
  },
}


</script>



<style scoped>
#delete1:hover {
  color: red;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.empty-container{
  width: 100%;
  height: 0;
  padding-bottom: 60%;
  position: relative;
}

#empty{position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;}
.map-container {
  width: 100%;
  height: 0;
  padding-bottom: 60%;
  position: relative;
}


#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

form {
  padding: 20px 0;
}

#heading {
  font-weight: bold;
  text-align: center;
}

select,
input {
  border: 1px solid #ced4da;
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
  background-color: #f8f9fa;
}

input:focus::placeholder {
  color: transparent;
}

.btn {
  width: 100%;
  font-size: 14px;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}



.btn:hover {
  background-color: white;
  color: black;
}

#checkout {
  text-align: center;
  margin: auto;
  font-weight: bold;
}


a {
  color: #343a40;
  text-decoration: none;
}

a:hover {
  color: #343a40;
  text-decoration: underline;
}

.quantity-field {
  border: none !important;
  /* Remove the border */
  text-align: center;
  /* Center the text */
  width: 40px;
  /* Adjust the width */
}

.input-group-prepend,
.input-group-append {
  display: flex;
}

.input-group-text {
  border: none !important;
}

#sticky {
  position: sticky;
  z-index:5;
}
.payment-info {
  background: #508E46;
  padding: 30px;
  border-radius: 6px;
  color: #fff;
  font-weight: bold;
  height: auto;
  font-size: 20px;
}

body {
  background: #FAF9F6;
}

.cart {
  background: #FAF9F6
}

.p-about {
  font-size: 12px;
}

p {
  text-align: left;
}

.table-shadow {
  -webkit-box-shadow: 5px 5px 15px -2px rgba(0, 0, 0, 0.42);
  box-shadow: 5px 5px 15px -2px rgba(0, 0, 0, 0.42);
}

.type {
  font-weight: 400;
  font-size: 15px;
}

label.radio {
  cursor: pointer;
}

label.radio input {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  pointer-events: none;
}

label.radio span {
  padding: 1px 12px;
  border: 2px solid #ada9a9;
  display: inline-block;
  color: #8f37aa;
  border-radius: 3px;
  text-transform: uppercase;
  font-size: 11px;
  font-weight: 300;
}

label.radio input:checked+span {
  border-color: #fff;
  background-color: white;
  color: #fff;
}

.credit-inputs {
  background: #D3D3D3;
  color: #000 !important;
  border-color: rgb(102, 102, 221);
}

.credit-inputs::placeholder {
  color: #000;
  font-size: 13px;
}

.credit-card-label {
  font-size: 15px;
  font-weight: 300;
  padding-top: 10px;
}

.form-control.credit-inputs:focus {
  background: white;
  border: rgb(102, 102, 221);
}

.line {
  border-bottom: 1px solid rgb(102, 102, 221);
}

.information span {
  font-size: 15px;
  font-weight: 500;
}

.information {
  margin-bottom: 5px;
}

.items {
  -webkit-box-shadow: 5px 5px 4px -1px rgba(0, 0, 0, 0.25);
  box-shadow: 5px 5px 4px -1px rgba(0, 0, 0, 0.08);
}

.spec {
  font-size: 11px;
}

.payment-info {
  text-align: left;
}

#cart-section {
  display: flex;
  flex-direction: column;
}

.header-container {
  display: flex;
  justify-content: space-between;
}

.custom-text:nth-of-type(1) {
  display: flex;
  flex-grow: 8;
  margin: 0;
  padding: 10px;
}

.custom-text:nth-of-type(2) {
  display: flex;
  flex-grow: 1.5;

  text-align: center;
  margin: 0;
  padding: 10px;
}

.custom-text:nth-of-type(3) {
  display: flex;
  flex-grow: 1;
  left: -40px;
  position: relative;
  text-align: center;
  margin: 0;
  padding: 10px;
}

</style>
