<template>
  <v-card style="margin: auto;">
    <v-card-title>
      Payment History Report Input Form
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-form lazy-validation ref="showReportForm">
        <v-row>
          <!-- Start date field -->
          <v-col cols="12" class="pb-0">
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
                  :rules="[rules.required]"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="fromDatePicker"
                v-model="fromDate"
                label="Date"
                no-title
                scrollable
                :max="new Date().toISOString().substr(0, 10)"
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
                  :rules="[rules.required]"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="endDatePicker"
                v-model="toDate"
                no-title
                scrollable
                :max="new Date().toISOString().substr(0, 10)"
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
export default {
  data() {
    return {
      fromDateMenu: false,
      endDateMenu: false,
      fromDate: null,
      toDate: null,
      rules: {
        required: (v) => !!v || 'Required'
      }
    };
  },

  watch: {
    // ### Changes the date picker's first card after click in years instead of dates
    // fromDateMenu(val) {
    //   val &&
    //     setTimeout(() => (this.$refs.fromDatePicker.activePicker = 'YEAR'));
    // },
    // endDateMenu(val) {
    //   val && setTimeout(() => (this.$refs.endDatePicker.activePicker = 'YEAR'));
    // }
  },

  methods: {
    handleNext() {
      console.log(this.fromDate, this.toDate);
      this.$emit('closePHRInputForm');
    }
  }
};
</script>

<style lang="scss" scoped></style>
