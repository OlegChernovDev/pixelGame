<template>
  <div id="app1">
    <p></p>
    <p class="nes-container is-centered">
        Bet - <span class="nes-text is-primary">{{ form.rate }}</span> 
        Balance - <span class="nes-text is-primary">{{ $store.state.money }}</span>
    </p>

    <slot-machine
        :list="list"
        :responsive="true"
        :trigger="trigger"
        @onComplete="onComplete">
    </slot-machine>

    <div class="control">
        <button type="button" v-bind:class="isActive" class="nes-btn is-primary" @click="start('less')"><5 [x2]</button>
        <button type="button" v-bind:class="isActive" class="nes-btn is-primary" @click="start('equally')">=5 [x10]</button>
        <button type="button" v-bind:class="isActive" class="nes-btn is-primary" @click="start('more')">>5 [x2]</button>
    </div>

    <button type="button" class="nes-btn is-success stat-btn" @click="open_stat">Statistics</button>

    <Modal ref="rate" id="rate">
        <p class="title">Bet</p>
        <p>Your balance - <span class="nes-text is-primary">{{ $store.state.money }}</span></p>
        
        <div class="nes-field is-inline">
            <label for="inline_field">Bet </label>
            <input type="text" id="inline_field" v-model="form.rate" @keyup="checkVatId" class="nes-input" placeholder="10">

        </div>
        <p class="error" v-if="form.vatError">{{ form.vatErrorMsg }}</p>

        <button type="button" class="nes-btn is-success" v-if="form.vatError" @click="play">Play!</button>
    </Modal>

    <Modal ref="result">
        <p class="title">Result</p>
        <p>{{ result_message }}</p>
        <button type="button" class="nes-btn is-success" @click="open_stat">Statistics</button> 
        <button type="button" class="nes-btn is-success" @click="open_rate(), close_result()">Play again!</button>
    </Modal>

    <Modal ref="stat">
        <p class="title">Statistics</p>
        <p>Victories - {{ $store.state.win_count }}</p>
        <p>Defeats - {{ $store.state.defeat_count }}</p>
        <p></p>
        <button type="button" class="nes-btn is-success" @click="close_stat">Close</button>
    </Modal>

  </div>
</template>

<script>
    import Modal from './Modal.vue'
    import store from '../store'
    import api from '@/api/idb.js'

    export default {
        name: 'Gambling',
        data() {
            return {
                list: [],
                trigger: false,
                isActive: '',
                form: {
                    rate: '',
                    vatError: false, 
                    vatErrorMsg: ''
                },
                current_number: 0,
                current_button: '',

                result_message: '', //сообщение выводимое при различных исходах
                result_rate: 0

            };
    },
    components: { Modal },
    methods: {
        open_stat: function () {
            this.$refs.stat.$el.style.display = 'block';
        },
        close_stat: function () {
            this.$refs.stat.$el.style.display = 'none';
        },
        close_rate: function () {
            this.$refs.rate.$el.style.display = 'none';
        },
        open_rate: function () {
            this.$refs.rate.$el.style.display = 'block';
        },
        play: function () {
            this.close_rate();

        },
        close_result: function () {
            this.$refs.result.$el.style.display = 'none';
        },
        open_result() {
            this.$refs.result.$el.style.display = 'block';
        },
        checkVatId() {
            var vatIdRegex = /^[1-9]\d*$/;
            
            if (this.form.rate == ''){
                this.form.vatError = false;

            } else if(!vatIdRegex.test(this.form.rate)) {
                this.form.vatError = false;
                console.log(1)
            } else {
                if (this.form.rate <= store.state.money) {
                    this.form.vatError = true;
                } else {
                    this.form.vatError = false;
                }
            }
        },
        start(data) { // Trigger to let the machine start
            if (this.isActive != 'is-disabled') {
                this.trigger = !this.trigger;
                this.isActive = 'is-disabled';

                this.current_button = data;
            }
        },
        onComplete(data) { // Run complete callback

            setTimeout(() => {
            this.current_number = data.text;
                switch (this.current_button) {
                    case 'less':
                        if (this.current_number < 5) {
                            store.commit('win', {coef: 2, rate: this.form.rate});
                            this.result_message = 'Congratulations, you won!';
                            this.result_rate = 2 * this.form.rate;
                            this.open_result();
                        } else {
                            store.commit('defeat', {rate: this.form.rate});
                            this.result_message = 'Defeat, you lost!'
                            this.open_result();
                            console.log('Поражение');
                        }
                    break;
                    case 'equally':
                        if (this.current_number == 5) {
                            store.commit('win', {coef: 5, rate: this.form.rate});
                            this.result_message = 'Congratulations, you won!'
                            this.result_rate = 5 * this.form.rate;
                            this.open_result();
                        } else {
                            store.commit('defeat', {rate: this.form.rate});
                            this.result_message = 'Defeat, you lost!'
                            this.open_result();
                            console.log('Поражение');
                        }
                    break;
                    case 'more':
                        if (this.current_number > 5) {
                            store.commit('win', {coef: 2, rate: this.form.rate});
                            this.result_message = 'Congratulations, you won!'
                            this.result_rate = 2 * this.form.rate;
                            this.open_result();
                        } else {
                            store.commit('defeat', {rate: this.form.rate});
                            this.result_message = 'Defeat, you lost!'
                            this.open_result();
                            console.log('Поражение');
                        }
                    break;
                }

                //this.$refs.result.$el.style.display = 'block';
                this.isActive = '';
            }, 1500);
        }
    },
    created: function () {
        while (this.list.length < 11) { // выводит 0, затем 1, затем 2
            this.list.push({text: this.list.length, color: '#B366FF'})
        }
    },
    mounted: function () {
        store.dispatch('load');
    }
}

