<template>
    <div id="app">
      <div class="lottie-wrapper">
        <div class="lottie-container" ref="lottie"></div>
      </div>
    </div>
    <div class="text">
        <h2>Thank you!</h2>
        <h3>Your order has been received.</h3>
    </div>
    <router-link to="/marketplace">
        <button type="button" class="btn btn-success btn-lg" style="margin-top: -10%;">Continue Shopping</button>
    </router-link>
  </template>
  
  <script>
  import lottie from 'lottie-web';
  import animationData from '@/assets/img/confirmation.json'; // Update the path accordingly
  
  export default {
  mounted() {
    this.animation = lottie.loadAnimation({
      container: this.$refs.lottie,
      animationData: animationData,
      renderer: 'svg',
      loop: true,
      autoplay: true,
    });
  },
};
</script>
<style scoped>
.lottie-wrapper {
  padding-top: 40px;
}
.lottie-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 50vh;
  margin: 0px auto 0;
  background-color: #FAF9F6;

}

h2{
    margin-top: 65px;
    font-weight: bold;

}
h3 {
	margin-top: 20px;
	margin-bottom: 8%;
	text-align: center;
	color: #9ea4a6;
    font-size: 1.5rem;
}

</style>

  