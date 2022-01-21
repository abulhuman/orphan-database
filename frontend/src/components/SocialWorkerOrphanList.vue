<template>
  <div style="min-width:1024px; min-height:768px">
    <v-row justify="center" no-gutters>
      <v-col cols="9" class="mt-12">
        <v-card elevation="2">
          <v-row>
            <!-- TODO implement expanding button into the select-list  -->
            <v-col cols="1" class="mt-4 pt-5">
              <v-btn fab small class="ml-5" elevation="1" right color="#eee">
                <v-icon> mdi-filter </v-icon>
              </v-btn>
            </v-col>
            <v-col class="mt-6">
              <v-select
                v-model="filterValue"
                hint="select field/s to filter explicity"
                :items="filterItems"
                :menu-props="{ bottom: true, offsetY: true }"
                dense
                elevation="1"
                persistent-hint
                multiple
                placeholder="Filter By"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip
                    color="primary"
                    label
                    close
                    close-icon="mdi-close"
                    v-if="index === 0"
                  >
                    <span>{{ item }}</span>
                  </v-chip>
                  <span v-if="index === 1" class="grey--text caption">
                    (+{{ filterValue.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col class="mt-3">
              <v-text-field v-model="search" placeholder="Search ..." />
            </v-col>
            <v-col cols="1" class="mt-4 mr-3 pt-5">
              <v-btn fab small elevation="1" right color="blue lighten-1">
                <v-icon> mdi-account-search </v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="orphans"
                :items-per-page="itemsPerPage"
                :search="search"
                :custom-filter="searchFilter"
              >
                <template #[`item.actions`]="{ item }">
                  <financialRecordsDialog
                    :open="financialRecordsDialog"
                    :item="item"
                  />
                  <educational-records-dialog
                    :open="educationalRecordsDialog"
                    :item="item"
                    :isEditable="true"
                    :isOrphanDetail="false"
                  />
                  <insert-images-dialog
                    :open="insertImagesDialog"
                    :item="item"
                  />
                  <miscellaneous-social-worker-tasks-dialog
                    :open="miscellaneousSocialWorkerTasksDialog"
                    :item="item"
                    @addedSuccessfully="initialize()"
                  />
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from "axios";
import { capitalize, calculateAge } from "@/utils/utils";
import InsertImagesDialog from "./InsertImagesDialog.vue";
import EducationalRecordsDialog from "./EducationalRecordsDialog.vue";
import MiscellaneousSocialWorkerTasksDialog from "./MiscellaneousSocialWorkerTasksDialog.vue";
import FinancialRecordsDialog from "./FinancialRecordsDialog.vue";
import { mapMutations } from "vuex";
export default {
  props: ["socialWorerkId"],
  components: {
    InsertImagesDialog,
    EducationalRecordsDialog,
    MiscellaneousSocialWorkerTasksDialog,
    FinancialRecordsDialog
  },
  data() {
    return {
      orphans: [],
      search: "",
      // used in filter selection items
      filterItems: [
        "ID",
        "Full Name",
        "Age",
        "Gender",
        "Guardian Full Name",
        "Guardian Phone Number",
        "Account Number",
        "District",
        "Village",
        "Donor"
      ],
      filterValue: [],
      // used for filter selection
      // table headers if that wasn't clear enough LOL
      headers: [
        { text: "ID", value: "id" },
        {
          text: "Full Name",
          align: "start",
          value: "fullName"
        },
        {
          text: "Age",
          value: "age"
        },
        {
          text: "Gender",
          value: "gender"
        },
        {
          text: "Guardian Full Name",
          value: "guardianFullName"
        },
        {
          text: "Guardian Mobile Number",
          value: "guardianMobileNumber"
        },
        {
          text: "Account Number",
          value: "accountNumber"
        },
        {
          text: "Village",
          align: "Start",
          value: "village"
        },
        {
          text: "Actions",
          value: "actions"
        }
      ],
      itemsPerPage: 20,
      insertImagesDialog: false,
      educationalRecordsDialog: false,
      miscellaneousSocialWorkerTasksDialog: false,
      financialRecordsDialog: false
    };
  },
  computed: {},
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    // custom search function based on selected columns
    searchFilter(value, search, item) {
      if (search.length > 0) {
        if (this.filterValue.length > 0) {
          for (const filterVal of this.filterValue) {
            if (filterVal === this.headers[0].text) {
              // filter by id only
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.headers[1].text) {
              // filter by full name only
              return (
                item.fullName.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[2].text) {
              // filter by age only, N.B.: '0' , '<1' & '< 1' gives all marked by < 1
              return (
                item.age === parseInt(search) ||
                ((search == 0 || search == `< 1` || search == `<1`) &&
                  item.age === `< 1`)
              );
            } else if (filterVal === this.headers[3].text) {
              // filter by gender only
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[4].text) {
              // filter by guardian full name only
              return (
                item.guardianFullName
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[5].text) {
              // filter by guardian mobile number only
              return (
                item.guardianMobileNumber
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[6].text) {
              // filter by account number only
              return (
                item.accountNumber
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[7].text) {
              // filter by district name only
              return (
                item.district.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[8].text) {
              // filter by village name only
              return (
                item.village.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[9].text) {
              // filter by donor name initals only
              return (
                item.donor.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            }
          }
        } else {
          // default search by full name
          return (
            item.fullName != null &&
            typeof item.fullName === "string" &&
            item.fullName
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
    },
    showInsertImagesDialog(item) {
      return item.id;
    },
    initialize() {
      let { id } = this.$route.params;

      (async () => {
        try {
          const query = `query socialWorker($id: ID!) {
                    socialWorker(id: $id) {
                      id
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        dateOfBirth
                        gender
                        guardian {
                          firstName
                          middleName
                          lastName
                          mobileNumber
                        }
                        accountNumber
                        village {
                          id
                          name
                          district {
                            id
                            name
                          }
                        }
                      }
                    }
                  }`;
          const requestOptions = { query, variables: { id } };
          const res = await axios.post("/graphql", requestOptions);
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message);
          } else {
            const { socialWorker } = res.data.data;

            let formattedOrphans = socialWorker.orphans.map(item => {
              return {
                id: item.id,
                fullName: `${capitalize(item.firstName)} ${capitalize(
                  item.father.firstName
                )} ${capitalize(item.father.lastName)}`,
                age: calculateAge(item.dateOfBirth),
                gender: item.gender,
                guardianFullName: `${capitalize(
                  item.guardian.firstName
                )} ${capitalize(item.guardian.middleName)} ${capitalize(
                  item.guardian.lastName
                )}`,
                guardianMobileNumber: item.guardian.mobileNumber,
                accountNumber: item.accountNumber,
                district: item.village.district.name,
                village: item.village.name
              };
            });

            formattedOrphans.sort((a, b) => a.id - b.id);

            this.orphans = formattedOrphans;
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
    }
  },
  created() {
    this.initialize();
  }
};
</script>

<style></style>
