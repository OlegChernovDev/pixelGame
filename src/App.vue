<template>
  <div id="app" class="nes-container with-title is-centered">


  <transition name="fade">
    <div v-if="$store.state.show_notification" class="nes-container with-title is-centered notification-award">
      <p class="title">Опа</p>
      <p>Вы получили новое достижение!</p>
      <a href="javascript:void(0)" class="nes-btn is-primary" @click="openAward()">Чек</a>

    </div>
  </transition>
<div class="header-block">
    <div class="is-beetwin">
        <h1>{{ $store.state.lang.name }} 2.0</h1>
    </div>

        <h1 class="is-centered">{{ $store.state.lang.money }} - {{ coins }}</h1>
        <div class="nes-container">
            <div class="is-left">
                <div class="nes-block">
                    {{ $store.state.lang.currency }} - {{ currency }}<br>
                    {{ per_sec }}/{{ $store.state.lang.per_sec }}
                </div>
                <button @click="click" class="nes-btn is-success" id="click">+ {{ $store.state.byClick }}</button><br><br>
            </div>
        </div>
</div>

        <div class="nes-container is-left is-body">
            <div v-for="item in $store.state.levels">
                <div class="nes-block">{{ item.text }}<br> [{{ item.count }}] + {{
                    reduce_num((item.auto_coins * $store.state.amount_select).toFixed(5), 5) }}</div>
                <button @click="buyAuto(item.price * $store.state.amount_select, $event)" v-bind:data-id="item.id" class="nes-btn" v-bind:class="$store.state.coins < item.price  * $store.state.amount_select ? 'is-disabled' : ''">{{ reduce_num((item.price * $store.state.amount_select).toFixed(5), 5) }}</button>
            </div>
        </div>

        <div class="is-beetwin is-panel">
            <div><button class="nes-btn is-primary" @click="openShop">{{ $store.state.lang.shop }}</button></div>
            <div><button class="nes-btn is-primary" @click="openSetting">{{ $store.state.lang.setting }}</button></div>

            <div></div>
            <div>
                <span>{{ $store.state.lang.amount_by }}</span>
                <select class="nes-btn" v-model="$store.state.amount_select">
                    <option v-for="option in $store.state.amount" v-bind:value="option.value" @click="updateAmount(option.value)">{{ option.value }}</option>
                </select>
            </div>
        </div>



<!--SETTING-->
<Modal ref="setting">
    <p class="title">Настройки</p>
    <p><a href="https://yandex.ru/games/app/97415" class="nes-btn is-success">Оставить отзыв</a></p>
    <p><a href="javascript:void(0)" @click="restart" class="nes-btn is-error">Очистить</a></p>
    <p><a href="javascript:void(0)" @click="closeSetting" class="nes-btn is-primary">{{ $store.state.lang.close }}</a></p>

</Modal>
<!--END SETTING-->

<!--REWARDED-->
<Modal ref="reward" id="reward">
    <p class="title">Дополнительные коины</p>
    <p>Получите {{ reward_coins }} коинов</p>
    <p><a href="javascript:void(0)" @click="reward" class="nes-btn is-success"> Получить коины </a></p>
    <p><a href="javascript:void(0)" @click="closeReward" class="nes-btn is-primary">{{ $store.state.lang.close }}</a></p>
</Modal>
<!--END REWARDED-->

<!--ERROR REWARD-->
<Modal ref="errorReward">
    <div class="nes-container is-centered with-title">
        <p class="title">Упс...</p>
        <p>Кажется что-то пошло не так, попробуйте позже</p>
        <p><a href="javascript:void(0)" @click="closeErrorReward" class="nes-btn is-primary">{{ $store.state.lang.close }}</a></p>
    </div>
</Modal>
<!--END ERROR REWARD-->

