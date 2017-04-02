<template lang="html">
<div>
    <myheader :user="user"></myheader>
    <div class="container haiku-container">
        <form role="form" action="/haiku" method="POST">
            <div class="form-group">
                <input class="form-control" type="text" name="title"
                       v-model="title" placeholder="Add title here"></input>
            </div>
            <div class="form-group">
                <textarea class="form-control" rows="3" name="content"
                          v-model="content" placeholder="Add haiku here" style="resize: none"></textarea>
            </div>
            <div v-if="isValidMessage === ''">
                <button class="btn btn-default">Submit</button>
            </div>
            <div v-else>
                {{isValidMessage}}
            </div>
        </form>
    </div>
</div>
</template>

<script>
    export default {
        data: function() {
            return {
                title: '',
                content: '',
                user: {}
            }
        },
        computed: {
            isValidMessage () {
                if(this.title === '') {
                    return 'There should be title';
                } else if(this.content === '') {
                    return 'There should be content';
                } else if(this.content.split(/\r\n|\r|\n/).length !== 3) {
                    return 'Haiku should be 3 line poem';
                } else if(this.content.match(/[aeiouy]/g).length > 20 || this.content.length > 100) {
                    return "Haiku is often written in a 5/7/5 syllable count.\nYour haiku doesn't match that form.";
                } else {
                    return '';
                }
            }
        },
        methods: {
        }
    }
</script>

<style lang="css">
</style>