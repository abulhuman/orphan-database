<template>
  <v-card style="margin: auto;">
    <v-card-title>
      Payment History Report Input Form
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form lazy-validation ref="phrInputForm">
        <v-row>
          <!-- Report type -->
          <v-col cols="12" class="mt-4 mb-n4 pb-0">
            <v-select
              v-model="reportType"
              :items="reportOptions"
              item-text="text"
              item-value="value"
              label="Type"
              dense
              outlined
              @change="handleReportTypeChange"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <!-- Orphan select -->
          <v-col v-if="showOrphanSelect" cols="12" class="mt-4 mb-n4 pb-0">
            <v-select
              v-model="selectedOrphan"
              :items="orphanOptions"
              :item-text="orphanFullName"
              item-value="id"
              label="Select Orphan"
              dense
              outlined
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <!-- Donor select -->
          <v-col v-if="showDonorSelect" cols="12" class="mt-4 mb-n4 pb-0">
            <v-select
              v-model="selectedDonor"
              :items="donorOptions"
              item-text="nameInitials"
              item-value="id"
              label="SelectDonor"
              dense
              outlined
              :rules="[rules.required]"
            ></v-select>
          </v-col>
          <!-- Start date field -->
          <v-col cols="12" class="py-0">
            <v-menu
              ref="fromDateRef"
              v-model="fromDateMenu"
              :close-on-content-click="false"
              :return-value.sync="fromDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="fromDate"
                  label="From Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required, rules.isDate]"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="fromDatePicker"
                v-model="fromDate"
                label="Date"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="fromDateMenu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.fromDateRef.save(fromDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <!-- End date field -->
          <v-col cols="12" class="pt-0">
            <v-menu
              ref="endDateRef"
              v-model="endDateMenu"
              :close-on-content-click="false"
              :return-value.sync="toDate"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="toDate"
                  label="To Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  :rules="[rules.required, rules.isDate]"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="endDatePicker"
                v-model="toDate"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="endDateMenu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.endDateRef.save(toDate)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer />
      <v-btn class="secondary lighten-2">Cancel</v-btn>
      <v-btn class="primary" @click="handleNext">Next</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    projectId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      fromDateMenu: false,
      endDateMenu: false,
      fromDate: null,
      toDate: null,
      reportType: null,
      reportOptions: [
        {
          text: 'Orphan Payment History Report',
          value: 'orphanPHR'
        },
        {
          text: 'Donor Payment History Report',
          value: 'donorPHR'
        },
        {
          text: 'Project Payment History Report',
          value: 'projectPHR'
        }
      ],
      showOrphanSelect: false,
      selectedOrphan: null,
      orphanOptions: [],
      showDonorSelect: false,
      selectedDonor: null,
      donorOptions: [],
      rules: {
        required: (value) => !!value || 'This field is Required',
        isDate: (value) =>
          new Date(value).toString() !== 'Invalid Date' || 'Invalid Date'
      }
    };
  },

  watch: {
    // ### Shows year view when the date picker is opened as opposed to the default date view
    // fromDateMenu(val) {
    //   val &&
    //     setTimeout(() => (this.$refs.fromDatePicker.activePicker = 'YEAR'));
    // }
    // endDateMenu(val) {
    //   val && setTimeout(() => (this.$refs.endDatePicker.activePicker = 'YEAR'));
    // }
  },

  methods: {
    handleNext() {
      if (this.$refs.phrInputForm.validate()) {
        this.$emit('closePHRInputForm', {
          startDate: this.fromDate,
          endDate: this.toDate,
          reportType: this.reportType,
          orphanId: this.selectedOrphan,
          donorId: this.selectedDonor
        });
      }
    },
    orphanFullName(orphan) {
      return (
        `${orphan.firstName
          .substr(0, 1)
          .toUpperCase()}${orphan.firstName.substr(1)}` +
        ` ${orphan.father.firstName
          .substr(0, 1)
          .toUpperCase()}${orphan.father.firstName.substr(1)}` +
        ` ${orphan.father.lastName
          .substr(0, 1)
          .toUpperCase()}${orphan.father.lastName.substr(1)}`
      );
    },
    async handleReportTypeChange() {
      this.showOrphanSelect = false;
      this.showDonorSelect = false;
      this.selectedDonor = null;
      this.selectedOrphan = null;

      if (this.reportType === 'orphanPHR') {
        this.showOrphanSelect = true;
        this.orphanOptions = await this.fetchOrphansByProjectId(this.projectId);
      } else if (this.reportType === 'donorPHR') {
        this.showDonorSelect = true;
        this.donorOptions = await this.fetchDonorsByProjectId(this.projectId);
      }
    },
    async fetchOrphansByProjectId(projectId) {
      const orphans = await axios.post('/graphql', {
        query: `query getOrphansByProjectId ($projectId: ID!) {
                  getOrphansByProjectId (projectId: $projectId) {
                    id
                    orphanCode
                    firstName
                    father {
                      firstName
                      lastName
                    }
                  }
                }`,
        variables: {
          projectId
        }
      });

      return orphans.data.data.getOrphansByProjectId;
    },
    async fetchDonorsByProjectId(projectId) {
      const supportPlans = await axios.post('/graphql', {
        query: `query getSupportPlanByProjectId ($projectId: ID!) {
                getSupportPlansByProjectId (projectId: $projectId) {
                  donor {
                    id
                    nameInitials
                    companyName
                  }
                }
              }`,
        variables: {
          projectId
        }
      });

      return supportPlans.data.data.getSupportPlansByProjectId.map(
        (supportPlan) => supportPlan.donor
      );
    }
  }
};
</script>

<style lang="scss" scoped></style>
