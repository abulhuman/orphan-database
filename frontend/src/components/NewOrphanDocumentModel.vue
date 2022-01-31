<template>
  <v-form ref="documentForm" v-model="validDocumentForm" lazy-validation>
    <v-container>
      <v-row>
        <!-- Orphan Documents -->
        <template>
          <v-col sm="12">
            <div class="title mt-3 mb-n5">Orphan Documents</div>
          </v-col>
          <!-- Birth Certificate -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="birthCertificateFile"
              accept="image/*, .pdf"
              counter
              chips
              prepend-icon="mdi-file-document-outline"
              :rules="[rules.required]"
              label="Birth Certificate"
              @change="toggleBirthCertificateInput($event)"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleBirthCertificateDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>

                <!-- preview image popup -->
                <v-dialog v-model="birthCertificateDialog">
                  <v-container>
                    <v-row>
                      <!-- <v-col>what</v-col> -->
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon dark @click="toggleBirthCertificateDialog">
                          mdi-close
                        </v-icon>
                      </v-col>
                    </v-row>

                    <v-img
                      height="82vh"
                      :src="birthCertificatePreview"
                      contain
                      alt="birthCertificateimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
          <!-- Portrait Photo -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="portraitPhotoFile"
              accept="image/*, .pdf"
              counter
              chips
              prepend-icon="mdi-camera"
              label="Portrait Photo"
              @change="togglePortraitPhotoInput($event)"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="togglePortraitPhotoDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>
                <!-- preview image popup -->
                <v-dialog v-model="portraitPhotoDialog">
                  <v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon dark @click="togglePortraitPhotoDialog"
                          >mdi-close</v-icon
                        ></v-col
                      >
                    </v-row>

                    <v-img
                      height="82vh"
                      :src="portraitPhotoPreview"
                      contain
                      alt="portraitPhotoimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
          <!-- Orphan Id -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="orphanIdFile"
              accept="image/*, .pdf"
              counter
              chips
              prepend-icon="mdi-file-document-outline"
              label="Orphan Id"
              @change="toggleOrphanIdInput"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleOrphanIdDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>
                <!-- preview image popup -->
                <v-dialog v-model="orphanIdDialog">
                  <v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon dark @click="toggleOrphanIdDialog"
                          >mdi-close</v-icon
                        ></v-col
                      >
                    </v-row>
                    <v-img
                      height="82vh"
                      :src="orphanIdPreview"
                      contain
                      alt="orphanIdimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
          <!-- Orphan Passport -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="orphanPassportFile"
              accept="image/*, .pdf"
              counter
              prepend-icon="mdi-file-document-outline"
              label="Orphan Passport"
              @change="toggleOrphanPassportInput"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleOrphanPassportDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>
                <!-- preview image popup -->
                <v-dialog v-model="orphanPassportDialog">
                  <v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon dark @click="toggleOrphanPassportDialog"
                          >mdi-close</v-icon
                        ></v-col
                      >
                    </v-row>
                    <v-img
                      height="82vh"
                      :src="orphanPassportPreview"
                      contain
                      alt="orphanPassportimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
        </template>
        <!-- Father Documents -->
        <template>
          <v-col sm="12">
            <div class="title mt-n3 mb-n5">Father Documents</div>
          </v-col>
          <!-- Father Death Certificate -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="fatherDeathCertificateFile"
              accept="image/*, .pdf"
              counter
              prepend-icon="mdi-file-document-outline"
              :rules="[rules.required]"
              label="Death Certificate"
              @change="toggleFatherDeathCertificateInput"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleFatherDeathCertificateDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>
                <!-- preview image popup -->
                <v-dialog v-model="fatherDeathCertificateDialog">
                  <v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon dark @click="toggleFatherDeathCertificateDialog"
                          >mdi-close</v-icon
                        ></v-col
                      >
                    </v-row>
                    <v-img
                      height="82vh"
                      :src="fatherDeathCertificatePreview"
                      contain
                      alt="fatherDeathCertificateimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
        </template>
        <!-- Guardian Documents -->
        <template>
          <v-col sm="12">
            <div class="title mt-n3 mb-n5">Guardian Documents</div>
          </v-col>
          <!-- Guardian Id -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="guardianIdFile"
              accept="image/*, .pdf"
              counter
              prepend-icon="mdi-file-document-outline"
              :rules="[rules.required]"
              label="Guardian Id"
              @change="toggleGuardianIdInput"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleGuardianIdDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>
                <!-- preview image popup -->
                <v-dialog v-model="guardianIdDialog">
                  <v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon dark @click="toggleGuardianIdDialog"
                          >mdi-close</v-icon
                        ></v-col
                      >
                    </v-row>
                    <v-img
                      height="82vh"
                      :src="guardianIdPreview"
                      contain
                      alt="guardianIdimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
          <!-- Guardian Confirmation Letter -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="guardianConfirmationLetterFile"
              accept="image/*, .pdf"
              counter
              prepend-icon="mdi-file-document-outline"
              :rules="[rules.required]"
              label="Guardian Confirmation Letter"
              @change="toggleGuardianConfirmationLetterInput"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleGuardianConfirmationLetterDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>
                <!-- preview image popup -->
                <v-dialog v-model="guardianConfirmationLetterDialog">
                  <v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon
                          dark
                          @click="toggleGuardianConfirmationLetterDialog"
                          >mdi-close</v-icon
                        ></v-col
                      >
                    </v-row>
                    <v-img
                      height="82vh"
                      :src="guardianConfirmationLetterPreview"
                      contain
                      alt="guardianConfirmationLetterimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
          <!-- Guardian Legal Confirmation Letter -->
          <v-col cols="12" sm="6" md="4">
            <v-file-input
              v-model="guardianLegalConfirmationLetterFile"
              accept="image/*, .pdf"
              counter
              prepend-icon="mdi-file-document-outline"
              :rules="[rules.required]"
              label="Guardian Legal Confirmation Letter"
              @change="toggleGuardianLegalConfirmationLetterInput"
            >
              <template v-slot:append>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      class="ml-auto"
                      v-bind="attrs"
                      v-on="on"
                      @click="toggleGuardianLegalConfirmationLetterDialog"
                    >
                      mdi-file-eye-outline
                    </v-icon>
                  </template>
                  <span>Preview</span>
                </v-tooltip>
                <!-- preview image popup -->
                <v-dialog v-model="guardianLegalConfirmationLetterDialog">
                  <v-container>
                    <v-row>
                      <v-spacer></v-spacer>
                      <v-col class="mr-n12" sm="1">
                        <v-icon
                          dark
                          @click="toggleGuardianLegalConfirmationLetterDialog"
                          >mdi-close</v-icon
                        ></v-col
                      >
                    </v-row>
                    <v-img
                      height="82vh"
                      :src="guardianLegalConfirmationLetterPreview"
                      contain
                      alt="guardianLegalConfirmationLetterimage"
                    ></v-img>
                  </v-container>
                </v-dialog>
              </template>
            </v-file-input>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    updatedOrphan: {
      type: Object
    },
    orphanVillageId: {
      type: String
    },
    save: {
      type: Boolean
    },
    cancel: {
      type: Boolean
    }
  },
  data() {
    return {
      // dialog
      dialog: false,
      validDocumentForm: false,
      formHasErrors: false,
      orphan: {
        birthCertificateUrl: null,
        idCardUrl: null,
        passportUrl: null,
        father: {
          deathCertificateUrl: null
        },
        guardian: {
          iDCardUrl: null,
          confirmationLetterUrl: null,
          legalConfirmationLetterUrl: null
        },
        photos: {
          portraitUrl: null
        }
      },
      rules: {
        required: (value) => !!value || 'Required.'
      },
      birthCertificateDialog: false,
      birthCertificateFile: null,
      birthCertificatePreview: null,
      portraitPhotoDialog: false,
      portraitPhotoFile: null,
      portraitPhotoPreview: null,
      orphanIdDialog: false,
      orphanIdFile: null,
      orphanIdPreview: null,
      orphanPassportDialog: false,
      orphanPassportFile: null,
      orphanPassportPreview: null,
      fatherDeathCertificateDialog: false,
      fatherDeathCertificateFile: null,
      fatherDeathCertificatePreview: null,
      guardianIdDialog: false,
      guardianIdFile: null,
      guardianIdPreview: null,
      guardianConfirmationLetterDialog: false,
      guardianConfirmationLetterFile: null,
      guardianConfirmationLetterPreview: null,
      guardianLegalConfirmationLetterDialog: false,
      guardianLegalConfirmationLetterFile: null,
      guardianLegalConfirmationLetterPreview: null
    };
  },
  computed: {
    orphanDocumentSave: function() {
      return this.save;
    },
    orphanDocumentCancel: function() {
      return this.cancel;
    }
  },
  watch: {
    orphanDocumentSave(val) {
      if (val) this.documentDialogSave();
    },
    orphanDocumentCancel(val) {
      if (val) this.documentDialogCancel();
    },
    validDocumentForm(val) {
      this.$emit('documentError', val);
    }
  },
  methods: {
    // assign the entered image to preview
    // Birth Certificate
    toggleBirthCertificateInput() {
      if (this.birthCertificateFile) {
        this.birthCertificatePreview = URL.createObjectURL(
          this.birthCertificateFile
        );
      }
    },
    toggleBirthCertificateDialog() {
      this.birthCertificateDialog = !this.birthCertificateDialog;
    },
    // Portrait Photo
    togglePortraitPhotoInput() {
      if (this.portraitPhotoFile) {
        this.portraitPhotoPreview = URL.createObjectURL(this.portraitPhotoFile);
      }
    },
    togglePortraitPhotoDialog() {
      this.portraitPhotoDialog = !this.portraitPhotoDialog;
    },
    // Orphan Id
    toggleOrphanIdInput() {
      if (this.orphanIdFile) {
        this.orphanIdPreview = URL.createObjectURL(this.orphanIdFile);
      }
    },
    toggleOrphanIdDialog() {
      this.orphanIdDialog = !this.orphanIdDialog;
    },
    // Orphan Passport
    toggleOrphanPassportInput() {
      if (this.orphanPassportFile) {
        this.orphanPassportPreview = URL.createObjectURL(
          this.orphanPassportFile
        );
      }
    },
    toggleOrphanPassportDialog() {
      this.orphanPassportDialog = !this.orphanPassportDialog;
    },
    // Father Death Certificate
    toggleFatherDeathCertificateInput() {
      if (this.fatherDeathCertificateFile) {
        this.fatherDeathCertificatePreview = URL.createObjectURL(
          this.fatherDeathCertificateFile
        );
      }
    },
    toggleFatherDeathCertificateDialog() {
      this.fatherDeathCertificateDialog = !this.fatherDeathCertificateDialog;
    },
    // Guardian Id
    toggleGuardianIdInput() {
      if (this.guardianIdFile) {
        this.guardianIdPreview = URL.createObjectURL(this.guardianIdFile);
      }
    },
    toggleGuardianIdDialog() {
      this.guardianIdDialog = !this.guardianIdDialog;
    },
    // Guardian Confirmation Letter
    toggleGuardianConfirmationLetterInput() {
      if (this.guardianConfirmationLetterFile) {
        this.guardianConfirmationLetterPreview = URL.createObjectURL(
          this.guardianConfirmationLetterFile
        );
      }
    },
    toggleGuardianConfirmationLetterDialog() {
      this.guardianConfirmationLetterDialog = !this
        .guardianConfirmationLetterDialog;
    },
    // Guardian Legal Confirmation Letter
    toggleGuardianLegalConfirmationLetterInput() {
      if (this.guardianLegalConfirmationLetterFile) {
        this.guardianLegalConfirmationLetterPreview = URL.createObjectURL(
          this.guardianLegalConfirmationLetterFile
        );
      }
    },
    toggleGuardianLegalConfirmationLetterDialog() {
      this.guardianLegalConfirmationLetterDialog = !this
        .guardianLegalConfirmationLetterDialog;
    },

    documentDialogClose() {
      this.dialog = false;
    },

    documentDialogReset() {
      this.formHasErrors = false;
      this.$refs.documentForm.reset();
    },

    async documentDialogSave() {
      this.formHasErrors = false;
      if (this.$refs.documentForm.validate()) {
        const documents = {
          orphanBirthCertificateFormData: null,
          orphanPortraitPhotoFormData: null,
          orphanIdFormData: null,
          orphanPassportFormData: null,
          fatherDeathCertificateFormData: null,
          guardianIdFormData: null,
          guardianConfirmationLetterFormData: null,
          guardianLegalConfirmationLetterFormData: null
        };

        documents.orphanBirthCertificateFormData = new FormData();
        documents.orphanBirthCertificateFormData.append(
          'document',
          this.birthCertificateFile,
          this.birthCertificateFile.name
        );
        this.orphan.birthCertificateUrl = await axios
          .post(`/document/`, documents.orphanBirthCertificateFormData)
          .then((res) => res.data)
          .catch((err) => console.warn(err));

        documents.fatherDeathCertificateFormData = new FormData();
        documents.fatherDeathCertificateFormData.append(
          'document',
          this.fatherDeathCertificateFile,
          this.fatherDeathCertificateFile.name
        );

        documents.guardianIdFormData = new FormData();
        documents.guardianIdFormData.append(
          'document',
          this.guardianIdFile,
          this.guardianIdFile.name
        );

        documents.guardianConfirmationLetterFormData = new FormData();
        documents.guardianConfirmationLetterFormData.append(
          'document',
          this.guardianConfirmationLetterFile,
          this.guardianConfirmationLetterFile.name
        );

        documents.guardianLegalConfirmationLetterFormData = new FormData();
        documents.guardianLegalConfirmationLetterFormData.append(
          'document',
          this.guardianLegalConfirmationLetterFile,
          this.guardianLegalConfirmationLetterFile.name
        );

        if (this.portraitPhotoFile) {
          documents.orphanPortraitPhotoFormData = new FormData();
          documents.orphanPortraitPhotoFormData.append(
            'image',
            this.portraitPhotoFile,
            this.portraitPhotoFile.name
          );
        }

        if (this.orphanIdFile) {
          documents.orphanIdFormData = new FormData();
          documents.orphanIdFormData.append(
            'document',
            this.orphanIdFile,
            this.orphanIdFile.name
          );
        }

        if (this.orphanPassportFile) {
          documents.orphanPassportFormData = new FormData();
          documents.orphanPassportFormData.append(
            'document',
            this.orphanPassportFile,
            this.orphanPassportFile.name
          );
        }

        // console.log('documents', documents);

        this.$emit('documentDone', documents);
        this.$emit('documentRefs', this.$refs.documentForm);
        this.documentDialogClose();
      } else {
        this.formHasErrors = true;
      }
    },

    documentDialogCancel() {
      this.documentDialogReset();
      this.documentDialogClose();
    }
  }
};
</script>
