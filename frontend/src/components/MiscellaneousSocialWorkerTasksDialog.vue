<template>
  <v-dialog
    v-model="isOpen"
    persistent
    :retain-focus="false"
    max-width="325"
    overlay-color="#000"
    overlay-opacity=".3"
  >
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip}">
          <v-icon
            class="mr-2"
            color="blue-grey darken-2"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
          >
            mdi-forwardburger
          </v-icon></template
        >
        <span>Other Tasks</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title> What do you want to do? </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-dialog
          overlay-color="#000"
          overlay-opacity=".3"
          max-width="350"
          v-model="accountNumberDialog"
        >
          <template #activator="{ on, attrs}">
            <v-btn
              v-on="on"
              v-bind="attrs"
              class="my-2"
              block
              color="purple lighten-5"
              ><v-icon class="mr-2">mdi-book-open</v-icon>Insert Account
              Number</v-btn
            >
          </template>
          <v-card>
            <v-card-title>Thanyou Letter</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form
                ref="accountNumberForm"
                v-model="validAccountNumberForm"
                lazy-validation
                @submit.prevent="saveAccountNumber(item)"
              >
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="accountNumber"
                      label="Account Number"
                      prepend-icon="mdi-book-open"
                      :rules="[rules.required /*, rules.accountNumber]*/]"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="saveAccountNumber(item)"
                :disabled="!validAccountNumberForm"
                >save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          overlay-color="#000"
          overlay-opacity=".3"
          max-width="350"
          v-model="thankyouLetterDialog"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              class="my-2"
              block
              color="lime lighten-5"
              ><v-icon class="mr-2">mdi-text-box</v-icon>Insert Thankyou
              Letter</v-btn
            >
          </template>
          <v-card>
            <v-card-title>Thanyou Letter</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form
                ref="thankyouLetterForm"
                v-model="validThankyouLetterForm"
                lazy-validation
                @submit.prevent="saveThankyouLetter(item)"
              >
                <v-row>
                  <v-col>
                    <v-file-input
                      v-model="thankyouLetter"
                      label="Thankyou Letter"
                      prepend-icon="mdi-camera-plus"
                      accept="image/*"
                      :rules="[rules.required]"
                      ><template #append>
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-icon
                              class="ml-auto"
                              v-bind="attrs"
                              v-on="on"
                              @click.stop="openThankyouLetterPreviewDialog"
                            >
                              mdi-file-eye
                            </v-icon>
                          </template>
                          <span>Preview</span>
                        </v-tooltip>
                        <v-dialog
                          v-model="thankyouLetterPreviewDialog"
                          max-height="600"
                          max-width="400"
                          overlay-color="#eee"
                          overlay-opacity=".3"
                        >
                          <v-img :src="thankyouLetterPreview" contain></v-img>
                        </v-dialog> </template
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="saveThankyouLetter(item)"
                :disabled="!validThankyouLetterForm"
                >save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          overlay-color="#000"
          overlay-opacity=".3"
          max-width="350"
          v-model="healthRecordDialog"
        >
          <template #activator="{ on, attrs}">
            <v-btn
              v-on="on"
              v-bind="attrs"
              class="my-2"
              block
              color="blue lighten-5"
              ><v-icon class="mr-2 ml-n5">mdi-doctor</v-icon>Insert Health
              Record</v-btn
            >
          </template>
          <v-card>
            <v-card-title>Health Record</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-form
                ref="healthRecordForm"
                v-model="validHealthRecordForm"
                lazy-validation
                @submit.prevent="saveHealthRecord(item)"
              >
                <v-row>
                  <v-col>
                    <v-file-input
                      v-model="healthRecord"
                      label="Health Record"
                      prepend-icon="mdi-camera-plus"
                      accept="image/*"
                      :rules="[rules.required]"
                      ><template #append>
                        <v-tooltip top>
                          <template #activator="{ on, attrs }">
                            <v-icon
                              class="ml-auto"
                              v-bind="attrs"
                              v-on="on"
                              @click.stop="openHealthRecordPreviewDialog"
                            >
                              mdi-file-eye
                            </v-icon>
                          </template>
                          <span>Preview</span>
                        </v-tooltip>
                        <v-dialog
                          v-model="healthRecordPreviewDialog"
                          max-height="600"
                          max-width="400"
                          overlay-color="#eee"
                          overlay-opacity=".3"
                        >
                          <v-img :src="healthRecordPreview" contain></v-img>
                        </v-dialog> </template
                    ></v-file-input>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                @click="saveHealthRecord(item)"
                :disabled="!validHealthRecordForm"
                >save</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn elevation="2" class="mr-3" color="#eee" @click="isOpen = false"
          >close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  props: ["open", "item"],
  data() {
    return {
      isOpen: false,
      rules: {
        required: value => !!value || "Required."
        //   accountNumber: value =>{
        //     console.log(value);
        //     return value.length > 4 || "Account number must be at least a 4-digits long."}
      },
      accountNumberDialog: false,
      validAccountNumberForm: false,
      accountNumber: "",

      thankyouLetterDialog: false,
      validThankyouLetterForm: false,
      thankyouLetter: null,
      thankyouLetterPreviewDialog: false,
      thankyouLetterPreview: null,

      healthRecordDialog: false,
      validHealthRecordForm: false,
      healthRecord: null,
      healthRecordPreviewDialog: false,
      healthRecordPreview: null
    };
  },
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    openThankyouLetterPreviewDialog() {
      if (this.$refs.thankyouLetterForm.validate()) {
        this.thankyouLetterPreview = URL.createObjectURL(this.thankyouLetter);
        this.thankyouLetterPreviewDialog = true;
      } else this.thankyouLetterPreviewDialog = false;
    },
    openHealthRecordPreviewDialog() {
      if (this.$refs.healthRecordForm.validate()) {
        this.healthRecordPreview = URL.createObjectURL(this.healthRecord);
        this.healthRecordPreviewDialog = true;
      } else this.healthRecordPreviewDialog = false;
    },
    saveAccountNumber(item) {
      if (this.$refs.accountNumberForm.validate()) {
        (async () => {
          try {
            const query = `
              mutation updateAccountNumber(
                  $id: ID!
                  $accountNumber: String
                  ) {
                    updateOrphan(
                      id: $id
                      accountNumber: $accountNumber
                      ) {
                        accountNumber
                      }
                  }
            `;
            const queryOptions = {
              query,
              variables: {
                id: parseInt(item.id),
                accountNumber: this.accountNumber
              }
            };
            const saveAccountNumberResponse = await axios.post(
              "/graphql",
              queryOptions
            );

            if (saveAccountNumberResponse.data.errors?.length) {
              throw new Error(
                saveAccountNumberResponse.data.errors[0].message.message
              );
            }
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR("success");
            this.SET_SNACKBAR_TEXT("Succesfully added account number.");
            this.$emit("addedSuccessfully");
            this.accountNumberDialog = false;
            this.$refs.accountNumberForm.reset();
          } catch (error) {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR("error");
            this.SET_SNACKBAR_TEXT(
              "Server error. Reload the page and try again."
            );
            console.error(error);
          }
        })();
      }
    },
    saveThankyouLetter(item) {
      if (this.$refs.thankyouLetterForm.validate()) {
        const thankyouLetterFormData = new FormData();
        thankyouLetterFormData.append(
          "document",
          this.thankyouLetter,
          this.thankyouLetter.name
        );
        (async () => {
          try {
            const thankyouLetterRes = await axios.post(
              "/document/",
              thankyouLetterFormData
            );
            (async () => {
              try {
                const query = `
                mutation createOrphanLetter(
                  $orphanId: ID!,
                  $originalThankyouLetterUrl: String!
                  ) {
                    createOrphanLetter(
                      orphanId: $orphanId,
                      originalThankyouLetterUrl: $originalThankyouLetterUrl
                      ) {
                        originalThankyouLetterUrl
                      }
                  }`;
                const queryOptions = {
                  query,
                  variables: {
                    orphanId: item.id,
                    originalThankyouLetterUrl: thankyouLetterRes.data
                  }
                };

                const createThankyouLetterResponse = await axios.post(
                  "/graphql/",
                  queryOptions
                );

                if (createThankyouLetterResponse.data.errors?.length) {
                  throw new Error(
                    createThankyouLetterResponse.data.errors[0].message.message
                  );
                }
                this.SET_SNACKBAR(true);
                this.SET_SNACKBAR_COLOR("success");
                this.SET_SNACKBAR_TEXT(
                  "Succesfully uploaded thank you letter."
                );
                this.thankyouLetterDialog = false;
                this.$refs.thankyouLetterForm.reset();
              } catch (err) {
                this.SET_SNACKBAR(true);
                this.SET_SNACKBAR_COLOR("error");
                this.SET_SNACKBAR_TEXT(
                  "Server error. Reload the page and try again."
                );
                console.error(err);
              }
            })();
          } catch (error) {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR("error");
            this.SET_SNACKBAR_TEXT(
              "Server error. Reload the page and try again."
            );
            console.error(error);
          }
        })();
      }
    },
    saveHealthRecord(item) {
      if (this.$refs.healthRecordForm.validate()) {
        const healthRecordFormData = new FormData();
        healthRecordFormData.append(
          "document",
          this.healthRecord,
          this.healthRecord.name
        );
        (async () => {
          try {
            const healthRecordRes = await axios.post(
              "/document/",
              healthRecordFormData
            );
            (async () => {
              try {
                const query = `
                mutation createHealthRecord(
                  $documentUrl: String!
                  $orphanId: ID!
                  ) {
                    createOrphanDocument(
                      documentUrl: $documentUrl
                      documentType: medicalCertificate
                      orphanId: $orphanId
                      ) {
                        __typename
                      }
                  }`;
                const queryOptions = {
                  query,
                  variables: {
                    documentUrl: healthRecordRes.data,
                    orphanId: item.id
                  }
                };

                const createHealthRecordResponse = await axios.post(
                  "/graphql/",
                  queryOptions
                );

                if (createHealthRecordResponse.data.errors?.length) {
                  throw new Error(
                    createHealthRecordResponse.data.errors[0].message.message
                  );
                }
                this.SET_SNACKBAR(true);
                this.SET_SNACKBAR_COLOR("success");
                this.SET_SNACKBAR_TEXT("Succesfully uploaded health record.");
                this.healthRecordDialog = false;
                this.$refs.healthRecordForm.reset();
              } catch (err) {
                this.SET_SNACKBAR(true);
                this.SET_SNACKBAR_COLOR("error");
                this.SET_SNACKBAR_TEXT(
                  "Server error. Reload the page and try again."
                );
                console.error(err);
              }
            })();
          } catch (error) {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR("error");
            this.SET_SNACKBAR_TEXT(
              "Server error. Reload the page and try again."
            );
            console.error(error);
          }
        })();
      }
    }
  }
};
</script>

<style></style>