<!--SHOP-->
<Modal ref="shop">
    <p class="title">{{ $store.state.lang.shop }}</p>
    <p>{{ $store.state.lang.my_currency }} - {{ currency }}</p>
    <p>{{ $store.state.lang.my_money }} - {{ coins }}</p>
    <p>{{ $store.state.lang.coin_price }} - {{ course_rub }} {{ $store.state.lang.currency }}</p>
    <p>{{ $store.state.lang.change_24 }} - {{ change_24 }} {{ $store.state.lang.currency }}</p><br>
    <p>
        <a href="javascript:void(0)" class="nes-btn is-primary" @click="openAward()">Награды</a>
        <a href="javascript:void(0)" @click="openReward" class="nes-btn is-warning">Получить коины</a>
        <a href="javascript:void(0)" @click="openGambling" class="nes-btn is-warning">Рулетка</a>
    </p>
    <p>
        <div class="nes-field">
            <label for="coins">{{ $store.state.lang.money }}</label>
            <input type="number" id="coins" class="nes-input sell-input" @input="sell_coins" @keypress="isNumber($event)" value="1">
        <a href="javascript:void(0)" class="nes-btn is-success close-btn" @click="sell" v-bind:class="$store.state.coins <  $store.state.sell_coins ? 'is-disabled' : ''">{{ $store.state.lang.sell_off }}</a>
        </div>
        <a href="javascript:void(0)" class="nes-btn is-primary close-btn" @click="closeShop">{{ $store.state.lang.close }}</a>
    </p>
</Modal>
<!--END SHOP-->

<Modal ref="award">
    <Awards></Awards>
    <a href="javascript:void(0)" class="nes-btn is-primary close-btn" @click="closeAward">{{ $store.state.lang.close }}</a>
</Modal>

<!--OFFLINE-->
<Modal ref="offline" id="offline">
    <p class="title">{{ $store.state.lang.message }}</p>
    <p>Братан, пока тебя не было, мы присмотрели.</p>
    <p>{{ $store.state.coins_offline.toFixed(5) }}</p>
    <p><a href="javascript:void(0)" class="nes-btn is-primary close-btn" @click="closeOffline">{{ $store.state.lang.close }}</a></p>    
</Modal>
<!--END OFFLINE-->

<!--OFFLINE-->
<Modal ref="gambling" id="gambling">
    <Gambling></Gambling> 
    <a href="javascript:void(0)" @click="closeGambling" class="nes-btn is-warning">Закрыть</a>
</Modal>
<!--END OFFLINE-->

  </div>
</template>

