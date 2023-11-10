<script setup>
import { Icon } from "@iconify/vue";
import { useAccountStorage } from "../main.js";
import axios from "axios";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const accountStorage = useAccountStorage();
let successMessage = "";
</script>

<template>
  <meta charset="utf-8" />
  <section class="container" style="padding-top: 20px">
    <!-- Welcome Message -->
    <div class="container-fluid">
      <div class="row">
        <h1 class="text-center fw-bold mb-4">
          {{ accountStorage.name }}'s Food Inventory
          <Icon icon="mdi:human-welcome" />
        </h1>
      </div>
    </div>

    <!-- Search Bar -->
    <!-- <div class="input-group mx-10 mt-2 mb-5" id='sticky' style="padding-left: 20px; padding-right: 20px; height: 45px;  padding-top: 5px;">
			<span id="search_input" class="input-group-text">
				<Icon icon="ph:magnifying-glass" />
			</span>
			<input v-model="searching" type="text" id="search_input" class="form-control" placeholder="Search for ingredients" />
		</div> -->

    <!-- Category Filter Buttons -->
    <div id="category">
      <div class="container-fluid justify-content-center d-flex">
        <div
          v-for="category in categories"
          :key="category.categoryName"
          class="border rounded d-flex flex-column justify-content-between align-items-center mx-3">
          <div
            class="filter"
            :class="{ active: currentFilter === category.categoryName }"
            @click="setFilter(category.categoryName)">
            <img :src="imageUrl(category.imgLink)" style="width: 30px" /> &nbsp;
            <span class="mb-0 fw-bold">{{ category.categoryName }}</span>
          </div>
        </div>
        <button class="open-button" @click="formAction('open')">
          + New item
        </button>
      </div>
    </div>

    <!-- Add-items Form -->
    <div class="form-popup" id="myForm" v-if="!successMessage">
      <form class="form-container">
        <h3 class="fw-bold" style="text-align: center">
          Item Tracking
          <button id="close" @click="formAction('close')">close</button>
        </h3>

        <div class="mb-3 py-2">
          <label for="formName" class="form-label">Item Name</label>
          <input
            type="text"
            class="form-control"
            id="formName"
            placeholder="Enter product name"
            v-model="ingredient_name"
            required />
        </div>

        <div class="mb-3">
          <label for="formQty" class="form-label">Item Quantity</label>
          <input
            type="number"
            class="form-control"
            id="formQty"
            placeholder="0"
            v-model="ingredient_quantity"
            required />
        </div>

        <div class="mb-3">
          <label for="formCategory" class="form-label">Item Category</label>
          <select
            v-model="selectedCategory"
            class="form-select"
            id="formCategory"
            required>
            <option>Fruits</option>
            <option>Dairy</option>
            <option>Fish</option>
            <option>Meats</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="edate" class="form-label">Expiry Date</label>
          <input
            type="date"
            class="form-control"
            id="edate"
            v-model="ingredient_expiry_date"
            required />
        </div>

        <div class="mb-3">
          <label :for="radios" class="form-label">Choose Emoji</label>
          <div :id="radios">
            <div v-for="emoji in getEmojis" :key="emoji">
              <div
                v-for="(e, idx) in emoji"
                :key="idx"
                style="display: inline-block">
                <label class="form-check-label" :for="'emojiRadio-' + idx">
                  <input
                    type="radio"
                    name="emoji"
                    :value="e"
                    class="form-check-input"
                    :id="'emojiRadio-' + idx"
                    v-model="selectedEmoji" />
                  <span>{{ e }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <a href="./inventory-tracker">
            <button type="button" class="btn add" @click="insertItem()">
              Add
            </button>
          </a>
          <button type="button" class="btn cancel" @click="formAction('clear')">
            Clear
          </button>
        </div>
      </form>
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <!-- If there are no items -->
    <div
      class="row container justify-content-center"
      v-if="items == ''"
      style="padding-top: 10px">
      <img :src="imageUrl('inventorytracker.webp')" style="width: 50%" />
      <h3 class="text-center">
        Record the food items you have to get started.
      </h3>
      <p class="text-center">Let's not make all these food go to waste!</p>
    </div>

    <!-- Product card  -->

    <div
      class="row row-cols-2 row-cols-lg-3 justify-content-center container-fluid mt-5">
      <!-- example inventory card -->
      <div
        class="col py-3"
        v-for="(item, idx) in sortedArray"
        :key="item.iname"
        style="height: 360px; width: 360px">
        <div
          class="rounded-4 p-3 d-flex flex-column justify-content-between shadow h-100 bg-white">
          <div class="d-flex justify-content-between flex-grow-1">
            <img
              :src="require('@/assets/img/' + item.postingImage)"
              class="img-fluid object-fit-contain"
              height="180"
              width="180" />

            <div class="d-flex justify-content-between align-items-start">
              <!-- <div class="fs-1">{{ item.emoji }}</div> -->
              <div class="d-flex gap-2 align-items-center">
                <button
                  type="button"
                  class="btn btn-outline-light rounded-circle d-flex align-items-center"
                  style="height: 32px; width: 32px"
                  @click="modifyItemQty(item, 'minus')">
                  -
                </button>
                <div
                  class="p-2 rounded-circle lh-1 fs-4 fw-bold d-flex justify-content-center align-items-center inventory-qty">
                  <!-- :style="{ color: card.qty_color }" -->
                  x{{ item.qty }}
                </div>
                <button
                  type="button"
                  class="btn btn-outline-light rounded-circle d-flex align-items-center"
                  style="height: 32px; width: 32px"
                  @click="modifyItemQty(item, 'add')">
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <div class="text-start fs-4 fw-semibold">
              {{ item.iname }}
            </div>
            <div class="text-start text-secondary-emphasis">
              Fresh for {{ item.expiring_in }} more day<span
                v-if="item.expiring_in > 1"
                >s</span
              >
            </div>
            <div class="btn-group w-100 mt-2">
              <!-- <div class="col-lg-6 col-md-6 col-sm-6"> -->
              <button
                type="button"
                class="btn bg-success-subtle"
                style="display: block; width: 100%"
                @click="removePost()">
                Remove
              </button>
              <!-- </div> -->
              <!-- <div class="col-lg-6 col-md-6 col-sm-6"> -->
              <button
                type="button"
                class="btn btn-success"
                style="display: block; width: 100%"
                data-bs-toggle="modal"
                data-bs-target="#openModal">
                Sell
              </button>
              <!-- </div> -->
            </div>

            <!-- Modal Opened -->
            <div
              class="modal fade"
              id="openModal"
              tabindex="-1"
              aria-labelledby="openModalLabel"
              aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="'ModalLabel' + idx">
                      Listing Details
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <label :for="'FormControlInput1' + idx" class="form-label"
                      >Selling Price</label
                    >
                    <div class="input-group mb-3">
                      <span class="input-group-text" id="addon-wrappifng"
                        >$</span
                      >
                      <input
                        type="number"
                        class="form-control"
                        :id="'FormControlInput1' + idx"
                        placeholder="3.00" />
                    </div>
                    <div class="mb-3">
                      <label :for="'FormControlInput2' + idx" class="form-label"
                        >Upload photo of product</label
                      >
                      <input
                        type="file"
                        class="form-control"
                        :id="'FormControlInput2' + idx" />
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary">Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="projects" name="projects">
        <template v-for="(item, idx) in sortedArray" :key="item.iname">
          <TransitionGroup
            class="project"
            v-if="currentFilter === item.icat || currentFilter === 'All'">
            <div
              class="col-lg-4 col-md-6 col-sm-12"
              style="padding-bottom: 10px">
              <div class="card" :style="computedItemStyle(item)">
                <div
                  class="card-title d-flex justify-content-between"
                  :id="'card-title-' + idx">
                  <div class="emoji emoji-hover">
                    {{ item.emoji }}
                  </div>
                  <div id="counter" style="display: inline-flex">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      style="border: none"
                      v-if="item.qty > 0"
                      @click="modifyItemQty(idx, 'minus')">
                      -
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      style="border: none"
                      v-else>
                      -
                    </button>
                    <span class="circle"> x {{ item.qty }} </span>
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      style="border: none"
                      @click="modifyItemQty(idx, 'add')">
                      +
                    </button>
                  </div>
                </div>

                <div class="card-body">
                  <p>
                    <span class="fw-bold" style="font-size: large">{{
                      item.iname
                    }}</span>
                    <br />
                    Expiring in
                    <span class="fw-bold" style="font-size: large">{{
                      item.expiring_in
                    }}</span>
                    days
                  </p>
                </div> -->

    <!-- Modal  -->
    <!-- Button trigger modal -->
    <!-- <div class="d-flex">
                  <div class="col-lg-6 col-md-6 col-sm-6">
                    <button
                      type="button"
                      class="btn btn-danger"
                      style="display: block; width: 100%"
                      @click="removeItem()">
                      Remove
                    </button>
                  </div>
                  <div class="col-lg-6 col-md-6 col-sm-6">
                    <button
                      type="button"
                      class="btn btn-success"
                      style="display: block; width: 100%"
                      @click="changeItemChosen(item.iid)"
                      data-bs-toggle="modal"
                      :data-bs-target="'#openModal' + idx">
                      Sell
                    </button>
                  </div>
                </div> -->

    <!-- Modal Opened -->
    <!-- <div
                  class="modal fade"
                  :id="'openModal' + idx"
                  tabindex="-1"
                  aria-labelledby="openModalLabel"
                  aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" :id="'ModalLabel' + idx">
                          Listing Details
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <label
                          :for="'FormControlInput1' + idx"
                          class="form-label"
                          >Selling Price</label
                        >
                        <div class="input-group mb-3">
                          <span class="input-group-text" id="addon-wrappifng"
                            >$</span
                          >
                          <input
                            type="number"
                            class="form-control"
                            :id="'FormControlInput1' + idx"
                            v-model="price" />
                        </div>
                        <div class="mb-3">
                          <label
                            :for="'FormControlInput2' + idx"
                            class="form-label"
                            >Upload photo of product</label
                          >
                          <input
                            type="file"
                            class="form-control"
                            :id="'FormControlInput2' + idx" />
                        </div>
                      </div>
                      <div class="modal-footer">
                        <a href="./inventory-tracker">
                          <button
                            type="button"
                            class="btn btn-primary"
                            @click="posted(price)">
                            Post
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </template>
      </div>
    </div> -->
  </section>
</template>

<script>
export default {
  name: "InventoryTracker",
  data() {
    return {
      isLoggedIn: true,
      currentFilter: "All",
      user: "",

      items: [],
      // inventoryItems: [],
      successMessage: "",

      // Form inputs
      price: 3,
      is_selected: undefined,
      ingredient_name: "",
      ingredient_quantity: "",
      ingredient_expiry_date: "",
      posting_status: "",
      selectedCategory: "Fruits",
      selectedEmoji: "",

      // Hard-Coded
      categories: [
        { categoryName: "All", imgLink: "kitchen.png" },
        // { categoryName: "Due Soon", imgLink: "duesoon.png" },
        // { categoryName: "Past Due", imgLink: "pastdue.png" },
        { categoryName: "Dairy", imgLink: "milk.png" },
        { categoryName: "Fish", imgLink: "fish.png" },
        { categoryName: "Fruits", imgLink: "fruits.png" },
        { categoryName: "Meats", imgLink: "barbecue.png" },
      ],
      emojis: [
        { dairy: ["🧀", "🧈", "🥛", "🍼"] },
        { fish: ["🐟", "🐠"] },
        { fruit: ["🍇", "🍊", "🍌", "🍍", "🍎", "🍓", "🫐", "🥝"] },
        {
          meat: [
            "🥩",
            "🐄",
            "🐖",
            "🐓",
            "🐏",
            "🦃",
            "🦆",
            "🐔",
            "🦀",
            "🦞",
            "🦐",
          ],
        },
      ],

      // DO NOT DELETE THIS
      cards: [
        {
          icon: "🥬",
          qty: 4,
          item: "Lettuce",
          expiry: 3,
          background:
            "linear-gradient(135deg, rgb(202, 236, 172) 0%, rgb(131, 208, 197) 100%)",
          qty_color: "rgb(160, 220, 187)",
        },
      ],
      allIngredientsAndImages: [],
    };
  },
  created() {
    this.checkLoginStatus();
    this.fetchItems();
  },
  computed: {
    sortedArray() {
      let sortedItems = this.items.filter((item) => {
        return item.icat === this.currentFilter || this.currentFilter === "All";
      });
      sortedItems = sortedItems.sort((a, b) => {
        return a.expiring_in - b.expiring_in;
      });
      return sortedItems;
    },

    getEmojis() {
      switch (this.selectedCategory) {
        case "Fruits":
          return this.emojis[2];
        case "Dairy":
          return this.emojis[0];
        case "Meats":
          return this.emojis[3];
        case "Fish":
          return this.emojis[1];
        default:
          return [];
      }
    },

    calculateRemainingDays() {
      const currentDate = new Date();
      var futureDate = new Date(this.ingredient_expiry_date);
      var timeDifference = futureDate.getTime() - currentDate.getTime();
      var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      return daysDifference;
    },
  },
  methods: {
    changeItemChosen(newiid) {
      this.is_selected = newiid;
      console.log("new me");
      console.log(this.is_selected);
    },

    checkLoginStatus() {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (sessionData && sessionData.user && sessionData.user.email) {
        // Assuming that the presence of the user's email indicates a valid login session
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },

    fetchItems() {
      // Replace the URL with the appropriate route for getting user inventory items
      const userId = useAccountStorage().aid; // Replace with the actual user ID
      axios
        .get(`http://localhost:3000/get_inventory_and_images/${userId}`)
        .then((response) => {
          this.items = response.data; // Store the fetched inventory items in the data property
          console.log("Inventory items:", this.items);
        })
        .catch((error) => {
          console.error(
            "Error occurred while fetching inventory items:",
            error
          );
        });
    },
    // fetchItems() {
    //   // Replace the URL with the appropriate route for getting user inventory items
    //   const userId = useAccountStorage().aid; // Replace with the actual user ID
    //   axios
    //     .get(`http://localhost:3000/get_user_inventory_items/${userId}`)
    //     .then((response) => {
    //       this.items = response.data; // Store the fetched inventory items in the data property
    //       console.log("Inventory items:", this.items);
    //     })
    //     .catch((error) => {
    //       console.error(
    //         "Error occurred while fetching inventory items:",
    //         error
    //       );
    //     });
    // },
    getIngredientIdByName(ingredientName) {
      // Make a GET request to the server-side endpoint to retrieve all ingredients
      axios
        .get("http://localhost:3000/get_all_ingredients")
        .then((response) => {
          const ingredients = response.data;
          const ingredient = ingredients.find(
            (ingredient) => ingredient.name === ingredientName
          );
          return ingredient ? ingredient.iid : null;
        })
        .catch((error) => {
          console.error("Error fetching ingredients:", error);
          return null;
        });
    },

    insertItem() {
      // Access the values from the input fields
      const itemName = this.ingredient_name;
      const itemQuantity = this.ingredient_quantity;
      const selectedCategory = this.selectedCategory;
      const expiryDate = this.ingredient_expiry_date;
      const selectedEmoji = this.selectedEmoji;
      this.formAction("close");

      this.items.push({
        aid: useAccountStorage().aid,
        iid: 3,
        iname: itemName,
        qty: itemQuantity,
        expiring_in: this.calculateRemainingDays,
        ExpiryDate: expiryDate,
        icat: selectedCategory,
        emoji: selectedEmoji,
      });

      // Get the ingredient id by name
      axios
        .get("http://localhost:3000/get_ingredient_id_by_name", {
          params: {
            name: itemName,
          },
        })
        .then(async (response) => {
          const ingredientId = response.data.iid;
          if (ingredientId) {
            // Now you can use these variables to perform any necessary logic or actions
            // For example, you can use them in your axios POST request

            try {
              const postResponse = await axios.post(
                "http://localhost:3000/add_inventory_item",
                {
                  aid: useAccountStorage().aid,
                  iid: ingredientId,
                  qty: itemQuantity,
                  expiring_in: daysDifference, // Store the calculated difference in days
                  ExpiryDate: expiryDate,
                  // other data properties as needed
                }
              );

              // Show success message and close the form
              this.successMessage = "Item added successfully!";

              setTimeout(() => {
                this.successMessage = "";
              }, 2000); // Hides the success message after 2 seconds
            } catch (error) {
              // Handle errors
              console.error(
                "Error occurred while adding inventory item:",
                error
              );
            }
          } else {
            console.error(
              "Ingredient ID not found for the provided name:",
              itemName
            );
          }
        })
        .catch((error) => {
          // Handle errors
          console.error("Error retrieving ingredient ID:", error);
        });
    },

    imageUrl(img) {
      return require(`@/assets/img/${img}`);
    },
    setFilter: function (filter) {
      this.currentFilter = filter;
    },

    computedItemStyle(obj) {
      let style = {};

      if ("🧀🧈🍋🍌🥔🌽".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #FBF8CC 70%, white)";
      } else if ("🐟🐠".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #8EECF5 70%, white)";
      } else if ("🦑🍇🫐🍆".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #CFBAF0 70%, white)";
      } else if ("🍈🍏🍐🥝🫒🥑🫑🥒🥬🥦".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #b9fbc0 70%, white)";
      } else if ("🦀🦞🦐🍉🍎🍒🍓🍅".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #ffb5a7 , 70%, white)";
      } else if ("🍍🍗🍑🥕".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #fec89a, 70%, white)";
      } else if ("🥥🍖🥓🐓".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #e2cfc4, 70%, white)";
      } else if ("🐖".includes(obj.emoji)) {
        style.background = "linear-gradient(to top left, #ffacc5, 70%, white)";
      } else {
        style.background = "linear-gradient(to top left, #F8F6F4, 70%, white)";
      }

      // if (obj.expiring_in <= 2 && obj.expiring_in >= 0) {
      // 	style.border = 'solid 5px orange';
      // 	style.borderRadius = '1rem';
      // }
      // else if (obj.expiring_in < 0) {
      // 	style.border = 'solid 5px orange';
      // 	style.borderRadius = '1rem';
      // }
    },

    formAction(action) {
      if (action == "open") {
        document.getElementById("myForm").style.display = "block";
      } else if (action == "close") {
        document.getElementById("myForm").style.display = "none";
      } else if (action == "clear") {
        this.ingredient_name = "";
        this.ingredient_quantity = "";
        this.selectedCategory = "Fruits";
        this.ingredient_expiry_date = "";
        this.selectedEmoji = "";
      }
    },

    modifyItemQty(item, operator) {
      if (operator == "add") {
        item.qty += number;
        // check again
      } else if (operator == "minus" && item.qty > 0) {
        item.qty -= number;
        // check again
      }
      if (item.qty == 0) {
        this.removeItem();
      }
    },

    // TO DO: remove this card information from the Table 'AccountInventory' completely
    removeItem() {
      this.items.splice(idx, 1);
      // check again
    },

    // TO DO: insert this card information to Table 'Posting'
    posted(s_price) {
      let iid = this.is_selected;

      try {
        axios.post(
          `http://localhost:3000/InventorytoPosting/${
            useAccountStorage().aid
          }/${iid}/${s_price}`,
          {}
        );
      } catch (error) {
        console.error("Error:", error);
      }
    },

    // to store the ingredients and their images into this.allIngredientsAndImages
    getAllIngredientImages() {
      const userId = useAccountStorage().aid; // Replace with the actual user ID
      axios
        .get(`http://localhost:3000/get_all_ingredients/`)
        .then((response) => {
          // this.items = response.data; // Store the fetched inventory items in the data property
          console.log("Inventory items:", this.items);
          for (ingredient in response.data) {
            this.allIngredientsAndImages.push({
              iid: ingredient.iid,
              iname: ingredient.iname,
              image: ingredient.postingImage,
            });
          }
        })
        .catch((error) => {
          console.error(
            "Error occurred while fetching inventory items:",
            error
          );
        });
    },
  },
  mounted() {
    this.getAllIngredientImages();
  },
};
</script>

<style scoped>
.container {
  /* position: relative; */
  text-align: left;
}

#category {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.btn {
  color: black;
  border: none;
}
.filter {
  padding: 6px 6px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.35s;
  justify-content: center;
}

.filter.active {
  box-shadow: 0px 1px 3px 0px #508e46;
  background-color: gray;
  color: white;
}

.filter:hover {
  background: lightgray;
}

.projects {
  margin-top: 25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.projects-enter {
  transform: scale(0.5) translatey(-80px);
  opacity: 0;
}

.projects-leave-to {
  transform: translatey(30px);
  opacity: 0;
}

.projects-leave-active {
  position: absolute;
  z-index: -1;
}

.card {
  max-width: 260px;
  /* border-radius: 8px; */
  position: relative;
  padding: 0.7em;
  width: 350px;
  box-shadow: -1px 15px 30px -12px rgb(32, 32, 32);
  border-radius: 0.9rem;
  cursor: pointer;
}

.card-body {
  height: 150px;
  width: auto;
  padding-left: 6px;
  padding-right: 6px;
}

.card-body p {
  position: relative;
  top: 70px;
  left: 2px;
}

.circle {
  text-align: center;
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  /* 	border:1px solid black; */
  /* box-shadow: 0px -4px 3px 0px #494d3257; */
  justify-content: center;
  align-items: center;
  display: inline-flex;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: saturate(180%) blur(10px);
  /* 	box-shadow:0px -3px 3px #484848a6; */
  z-index: 2;
  font-size: 18pt;
  top: 5px;
}

.project body {
  z-index: 3;
}

.btn-subtle {
  border: none;
  transition: background-color 0.3s;
}

.btn-subtle:hover {
  cursor: pointer;
}

.btn-danger-subtle:hover {
  background-color: #dc3545; /* Change to your desired hover color for Remove */
}

.btn-success-subtle:hover {
  background-color: #28a745; /* Change to your desired hover color for Sell */
}

.project {
  transition: all 0.35s ease-in-out;
  margin: 10px;
  box-shadow: 0px 2px 8px lightgrey;
  border-radius: 3px;
  width: 180px;
  height: 200px;
  flex-direction: column;
  align-items: center;
}

/* Button used to open the contact form - fixed at the bottom of the page */
.open-button {
  background-color: #508e46;
  color: white;
  padding: 15px;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  bottom: 15px;
  right: 28px;
  width: 150px;
  z-index: 4;
  border: none;
  border-radius: 10px;
  z-index: 4;
}

/* The popup form - hidden by default */
.form-popup {
  display: none;
  position: fixed;
  bottom: 10px;
  right: 15px;
  border: 3px solid #f1f1f1;
  z-index: 9;
}

/* Add styles to the form container */
.form-container {
  width: 300px;
  padding: 15px;
  background-color: white;
  height: auto;
  overflow-y: auto;
}

/* Set a style for the add/clear button */
.form-container .btn {
  background-color: #04aa6d;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom: 10px;
  opacity: 0.8;
}

/* Add a red background color to the cancel button */
.form-container .cancel {
  background-color: red;
}

/* Add some hover effects to buttons */
.form-container .btn:hover,
.open-button:hover {
  opacity: 1;
}

.emoji {
  font-size: 2.7rem;
  text-shadow: 0 -0.5rem 1rem #faf5f5, 0 0.5rem 1rem #999;
}

.emoji-hover:hover {
  transform: scale(1.2);
  /* Increase the size on hover */
  transition: transform 0.3s ease;
  /*Add a smooth transition */
}

#radios label {
  cursor: pointer;
  position: relative;
}

.inventory-qty {
  height: 52px;
  /* width: 60px; */
  aspect-ratio: 1/1;
  background-color: rgba(255, 255, 255, 0.7);
}

input[type="radio"] {
  opacity: 0;
  /* hidden but still tabable */
  position: absolute;
  z-index: 9;
  border: 0px;
  width: 100%;
  height: 2em;
}

input[type="radio"] + span {
  font-family: "Material Icons";
  color: #b3cefb;
  border-radius: 50%;
  padding: 12px;
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
}

input[type="radio"]:checked + span {
  color: #d9e7fd;
  background-color: #b3cefb;
}

#close {
  overflow: hidden;
  position: relative;
  border: 1px;
  padding: 0;
  width: 2em;
  border-radius: 50%;
  background: transparent;
  color: #1da1f2;
  text-indent: 100%;
  cursor: pointer;
  left: 2rem;
  bottom: 0.5rem;
}

#close:focus {
  outline: solid 0 transparent;
  box-shadow: 0 0 0 2px #8ed0f9;
}

#close:hover {
  background: rgba(29, 161, 142, 0.1);
}

#close:before,
#close:after {
  position: absolute;
  top: 15%;
  left: calc(50% - 0.0625em);
  width: 0.125em;
  height: 70%;
  border-radius: 0.125em;
  transform: rotate(45deg);
  background: currentcolor;
  content: "";
}

#close:after {
  transform: rotate(-45deg);
}

#counter button {
  background-color: transparent;
  outline: none;
  color: black;
}
</style>
