<template>
  <div style="height: 100vh; padding-top: 120px;">
    <v-card class="mx-auto" max-width="450">
      <v-card-text class="px-6">
        <!-- <h2 class="text-h3 text-center pt-3">Welcome</h2>
        <h3 class="text-center">To Your Account</h3> -->

        <v-row justfiy="center" class="ma-4 mb-0">
          <v-avatar class="mx-auto" size="100">
            <v-img src="../assets/cda-6.png"></v-img>
            <!-- <v-icon size="100" class="mx-auto"> mdi-account-circle </v-icon> -->
          </v-avatar>
        </v-row>

        <h2 class="text-h3 text-center pt-3 mb-9">Login</h2>

        <v-form>
          <p class="my-1 ml-1 error--text">{{ loginError }}</p>
          <v-text-field
            v-model="loginEmail"
            class="mt-4"
            label="Email"
            dense
            type="email"
            outlined
            color="#FF9983"
          ></v-text-field>
          <v-text-field
            v-model="loginPassword"
            label="Password"
            dense
            type="password"
            outlined
            color="#FF9983"
          ></v-text-field>
        </v-form>
        <v-row justify="space-between" class="mb-1">
          <!-- <v-checkbox
        
            class="mt-0 ml-3"
            v-model="selected"
            label="Remember me"
            value="rememberMeTruthValue"
            color="#ff9983"
          ></v-checkbox> -->
          <v-spacer></v-spacer>
          <a
            class="mt-1 mr-3"
            @click="
              reveal = true;
              createAccount = false;
            "
            >Forgot your password?</a
          >
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-row>
          <v-col cols="12">
            <v-btn
              @click="login"
              dark
              block
              class="mx-auto mt-n3"
              color="rgba(25,32,72, 0.5)"
            >
              LOGIN
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-center py-0">
            <p>
              Don't have an account?
              <v-btn
                class="px-0"
                text
                plain
                color="primary"
                @click="
                  reveal = true;
                  createAccount = true;
                "
                >request for an account</v-btn
              >
            </p>
          </v-col>
        </v-row>
      </v-card-actions>
      <!-- signup -->
      <v-expand-transition v-if="reveal">
        <v-card class="transition-fast-in-fast-out v-card--reveal">
          <v-card-text class="pb-0">
            <h2 class="text-h3 text-center pt-3 mb-7">
              {{ createAccount ? "Signup Request" : "Reset Password" }}
            </h2>
            <p class="text-center mb-0">
              Please provide an email, we can contact you with
            </p>
            <p class="text-center mb-0">
              and you can contact us at
              <a href="">info@cda-charity.org</a>
            </p>

            <v-form ref="accountForm" v-model="validAccount" lazy-validation>
              <v-row>
                <!-- New Account Full Name -->
                <v-col cols="12">
                  <v-responsive max-width="" class="mx-10 mb-n7 mt-5">
                    <v-text-field
                      v-model="accountFullName"
                      :rules="[...rules.personalName]"
                      label="Full Name"
                    >
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <!-- New Account Role -->
                <v-col cols="12">
                  <v-responsive max-width="" class="mx-10 mb-n7 mt-5">
                    <v-select
                      v-model="accountRole"
                      :items="accountRoles"
                      :rules="[...rules.role]"
                      label="Role"
                    >
                    </v-select>
                  </v-responsive>
                </v-col>
                <!-- New Account Email -->
                <v-col cols="12">
                  <v-responsive max-width="" class="mx-10 mb-n7">
                    <v-text-field
                      v-model="accountEmail"
                      :rules="[...rules.email]"
                      label="Email"
                      type="email"
                    >
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <!-- New Account Phone Number -->
                <v-col cols="12">
                  <v-responsive max-width="" class="mx-10 mb-n7">
                    <v-text-field
                      v-model="accountMobileNumber"
                      :rules="[...rules.mobileNumber]"
                      label="Phone Number"
                    >
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <v-col align="right" class="mb-5">
                  <v-btn class="mr-5" @click="reveal = false">Cancel</v-btn>
                  <v-btn
                    class="mr-10 primary"
                    @click="sendRequest"
                    :disabled="!validAccount"
                    >Send</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      reveal: false,
      createAccount: false,
      selected: false,
      loginEmail: "",
      loginPassword: "",
      loginError: "",
      role: "",
      accountFullName: null,
      accountRole: null,
      accountRoles: [
        {
          text: "Social Worker",
          value: "SocialWorker"
        },
        "Coordinator",
        "Donor"
      ],
      accountEmail: null,
      accountMobileNumber: null,
      validAccount: false,
      rules: {
        role: [v => !!v || "Role is required"],
        personalName: [
          v => !!v || "Name is required",
          v =>
            /^[A-z]([A-z/]+) ([A-z/]+) ([A-z/]+)$/gi.test(v) ||
            "Name must include father and grandfather name"
        ],
        email: [
          v => !!v || "Email is required",
          v =>
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
            "Email must be valid"
        ],
        mobileNumber: [
          v => !!v || "Phone Number is required",
          v => /^09[0-9]{8}$/.test(v) || "Phone Number must be in 0-9"
        ]
      }
    };
  },
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    async login() {
      let loginResponse;
      try {
        loginResponse = await axios.post("/graphql", {
          query: `mutation login($email: String!, $password: String!) {
                      login(email: $email, password: $password) {
                        user {
                          id
                          email
                          role
                          coordinator {
                            id
                          }
                          head {
                            id
                          }
                          donor {
                            id
                          }
                          socialWorker {
                            id
                            firstName
                          }
                        }
                      }
                    }`,
          variables: {
            email: this.loginEmail,
            password: this.loginPassword
          }
        });

        if (
          loginResponse.data.errors?.length &&
          loginResponse.data.data === null
        )
          throw new Error(String(loginResponse.data.errors[0].message.message));
        else {
          const { user } = loginResponse.data.data.login;
          sessionStorage.setItem("loggedIn", true);
          sessionStorage.setItem("loggedInAs", user.role);
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR("success");
          this.SET_SNACKBAR_TEXT("Logged in successfully.");
          if (user.role === "Head") {
            this.$router.push({
              name: "Head_v2",
              params: { id: Number(user.head.id) }
            });
          } else if (user.role === "Donor") {
            this.$router.push({
              name: "Donor",
              params: { id: Number(user.donor.id) }
            });
          } else if (user.role === "Coordinator") {
            this.$router.push({
              name: "Coordinator",
              params: { id: Number(user.coordinator.id) }
            });
          } else if (user.role === "SocialWorker") {
            this.$router.push({
              name: "SocialWorker",
              params: {
                id: Number(user.socialWorker.id),
                firstName: user.socialWorker.firstName
              }
            });
          }
        }
      } catch (error) {
        if (String(error).includes("Invalid password")) {
          this.loginError = "Insert the correct password";
        } else if (String(error).includes("No such user found for email:")) {
          this.loginError = "Insert the correct email";
        } else {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR("error");
          this.SET_SNACKBAR_TEXT(
            "Server error. Reload the page and try again."
          );
        }
        console.error(error);
      }
    },
    sendRequest() {
      if (this.$refs.accountForm.validate()) {
        (async () => {
          const query = `
                mutation (
                  $type: accountMaintainenceType!,
                  $role: userRoles!
                  $firstName: String!
                  $middleName: String!
                  $lastName: String!
                  $email: String!
                  $mobileNumber: String!
                ) {
                  createAccountMaintainence(
                    type: $type
                    status: pending
                    role: $role
                    firstName: $firstName
                    middleName: $middleName
                    lastName: $lastName
                    email: $email
                    mobileNumber: $mobileNumber
                  ) {
                    id
                  }
                }
          `;
          const queryOptions = {
            query,
            variables: {
              type: this.createAccount ? "register" : "passwordRecovery",
              role: this.accountRole,
              firstName: this.accountFullName.split(" ")[0],
              middleName: this.accountFullName.split(" ")[1],
              lastName: this.accountFullName.split(" ")[2],
              email: this.accountEmail,
              mobileNumber: this.accountMobileNumber
            }
          };

          try {
            const accountRes = await axios.post("/graphql", queryOptions);

            if (accountRes.data.errors?.length) {
              throw new Error();
            } else {
              this.SET_SNACKBAR(true);
              this.SET_SNACKBAR_COLOR("success");
              this.SET_SNACKBAR_TEXT(
                "Request submitted successfully. Please wait until the department Head reviews your request."
              );
            }
          } catch (error) {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR("error");
            this.SET_SNACKBAR_TEXT(
              "Server error. Reload the page and try again."
            );
            console.error(error);
          }
        })();
        this.reveal = false;
        this.$refs.accountForm.reset();
      }
    }
  }
};
</script>
