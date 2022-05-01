<template>
  <v-dialog v-model="dialog">
    <v-stepper
      v-model="currentRegistrationPosition"
      max-width="90%"
      class="mx-auto"
    >
      <v-stepper-header>
        <v-stepper-step :complete="currentRegistrationPosition > 1" step="1">
          Personal
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentRegistrationPosition > 2" step="2">
          Education
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentRegistrationPosition > 3" step="3">
          Guardian
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentRegistrationPosition > 4" step="4">
          Family
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step :complete="currentRegistrationPosition > 5" step="5">
          Document
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!-- Personal Stepper -->
        <v-stepper-content step="1">
          <new-orphan-personal-model
            :save="savePersonalData"
            @personalDone="addPersonalInfo($event)"
            @personalRefs="addPersonalRef($event)"
            @personalError="handlePersonalError($event)"
          />

          <v-btn
            color="blue darken-1"
            text
            @click="savePersonalInfo"
            :disabled="!personalFormError"
          >
            Continue
          </v-btn>
        </v-stepper-content>

        <!-- Education Stepper -->
        <v-stepper-content step="2">
          <new-orphan-education-model
            :save="saveEducationalData"
            :updatedOrphan="orphan"
            @educationDone="addEducationalInfo($event)"
            @educationRefs="addEducationalRef($event)"
            @educationalError="handleEducationalError($event)"
          />

          <v-btn color="red darken-1" text @click="cancelEducationalInfo">
            Back
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveEducationalInfo"
            :disabled="!educationalFormError"
          >
            Continue
          </v-btn>
        </v-stepper-content>

        <!-- Guardian Stepper -->
        <v-stepper-content step="3">
          <new-orphan-guardian-model
            :save="saveGuardianData"
            @guardianDone="addGuardianInfo($event)"
            @guardianRefs="addGuardianRef($event)"
            @guardianError="handleGuardianError($event)"
          />

          <v-btn color="red darken-1" text @click="cancelGuardianInfo">
            Back
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveGuardianInfo"
            :disabled="!guardianFormError"
          >
            Continue
          </v-btn>
        </v-stepper-content>

        <!-- Family Stepper -->
        <v-stepper-content step="4">
          <new-orphan-family-model
            :save="saveFamilyData"
            @familyDone="addFamilyInfo($event)"
            @familyRefs="addFamilyRef($event)"
            @familyError="handleFamilyError($event)"
          />

          <v-btn color="red darken-1" text @click="cancelFamilyInfo">
            Back
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveFamilyInfo"
            :disabled="!familyFormError"
          >
            Continue
          </v-btn>
        </v-stepper-content>

        <!-- Document Stepper -->
        <v-stepper-content step="5">
          <new-orphan-document-model
            :save="saveDocumentData"
            @documentDone="addDocumentInfo($event)"
            @documentRefs="addDocumentRef($event)"
            @documentError="handleDocumentError($event)"
          />

          <v-btn color="red darken-1" text @click="cancelDocumentInfo">
            Back
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveDocumentInfo"
            :disabled="!documentFormError"
          >
            Save
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';
import NewOrphanPersonalModel from './NewOrphanPersonalModel.vue';
import NewOrphanEducationModel from './NewOrphanEducationModel.vue';
import NewOrphanGuardianModel from './NewOrphanGuardianModel.vue';
import NewOrphanFamilyModel from './NewOrphanFamilyModel.vue';
import NewOrphanDocumentModel from './NewOrphanDocumentModel.vue';

