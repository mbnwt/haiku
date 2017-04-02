<template>
    <div class="top">
        <div class="container">
            <br>
            <span class="top-title">俳句</span>
            <span><a href="/" class="top-routes">Home</a></span>
            <span><a href="/addHaiku" class="top-routes">Add haiku</a></span>
            <span><a href="/about" class="top-routes">About</a></span>
            <span v-if="isLogged">
                <span><a href="/haiku/{{user.username}}" class="top-routes">My haiku</a></span>
                <span><a href="/favorites/{{user.username}}" class="top-routes">My favorites</a></span>
                <span><a href="/logout" class="top-routes">Logout</a></span>
            </span>
            <span v-else>
                <span><a href="/login" class="top-routes">Login</a></span>
                <span><a href="/register" class="top-routes">Register</a></span>
            </span>
            <br>
        </div>
        <hr>
    </div>
    <br>
</template>

<script>
    export default {
        props: ['user'],
        data: function() {
            return {
            }
        },
        created () {
        },
        computed: {
            isLogged() {
                return this.user != null;
            }
        },
        methods: {
            print() {
                
            }
        }
    }
</script>