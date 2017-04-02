<template lang="html">
<div>
    <myheader :user="user"></myheader>
    <div class="container haiku-container">
        <h3 class="text-center">Marin Biloš</h3>
        <h4 class="text-center">NODE + EXPRESS + VUE</h4>
        <h4 class="text-center">2016/2017</h4>
    </div>
</div>
</template>

<script>
    export default {
        data: function() {
            return {
                user: {}
            }
        }
    }
</script>

<style></style>