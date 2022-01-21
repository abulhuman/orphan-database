<template>
  <div>
    <!-- <v-app-bar absolute elevate-on-scroll style="background: #eee;"> -->
    <v-app-bar absolute elevate-on-scroll>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(255,255,255,.5), rgba(255,255,255,.7)"
        ></v-img>
      </template>

      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-toolbar-title>
        <v-img src="@/assets/logo2.png"></v-img>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Coordinator part -->
      <template v-if="user.role === 'Coordinator'">
        <v-btn
          text
          class="mr-0 py-8 indigo--text"
          :class="{ active: isNewOrphan }"
          @click.stop="toggleNewOrphanDialog"
        >
          New Orphan
        </v-btn>
        <!-- <v-btn
          text
          class="py-8 indigo--text"
          :class="{ active: isSupportPlan }"
          @click.stop="toggleSupportPlanComponent"
        >
          Support Plans
        </v-btn> -->
        <v-btn
          text
          class="mr-0 py-8 indigo--text"
          :class="{ active: isChangeStatus }"
          @click.stop="toggleChangeStatusDialog"
        >
          Change Status
        </v-btn>
      </template>

      <!-- Donor part -->
      <!-- <template v-else-if="user.role === 'Donor'">
        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="mr-0 py-8 indigo--text"
              :class="{ active: isProcessing }"
              v-bind="attrs"
              v-on="on"
              @click.stop="processingActive"
              >Processing</v-btn
            >
          </template>
          <span>New Orphans</span>
        </v-tooltip>

        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="mr-0 py-8 indigo--text"
              :class="{ active: isPending }"
              v-bind="attrs"
              v-on="on"
              @click.stop="pendingActive"
              >Pending</v-btn
            >
          </template>
          <span>Waiting Orphans</span>
        </v-tooltip>

        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="mr-0 py-8 indigo--text"
              :class="{ active: isSponsored }"
              v-bind="attrs"
              v-on="on"
              @click.stop="sponsoredActive"
              >Sponsored</v-btn
            >
          </template>
          <span>Sponsored Orphans</span>
        </v-tooltip>

        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="mr-0 py-8 indigo--text"
              :class="{ active: isGraduated }"
              v-bind="attrs"
              v-on="on"
              @click.stop="graduatedActive"
              >Graduated</v-btn
            >
          </template>
          <span>Graduated Orphans</span>
        </v-tooltip>
      </template> -->

      <!-- Head Part -->
      <!-- <template v-else-if="user.role === 'Head'">
        <v-btn text class="mr-0 py-8 indigo--text">View</v-btn>
        <v-btn text class="mr-0 py-8 indigo--text">Register</v-btn>
        <v-btn text class="mr-0 py-8 indigo--text">User</v-btn>
      </template> -->

      <!-- <template v-else-if="user.role === 'SocialWorker'">
        <v-btn text class="mr-0 py-8">View</v-btn>
        <v-btn text class="mr-0 py-8">Register</v-btn>
        <v-btn text class="mr-0 py-8">User</v-btn>
      </template> -->

      <v-spacer></v-spacer>
      <!-- <v-responsive max-width="300" class="mr-3">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          class="pt-5"
          color="indigo"
        ></v-text-field>
      </v-responsive> -->
      <!-- user profile menu -->
      <v-menu
        v-model="accountMenu"
        :close-on-content-click="false"
        bottom
        offset-y
        nudge-bottom="5"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on" color="indigo">
            <v-icon size="27">mdi-account</v-icon>
          </v-btn>
        </template>

        <v-card min-width="300px">
          <v-card-title class="py-1">
            <v-row>
              <v-col cols="10" class="pa-4 pl-13 pt-5 body-2 text-center"
                >Account</v-col
              >
              <v-col cols="2" class="subtitle-1 justify-end">
                <v-icon size="19" @click="closeAccountMenu">mdi-close</v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider class=""></v-divider>
          <v-card-text>
            <v-row>
              <v-col sm="3">
                <v-avatar color="green">
                  <span class="white--text text-h5">
                    {{ displayNameInitials() }}
                  </span>
                </v-avatar>
              </v-col>
              <v-col sm="9">
                <v-col class="pa-0">
                  <span class="black--text">
                    {{ displayName() }}
                  </span>
                </v-col>
                <span class="gray--text">
                  {{ user.email }}
                </span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class=""></v-divider>
          <v-card-actions class="py-1 justify-end">
            <v-btn color="red" text @click="logOut">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- <v-navigation-drawer v-model="drawer" absolute temporary style="color: #FF9983;">
      <v-list nav dense>
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <router-link to="/test"></router-link>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Test</v-list-item-title>
          </v-list-item>

          <router-link to="/"></router-link>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Orphans</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer> -->
  </div>
