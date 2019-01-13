<template>
  <!--Component style-->

  <!--<v-container>-->
    <!--<ApolloQuery :query="getPostsQuery">-->
      <!--<template slot-scope="{ result: { loading, data, error, networkStatus } }">-->
        <!--<div v-if="loading">Loading...</div>-->
        <!--<div v-else-if="error">Error! {{ error.message }}</div>-->
        <!--<div v-else-if="!loading">Network Status: {{ networkStatus }}</div>-->

        <!--<ul v-else-if="data" v-for="post in data.getPosts" :key="post._id">-->
          <!--<li>{{ post.title }} {{ post.imageUrl }} {{ post.likes }}</li>-->
        <!--</ul>-->
      <!--</template>-->
    <!--</ApolloQuery>-->
  <!--</v-container>-->

  <!--For smart query-->

  <!--<v-container text-xs-center v-if="posts.length > 0">-->
    <!--<v-flex xs12>-->
      <!--<v-carousel v-bind="{ 'cycle': true }" interval="3000">-->
        <!--<v-carousel-item v-for="post in posts" :key="post._id" :src="post.imageUrl">-->
          <!--<h1 id="carousel__title">{{ post.title }}</h1>-->
        <!--</v-carousel-item>-->
      <!--</v-carousel>-->
    <!--</v-flex>-->
  <!--</v-container>-->

  <v-container text-xs-center>
    <!--Loading Spiner-->
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary" />
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <!--Explorer Posts Button-->
    <v-layout class="mt-2 mb-3" row wrap v-if="!loading">
      <v-flex xs12>
        <v-btn class="secondary" to="/posts" large dark>
          Explore Post
        </v-btn>
      </v-flex>
    </v-layout>

    <!--Post Carousel-->
    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item
          v-for="post in posts"
          :key="post._id"
          :src="post.imageUrl"
          @click.native="goToPost(post._id)"
        >
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  data() {
    return {
      // For Component style
      // posts: [],
      // getPostsQuery: gql`
      //    query {
      //      getPosts {
      //        _id
      //        title
      //        imageUrl
      //        description
      //        likes
      //      }
      //    }
      //  `,
    }
  },

  // Smart query
  // apollo: {
  //   getPosts: {
  //     query: gql`
  //       query {
  //         getPosts {
  //           _id
  //           title
  //           imageUrl
  //           description
  //           likes
  //         }
  //       }
  //     `,
  //     result({ data, loading, networkStatus }) {
  //       if (!loading) this.posts = data.getPosts;
  //     },
  //     error(err) {
  //       console.log('Error in getPosts', err)
  //     }
  //   }
  // }

  computed: {
    // posts() {
    //   return this.$store.getters.posts;
    // },
    // loading() {
    //   return this.$store.getters.loading;
    // }
    ...mapGetters(['loading', 'posts'])
  },

  created() {
    this.handleGetCarouselPosts();
  },

  methods: {
    handleGetCarouselPosts() {
      // reach out to Vuex store, fire action that gets posts for carousel
      this.$store.dispatch('getPosts')
    },
    goToPost(id) {
      this.$router.push(`posts/${id}`)
    }
  }
}
</script>

<style>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>
