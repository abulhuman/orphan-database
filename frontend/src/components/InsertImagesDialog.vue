<template>
  <v-dialog
    v-model="isOpen"
    persistent
    :retain-focus="false"
    max-width="450"
    overlay-color="#000"
    overlay-opacity=".3"
  >
    <template v-slot:activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip}">
          <v-icon
            class="mr-2"
            color="indigo darken-2"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
          >
            mdi-image-plus
          </v-icon></template
        >
        <span>Insert Images</span>
      </v-tooltip>
    </template>
    <v-card>
      <v-card-title>Upload Photos</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="imagesForm" v-model="validImagesForm" lazy-validation>
          <v-container>
            <v-row
              ><v-col cols="12"
                ><v-file-input
                  v-model="portraitImage"
                  label="Portrait Photo"
                  prepend-icon="mdi-camera-plus"
                  accept="image/*"
                  :rules="[rules.required]"
                >
                  <template v-slot:append>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="ml-auto"
                          v-bind="attrs"
                          v-on="on"
                          @click="openPortraitImagePreviewDialog"
                        >
                          mdi-file-eye
                        </v-icon>
                      </template>
                      <span>Preview</span>
                    </v-tooltip>
                    <v-dialog
                      v-model="portraitImageDialog"
                      max-height="600"
                      max-width="400"
                      overlay-color="#eee"
                      overlay-opacity=".3"
                    >
                      <v-img :src="portraitImagePreview" contain></v-img>
                    </v-dialog>
                  </template> </v-file-input></v-col
            ></v-row>
            <v-row
              ><v-col cols="12"
                ><v-file-input
                  v-model="longImage"
                  label="Long Photo"
                  accept="image/*"
                  prepend-icon="mdi-camera-plus"
                  :rules="[rules.required]"
                  ><template v-slot:append>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="ml-auto"
                          v-bind="attrs"
                          v-on="on"
                          @click="openLongImagePreviewDialog"
                        >
                          mdi-file-eye
                        </v-icon>
                      </template>
                      <span>Preview</span>
                    </v-tooltip>
                    <v-dialog
                      v-model="longImageDialog"
                      max-height="600"
                      max-width="400"
                      overlay-color="#eee"
                      overlay-opacity=".3"
                    >
                      <v-img :src="longImagePreview" contain></v-img>
                    </v-dialog>
                  </template> </v-file-input></v-col
            ></v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="#777" @click="closeImageInsertDialog">Close</v-btn>
        <v-btn
          text
          color="primary"
          @click="saveImageInsertDialog(item)"
          :disabled="!validImagesForm"
          >Save</v-btn
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
        required: value => !!value || "Required.",
        name: value => {
          const namePattern = /(^[A-z][A-Z-a-z/'.,/]+)[A-z]\s*$/g;
          return namePattern.test(value) || "Invalid name";
        }
      },
      // Image Upload Form Dialog
      insertImageDialog: false,
      portraitImage: null,
      portraitImagePreview: null,
      portraitImageDialog: null,
      longImage: null,
      longImagePreview: null,
      longImageDialog: null,
      validImagesForm: false
    };
  },
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    openPortraitImagePreviewDialog() {
      if (this.$refs.imagesForm.inputs[0].validate()) {
        this.portraitImagePreview = URL.createObjectURL(this.portraitImage);
        this.portraitImageDialog = true;
      }
    },
    openLongImagePreviewDialog() {
      if (this.$refs.imagesForm.inputs[1].validate()) {
        this.longImagePreview = URL.createObjectURL(this.longImage);
        this.longImageDialog = true;
      }
    },
    closeImageInsertDialog() {
      this.isOpen = false;
    },
    saveImageInsertDialog(item) {
      if (this.$refs.imagesForm.validate()) {
        // (1) SEND IMAGES TO SERVER,
        // (2) GET IMAGES URLS,
        // (3) CREATE A DB RECORD,
        // (4) LOG CREATE RESULT

        // ! prep images before send
        const portraitImageFormData = new FormData();
        portraitImageFormData.append(
          "image",
          this.portraitImage,
          this.portraitImage.name
        );
        const longImageFormData = new FormData();
        longImageFormData.append(
          "image",
          this.longImage,
          this.longImage.name
        );
        // ! send and get urls
        (async () => {
          try {
            const portraitRes = await axios.post(
              `/img/`,
              portraitImageFormData
            );
            const longRes = await axios.post(
              `/img/`,
              longImageFormData
            );
            // ! create DB record with the urls
            (async () => {
              try {
                const query = `
                  mutation createPhoto(
                    $photoPortraitUrl: String!
                    $photoLongUrl: String
                    $orphanId: ID!
                    ) {
                      createOrphanPhoto(
                        photoPortraitUrl: $photoPortraitUrl
                        photoLongUrl: $photoLongUrl
                        orphanId: $orphanId
                        ) { id }
                    }
                `;
                const queryOptions = {
                  query,
                  variables: {
                    photoPortraitUrl: portraitRes.data,
                    photoLongUrl: longRes.data,
                    orphanId: item.id
                  }
                };
                const createPhotosRes = await axios.post(
                  `/graphql/`,
                  queryOptions
                );
                if (createPhotosRes.data.errors?.length)
                  throw new Error(
                    createPhotosRes.data.errors[0].message.message
                  );
                // ! log create result
                this.SET_SNACKBAR(true);
                this.SET_SNACKBAR_COLOR("success");
                this.SET_SNACKBAR_TEXT("Images uploaded successfullly.");

                this.closeImageInsertDialog();
                this.$refs.imagesForm.reset();
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