</template>

<style scoped>
.active {
  background-color: rgba(100, 115, 201, 0.5);
}
</style>

<script>
import axios from "axios";
export default {
  props: {
    user: {
      type: Object
    },
    dialog: {
      type: Boolean
    },
    newOrphanView: {
      type: Boolean
    },
    changeStatusDialogValue: {
      type: Boolean
    }
  },

  data() {
    return {
      accountMenu: false,
      search: "",
      drawer: false,
      newOrphanDialog: true,
      supportPlanTable: true,
      changeStatusDialog: true,
      state: "",
      isNewOrphan: false,
      isSupportPlan: false,
      isChangeStatus: false,
      isProcessing: true,
      isPending: false,
      isSponsored: false,
      isGraduated: false
    };
  },
  watch: {
    dialog(val) {
      this.isNewOrphan = val;
    },
    newOrphanView(val) {
      this.isNewOrphan = val;
    },
    changeStatusDialogValue(val) {
      this.isChangeStatus = val;
    }
  },
  methods: {
    toggleNewOrphanDialog() {
      // because when the dialog closes this function don't get the memo so do it manually like a noob same goes for toggleChangeStatusDialog
      if (this.newOrphanDialog === false) this.newOrphanDialog = !this.dialog;
      this.$emit("toggleNewOrphanDialog", this.newOrphanDialog);
      this.newOrphanDialog = !this.newOrphanDialog;

      this.isSupportPlan = false;
      this.isChangeStatus = false;
    },
    toggleSupportPlanComponent() {
      console.log(this.supportPlanTable);
      // if(this.supportPlanTable === false) this.supportPlanTable = true;
      this.$emit("toggleSupportPlanComponent", this.supportPlanTable);
      this.supportPlanTable = !this.supportPlanTable;

      this.isSupportPlan = !this.supportPlanTable;
      this.isNewOrphan = false;
      this.isChangeStatus = false;
    },
    toggleChangeStatusDialog() {
      if (this.changeStatusDialog === false)
        this.changeStatusDialog = !this.changeStatusDialogValue;
      this.$emit("toggleChangeStatusDialog", this.changeStatusDialog);
      this.changeStatusDialog = !this.changeStatusDialog;

      this.isSupportPlan = false;
      this.isNewOrphan = false;
    },
    displayName() {
      if (Object.hasOwnProperty.call(this.user, "companyName")) {
        return this.user.companyName;
      } else return `${this.user.firstName} ${this.user.middleName}`;
    },
    displayNameInitials() {
      if (Object.hasOwnProperty.call(this.user, "nameInitials")) {
        return this.user.nameInitials;
      } else
        return (
          this.user.firstName.slice(0, 1).toUpperCase() +
          this.user.middleName.slice(0, 1).toUpperCase()
        );
    },
    closeAccountMenu() {
      this.accountMenu = false;
    },
    logOut() {
      (async () => {
        const query = `mutation{logout}`;
        const loggedOut = await axios.post("/graphql", { query });
        console.log();
        if (loggedOut.data.data.logout) {
          sessionStorage.clear();
          this.$router.push("/");
        }
      })();
    },
    // -------------Donor----------------
    processingActive() {
      this.state = "processing";
      this.$emit("activeTab", this.state);
      this.isProcessing = true;
      this.isPending = false;
      this.isSponsored = false;
      this.isGraduated = false;
    },
    pendingActive() {
      this.state = "pending";
      this.$emit("activeTab", this.state);
      this.isProcessing = false;
      this.isPending = true;
      this.isSponsored = false;
      this.isGraduated = false;
    },
    sponsoredActive() {
      this.state = "sponsored";
      this.$emit("activeTab", this.state);
      this.isProcessing = false;
      this.isPending = false;
      this.isSponsored = true;
      this.isGraduated = false;
    },
    graduatedActive() {
      this.state = "graduated";
      this.$emit("activeTab", this.state);
      this.isProcessing = false;
      this.isPending = false;
      this.isSponsored = false;
      this.isGraduated = true;
    }
  }
};
</script>