export default {
  components: {
    NewOrphanPersonalModel,
    NewOrphanEducationModel,
    NewOrphanGuardianModel,
    NewOrphanFamilyModel,
    NewOrphanDocumentModel
  },
  props: {
    newOrphanDialog: {
      type: Boolean
    },
    villageId: {
      type: String
    }
  },
  data() {
    return {
      dialog: false,
      currentRegistrationPosition: 1,
      // registrationSteps: 5,
      orphan: null,
      savePersonalData: false,
      personalRef: null,
      personalFormError: false,
      saveEducationalData: false,
      educationalRef: null,
      educationalFormError: false,
      saveGuardianData: false,
      guardianRef: null,
      guardianFormError: false,
      saveFamilyData: false,
      familyRef: null,
      familyFormError: false,
      saveDocumentData: false,
      documentRef: null,
      documentFormError: false
    };
  },

  watch: {
    // steps (val) {
    //   if (this.currentRegistrationPosition > val) {
    //     this.currentRegistrationPosition = val
    //   }
    // },
    newOrphanDialog(val) {
      this.dialog = val;
    },
    dialog(val) {
      if (val === false) this.$emit('dialogClosed', false);
      val || this.orphanDialogClose();
    }
  },

  methods: {
    ...mapMutations([
      'SET_SNACKBAR',
      'SET_SNACKBAR_COLOR',
      'SET_SNACKBAR_TEXT'
    ]),

    savePersonalInfo() {
      this.savePersonalData = true;
    },
    addPersonalInfo(updatedOrphan) {
      // assings orphan data from the personal form to the orphan object
      this.orphan = Object.assign(this.orphan ?? {}, updatedOrphan);
      // this variables change enables for the proper functioning of the personal continue button
      this.savePersonalData = false;
      // changes the steeper to the next
      this.currentRegistrationPosition = 2;
      console.log('personalDone', updatedOrphan);
    },
    addPersonalRef(personalRef) {
      this.persoanlRef = personalRef;
    },
    handlePersonalError(error) {
      this.personalFormError = error;
    },

    // ------------------------------

    saveEducationalInfo() {
      this.saveEducationalData = true;
    },
    cancelEducationalInfo() {
      this.currentRegistrationPosition = 1;
    },
    addEducationalInfo(updatedOrphan) {
      // set orphan to empty object literal if orphan object is null/undefined
      this.orphan = this.orphan ?? {};
      // assings orphan educational data from the education form to the orphan object
      this.orphan.educationalRecord = Object.assign(
        this.orphan.educationalRecord ?? {},
        updatedOrphan.educationalRecord
      );
      // creates hobbies property on orphan object and assign it a value from the updated orphan object
      this.orphan['hobbies'] = updatedOrphan.hobbies;
      // this variables change enables for the proper functioning of the educational continue button
      this.saveEducationalData = false;
      // changes the steeper to the next
      this.currentRegistrationPosition = 3;
      console.log('educationalDone', updatedOrphan);
    },
    addEducationalRef(educationalRef) {
      this.educationalRef = educationalRef;
    },
    handleEducationalError(error) {
      this.educationalFormError = error;
    },

    // ------------------------------

    saveGuardianInfo() {
      this.saveGuardianData = true;
    },
    cancelGuardianInfo() {
      this.currentRegistrationPosition = 2;
    },
    addGuardianInfo(updatedOrphan) {
      // set orphan to empty object literal if orphan object is null or undefined
      this.orphan = this.orphan ?? {};
      // assings orphan guardian data from the guardian form to the orphan object
      this.orphan.guardian = Object.assign(
        this.orphan.guardian ?? {},
        updatedOrphan.guardian
      );
      // this variables change enables for the proper functioning of the guardian continue button
      this.saveGuardianData = false;
      // this has to point to the next steeper not the previous
      this.currentRegistrationPosition = 4;
      console.log('guardianDone', updatedOrphan);
    },
    addGuardianRef(guardianRef) {
      this.guardianRef = guardianRef;
    },
    handleGuardianError(error) {
      this.guardianFormError = error;
    },

    // ------------------------------

    saveFamilyInfo() {
      this.saveFamilyData = true;
    },
    cancelFamilyInfo() {
      this.currentRegistrationPosition = 3;
    },
    addFamilyInfo(updatedOrphan) {
      // set orphan to empty object literal if orphan object is null or undefined
      this.orphan = this.orphan ?? {};
      // assings orphan family data from the family form to the orphan object
      this.orphan.father = Object.assign(
        this.orphan.father ?? {},
        updatedOrphan.father
      );
      this.orphan.mother = Object.assign(
        this.orphan.mother ?? {},
        updatedOrphan.mother
      );
      this.orphan.House_property = Object.assign(
        this.orphan.House_property ?? {},
        updatedOrphan.House_property
      );
      // this variables change enables for the proper functioning of the family continue button
      this.saveFamilyData = false;
      // this has to point to the next steeper not the previous
      this.currentRegistrationPosition = 5;
      console.log('familyDone', updatedOrphan);
    },
    addFamilyRef(familyRef) {
      this.familyRef = familyRef;
    },
    handleFamilyError(error) {
      this.familyFormError = error;
    },

    // ------------------------------

    saveDocumentInfo() {
      this.saveDocumentData = true;
    },
    cancelDocumentInfo() {
      this.currentRegistrationPosition = 4;
    },
    async addDocumentInfo(documents) {
      // set orphan to empty object literal if orphan object is null or undefined
      this.orphan = this.orphan ?? {};
      // assings orphan document data from the document form to the orphan object

      this.orphan.birthCertificateUrl = await axios
        .post(`/document/`, documents.orphanBirthCertificateFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.photoPortraitUrl = await axios
        .post(`/img/`, documents.orphanPortraitPhotoFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.idCardUrl = await axios
        .post(`/document/`, documents.orphanIdFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.passportUrl = await axios
        .post(`/document/`, documents.orphanPassportFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.father.deathCertificateUrl = await axios
        .post(`/document/`, documents.fatherDeathCertificateFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.guardian.idCardUrl = await axios
        .post(`/document/`, documents.guardianIdFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.guardian.confirmationLetterUrl = await axios
        .post(`/document/`, documents.guardianConfirmationLetterFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.guardian.legalConfirmationLetterUrl = await axios
        .post(`/document/`, documents.guardianLegalConfirmationLetterFormData)
        .then((res) => res.data)
        .catch((err) => console.warn(err));

      this.orphan.dateOfBirth = this.isoDateFormatter(this.orphan.dateOfBirth);

      this.orphan.father.dateOfDeath = this.isoDateFormatter(
        this.orphan.father.dateOfDeath
      );
      this.orphan.father.dateOfBirth = this.isoDateFormatter(
        this.orphan.father.dateOfBirth
      );

      this.orphan.mother.dateOfBirth = this.isoDateFormatter(
        this.orphan.mother.dateOfBirth
      );
      this.orphan.mother.dateOfDeath = this.isoDateFormatter(
        this.orphan.mother.dateOfDeath
      );

      this.orphan.guardian.dateOfBirth = this.isoDateFormatter(
        this.orphan.guardian.dateOfBirth
      );

      const registeredOrphan = await this.registerOrphanWithBaselineData(
        this.orphan.orphanCode,
        this.orphan.firstName,
        this.orphan.gender,
        this.orphan.placeOfBirth,
        this.orphan.dateOfBirth,
        this.orphan.spokenLanguages,
        'gradeAgeMismatchReasonPlaceholder',
        this.orphan.hobbies,
        this.orphan.religion,
        this.orphan.idCardUrl || 'idCardUrlPlaceHolder',
        this.orphan.passportUrl || 'passportUrlPlaceHolder',
        this.orphan.birthCertificateUrl,
        // "accountNumberPlaceholder",
        // "currentBalancePlaceholder",
        this.orphan.father,
        this.orphan.mother,
        this.orphan.guardian,
        this.orphan.House_property,
        {
          healthDescription: this.orphan.healthDescription || 'N/A',
          psychologicalStatus: this.orphan.psychologicalStatus
        },
        {
          photoPortraitUrl: this.orphan.photoPortraitUrl,
          photoLongUrl: 'photoLongUrlPlaceholder'
        },
        this.orphan.educationalRecord,
        parseInt(this.villageId)
      );

      console.log('Registered Orphan', registeredOrphan);

      this.SET_SNACKBAR_COLOR('success');
      this.SET_SNACKBAR_TEXT(
        `Orphan ${registeredOrphan.firstName} ${registeredOrphan.father.firstName} created successfully!`
      );
      this.SET_SNACKBAR(true);

      // reset all the dialogs
      this.persoanlRef.reset();
      this.educationalRef.reset();
      this.familyRef.reset();
      this.guardianRef.reset();
      this.documentRef.reset();

      // close the dialog
      this.dialog = false;

      // this variables change enables for the proper functioning of the document continue button
      this.saveDocumentData = false;
    },
    addDocumentRef(documentRef) {
      this.documentRef = documentRef;
    },
    handleDocumentError(error) {
      this.documentFormError = error;
    },

    // ------------------------------

    nextStep(n) {
      if (n === this.registrationSteps) {
        this.currentRegistrationPosition = 1;
      } else {
        this.currentRegistrationPosition = n + 1;
      }
    },

    // ------------------------------

    orphanDialogClose() {
      this.dialog = false;
    },

    isoDateFormatter(dateString) {
      return dateString ? new Date(dateString).toISOString(): null;
    },

    registerOrphanWithBaselineData(
      orphanCode,
      firstName,
      gender,
      placeOfBirth,
      dateOfBirth,
      spokenLanguages,
      gradeAgeMismatchReason,
      hobbies,
      religion,
      idCardUrl,
      passportUrl,
      birthCertificateUrl,
      // accountNumber,
      // currentBalance,
      father,
      mother,
      guardian,
      house_property,
      firstHealthStatus,
      firstPhotos,
      firstEducationalRecord,
      villageId
    ) {
      return axios
        .post('graphql', {
          query: `mutation createOrphanWithBaselineData (
                  $orphanCode: String
                  $firstName: String!
                  $gender: orphanGender!
                  $placeOfBirth: String!
                  $dateOfBirth: DateTime!
                  $spokenLanguages: String
                  $gradeAgeMismatchReason: String
                  $hobbies: String
                  $religion: orphanReligion
                  $idCardUrl: String
                  $passportUrl: String
                  $birthCertificateUrl: String!
                  # $accountNumber: String
                  # $currentBalance: Float
                  $father: FatherCreateInput!
                  $mother: MotherCreateInput!
                  $guardian: GuardianCreateInput!
                  $house_property: House_propertyCreateInput!
                  $firstHealthStatus: HealthStatusCreateInput!
                  $firstPhotos: OrphanPhotoCreateInput!
                  $firstEducationalRecord: EducationalRecordCreateInput!
                  $villageId: ID!
                ) {
                  createOrphanWithBaselineData (
                    orphanCode: $orphanCode,
                    firstName: $firstName,
                    gender: $gender,
                    placeOfBirth: $placeOfBirth,
                    dateOfBirth: $dateOfBirth,
                    spokenLanguages: $spokenLanguages,
                    gradeAgeMismatchReason: $gradeAgeMismatchReason,
                    hobbies: $hobbies,
                    religion: $religion,
                    idCardUrl: $idCardUrl,
                    passportUrl: $passportUrl,
                    birthCertificateUrl: $birthCertificateUrl,
                    # accountNumber: $accountNumber,
                    # currentBalance: $currentBalance,
                    father: $father,
                    mother: $mother,
                    guardian: $guardian,
                    house_property: $house_property,
                    firstHealthStatus: $firstHealthStatus
                    firstPhotos: $firstPhotos,
                    firstEducationalRecord: $firstEducationalRecord,
                    villageId: $villageId,
                  ) {
                    id
                    firstName
                    father {
                      firstName
                    }
                  }
                }`,
          variables: {
            orphanCode,
            firstName,
            gender,
            placeOfBirth,
            dateOfBirth,
            spokenLanguages,
            gradeAgeMismatchReason,
            hobbies,
            religion,
            idCardUrl,
            passportUrl,
            birthCertificateUrl,
            // accountNumber,
            // currentBalance,
            father,
            mother,
            guardian,
            house_property,
            firstHealthStatus,
            firstPhotos,
            firstEducationalRecord,
            villageId
          }
        })
        .then((res) => res.data.data.createOrphanWithBaselineData)
        .catch((err) => console.warn(err));
    },
  }
};
</script>
