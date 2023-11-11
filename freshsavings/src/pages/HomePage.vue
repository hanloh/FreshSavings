<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <section
    class="container-fluid position-relative overflow-hidden px-0 section-vh">
    <video
      autoplay
      muted
      loop
      :poster="require('@/assets/img/food_packing.webp')"
      class="object-fit-cover h-100 w-100">
      <source
        :src="require('@/assets/img/food_packing.webm')"
        type="video/webm" />
    </video>

    <div
      class="position-absolute top-50 glass-container col-12 col-md-7 col-xl-5">
      <div
        class="px-3 py-4 d-flex flex-column justify-content-center align-items-center glass-effect">
        <h1 class="mb-4">Save food, save money, save the planet.</h1>
        <p class="w-75 mb-4" style="text-wrap: balance">
          Food waste poses a dire threat to our environment and global
          resources. Join us to take an active stance against food waste today.
        </p>
        <a
          href="/signup"
          role="button"
          class="btn btn-outline-light align-self-center">
          <span class="pe-2">Kickstart your journey now</span>
          <Icon icon="solar:cup-star-outline" height="24" width="24" />
        </a>
      </div>
      <div class="col col-md-6 px-0"></div>
    </div>
  </section>

  <section class="container-fluid bg-custom">
    <div class="container row py-5 mx-auto">
      <h1 class="mb-3">The ideal assistant in your kitchen</h1>
      <div class="row row-cols-1 row-cols-md-3 g-2">
        <div
          class="col mb-4"
          v-for="feature in featuresAndDescriptions"
          :key="feature">
          <div
            class="p-3 h-100 d-flex justify-content-between align-items-start flex-column">
            <div class="d-flex justify-content-start flex-column">
              <img
                :src="require(`@/assets/img/${feature.imageUrl}`)"
                class="object-fit-contain icon-glass-bg p-2 mb-3"
                height="80"
                width="80" />
              <h5 class="text-start fw-semibold">{{ feature.feature }}</h5>
              <p class="text-start w-md-75" style="text-wrap: balance">
                {{ feature.description }}
              </p>
            </div>
            <a
              :href="'#anchor-' + feature.redirect"
              class="btn btn-success"
              role="button">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- inventory-tracker -->
  <section class="container-fluid p-0">
    <span class="anchor" id="anchor-inventory-tracker"></span>
    <div class="parallax pb-5">
      <div class="container">
        <h1 class="pt-5 text-light fw-bold">Inventory Tracker</h1>
        <div class="row my-3 row-cols-1 py-3">
          <div class="col">
            <div class="row row-cols-2 row-cols-lg-4 flex-wrap g-3">
              <div
                class="col order-lg-1"
                :class="[{ 'order-2': i <= 2 }, { 'order-5': i > 2 }]"
                v-for="i in 6"
                :key="cards[i]"
                style="aspect-ratio: 1/1">
                <div
                  style="background: white"
                  class="rounded-4 p-3 d-flex flex-column justify-content-between shadow h-100">
                  <div
                    class="d-flex justify-content-between align-items-center">
                    <div style="font-size: 72px" class="text-start">
                      {{ cards[i].icon }}
                    </div>
                    <div
                      class="p-2 rounded-circle lh-1 fs-5 fw-bold d-flex justify-content-center align-items-center inventory-qty"
                      style="color: black">
                      x{{ cards[i].qty }}
                    </div>
                  </div>
                  <div>
                    <div class="text-start fs-5 fw-semibold">
                      {{ cards[i].item }}
                    </div>
                    <div class="text-start text-secondary-emphasis">
                      Fresh for {{ cards[i].expiry }} more days
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 col-lg-6 order-3">
                <h1
                  class="rounded-4 p-5 p-lg-3 d-flex justify-content-center align-items-center fw-bold fs-1 shadow h-100 glass-card text-light">
                  Add your items and never forget about them...
                </h1>
              </div>

              <div class="col-12 col-lg-6 order-5">
                <h1
                  class="rounded-4 p-5 p-lg-3 d-flex justify-content-center align-items-center fw-bold fs-1 shadow h-100 glass-card text-light">
                  ...and get notified when they are about to expire
                </h1>
              </div>

              <div class="col order-5" style="aspect-ratio: 1/1">
                <div
                  class="rounded-4 p-3 shadow h-100 d-flex justify-content-center align-items-center"
                  style="background: white">
                  <img
                    :src="require('@/assets/img/notification.gif')"
                    class="img-fluid" />
                </div>
              </div>

              <div
                class="col order-5"
                v-for="i in 5"
                :key="cards[i + 6]"
                style="aspect-ratio: 1/1">
                <div
                  style="background: white"
                  class="rounded-4 p-3 d-flex flex-column justify-content-between shadow h-100">
                  <div
                    class="d-flex justify-content-between align-items-center">
                    <div style="font-size: 72px" class="text-start">
                      {{ cards[i + 6].icon }}
                    </div>
                    <div
                      class="p-2 rounded-circle lh-1 fs-5 fw-bold d-flex justify-content-center align-items-center inventory-qty"
                      style="color: black">
                      x{{ cards[i + 6].qty }}
                    </div>
                  </div>
                  <div>
                    <div class="text-start fs-5 fw-semibold">
                      {{ cards[i + 6].item }}
                    </div>
                    <div class="text-start text-secondary-emphasis">
                      Fresh for {{ cards[i + 6].expiry }} more days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- recipe-generator -->
    <span class="anchor" id="anchor-recipe-generator"></span>
    <div class="parallax pb-5" id="parallax-recipe-generator">
      <div class="container">
        <h1 class="fw-bold text-start text-light pt-5 pb-4">
          Recipe Generator
        </h1>
        <div class="d-flex justify-content-end mb-4">
          <div class="icon-glass-bg speech top p-4">
            <h2 class="m-0">
              Never worry about what you can cook with our Recipe Generator
            </h2>
          </div>
        </div>
        <div class="accordion col-12 col-md-9 col-lg-7 col-xl-6">
          <div class="accordion-item">
            <div class="accordion-header">
              <button
                type="button"
                class="accordion-button fs-3 fw-semibold"
                data-bs-toggle="collapse"
                data-bs-target="#collapse"
                aria-expanded="true"
                aria-control="collapse">
                It is as easy as selecting
              </button>
              <div id="collapse" class="accordion-collapse collapse show">
                <div class="accordion-body p-3">
                  <button
                    type="button"
                    class="btn text-light bg-success m-1 p-2 fs-5">
                    the
                    <span class="badge rounded-pill text-bg-warning">3</span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success m-1 p-2 active fs-5"
                    data-bs-toggle="button">
                    ingredients
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success m-1 p-2 active fs-5"
                    data-bs-toggle="button">
                    you
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success m-1 p-2 fs-5"
                    data-bs-toggle="button">
                    want
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success m-1 p-2 fs-5"
                    data-bs-toggle="button">
                    to
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-success m-1 p-2 fs-5"
                    data-bs-toggle="button">
                    use
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 d-flex justify-content-end">
          <div class="paper rounded-3 p-3">
            <h3 class="paper-content text-start fs-3 fw-semibold p-2">
              and we will recommend suitable recipes for you!
            </h3>
          </div>
        </div>
      </div>
    </div>

    <!-- marketplace -->
    <span class="anchor" id="anchor-marketplace"></span>
    <div class="parallax pb-5" id="parallax-marketplace">
      <div class="container-fluid">
        <h1 class="fw-bold text-middle text-light pt-5 pb-4">Marketplace</h1>
        <div class="row row-cols-2 row-cols-lg-4">
          <div class="p-2">
            <div class="css-card col p-0 order-3 order-lg-1">
              <img
                :src="require('@/assets/img/banana.webp')"
                class="img-fluid object-fit-cover" />
            </div>
          </div>
          <div class="p-2">
            <div class="css-card col p-0 order-3 order-lg-1">
              <img
                :src="require('@/assets/img/yoghurt.webp')"
                class="img-fluid object-fit-cover" />
            </div>
          </div>
          <div class="p-2">
            <div class="css-card col p-0 order-3 order-lg-1">
              <img
                :src="require('@/assets/img/salmon.webp')"
                class="img-fluid object-fit-cover" />
            </div>
          </div>
          <div class="p-2">
            <div class="css-card col p-0 order-3 order-lg-1">
              <img
                :src="require('@/assets/img/orange.avif')"
                class="img-fluid object-fit-cover" />
            </div>
          </div>
          <div class="col p-0 order-3 order-lg-1">
            <div class="p-2 mb-2">
              <div class="css-card col">
                <img
                  :src="require('@/assets/img/shrimp.jpg')"
                  class="img-fluid object-fit-cover" />
              </div>
            </div>
            <div class="p-2">
              <div class="css-card col">
                <img
                  :src="require('@/assets/img/kiw.jpeg')"
                  class="img-fluid object-fit-cover" />
              </div>
            </div>
          </div>
          <div class="col p-0 order-3 order-lg-1">
            <div class="p-2 mb-2">
              <div class="css-card col">
                <img
                  :src="require('@/assets/img/cabbage.webp')"
                  class="img-fluid object-fit-cover" />
              </div>
            </div>
            <div class="p-2">
              <div class="css-card col">
                <img
                  :src="require('@/assets/img/butter.avif')"
                  class="img-fluid object-fit-cover" />
              </div>
            </div>
          </div>

          <div class="px-2 my-2 w-50 order-2" id="marketplace-card">
            <div
              class="rounded-4 glass-card h-100 px-4 py-5 text-light d-flex justify-content-center align-items-center flex-column">
              <h2 class="mb-4 pb-3">
                Have food that you don't think you can finish before it expires?
              </h2>
              <h3 class="fw-light fs-4">
                Sell it to others in our marketplace and ensure it does not go
                to waste.
              </h3>
              <hr class="w-100" />
              <h2>
                Similarly, buy from others and enjoy greater savings as well.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      featuresAndDescriptions: [
        {
          feature: "Inventory Tracker",
          description:
            "Keeping track of your groceries with our Inventory Tracker means that you never have to discard expired food items anymore.",
          imageUrl: "shelf.webp",
          redirect: "inventory-tracker",
        },
        {
          feature: "Recipe Generator",
          description:
            "Need inspiration on what to cook? Simply select the ingredients you have and our Recipe Generator will do the rest for you.",
          imageUrl: "recipe_book.webp",
          redirect: "recipe-generator",
        },
        {
          feature: "Marketplace",
          description:
            "Gone are the days of discarding expired food items. Be notified when items are expiring, and let us help you sell them should you want to.",
          imageUrl: "trade.webp",
          redirect: "marketplace",
        },
      ],
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
        {
          icon: "🍍",
          qty: 2,
          item: "Pineapples",
          expiry: 3,
          background:
            "linear-gradient(135deg, rgb(255, 239, 184) 0%, rgb(251, 220, 113) 100%)",
          qty_color: "rgb(252, 224, 130)",
        },
        {
          icon: "🍅",
          qty: 2,
          item: "Tomatoes",
          expiry: 8,
          background:
            "linear-gradient(135deg, rgb(255, 200, 143) 0%, rgb(255, 143, 143) 100%)",
          qty_color: "rgb(255, 166, 143)",
        },
        {
          icon: "🥕",
          qty: 6,
          item: "Carrots",
          expiry: 14,
          background:
            "linear-gradient(135deg, rgb(255, 232, 188) 0%, rgb(255, 156, 84) 100%)",
          qty_color: "rgb(255, 187, 129)",
        },
        {
          icon: "🍇",
          qty: 3,
          item: "Grapes",
          expiry: 5,
          background:
            "linear-gradient(135deg, rgb(234, 216, 253) 0%, rgb(178, 143, 255) 100%)",
          qty_color: "rgb(192, 160, 255)",
        },
        {
          icon: "🍋",
          qty: 5,
          item: "Lemons",
          expiry: 7,
          background:
            "linear-gradient(135deg, rgb(255, 255, 178) 0%, rgb(213, 213, 73) 100%)",
          qty_color: "rgb(221, 221, 45)",
        },
        {
          icon: "🥑",
          qty: 2,
          item: "Avocadoes",
          expiry: 4,
          background:
            "linear-gradient(135deg, rgb(202, 255, 178) 0%, rgb(131, 255, 143) 100%)",
          qty_color: "rgb(166, 255, 160)",
        },

        {
          icon: "🍓",
          qty: 4,
          item: "Strawberries",
          expiry: 3,
          background:
            "linear-gradient(135deg, rgb(255, 178, 178) 0%, rgb(255, 102, 102) 100%)",
          qty_color: "rgb(255, 140, 140)",
        },
        {
          icon: "🍌",
          qty: 6,
          item: "Bananas",
          expiry: 4,
          background:
            "linear-gradient(135deg, rgb(255, 255, 202) 0%, rgb(221, 221, 77) 100%)",
          qty_color: "rgb(217, 217, 133)",
        },
        {
          icon: "🍎",
          qty: 3,
          item: "Apples",
          expiry: 7,
          background:
            "linear-gradient(135deg, rgb(255, 202, 202) 0%, rgb(255, 131, 131) 100%)",
          qty_color: "rgb(255, 166, 166)",
        },
        {
          icon: "🍊",
          qty: 5,
          item: "Oranges",
          expiry: 6,
          background:
            "linear-gradient(135deg, rgb(255, 232, 188) 0%, rgb(255, 178, 84) 100%)",
          qty_color: "rgb(255, 205, 136)",
        },
        {
          icon: "🍐",
          qty: 2,
          item: "Pears",
          expiry: 5,
          background:
            "linear-gradient(135deg, rgb(232, 255, 188) 0%, rgb(134, 217, 33) 100%)",
          qty_color: "rgb(162, 227, 72)",
        },
        {
          icon: "🍉",
          qty: 1,
          item: "Watermelon",
          expiry: 3,
          background:
            "linear-gradient(135deg, rgb(255, 189, 189) 0%, rgb(255, 75, 75) 100%)",
          qty_color: "rgb(255, 140, 140)",
        },
        {
          icon: "🍑",
          qty: 4,
          item: "Peaches",
          expiry: 4,
          background:
            "linear-gradient(135deg, rgb(255, 202, 143) 0%, rgb(255, 143, 84) 100%)",
          qty_color: "rgb(255, 172, 113)",
        },
        {
          icon: "🍒",
          qty: 3,
          item: "Cherries",
          expiry: 6,
          background:
            "linear-gradient(135deg, rgb(255, 143, 202) 0%, rgb(255, 84, 178) 100%)",
          qty_color: "rgb(255, 113, 190)",
        },

        {
          icon: "🍈",
          qty: 2,
          item: "Melons",
          expiry: 4,
          background:
            "linear-gradient(135deg, rgb(232, 255, 202) 0%, rgb(118, 198, 40) 100%)",
          qty_color: "rgb(156, 217, 92)",
        },
        {
          icon: "🍠",
          qty: 5,
          item: "Sweet Potatoes",
          expiry: 7,
          background:
            "linear-gradient(135deg, rgb(255, 216, 188) 0%, rgb(255, 140, 84) 100%)",
          qty_color: "rgb(255, 178, 136)",
        },
        {
          icon: "🥒",
          qty: 3,
          item: "Cucumbers",
          expiry: 5,
          background:
            "linear-gradient(135deg, rgb(202, 255, 202) 0%, rgb(131, 255, 131) 100%)",
          qty_color: "rgb(166, 255, 166)",
        },
        {
          icon: "🍆",
          qty: 4,
          item: "Eggplants",
          expiry: 6,
          background:
            "linear-gradient(135deg, rgb(202, 178, 255) 0%, rgb(131, 102, 255) 100%)",
          qty_color: "rgb(166, 140, 255)",
        },
      ],
      marketplaceCards: [
        {
          imgSrc: "1",
          itemTitle: "2",
          itemQty: "3",
        },
      ],
    };
  },
};
</script>

