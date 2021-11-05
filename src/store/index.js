import Vue from 'vue'
import Vuex from 'vuex'

import Awards from './awards.js'
import Levels from './levels.js'
import Lang from './lang.js'
import api from '@/api/idb.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        coins: 0,
        byClick: 0.0001,
        currency: 0,     //валюта
        auto_coins: 0,   //коинов автоматический 
        //prestige_count: 0,
        coins_offline: 0,//коинов за время в оффлайн
        sell_coins: 0,   //кол-во продаваемых коинов
        amount_select: 1,
        reward_coins: 0,
        show_notification: false,
        awards: Awards,
        amount: [
            { value: 1 },
            { value: 10 },
            { value: 25 },
            { value: 50 },
            { value: 100 }
        ],
        levels: Levels,
        course: {
            rub: 0,
            rub_24h_change: 0
        },
        lang: Lang,
        
        money: 100,
        win_count: 0,
        defeat_count: 0
    },
    mutations: {
        win: (state, data) => { //data -> {coef: [number]; rate: [number]}
            state.money += data.coef * data.rate;
            state.win_count++;
        },
        defeat: (state, data) => {
            state.money -= data.rate
            state.defeat_count++;
        },
        setState: function (state, data) {
            this.replaceState(data)
        },
        changeShowNotification: function (state) {
            state.show_notification = !state.show_notification;
        },
    	click: function(state) {
    		state.coins += state.byClick;
    	},
    	auto: function (state) { //tik function
    		state.coins += state.auto_coins;
    	},
    	buyAuto: function (state, data) {
    		let price = data.price;
    		let id = data.id;

    		if (state.coins >= price) {
 				state.coins -= state.levels[id].price * state.amount_select;
                state.levels[id].price = (state.levels[id].price * state.amount_select) + (state.levels[id].price / 100 * 30);
                state.auto_coins += state.levels[id].auto_coins * state.amount_select;
                state.levels[id].count += 1 * state.amount_select;
    		}
    	},
    	updateAmount: function (state, amount) {
    		state.amount_select = amount;
    	},
    	updateOffline: function (state, offline) {
    		state.coins += offline;
    		state.coins_offline = offline;
    	},
    	getReward: function (state) {
    		state.coins += state.reward_coins
    	},
    	setReward: function (state) {
    		state.reward_coins = state.coins * 1.8
    	},
    	updateSellCoins: function (state, coins) {
    		state.sell_coins = coins;
    	},
        sellCoins: function (state) {
            state.currency += state.sell_coins * state.course.rub;
            state.coins -= state.sell_coins;
        },
    	setCourse: function (state, course) {
    		state.course = course;
    	},
    	setState: function (state, savedState) {
    		this.replaceState(savedState)
    	},
        checkAwardsCoins: function (state) {
            let i = 0;
            while (i < state.awards.coins.length) {
              if(state.awards.coins[i].earned == false) {

                  if (state.coins >= state.awards.coins[i].value) {
                      state.awards.coins[i].earned = true
                      state.byClick = state.awards.coins[i].byClick
                  }

              }
              i++;
            }
        }
    },
    actions: {
        save: async function (context, data) {
            return await api.save(context.state);
        },
        load: async function (context) {
            await api.load().then(
                result => {
                        context.commit('setState', result)
                });
        }
    },
    modules: {}
});
