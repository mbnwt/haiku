<template lang="html">
    <div>
    <myheader :user="user"></myheader>
    <div class="container haiku-container">
        <h3>LOGIN</h3>
        <form action="/login" method="POST">
            <div class="form-group">
                <input class="form-control" type="text" name="username" required="true"
                       placeholder="Enter username..."></input>
            </div>
            <div class="form-group">
                <input class="form-control" type="password" name="password" required="true"
                       placeholder="Enter password..."></input>
            </div>
            <button class="btn btn-default">Submit</button>
        </form>
        <br>
        <a href="/register">Don't have account? Register here</a>
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

<style lang="css">
</style>