<script>

    import Modal from './components/Modal.vue'
    import Awards from './components/Awards.vue'
    import Gambling from './components/Gambling.vue'
    import store from './store'
    import api from '@/api/idb.js'

    export default {
        name: 'App',
        components: { Modal, Awards, Gambling },
        methods: {
            chng: function () {
                store.commit('changeShowNotification')
            },
               isNumber: function(evt) {
        
              evt = (evt) ? evt : window.event;
              var charCode = (evt.which) ? evt.which : evt.keyCode;
              if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                evt.preventDefault();;
              } else {
                return true;
              }
            },
            updateAmount: function (e) {
                store.commit('updateAmount', e);
            },
            click: function() {
                store.commit('click');
                store.dispatch('save');
            },
            buyAuto: function(price, e) {
                store.commit('buyAuto',{ price: price, id: e.target.dataset.id})
            },
            sell_coins: function (e) {
                store.commit('updateSellCoins', e.target.value);
            },
           sell: function () {
                if (store.state.sell_coins <= store.state.coins && store.state.sell_coins > 0) {
                  store.commit('sellCoins')  
                }
            },
            restart: function() {
                let tx = db.transaction(['data'], 'readwrite');
                let storeData = tx.objectStore('data');

                storeData.clear();
                
                document.location.reload(true);
            },
            reward: function() {
                ysdkG.adv.showRewardedVideo({
                    callbacks: {
                        onOpen: () => {
                            console.log('Video ad open.');
                        },
                        onRewarded: () => {
                            console.log('Rewarded!');
                            store.commit('getReward')

                            this.$refs.reward.$el.style.display = 'none';
                        },
                        onClose: () => {
                            
                        },
                        onError: (e) => {
                            this.$refs.errorReward.$el.style.display = 'block';
                            this.$refs.reward.$el.style.display = 'none';
                            console.log('Error while open video ad:', e);
                        }
                    }
                });
            },
            openSetting: function () {
                this.$refs.setting.$el.style.display = 'block';
            },
            closeSetting: function () {
                this.$refs.setting.$el.style.display = 'none';
            },
            openShop: function () {
                this.$refs.shop.$el.style.display = 'block';
            },
            closeShop: function () {
                this.$refs.shop.$el.style.display = 'none';
            },
            openReward: function () {
                this.$refs.shop.$el.style.display = 'none';
                this.$refs.reward.$el.style.display = 'block';
            },
            closeReward: function () {
                this.$refs.reward.$el.style.display = 'none';
            },
            openGambling: function () {
                this.$refs.gambling.$el.style.display = 'block';
            },
            closeGambling: function () {
                this.$refs.gambling.$el.style.display = 'none';
            },
            closeErrorReward: function () {
                this.$refs.errorReward.$el.style.display = 'none';
            },
            closeOffline: function () {
                this.$refs.offline.$el.style.display = 'none';
            },
            openAward: function () {
                
                this.$refs.award.$el.style.display = 'block';
            },
            closeAward: function () {
                this.$refs.award.$el.style.display = 'none';
            },
            open: function () {
                this.$refs.errorReward.$el.style.display = 'block';
            },
            reduce_num: (val, decimals1 = 2) => {
                let postfixes  = ["", "к", "лям", "ярд", "трлн", "квдн", "квн", "sext", "sept", "octi", "quin", "deci", "ande", "duod", "tred", "quat", "quin", "seks", "sept", "octo", "newm", "vigi", "anvi", "dovi", "trev", "quat", "quin", "sexv", "sept", "octo", "newm", "trig", "оч много", ];
                
                let numb = parseFloat(val)
                let decimals = 2;

                if (numb < 0.01) {
                    decimals = 5;
                }

                const components = numb.toExponential(decimals).split("e");

                const roundValTo = (numb, roundTo) => { return Math.floor(numb/roundTo)*roundTo };
                const getPostFix = (exp) => { return postfixes[Math.floor(exp/3)] };
                let [str, exp] = components;

                exp = parseInt(exp);

                str = (numb / Math.pow(10, roundValTo(Math.max(0, exp), 3))).toFixed(decimals) + getPostFix(Math.max(0, exp));

                return str;
            }
        },
        computed: {
            coins: function () {
                return this.reduce_num(store.state.coins.toFixed(5));
            },
            currency: function () {
                return this.reduce_num(store.state.currency.toFixed(5))
            },
            per_sec: function () {
                return this.reduce_num(store.state.auto_coins.toFixed(5), 5)
            },
            change_24: function () {
                return store.state.course.rub_24h_change.toFixed(5)
            },
            course_rub: function () {
                return store.state.course.rub;
            },
            reward_coins: function () {
                return store.state.reward_coins.toFixed(5)
            }
        }
    }

window.onload = () => {

    store.dispatch('load');

    setInterval(() => {
        store.commit('checkAwardsCoins');
    }, 200);

    setInterval(() => {
        store.commit('setReward');
        store.commit('auto');
        localStorage.setItem('date', new Date);

        //store.commit('checkAwardsCoins');
        
        store.dispatch('save');
    }, 1000);

    setInterval(() => {
        if (store.state.reward_coins > 0) {
            document.querySelector('#reward').style.display = 'block';
        }
    }, 120 * 1000);

    setTimeout(function() {
        store.watch(
            function (state) {
                return state.awards.coins;
            },
            function (newState, oldState) {
                store.commit('changeShowNotification');

                setTimeout(() => {
                    store.commit('changeShowNotification');
                }, 2500)
            },
            {
                deep: true //add this if u need to watch object properties change etc.
            });
    }, 600)
}

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=4new&vs_currencies=rub&include_24hr_change=true')
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            store.commit('setCourse', json['4new']);
        });    


</script>

<style scoped>
.notification-award {
    width: 100%;
    position: fixed;
    z-index: 101;
    background: white;
    margin: 0;
    left: 0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;

}

    .close-btn {
        margin: 5px;
    }

    .sell-input {
        width: 70%;
        display: inline-block;
    }

    .is-panel span {
    display: inline-block;
}

.header-block {
    position: sticky;
    top: 0;
    min-height: 2em;
    background: white;
    z-index: 1;
}
</style>
