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
import axios from "axios";

export default {
  props: {
    updatedOrphan: {
      type: Object,
    },
    orphanVillageId: {
      type: String,
    },
    save: {
      type: Boolean,
    },
    cancel: {
      type: Boolean,
    },
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
          deathCertificateUrl: null,
        },
        guardian: {
          iDCardUrl: null,
          confirmationLetterUrl: null,
          legalConfirmationLetterUrl: null,
        },
        photos: {
          portraitUrl: null,
        },
      },
      rules: {
        required: (value) => !!value || "Required.",
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
      guardianLegalConfirmationLetterPreview: null,
    };
  },
  computed: {
    orphanDocumentSave: function() {
      return this.save;
    },
    orphanDocumentCancel: function() {
      return this.cancel;
    },
  },
  watch: {
    orphanDocumentSave(val) {
      if (val) this.documentDialogSave();
    },
    orphanDocumentCancel(val) {
      if (val) this.documentDialogCancel();
    },
    validDocumentForm(val) {
      this.$emit("documentError", val);
    },
  },
  methods: {
    // assign the entered image to preview
    // Birth Certificate
    toggleBirthCertificateInput() {
      if (this.birthCertificateFile) {
        this.birthCertificatePreview = URL.createObjectURL(
          this.birthCertificateFile
        );
        console.log("Preview", this.birthCertificatePreview);
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
          guardianLegalConfirmationLetterFormData: null,
        };

        documents.orphanBirthCertificateFormData = new FormData();
        documents.orphanBirthCertificateFormData.append(
          "orphanBirthCertificate",
          this.birthCertificateFile,
          this.birthCertificateFile.name
        );
        this.orphan.birthCertificateUrl = await axios
          .post(
            `/public/images/orphanBirthCertificate/`,
            documents.orphanBirthCertificateFormData
          )
          .then((res) => res.data)
          .catch((err) => console.warn(err));

        documents.fatherDeathCertificateFormData = new FormData();
        documents.fatherDeathCertificateFormData.append(
          "fatherDeathCertificate",
          this.fatherDeathCertificateFile,
          this.fatherDeathCertificateFile.name
        );

        documents.guardianIdFormData = new FormData();
        documents.guardianIdFormData.append(
          "guardianIDCard",
          this.guardianIdFile,
          this.guardianIdFile.name
        );

        documents.guardianConfirmationLetterFormData = new FormData();
        documents.guardianConfirmationLetterFormData.append(
          "guardianConfirmationLetter",
          this.guardianConfirmationLetterFile,
          this.guardianConfirmationLetterFile.name
        );

        documents.guardianLegalConfirmationLetterFormData = new FormData();
        documents.guardianLegalConfirmationLetterFormData.append(
          "guardianLegalConfirmationLetter",
          this.guardianLegalConfirmationLetterFile,
          this.guardianLegalConfirmationLetterFile.name
        );

        if (this.portraitPhotoFile) {
          documents.orphanPortraitPhotoFormData = new FormData();
          documents.orphanPortraitPhotoFormData.append(
            "orphanPhotosPhotoPortrait",
            this.portraitPhotoFile,
            this.portraitPhotoFile.name
          );
        }

        if (this.orphanIdFile) {
          documents.orphanIdFormData = new FormData();
          documents.orphanIdFormData.append(
            "orphanIdCard",
            this.orphanIdFile,
            this.orphanIdFile.name
          );
        }

        if (this.orphanPassportFile) {
          documents.orphanPassportFormData = new FormData();
          documents.orphanPassportFormData.append(
            "orphanPassport",
            this.orphanPassportFile,
            this.orphanPassportFile.name
          );
        }

        console.log("documents", documents);

        this.$emit("documentDone", documents);
        this.documentDialogClose();
      } else {
        this.formHasErrors = true;
      }
    },

    // async documentDialogSaveOld() {
    //   this.formHasErrors = false;
    //   if (this.$refs.documentForm.validate()) {
    //     const birthCertificateFormData = new FormData();
    //     birthCertificateFormData.append(
    //       "orphanBirthCertificate",
    //       this.birthCertificateFile,
    //       this.birthCertificateFile.name
    //     );

    //     const fatherDeathCertificateFormData = new FormData();
    //     fatherDeathCertificateFormData.append(
    //       "fatherDeathCertificate",
    //       this.fatherDeathCertificateFile,
    //       this.fatherDeathCertificateFile.name
    //     );
    //     const guardianIdFormData = new FormData();
    //     guardianIdFormData.append(
    //       "guardianIDCard",
    //       this.guardianIdFile,
    //       this.guardianIdFile.name
    //     );
    //     const guardianConfirmationLetterFormData = new FormData();
    //     guardianConfirmationLetterFormData.append(
    //       "guardianConfirmationLetter",
    //       this.guardianConfirmationLetterFile,
    //       this.guardianConfirmationLetterFile.name
    //     );
    //     const guardianLegalConfirmationLetterFormData = new FormData();
    //     guardianLegalConfirmationLetterFormData.append(
    //       "guardianLegalConfirmationLetter",
    //       this.guardianLegalConfirmationLetterFile,
    //       this.guardianLegalConfirmationLetterFile.name
    //     );

    //     this.orphan = Object.assign(this.orphan ?? {}, this.updatedOrphan);

    //     this.orphan.dateOfBirth = this.isoDateFormatter(
    //       this.orphan.dateOfBirth
    //     );

    //     this.orphan.father = Object.assign(
    //       this.orphan.father ?? {},
    //       this.updatedOrphan?.father
    //     );

    //     this.orphan.mother = Object.assign(
    //       this.orphan.mother ?? {},
    //       this.updatedOrphan?.mother
    //     );

    //     this.orphan.House_property = Object.assign(
    //       this.orphan.House_property ?? {},
    //       this.updatedOrphan?.House_property
    //     );

    //     this.orphan.educationalRecord = Object.assign(
    //       this.orphan.educationalRecord ?? {},
    //       this.updatedOrphan?.educationalRecord
    //     );

    //     this.orphan.guardian = Object.assign(
    //       this.orphan.guardian ?? {},
    //       this.updatedOrphan?.guardian
    //     );

    //     this.orphan.father.dateOfDeath = this.isoDateFormatter(
    //       this.orphan.father.dateOfDeath
    //     );
    //     this.orphan.father.dateOfBirth = this.isoDateFormatter(
    //       this.orphan.father.dateOfBirth
    //     );

    //     this.orphan.father.deathCertificateUrl = await axios
    //       .post(
    //         `/public/images/fatherDeathCertificate/`,
    //         fatherDeathCertificateFormData
    //       )
    //       .then((res) => res.data)
    //       .catch((err) => console.warn(err));

    //     const father = await this.getOrphanFather(
    //       this.orphan.father.firstName,
    //       this.orphan.father.lastName,
    //       this.orphan.father.dateOfDeath,
    //       this.orphan.father.causeOfDeath,
    //       this.orphan.father.dateOfBirth,
    //       this.orphan.father.deathCertificateUrl
    //     );

    //     const educationalRecord = await this.getOrphanEducationalRecord(
    //       this.orphan.educationalRecord.enrollmentStatus,
    //       this.orphan.educationalRecord.schoolName,
    //       this.orphan.educationalRecord.typeOfSchool,
    //       this.orphan.educationalRecord.year,
    //       this.orphan.educationalRecord.level,
    //       this.orphan.educationalRecord.reason
    //     );

    //     this.orphan.mother.dateOfBirth = this.isoDateFormatter(
    //       this.orphan.mother.dateOfBirth
    //     );
    //     this.orphan.mother.dateOfDeath = this.isoDateFormatter(
    //       this.orphan.mother.dateOfDeath
    //     );

    //     const mother = await this.getOrphanMother(
    //       this.orphan.mother.firstName,
    //       this.orphan.mother.middleName,
    //       this.orphan.mother.lastName,
    //       this.orphan.mother.vitalStatus,
    //       this.orphan.mother.dateOfBirth,
    //       this.orphan.mother.dateOfDeath,
    //       this.orphan.mother.causeOfDeath,
    //       this.orphan.mother.maritalStatus,
    //       this.orphan.mother.mobileNumber,
    //       this.orphan.mother.monthlyExpense
    //     );

    //     this.orphan.guardian.dateOfBirth = this.isoDateFormatter(
    //       this.orphan.guardian.dateOfBirth
    //     );

    //     this.orphan.guardian.idCardUrl = await axios
    //       .post(`/public/images/guardianIDCard/`, guardianIdFormData)
    //       .then((res) => res.data)
    //       .catch((err) => console.warn(err));

    //     this.orphan.guardian.confirmationLetterUrl = await axios
    //       .post(
    //         `/public/images/guardianConfirmationLetter/`,
    //         guardianConfirmationLetterFormData
    //       )
    //       .then((res) => res.data)
    //       .catch((err) => console.warn(err));

    //     this.orphan.guardian.legalConfirmationLetterUrl = await axios
    //       .post(
    //         `/public/images/guardianLegalConfirmationLetter/`,
    //         guardianLegalConfirmationLetterFormData
    //       )
    //       .then((res) => res.data)
    //       .catch((err) => console.warn(err));

    //     const guardian = await this.getOrphanGuardian(
    //       this.orphan.guardian.firstName,
    //       this.orphan.guardian.middleName,
    //       this.orphan.guardian.lastName,
    //       this.orphan.guardian.dateOfBirth,
    //       this.orphan.guardian.gender,
    //       this.orphan.guardian.relationToOrphan,
    //       this.orphan.guardian.nationality,
    //       this.orphan.guardian.mobileNumber,
    //       this.orphan.guardian.telephoneNumber,
    //       this.orphan.guardian.email,
    //       this.orphan.guardian.idCardUrl,
    //       this.orphan.guardian.confirmationLetterUrl,
    //       this.orphan.guardian.legalConfirmationLetterUrl
    //     );

    //     const houseProperty = await this.getHouseProperty(
    //       this.orphan.House_property.housingSituation,
    //       this.orphan.House_property.otherProperty
    //     );

    //     this.orphan.birthCertificateUrl = await axios
    //       .post(
    //         `/public/images/orphanBirthCertificate/`,
    //         birthCertificateFormData
    //       )
    //       .then((res) => res.data)
    //       .catch((err) => console.warn(err));

    //     if (this.orphanIdFile) {
    //       const orphanIdFormData = new FormData();
    //       orphanIdFormData.append(
    //         "orphanIdCard",
    //         this.orphanIdFile,
    //         this.orphanIdFile.name
    //       );
    //       this.orphan.idCardUrl = await axios
    //         .post(`/public/images/orphanIdCard/`, orphanIdFormData)
    //         .then((res) => res.data)
    //         .catch((err) => console.warn(err));
    //     }

    //     if (this.orphanPassportFile) {
    //       const orphanPassportFormData = new FormData();
    //       orphanPassportFormData.append(
    //         "orphanPassport",
    //         this.orphanPassportFile,
    //         this.orphanPassportFile.name
    //       );
    //       this.orphan.passportUrl = await axios
    //         .post(`/public/images/orphanPassport/`, orphanPassportFormData)
    //         .then((res) => res.data)
    //         .catch((err) => console.warn(err));
    //     }

    //     const registeredOrphan = await this.registerOrphan(
    //       this.orphan.firstName,
    //       this.orphan.gender,
    //       this.orphan.placeOfBirth,
    //       this.orphan.dateOfBirth,
    //       this.orphan.spokenLanguages,
    //       this.orphan.hobbies,
    //       this.orphan.religion,
    //       this.orphan.healthDescription || "N/A",
    //       this.orphan.psychologicalStatus,
    //       this.orphan.idCardUrl || "idCardUrlPlaceHolder",
    //       this.orphan.passportUrl || "passportUrlPlaceHolder",
    //       this.orphan.birthCertificateUrl,
    //       father.id,
    //       educationalRecord.id,
    //       guardian.id,
    //       mother.id,
    //       houseProperty.id,
    //       parseInt(this.orphanVillageId)
    //     );

    //     const status = await this.createSponsorshipStatus(registeredOrphan.id);

    //     console.log("Status", status);

    //     if (this.portraitPhotoFile) {
    //       const portraitPhotoFormData = new FormData();
    //       portraitPhotoFormData.append(
    //         "orphanPhotosPhotoPortrait",
    //         this.portraitPhotoFile,
    //         this.portraitPhotoFile.name
    //       );

    //       axios
    //         .post(
    //           `/public/images/orphanPhotosPhotoPortrait/`,
    //           portraitPhotoFormData
    //         )
    //         .then((res) => {
    //           axios
    //             .post(`/graphql/`, {
    //               query: `mutation createOrphanPhotos(
    //                   $photoPortraitUrl: String!
    //                   $orphanId: ID
    //                   ) {
    //                     createOrphanPhotos(
    //                       photoPortraitUrl: $photoPortraitUrl
    //                       orphanId: $orphanId
    //                       ) { id }
    //                   }`,
    //               variables: {
    //                 photoPortraitUrl: res.data,
    //                 orphanId: registeredOrphan.id,
    //               },
    //             })
    //             .then((res) => res.data.data.createOrphanPhotos)
    //             .catch((err) => console.warn(err));
    //         })
    //         .catch((err) => console.warn(err));
    //     }

    //     this.$emit("registrationDone", {
    //       documentForm: this.$refs.documentForm,
    //       newOrphanId: registeredOrphan.id,
    //     });
    //     this.documentDialogClose();
    //   } else {
    //     this.formHasErrors = true;
    //   }
    // },

    documentDialogCancel() {
      this.documentDialogReset();
      this.documentDialogClose();
    },
  },
};
</script>
