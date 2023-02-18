<template>
  <div align="center" style="margin-top: 6rem">
    <AppNavBar :user="donorUser" @activeTab="changeState($event)" />
    <!-- Processing -->
    <template v-if="orphanTable === 'processing'">
      <v-card elevation="3" width="90%">
        <v-sheet class="overflow-y-auto" max-height="75vh">
          <v-data-table
            v-model="selectedProcessingOrphans"
            :headers="headers"
            :items="processingOrphans"
            item-key="id"
            :search="processingSearch"
            append-icon="mdi-magnify"
            :custom-filter="processingSearchFilter"
            :single-select="singleProcessingSelect"
            show-select
            multi-sort
            class="elevation-1"
          >
            <template v-slot:top>
              <v-row style="margin: 0px">
                <!-- Filter/Search Selection -->
                <!-- TODO: # add close icon and function to remove from selection -->
                <!--       # add tooltip maybe -->
                <v-col
                  sm="5"
                  offset="0"
                  offset-sm="0"
                  offset-md="0"
                  class="mt-4 mt-sm-0"
                >
                  <v-responsive
                    min-width="300"
                    max-width="300"
                    class="mx-xs-auto ml-sm-auto mt-sm-2"
                  >
                    <v-select
                      v-model="processingFilterValue"
                      hint="select field/s to filter explicity"
                      :items="processingFilterItems"
                      :menu-props="{ bottom: true, offsetY: true }"
                      solo
                      outlined
                      dense
                      persistent-hint
                      multiple
                      placeholder="Filter By"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip
                          color="primary"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          @click:close="removeSelected(item)"
                          v-if="index === 0"
                        >
                          <span>{{ item }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ processingFilterValue.length - 1 }} others)
                        </span>
                      </template>
                    </v-select>
                  </v-responsive>
                </v-col>
                <!-- Search Input -->
                <!-- TODO: # add search icon and close icon -->
                <v-col
                  sm="7"
                  md="4"
                  offset="1"
                  offset-sm="3"
                  offset-md="1"
                  offset-lg="0"
                >
                  <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                    <v-text-field
                      v-model="processingSearch"
                      placeholder="Search"
                      dense
                      flat
                      clearable
                      append-icon="mdi-filter-minus"
                    >
                      <template v-slot:prepend> </template>
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <!-- Select Switch -->
                <v-col cols="4" class="pa-0">
                  <v-switch
                    v-model="singleProcessingSelect"
                    :label="selectSwitch"
                    class="px-3 mt-0"
                  ></v-switch>
                </v-col>
                <!-- rejected dialog -->
                <v-col class="mt-n4 pr-7" align="right">
                  <v-dialog
                    transition="dialog-bottom-transition"
                    persistent
                    max-width="450"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                        :disabled="selectedProcessingOrphans.length <= 0"
                        >Reject</v-btn
                      >
                    </template>
                    <template v-slot:default="dialog">
                      <v-card max-width="">
                        <v-card-title class="">
                          <span class="mx-auto">
                            Are you sure?
                          </span>
                        </v-card-title>
                        <v-card-text class="text-center">
                          Rejected orphans will be removed from your support
                          permanently!
                        </v-card-text>
                        <v-card-actions class="justify-center">
                          <v-btn
                            color="error"
                            text
                            @click="cancelRejection(dialog)"
                            >Cancel</v-btn
                          >
                          <v-btn
                            color="primary"
                            text
                            @click="confirmRejection(dialog)"
                            >Confirm</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-col>
                <!-- Support Plan dialog-->
                <v-col cols="3" class="mt-n4" align="left">
                  <v-dialog
                    transition="dialog-bottom-transition"
                    persistent
                    max-width="450"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="primary"
                        v-bind="attrs"
                        v-on="on"
                        :disabled="selectedProcessingOrphans.length <= 0"
                        >Sponsor</v-btn
                      >
                    </template>
                    <template v-slot:default="dialog">
                      <v-card max-width="">
                        <!-- <v-toolbar> -->
                        <v-card-title class="pb-0">
                          <span class="mx-auto">
                            {{
                              singleProcessingSelect === true
                                ? "Support Plan for Single Orphan"
                                : "Support Plan for Multiple Orphans"
                            }}
                          </span>
                        </v-card-title>
                        <!-- </v-toolbar> -->
                        <v-card-text class="pb-0">
                          <v-container>
                            <v-row>
                              <!-- supportPeriod -->
                              <v-col cols="6">
                                <v-responsive max-width="" class="">
                                  <v-text-field
                                    v-model="supportPeriod"
                                    type="number"
                                    label="Period of Support*"
                                    hint="period of support in months"
                                    required
                                  ></v-text-field>
                                </v-responsive>
                              </v-col>
                              <!-- fund_fc -->
                              <v-col cols="6">
                                <v-responsive max-width="" class="">
                                  <v-text-field
                                    v-model="fund_fc"
                                    type="number"
                                    label="Total Fund*"
                                    hint="fund for all the selected orphan/s"
                                    required
                                  ></v-text-field>
                                </v-responsive>
                              </v-col>
                              <!-- currency -->
                              <v-col cols="8" class="pt-0">
                                <v-responsive max-width="238">
                                  <v-select
                                    v-model="currency"
                                    :items="currencyOptions"
                                    :menu-props="{ top: true, offsetY: true }"
                                    label="Currency"
                                    hint="currency of the total fund"
                                  ></v-select>
                                </v-responsive>
                              </v-col>
                              <!-- adminPercent -->
                              <v-col cols="4" class="pt-0">
                                <v-responsive max-width="238" class="">
                                  <v-select
                                    v-model="adminPercent"
                                    :items="percent"
                                    :menu-props="{ top: true, offsetY: true }"
                                    label="Admin Fee %"
                                    hint="admin fee in percent"
                                  ></v-select>
                                </v-responsive>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                          <v-btn text color="error" @click="supportPlanCancel(dialog)"> 
                            Cancel
                          </v-btn>
                          <v-btn text color="primary" @click="supportPlanSubmit(dialog)"> 
                            Submit
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-col>
              </v-row>
            </template>
            <template v-slot:item.fullName="{ item }">
              {{ fullName(item) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ calcAge(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ guardianFullName(item) }}
            </template>
            <template v-slot:item.guardianRelationToOrphan="{ item }">
              {{ guardianRelationToOrphan(item) }}
            </template>
            <!-- Show Details icon -->
            <template v-slot:item.details="{ item }">
              <OrphanDetail :details="item" user="donor"/>
            </template>
          </v-data-table>
        </v-sheet>
      </v-card>
    </template>
    <!-- Pending -->
    <template v-else-if="orphanTable === 'pending'">
      <v-card elevation="3" width="90%">
        <v-sheet class="overflow-y-auto" max-height="75vh">
          <v-data-table
            v-model="selectedPendingOrphans"
            :headers="headers"
            :items="pendingOrphans"
            item-key="id"
            :search="pendingSearch"
            append-icon="mdi-magnify"
            :custom-filter="pendingSearchFilter"
            :single-select="singlePendingSelect"
            show-select
            multi-sort
            class="elevation-1"
          >
            <template v-slot:top>
              <v-row style="margin: 0px">
                <!-- Filter/Search Selection -->
                <!-- TODO: # add close icon and function to remove from selection -->
                <!--       # add tooltip maybe -->
                <v-col
                  sm="5"
                  offset="0"
                  offset-sm="0"
                  offset-md="0"
                  class="mt-4 mt-sm-0"
                >
                  <v-responsive
                    min-width="300"
                    max-width="300"
                    class="mx-xs-auto ml-sm-auto mt-sm-2"
                  >
                    <v-select
                      v-model="pendingFilterValue"
                      hint="select field/s to filter explicity"
                      :items="pendingFilterItems"
                      :menu-props="{ bottom: true, offsetY: true }"
                      solo
                      outlined
                      dense
                      persistent-hint
                      multiple
                      placeholder="Filter By"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip
                          color="primary"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          @click:close="removeSelected(item)"
                          v-if="index === 0"
                        >
                          <span>{{ item }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ pendingFilterValue.length - 1 }} others)
                        </span>
                      </template>
                    </v-select>
                  </v-responsive>
                </v-col>
                <!-- Search Input -->
                <!-- TODO: # add search icon and close icon -->
                <v-col
                  sm="7"
                  md="4"
                  offset="1"
                  offset-sm="3"
                  offset-md="1"
                  offset-lg="0"
                >
                  <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                    <v-text-field
                      v-model="pendingSearch"
                      placeholder="Search"
                      dense
                      flat
                      clearable
                      append-icon="mdi-filter-minus"
                    >
                      <template v-slot:prepend> </template>
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <!-- Select Switch -->
                <v-col cols="4" class="pa-0">
                  <v-switch
                    v-model="singlePendingSelect"
                    :label="selectSwitch"
                    class="px-3 mt-0"
                  ></v-switch>
                </v-col>
                <v-col class="mt-n4 pr-10" align="right"> </v-col>
              </v-row>
            </template>
            <template v-slot:item.fullName="{ item }">
              {{ fullName(item) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ calcAge(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ guardianFullName(item) }}
            </template>
            <template v-slot:item.guardianRelationToOrphan="{ item }">
              {{ guardianRelationToOrphan(item) }}
            </template>
            <!-- Show Details icon -->
            <template v-slot:item.details="{ item }">
              <OrphanDetail :details="item" user="donor"/>
            </template>
          </v-data-table>
        </v-sheet>
      </v-card>
    </template>
    <!-- Sponsored -->
    <template v-else-if="orphanTable === 'sponsored'">
      <v-card elevation="3" width="90%">
        <v-sheet class="overflow-y-auto" max-height="75vh">
          <v-data-table
            v-model="selectedActiveOrphans"
            :headers="headers"
            :items="activeOrphans"
            item-key="id"
            :search="activeSearch"
            append-icon="mdi-magnify"
            :custom-filter="activeSearchFilter"
            :single-select="singleActiveSelect"
            multi-sort
            class="elevation-1"
          >
            <template v-slot:top>
              <v-row style="margin: 0px">
                <!-- Filter/Search Selection -->
                <!-- TODO: # add close icon and function to remove from selection -->
                <!--       # add tooltip maybe -->
                <v-col
                  sm="5"
                  offset="0"
                  offset-sm="0"
                  offset-md="0"
                  class="mt-4 mt-sm-0"
                >
                  <v-responsive
                    min-width="300"
                    max-width="300"
                    class="mx-xs-auto ml-sm-auto mt-sm-2"
                  >
                    <v-select
                      v-model="activeFilterValue"
                      hint="select field/s to filter explicity"
                      :items="activeFilterItems"
                      :menu-props="{ bottom: true, offsetY: true }"
                      solo
                      outlined
                      dense
                      persistent-hint
                      multiple
                      placeholder="Filter By"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip
                          color="primary"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          @click:close="removeSelected(item)"
                          v-if="index === 0"
                        >
                          <span>{{ item }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ activeFilterValue.length - 1 }} others)
                        </span>
                      </template>
                    </v-select>
                  </v-responsive>
                </v-col>
                <!-- Search Input -->
                <!-- TODO: # add search icon and close icon -->
                <v-col
                  sm="7"
                  md="4"
                  offset="1"
                  offset-sm="3"
                  offset-md="1"
                  offset-lg="0"
                >
                  <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                    <v-text-field
                      v-model="activeSearch"
                      placeholder="Search"
                      dense
                      flat
                      clearable
                      append-icon="mdi-filter-minus"
                    >
                      <template v-slot:prepend> </template>
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <!-- Select Switch -->
                <!-- <v-col cols="4" class="pa-0">
                  <v-switch
                    v-model="singleActiveSelect"
                    :label="selectSwitch"
                    class="px-3 mt-0"
                  ></v-switch>
                </v-col> -->
              </v-row>
            </template>
            <template v-slot:item.fullName="{ item }">
              {{ fullName(item) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ calcAge(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ guardianFullName(item) }}
            </template>
            <template v-slot:item.guardianRelationToOrphan="{ item }">
              {{ guardianRelationToOrphan(item) }}
            </template>
            <!-- Show Details icon -->
            <template v-slot:item.details="{ item }">
              <OrphanDetail :details="item" user="donor"/>
            </template>
          </v-data-table>
        </v-sheet>
      </v-card>
    </template>
    <!-- Graduated -->
    <template v-else-if="orphanTable === 'graduated'">
      <v-card elevation="3" width="90%">
        <v-sheet class="overflow-y-auto" max-height="75vh">
          <v-data-table
            v-model="selectedGraduatedOrphans"
            :headers="headers"
            :items="graduatedOrphans"
            item-key="id"
            :search="graduatedSearch"
            append-icon="mdi-magnify"
            :custom-filter="graduatedSearchFilter"
            :single-select="singleGraduatedSelect"
            multi-sort
            class="elevation-1"
          >
            <template v-slot:top>
              <v-row style="margin: 0px">
                <!-- Filter/Search Selection -->
                <!-- TODO: # add close icon and function to remove from selection -->
                <!--       # add tooltip maybe -->
                <v-col
                  sm="5"
                  offset="0"
                  offset-sm="0"
                  offset-md="0"
                  class="mt-4 mt-sm-0"
                >
                  <v-responsive
                    min-width="300"
                    max-width="300"
                    class="mx-xs-auto ml-sm-auto mt-sm-2"
                  >
                    <v-select
                      v-model="graduatedFilterValue"
                      hint="select field/s to filter explicity"
                      :items="graduatedFilterItems"
                      :menu-props="{ bottom: true, offsetY: true }"
                      solo
                      outlined
                      dense
                      persistent-hint
                      multiple
                      placeholder="Filter By"
                    >
                      <template v-slot:selection="{ item, index }">
                        <v-chip
                          color="primary"
                          dark
                          label
                          close
                          close-icon="mdi-close-outline"
                          @click:close="removeSelected(item)"
                          v-if="index === 0"
                        >
                          <span>{{ item }}</span>
                        </v-chip>
                        <span v-if="index === 1" class="grey--text caption">
                          (+{{ graduatedFilterValue.length - 1 }} others)
                        </span>
                      </template>
                    </v-select>
                  </v-responsive>
                </v-col>
                <!-- Search Input -->
                <!-- TODO: # add search icon and close icon -->
                <v-col
                  sm="7"
                  md="4"
                  offset="1"
                  offset-sm="3"
                  offset-md="1"
                  offset-lg="0"
                >
                  <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                    <v-text-field
                      v-model="graduatedSearch"
                      placeholder="Search"
                      dense
                      flat
                      clearable
                      append-icon="mdi-filter-minus"
                    >
                      <template v-slot:prepend> </template>
                    </v-text-field>
                  </v-responsive>
                </v-col>
                <!-- Select Switch -->
                <!-- <v-col cols="4" class="pa-0">
                  <v-switch
                    v-model="singleGraduatedSelect"
                    :label="selectSwitch"
                    class="px-3 mt-0"
                  ></v-switch>
                </v-col> -->
              </v-row>
            </template>
            <template v-slot:item.fullName="{ item }">
              {{ fullName(item) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ calcAge(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ guardianFullName(item) }}
            </template>
            <template v-slot:item.guardianRelationToOrphan="{ item }">
              {{ guardianRelationToOrphan(item) }}
            </template>
            <!-- Show Details icon -->
            <template v-slot:item.details="{ item }">
              <OrphanDetail :details="item" user="donor"/>
            </template>
          </v-data-table>
        </v-sheet>
      </v-card>
    </template>
  </div>
</template>

<style scoped></style>

<script>
import axios from "axios";
import AppNavBar from "@/components/AppNavBar.vue";
import OrphanDetail from "@/components/OrphanDetail.vue";

export default {
  components: {
    AppNavBar,
    OrphanDetail,
  },

  data() {
    return {
      processingSearch: "",
      pendingSearch: "",
      activeSearch: "",
      graduatedSearch: "",
      orphanTable: "processing",
      singleProcessingSelect: false,
      singlePendingSelect: false,
      singleActiveSelect: false,
      singleGraduatedSelect: false,
      selectedProcessingOrphans: [],
      selectedPendingOrphans: [],
      selectedActiveOrphans: [],
      selectedGraduatedOrphans: [],
      selectSwitch: "Multiple Orphans",
      supportPeriod: null,
      fund_fc: null,
      currency: "",
      currencyOptions: [
        "US Dollar",
        "Pound Sterling",
        "EURO",
        "SWISS FRANK",
        "Swedish Kroner",
        "NORWEGIAN KRONER",
        "DANISH KRONER",
        "DJIBOUTI FRANC",
        "JAPANIS YEN",
        "Canadian Dollar",
        "SAUDI RIYAL",
        "UAE DIRHAM",
        "CENTRAL AFRICA FRANC",
        "Indian Rupee",
        "KENNYAN SHILLING",
        "AUSTRALIAN DOLLAR",
        "SOUTH AFRICAN RAND",
        "CHINESE YUAN",
        "KUWAITI DINAR",
      ],
      adminPercent: 0,
      percent: [],
      // ********************************

      // used in filter selection items
      processingFilterItems: [
        "Id",
        "Full Name",
        "Age",
        "Gender",
        "Guardian",
        "Relation to Orphan",
      ],
      pendingFilterItems: [
        "Id",
        "Full Name",
        "Age",
        "Gender",
        "Guardian",
        "Relation to Orphan",
      ],
      activeFilterItems: [
        "Id",
        "Full Name",
        "Age",
        "Gender",
        "Guardian",
        "Relation to Orphan",
      ],
      graduatedFilterItems: [
        "Id",
        "Full Name",
        "Age",
        "Gender",
        "Guardian",
        "Relation to Orphan",
      ],
      processingFilterValue: [],
      pendingFilterValue: [],
      activeFilterValue: [],
      graduatedFilterValue: [],
      // used for filter selection
      // table headers if that wasn't clear enough LOL
      headers: [
        { text: "Id", value: "id" },
        {
          text: "Full Name",
          align: "start",
          value: "fullName",
        },
        {
          text: "Age",
          value: "age",
        },
        {
          text: "Gender",
          value: "gender",
        },
        {
          text: "Guardian",
          value: "guardianFullName",
        },
        {
          text: "Relation to Orphan",
          value: "guardianRelationToOrphan",
        },
        {
          text: "Details",
          value: "details",
          sortable: false,
        },
      ],
      donor: {},
      donorUser: {
        companyName: "",
        nameInitials: "",
        email: "",
        role: "",
      },
      // table rows/items
      orphans: [],
      processingOrphans: [],
      pendingOrphans: [],
      activeOrphans: [],
      graduatedOrphans: [],
    };
  },
  beforeCreate() {
    console.log(`beforeCreate: `, this.singleProcessingSelect);
  },
  created() {
    console.log(`afterCreate: `, this.singleProcessingSelect);
    this.initialize();
    this.percentGenerator();
  },
  computed: {
    // temporary filter for the notification panel
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1); // I don't know what this is doing exactly
    },
    length() {
      return 7000;
    },
    // used in new orphan dialog
  },
  watch: {
    singleProcessingSelect() {
      this.selectSwitch =
        this.singleProcessingSelect === true
          ? "Single Orphan"
          : "Multiple Orphans";
    },
    orphans() {
      this.activeOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "active"
        );
      });
      this.processingOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "processing"
        );
      });
      this.pendingOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "pending"
        );
      });
      this.graduatedOrphans = this.orphans.filter((orphan) => {
        return (
          orphan.sponsorshipStatuses[
            orphan.sponsorshipStatuses.length - 1
          ].status.toLowerCase() === "graduated"
        );
      });
    },
  },
  methods: {
    changeState(val) {
      this.orphans = [];
      this.initialize();
      this.orphanTable = val;
    },
    // ********************************
    initialize() {
      axios
        .post("/graphql/", {
          query: `query donor($id: ID!) {
                    donor(id: $id) {
                      id
                      nameInitials
                      companyName
                      user {
                        id
                        email
                        role
                      }
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                          dateOfDeath
                          dateOfBirth
                          causeOfDeath
                          deathCertificateUrl
                        }
                        gender
                        dateOfBirth
                        placeOfBirth
                        religion
                        spokenLanguages
                        psychologicalStatus
                        healthDescription
                        education {
                          enrollmentStatus
                          level
                          year
                          schoolName
                          typeOfSchool
                          reason
                          educationalRecords {
                            yearDivision
                            quarter
                            semester
                            numberOfSubjects
                            totalMark
                            average
                            semesterGPA
                            cumulativeGPA
                            reportCardUrl
                          }
                        }
                        hobbies
                        house_property {
                          housingSituation
                          otherProperty
                        }
                        sponsorshipStatuses {
                          id
                          status
                          date
                        }
                        guardian {
                          id
                          firstName
                          middleName
                          lastName
                          gender
                          email
                          mobileNumber
                          nationality
                          telephoneNumber
                          dateOfBirth
                          relationToOrphan
                          iDCardUrl
                          confirmationLetterUrl
                          legalConfirmationLetterUrl
                        }
                        mother {
                          id
                          firstName
                          middleName
                          lastName
                          dateOfBirth
                          vitalStatus
                          maritalStatus
                        }
                        sponsorshipStatuses {
                          status
                          date
                        }
                        donor {
                          id
                          nameInitials
                        }
                        village {
                          id
                          name
                        }
                      }
                    }
                  }`,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then((res) => res.data.data.donor)
        .then((donor) => {
          this.orphans = [...donor.orphans];
          this.donor = Object.assign({}, donor);
          this.donorUser = Object.assign(this.donorUser, donor.user);
          for (const property in this.donorUser) {
            if (Object.hasOwnProperty.call(this.donor, property)) {
              this.donorUser[property] = donor[property];
            }
          }
          // console.log("donor", this.donor);
          // console.log("donorUser", this.donorUser);
        })
        .catch((err) => console.warn(err));
    },
    // custom search functions based on selected columns
    activeSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.activeFilterValue);
    },
    processingSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.processingFilterValue);
    },
    pendingSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.pendingFilterValue);
    },
    graduatedSearchFilter(value, search, item) {
      return this.searchFilter(value, search, item, this.graduatedFilterValue);
    },
    searchFilter(value, search, item, filterValue) {
      if (search.length > 0) {
        if (filterValue.length > 0) {
          for (const filterVal of filterValue) {
            if (filterVal === this.headers[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.headers[1].text) {
              return (
                this.fullName(item)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[2].text) {
              return (
                this.calcAge(item)
                  .toString()
                  .indexOf(search) !== -1
              );
            } else if (filterVal === this.headers[3].text) {
              return (
                item.gender.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[4].text) {
              return (
                this.guardianFullName(item)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.headers[5].text) {
              return (
                this.guardianRelationToOrphan(item)
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            }
          }
        } else {
          return (
            this.fullName(item) != null &&
            typeof this.fullName(item) === "string" &&
            this.fullName(item)
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
    },
    // table modifiers
    // TODO: add error handling if father is NULL and etc
    fullName(item) {
      return (
        `${item.firstName.substr(0, 1).toUpperCase()}${item.firstName.substr(
          1
        )}` +
        ` ${item.father.firstName
          .substr(0, 1)
          .toUpperCase()}${item.father.firstName.substr(1)}` +
        ` ${item.father.lastName
          .substr(0, 1)
          .toUpperCase()}${item.father.lastName.substr(1)}`
      );
    },
    calcAge(item) {
      return (
        new Date().getUTCFullYear() -
        new Date(Date.parse(item.dateOfBirth.toString())).getUTCFullYear()
      );
    },
    guardianFullName(item) {
      return item.guardian
        ? `${item.guardian.firstName
            .substr(0, 1)
            .toUpperCase()}${item.guardian.firstName.substr(1)}` +
            ` ${item.guardian.middleName
              .substr(0, 1)
              .toUpperCase()}${item.guardian.middleName.substr(1)}` +
            ` ${item.guardian.lastName
              .substr(0, 1)
              .toUpperCase()}${item.guardian.lastName.substr(1)}`
        : "N/A";
    },
    guardianRelationToOrphan(item) {
      return item.guardian ? item.guardian.relationToOrphan : "N/A";
    },
    percentGenerator() {
      for (let i = 1; i <= 100; i++) {
        this.percent.push(i);
      }
    },

    // showDetails(item) {
    showDetails(item) {
      console.log("Show Items", item);
    },

    removeSelectedActive(item) {
      this.activeFilterValue.splice(this.activeFilterValue.indexOf(item), 1);
      this.activeFilterValue = [...this.activeFilterValue];
    },
    removeSelectedProcessing(item) {
      this.processingFilterValue.splice(
        this.processingFilterValue.indexOf(item),
        1
      );
      this.processingFilterValue = [...this.processingFilterValue];
    },
    removeSelectedPending(item) {
      this.pendingFilterValue.splice(this.pendingFilterValue.indexOf(item), 1);
      this.pendingFilterValue = [...this.pendingFilterValue];
    },
    removeSelectedGraduated(item) {
      this.graduatedFilterValue.splice(
        this.graduatedFilterValue.indexOf(item),
        1
      );
      this.graduatedFilterValue = [...this.graduatedFilterValue];
    },

    // **********************************
    cancelRejection(dialog) {
      dialog.value = false;
    },
    confirmRejection(dialog) {
      dialog.value = false;
      
      for (const orphan of this.selectedProcessingOrphans) {
        const orphanId = orphan.id;
        this.createSponsorshipStatus(orphanId, "new")
          .then((sponsorshipStatuse) => {
            console.log("SponsoreStatus:", sponsorshipStatuse);
          })
          .catch((err) => console.warn(err));
      }
    },
    async createSponsorshipStatus(orphanId, status) {
      return axios
        .post("/graphql", {
          query: `mutation createSponsorshipStatus(
                  $status: SponsorshipStatusEnum
                  $date: DateTime!
                  $orphanId: ID
                ) {
                  createSponsorshipStatus(status: $status, date: $date, orphanId: $orphanId) {
                    id
                    status
                    date
                    orphan {
                      id
                    }
                  }
                }`,
          variables: {
            status: status,
            date: new Date().toISOString(),
            orphanId: orphanId,
          },
        })
        .then((res) => res.data.data.createSponsorshipStatus)
        .catch((err) => console.warn(err));
    },
    supportPlanSubmit(dialog) {
      dialog.value = false;

      let collectiveFund_fc,
        individualFund_fc,
        foreignCurrency,
        supportPeriod,
        orphanIds;
      // orphanIds = this.selectedProcessingOrphans.reduce((acc, cur) => {
      //   return acc.push(cur.id);
      //   }, []);
      orphanIds = this.selectedProcessingOrphans.map((val) => parseInt(val.id));
      if (this.singleProcessingSelect === true) {
        collectiveFund_fc = individualFund_fc = this.fund_fc;
        foreignCurrency = this.currency;
        supportPeriod = this.supportPeriod;
      } else {
        collectiveFund_fc = this.fund_fc;
        individualFund_fc = this.fund_fc / orphanIds.length;
        foreignCurrency = this.currency;
        supportPeriod = this.supportPeriod;
      }

      axios
        .post("/graphql/", {
          query: `mutation createSupportPlan(
                    $individualFund_fc: Float
                    $collectiveFund_fc: Float
                    $foreignCurrency: String
                    $supportPeriod: Int
                    $adminFeePercentage: Float
                    $donorId: ID!
                    $orphans: [ID!]!
                  ) {
                    createSupportPlan(
                      individualFund_fc: $individualFund_fc
                      collectiveFund_fc: $collectiveFund_fc
                      foreignCurrency: $foreignCurrency
                      supportPeriod: $supportPeriod
                      adminFeePercentage: $adminFeePercentage
                      donorId: $donorId
                      orphans: $orphans
                    ) {
                      id
                      foreignCurrency
                      collectiveFund_fc
                      individualFund_fc
                      supportPeriod
                      donor {
                        id
                        nameInitials
                      }
                      orphans {
                        id
                      }
                    }
                  }`,
          variables: {
            individualFund_fc: parseInt(individualFund_fc),
            collectiveFund_fc: parseInt(collectiveFund_fc),
            foreignCurrency: foreignCurrency,
            supportPeriod: parseInt(supportPeriod),
            adminFeePercentage: parseInt(this.adminPercent),
            donorId: parseInt(this.donor.id),
            orphans: orphanIds,
          },
        })
        .then((res) => res.data.data.createSupportPlan)
        .then((supportPlan) => {
          for (const orphan of supportPlan.orphans) {
            const orphanId = orphan.id;
            this.createSponsorshipStatus(orphanId, "pending")
              .then((sponsorshipStatuse) => {
                console.log("SponsoreStatus:", sponsorshipStatuse);
                this.selectedProcessingOrphans = [];
                this.orphans = [];
                this.initialize();
              })
              .catch((err) => console.warn(err));
          }
        })
        .catch((err) => console.warn(err));
    },
    supportPlanCancel(dialog) {
      dialog.value = false;
      this.currency = "";
      this.supportPeriod = "";
      this.fund_fc = "";
      this.adminPercent = "";
    }
  },
};
</script>
