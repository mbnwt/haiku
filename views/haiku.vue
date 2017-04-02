<template lang="html">
<div>
    <myheader :user="user"></myheader>
    <div class="container">
        <div v-if="haiku.length === 0">
            <p style="font-size: 20px; color: white; text-align: center;">No haiku here</p>
        </div>
        <div v-for="h in haiku">
            <div class="col col-md-6 col-xl-4">
                <div class="container haiku-container">
                    <h2>{{h.title}}</h2>
                    <p style="font-size: 20px">{{h.content}}</p>
                    <br>
                    <p class="haiku-bottom">posted {{timeSince(h.timestamp)}} ago by <a :href="authorUrl(h.author)">{{h.author}}</a></p>
                    <br><br>
                    
                    <div class="haiku-bottom haiku-bottom-icons" v-on:click="toogleComments(h.id)">
                        {{h.comments.length}} <span class="glyphicon glyphicon-comment" aria-hidden="true">
                    </div>

                    <span v-if="h.favorite">
                        <span class="glyphicon glyphicon-star haiku-bottom haiku-bottom-icons"
                            aria-hidden="true" v-on:click="toogleFavorite(h.id)"></span>
                    </span>
                    <span v-else>
                        <span class="glyphicon glyphicon-star-empty haiku-bottom haiku-bottom-icons"
                            aria-hidden="true" v-on:click="toogleFavorite(h.id)"></span>
                    </span>
                    
                    <span v-if="h.author === user.username" ><a :href="deleteUrl(h)" class="haiku-bottom">
                        <span class="glyphicon glyphicon-trash haiku-bottom haiku-bottom-icons"></span>
                    </a></span>

                    <div v-if="h.showComments">
                        <br>
                        <span>
                            <div class="form-group">
                                <input class="form-control" type="text" name="comment"
                                    v-model="comment" placeholder="Add comment here"></input>
                            </div>
                            <button class="btn btn-default" v-on:click="postComment(h.id)">Submit</button>
                        </span>

                        <div v-for="comment in h.comments" class="comments">
                            <b><a :href="authorUrl(comment.author)">{{ comment.author }}</a></b> {{ timeSince(comment.timestamp) }} ago<br>
                            {{ comment.content }}
                            <br>
                        </div>
                    </div>                 
                </div>
            </div>
        </div>
    </div>
    <br><br>
</div>
</template>

<script>
    import _ from 'lodash';
    
    export default {
        data: function() {
            return {
                comment: '',
                haiku: {},
                user: {},
                paginate: ['haiku']
            }
        },
        created () {
            for(let i = 0; i < this.haiku.length; i++) {
                this.haiku[i].favorite = this.user.favorites.indexOf(this.haiku[i].id) !== -1;
                this.haiku[i].showComments = false;
            }
        },
        methods: {
            postComment (id) {
                this.$http.post(this.postCommentUrl(id, this.comment)).then(response => console.log(response));
                this.haiku.map(h => { 
                    if(h.id === id) {
                        h.comments.push({ 
                            content: this.comment,
                            author: this.user.username,
                            timestamp: new Date()
                        });
                    }
                    return h;
                });
                this.comment = "";
            },
            authorUrl (author) {
                return '/haiku/' + author;
            },
            postCommentUrl (id, comment) {
                return '/comment/' + id + '&' + comment;
            },
            toogleFavorite (id) {
                this.$http.post('/favorite/' + this.user.username + '&' + id);
                this.haiku.map(h => { 
                    if(h.id === id) {
                        h.favorite = !h.favorite;
                    }
                    return h;
                });
            },
            toogleComments (id) {
                this.haiku.map(h => { 
                    if(h.id === id) {
                        h.showComments = !h.showComments;
                    } else {
                        h.showComments = false;
                    }
                    return h;
                });
            },
            deleteUrl (haiku) {
                return '/deleteHaiku/' + haiku.id;
            },
            timeSince(date) {

                var seconds = Math.floor((new Date() - Date.parse(date)) / 1000);                
                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return interval + " years";
                }

                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return interval + " months";
                }

                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days";
                }

                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours";
                }

                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes";
                }

                return Math.floor(seconds) + " seconds";
            }
        }
    }
</script>

<style lang="css">
</style>