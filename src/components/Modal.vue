<template>
		<div class="window nes-dialog is-rounded">
            <form method="dialog" class="dialog-form">
                <div class="nes-container dialog-form is-centered with-title">
                	<slot>f</slot>
                </div>
            </form>
        </div>
</template>

<script>
	export default {
		name: 'Modal'
	}
</script>

<style scoped>
    .window {
        position: fixed;
        width: 60%;
    }

@media (max-width: 640px) {
    .window {
        width: 100%;
        height: 100%;
        top: 0;
    }
    .dialog-form {
        height: 100%;
    }

    .nes-container.with-title.is-centered > .title {
        margin: -3.6rem auto 1rem;
    }
    .close-btn {
        width: 100px;
        position: absolute;
        bottom: 10px;
        left: 50%;
        margin: 0 -50px !important;
    }
}
</style>