<!--Save food, save money, save the planet.-->

<style scoped>
a {
  width: fit-content;
}

.anchor {
  scroll-margin-top: 58px;
}

.section-vh {
  height: calc(100vh - 74px) !important;
}

.card-shadow {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.glass-container {
  left: 0;
  height: 50%;
  /* bottom: 0; */

  @media (min-width: 768px) {
    left: 100px;
    /* top: 50%; */
    height: auto;
    transform: translateY(-50%);
  }
}

.glass-effect {
  height: 100%;
  border-radius: 16px 16px 0 0;

  /* From https://css.glass */
  background: rgba(80, 142, 70, 0.4);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(7.2px);
  -webkit-backdrop-filter: blur(7.2px);
  border: 1px solid rgba(80, 142, 70, 0.32);

  & > :not(a) {
    color: white;
  }

  @media (min-width: 768px) {
    border-radius: 16px;
  }
}

.glass-card {
  /* From https://css.glass */
  background: rgba(76, 76, 76, 0.4);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.1px);
  -webkit-backdrop-filter: blur(6.1px);
  border: 1px solid rgba(255, 255, 255, 0.23);
}

.icon-glass-bg {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6.1px);
  -webkit-backdrop-filter: blur(6.1px);
  border: 1px solid rgba(255, 255, 255, 0.23);
}

