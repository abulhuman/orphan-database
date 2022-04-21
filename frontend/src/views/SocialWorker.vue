<template>
  <div style="margin-top: 1.5rem">
    <AppNavBar :user="socialWorkerUser" />
    <social-worker-u-i
      class="mt-16 pt-3"
      :socialWorerkId="$route.params.id"
    ></social-worker-u-i>
  </div>
</template>

<script>
import SocialWorkerUI from "@/components/SocialWorkerUI.vue";
import AppNavBar from "@/components/AppNavBar.vue";
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      socialWorker: null,
      socialWorkerUser: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        role: ""
      }
    };
  },
  components: {
    SocialWorkerUI,
    AppNavBar
  },
  created() {
    this.initializeSocialWorker();
  },
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    initializeSocialWorker() {
      axios
        .post("/graphql/", {
          query: `query socialWorker($id: ID!) {
            socialWorker(id: $id) {
                    id
                    firstName
                    middleName
                    lastName
                    user {
                      id
                      email
                      role
                    }
                  }
                }`,
          variables: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          else {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR("success");
            this.SET_SNACKBAR_TEXT(
              `Welcome ${res.data.data.socialWorker.firstName}`
            );

            return res.data.data.socialWorker;
          }
        })
        .then(socialWorker => {
          this.socialWorker = Object.assign({}, socialWorker);
          this.socialWorkerUser = Object.assign(
            this.socialWorkerUser,
            socialWorker.user
          );
          for (const property in this.socialWorker) {
            if (Object.hasOwnProperty.call(this.socialWorker, property)) {
              this.socialWorkerUser[property] = socialWorker[property];
            }
          }
        })
        .catch(error => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR("error");
          this.SET_SNACKBAR_TEXT(
            "Server error. Reload the page and try again."
          );
          console.error(error);
        });
    }
  }
};
</script>

<style>
.v-dialog,
.v-menu__content {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}
</style>
