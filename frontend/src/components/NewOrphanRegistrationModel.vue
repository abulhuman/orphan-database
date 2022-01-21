<template>
  <v-dialog v-model="dialog" max-width="50rem">
    <!-- the activator of the dialog; the button. -->
    <!-- <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        right
        v-bind="attrs"
        v-on="on"
        style="align-item: right;"
      >
        Add New Orphan
        <v-icon dark> mdi-account-plus </v-icon>
      </v-btn>
    </template> -->
    <!-- the dialog main body; the card -->
    <v-card
      class="pa-10"
      style="background-image: linear-gradient(to bottom right, rgba(100,115,201,.6), rgba(25,32,72,1);"
    >
      <v-card-title class="pt-0">
        <span class="headline mx-auto white--text"
          >New Orphan Registration</span
        >
      </v-card-title>
      <v-divider
        dark
        class="mb-5"
        style="border-color: rgba(255, 255, 255, 0.5);"
      ></v-divider>
      <v-row justify="center">
        <v-col cols="12" md="6" lg="4" align="center">
          <NewOrphanPersonalModel
            ref="personalModel"
            @personalDone="printPersonal($event)"
            @personalRefs="personalRefsHandler($event)"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4" align="center">
          <NewOrphanEducationModel
            ref="educationModel"
            :updatedOrphan="orphan"
            @educationDone="printEducation($event)"
            @educationRefs="educationRefsHandler($event)"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4" align="center">
          <NewOrphanGuardianModel
            ref="guardianModel"
            @guardianDone="printGuardian($event)"
            @guardianRefs="guardianRefsHandler($event)"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4" align="center">
          <NewOrphanFamilyModel
            ref="familyModel"
            :updatedOrphan="orphan"
            @familyDone="printFamily($event)"
            @familyRefs="familyRefsHandler($event)"
          />
        </v-col>
        <v-col cols="12" md="6" lg="4" align="center">
          <NewOrphanDocumentModel
            ref="documentModel"
            :orphanVillageId="orphanVillageId"
            :updatedOrphan="orphan"
            @registrationDone="registrationDone($event)"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* .dino {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 5;
  margin-top: -2rem;
  margin-left: -6rem;
} */
</style>

<script>
import NewOrphanPersonalModel from "@/components/NewOrphanPersonalModel.vue";
import NewOrphanEducationModel from "@/components/NewOrphanEducationModel.vue";
import NewOrphanGuardianModel from "@/components/NewOrphanGuardianModel.vue";
import NewOrphanFamilyModel from "@/components/NewOrphanFamilyModel.vue";
import NewOrphanDocumentModel from "@/components/NewOrphanDocumentModel.vue";

export default {
  props: {
    newOrphanDialog: {
      type: Boolean,
    },
    orphanVillageId: {
      type: String,
    }
  },

  components: {
    NewOrphanPersonalModel,
    NewOrphanEducationModel,
    NewOrphanGuardianModel,
    NewOrphanFamilyModel,
    NewOrphanDocumentModel,
  },

  data: () => ({
    dialog: false,
    personalModelData: null,
    orphan: null,
    personalForm: null,
    educationForm: null,
    guardianForm: null,
    familyForm: null,
  }),

  mounted() {
    this.displayOrphan();
  },
  computed: {},
  created() {
  },
  watch: {
    newOrphanDialog(val) {
      this.dialog = val;
    },
    dialog(val) {
      if (val === false) this.$emit("dialogClosed", false)
      val || this.orphanDialogClose();
    },
  },
  methods: {
    personalRefsHandler(personalForm) {
      this.personalForm = personalForm;
    },
    educationRefsHandler(educationForm) {
      this.educationForm = educationForm;
    },
    guardianRefsHandler(guardianForm) {
      this.guardianForm = guardianForm;
    },
    familyRefsHandler(familyForm) {
      this.familyForm = familyForm;
    },
    registrationDone(documentFormObj) {
      this.personalForm.reset();
      this.educationForm.reset();
      this.guardianForm.reset();
      this.familyForm.reset();
      documentFormObj.documentForm.reset();
      this.$emit("registrationDone", documentFormObj.newOrphanId);
      console.log("registrationDone", documentFormObj.newOrphanId)
    },
    displayOrphan() {
      // console.log("personalModel", this.$refs.personalModel);
      // console.log("educationModel", this.$refs.educationModel);
      // console.log("familyModel", this.$refs.familyModel);
      // console.log("guardianModel", this.$refs.guardianModel);
      // console.log("documentModel", this.$refs.documentModel);
    },
    printPersonal(event) {
      this.orphan = Object.assign(this.orphan ?? {}, event);
      console.log("personalOrphan", this.orphan);
    },
    printEducation(updatedOrphan) {
      this.orphan = this.orphan ?? {};
      this.orphan.education = Object.assign(
        this.orphan.education ?? {},
        updatedOrphan.education
      );

      this.orphan['hobbies'] = updatedOrphan.hobbies

      // Object.defineProperty(this.orphan, "hobbies", {
      //   value: updatedOrphan.hobbies || null,
      //   writable: true,
      // });

      console.log("educationOrphan", this.orphan);
    },
    printGuardian(updatedOrphan) {
      this.orphan = this.orphan ?? {};
      this.orphan.guardian = Object.assign(
        this.orphan.guardian ?? {},
        updatedOrphan.guardian
      );
      console.log("guardianOrphan", this.orphan);
    },
    printFamily(updatedOrphan) {
      this.orphan = this.orphan ?? {};
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

      console.log("familyOrphan", this.orphan);
    },
    orphanDialogClose() {
      this.dialog = false;
      this.$nextTick(() => {
        this.orphanItem = Object.assign({}, this.defaultItem);
        this.orphanIndex = -1;
      });
    },

    orphanDialogSave() {
      if (this.orphanIndex > -1) {
        Object.assign(this.orphans[this.orphanIndex], this.orphanItem);
      } else {
        this.orphans.push(this.orphanItem);
      }
      this.orphanDialogClose();
    },
  },
};
</script>