.inventory-qty {
  height: 52px;
  aspect-ratio: 1/1;
  background-color: rgba(255, 255, 255, 0.7);
}

.bg-custom {
  background-image: linear-gradient(
    to right top,
    #ffffe9,
    #fbffe4,
    #f5ffdf,
    #eeffdb,
    #e6ffd8,
    #daffde,
    #cfffe4,
    #c5feec,
    #c1fbf9,
    #c5f6ff,
    #d0f0ff,
    #dceaff
  );
}

.custom-viewheight {
  height: 300vh;
}

.parallax {
  /* The image used */
  background-image: url("../assets/img/food_on_table.webp");

  /* Set a specific height */
  min-height: 100%;

  /* Create the parallax scrolling effect */
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  /* Turn off parallax scrolling for all tablets and phones. Increase/decrease the pixels if needed */
  @media only screen and (max-device-width: 991px) {
    background-attachment: scroll;
  }

  &#parallax-recipe-generator {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("../assets/img/cooking.webp") no-repeat fixed center;
    background-size: cover;
  }

  &#parallax-marketplace {
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url("../assets/img/grocery_store_aisle.webp") no-repeat fixed center;
    background-size: cover;
  }
}

.paper {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 280px;
  background: #fafafa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  @media (min-width: 767px) {
    width: 80%;
  }
}