setInterval(function() {
    store.dispatch('save');
}, 100);

window.onload = () => {
    document.querySelector('#rate').style.display = 'block';
}

</script>

<style>

.nes-container {
    padding: 0 0;
    margin-bottom: 20px;
}
.is-left .nes-btn {
    float: right;
}
.is-left div {
    margin-bottom: 15px;
}
.is-left div:after {
    content: '';
    display: block;
    clear: both;
}
.is-left {
    text-align: left;
}
.is-left .nes-block {
    display: inline-block;
    margin: 0;
}
.is-beetwin {
    display: flex;
    flex-flow: nowrap row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 30px 0;
}
@media (max-width: 640px) {
    .nes-container {
        padding: 1.5rem 2rem;
    }
    h1 {
        font-size: 1em;
    }
    p,
    .is-left,
    .nes-btn {
        font-size: .7em;
    }
    .title {
        padding: 25px 10px 0 !important;
    }
    .is-panel {
        position: fixed;
        bottom: 0;
        left: 50%;

        background: white;
        z-index: 10;
        margin: 0 -320px;
        padding: 20px;
        border: 4px solid black;
    }
    .is-body {
        margin: 0 0 90px;
    }
}
@media (min-width:320px) {
    #app1 {
        width: 100%;
        padding: 10px;
        margin: 0 auto;
        margin-bottom:0 !important;
    }

    h1 {
        font-size:1em;
    }
    p,select,button,div {
        font-size:.9em;
    }
    .nes-container {
        padding: .5rem .5rem;
    }
    .is-panel {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: white;
        z-index: 10;
        margin: 0;
        padding: 10px;
        border: 4px solid black;
        font-size:.9em;
    }
    .is-panel span {
        display:none;
    }
    .is-body {
        margin: 0 0 80px;
        padding: .5rem !important;
    }
    .is-body .nes-btn {
        width:40%;
    }
    .is-beetwin select.nes-btn,
    .is-left button.nes-btn {
        min-width: 17%;
    }
}

@media (min-width: 640px) {
    .is-body {
        margin: 0 0 70px;
    }
    .is-panel {
        position: fixed;
        bottom: 0;
        left: 50%;
        width: 640px;
        background: white;
        z-index: 10;
        margin: 0 -320px;
        padding: 10px;
        border: 4px solid black;
        font-size:.9em;
    }
    .is-panel span {
        display:inline-block;
    }
}
    .control {
        width: 100%;
        display: flex;
        flex-direction: row;
    }
    .control > button {
        margin: 10px;
        flex-grow: 3;
    }

    .stat-btn {
        width: 100%;
    }
</style>