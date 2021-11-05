<template>
	<div class="award-root">

		<div v-for="item in $store.state.awards.coins" class="nes-container award" :class="{ 'earned-award': item.earned}">
			<div class="wrapper">
			  
			  <div class="box a">
			  	<img :src="item.img" alt="">
			  </div>

			  <div class="box b"><h2 class="nes-text is-primary">{{ item.text }}</h2></div>
			  <div class="box c">За {{ item.value }} коинов | + {{ item.byClick }} за клик</div>
			</div>

			</div>

		</div>
	</div>
</template>

<script>
	import store from '../store'

	export default {
		name: 'Awards'
	}
</script>

<style scoped>
	img {
		width: 30px;
	}

	.wrapper {
	    display: grid;
	    grid-gap: 1px;
		grid-template-columns: 50px 100%-100px;
	}
	.a {
    
		grid-column: 1 / 2;
		grid-row: 1 / 3;
	}
	.b {
    		grid-column: 2 / 4;
		grid-row: 1;

	}
	.c {
		grid-column: 2 / 4 ;
		grid-row: 2 ;
	}

	.award-root {
		max-height: 370px;
		overflow: auto;
	}
	.award {

		-webkit-filter: grayscale(100%);
  		filter: grayscale(100%);
		padding: 10px;
		text-align: left;
		margin-bottom: 20px;
	}

	.earned-award {
		-webkit-filter: grayscale(0%);
  		filter: grayscale(0%);
	}
</style>