.paper:before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40px;
  background: radial-gradient(#575450 6px, transparent 7px) repeat-y;
  background-size: 30px 30px;
  border-right: 3px solid #d44147;
  box-sizing: border-box;
}

.paper-content {
  position: absolute;
  top: 30px;
  right: 0;
  bottom: 30px;
  left: 40px;
  background: linear-gradient(transparent, transparent 36px, #91d1d3 36px);
  background-size: 38px 38px;
}

/* (A) SPEECH BOX */
.speech {
  color: #fff;
  position: relative;
  padding: 20px;
  border-radius: 10px;
}

.speech::after {
  content: "";
  border: 20px solid transparent;

  position: absolute;
}

.top.speech::after {
  border-bottom-color: rgba(255, 255, 255, 0.18);
  border-top: 0;

  top: -21px;
  right: 8%;
}

.css-card {
  position: relative;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.css-card svg {
  fill: #333;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.css-card:hover {
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
}

.card__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  transform: translateY(350px);
  transform-origin: bottom;
  transition: all 0.2s cubic-bezier(0.175, 0.5, 0.32, 1);
}

.css-card:hover .card__content {
  transform: rotateX(0deg);
}

.card__title {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 700;
}

.css-card:hover svg {
  scale: 0;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #777;
  line-height: 1.4;
}

#marketplace-card {
  width: 100% !important;

  @media (min-width: 992px) {
    width: 50% !important;
  }
}
</style>
