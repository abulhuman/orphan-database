<template>
  <v-dialog
    v-model="isOpen"
    persistent
    :retain-focus="false"
    max-width="1024"
    overlay-color="#000"
    overlay-opacity=".3"
  >
    <template #activator="{ on: dialog, attrs }">
      <v-tooltip top>
        <template #activator="{ on: tooltip}">
          <v-icon
            class="mr-2"
            color="pink accent-4"
            v-bind="attrs"
            v-on="{ ...tooltip, ...dialog }"
            @click="populateFinancialRecordsTable(item)"
          >
            mdi-bank
          </v-icon></template
        >
        <span>Financial Records</span>
      </v-tooltip>
    </template>
    <v-snackbar v-model="snackBar" top right :color="snackBarColor" outlined>
      <v-row>
        <div class="ml-2">{{ snackBarText }}</div>
        <v-spacer></v-spacer>
        <v-icon color="gray" @click="snackBar = false" right>
          mdi-close</v-icon
        ></v-row
      >
    </v-snackbar>
    <v-card>
      <v-card-title
        >Financial Records <v-spacer></v-spacer>
        <insert-financial-record-dialog
          :orphanId="item.id"
          @newRecordSaved="
            snackBar = true;
            snackBarColor = 'success';
            snackBarText = 'Successfully added record!';
            populateFinancialRecordsTable(item);
          "
      /></v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-data-table :headers="headers" :items="items"> </v-data-table
          ></v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="light" @click="isOpen = !isOpen">close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import moment from "moment";
import InsertFinancialRecordDialog from "./InsertFinancialRecordDialog.vue";
import { mapMutations } from "vuex";
export default {
  props: ["open", "item"],
  components: {
    InsertFinancialRecordDialog
  },
  data: () => ({
    snackBar: false,
    snackBarText: "",
    snackBarColor: "success",
    isOpen: false,
    headers: [
      {
        text: "Transaction Date",
        value: "transactionDate"
      },
      {
        text: "Transaction Type",
        value: "transactionType"
      },
      {
        text: "Reason",
        value: "reason"
      },
      {
        text: "Amount",
        value: "amount",
        align: "end"
      },
      {
        text: "Special Case Reason",
        value: "specialCaseReason"
      }
    ],
    items: []
  }),
  methods: {
    ...mapMutations([
      "SET_SNACKBAR",
      "SET_SNACKBAR_COLOR",
      "SET_SNACKBAR_TEXT"
    ]),
    populateFinancialRecordsTable(item) {
      const query = `
        query($orphanId: ID!){
            getFinancialRecordsByOrphanId(orphanId: $orphanId){
                id
                transactionType
                transactionDate
                amount
                reason
                specialCaseReason
              }
            }
        `;

      const requestOptions = {
        query,
        variables: { orphanId: item.id }
      };
      (async () => {
        try {
          const response = await axios.post("graphql", requestOptions);
          if (response.data.errors?.length) {
            throw new Error(response.data.errors[0].message.message);
          }
          const financialRecords =
            response.data.data.getFinancialRecordsByOrphanId;
          this.items = financialRecords.map(item => ({
            ...item,
            transactionDate: moment(item.transactionDate).format("DD/MM/YY"),
            reason: String(item.reason).includes("EW")
              ? "Educational Material Withdrawal"
              : String(item.reason).includes("NW")
              ? "Necessities (food, clothes, rent, ...)"
              : String(item.reason).includes("HW")
              ? "Health support withdrawal"
              : String(item.reason).includes("SCW")
              ? "Special case withdrawal"
              : item.reason
          }));
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
};
</script>

<style></style>
