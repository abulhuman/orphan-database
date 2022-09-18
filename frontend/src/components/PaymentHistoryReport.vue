<template>
  <div>
    <!-- Payment history reports dialog trigger -->
    <v-tooltip top>
      <template #activator="{ on: onTooltip, attrs: tooltipAttrs }">
        <v-btn
          class="mr-1"
          v-bind="{ ...tooltipAttrs }"
          v-on="{ ...onTooltip }"
          @click="openPaymentHistoryReportDialog()"
        >
          <v-icon>mdi-chart-box-outline</v-icon>
          <!-- alternative icon -->
          <!-- <v-icon>mdi-chart-timeline-variant</v-icon> -->
        </v-btn>
      </template>
      <span>Payment History Reports</span>
    </v-tooltip>
    <v-dialog v-model="showPaymentHistoryReportInputForm" width="24em">
      <payment-history-report-input-form
        :projectId="projectId"
        @closePHRInputForm="handlePHRDialogClose"
      />
    </v-dialog>
    <v-dialog v-model="showPaymentHistoryReportTable" :width="tableWidth">
      <payment-history-report-table :phrInput="phrInput" />
    </v-dialog>
  </div>
</template>

<script>
import PaymentHistoryReportInputForm from './PaymentHistoryReportInputForm';
import PaymentHistoryReportTable from './PaymentHistoryReportTable.vue';
export default {
  components: {
    PaymentHistoryReportInputForm,
    PaymentHistoryReportTable
  },

  props: {
    projectId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      showPaymentHistoryReportInputForm: false,
      showPaymentHistoryReportTable: false,
      phrInput: {}
    };
  },

  computed: {
    tableWidth() {
      return this.phrInput === 'orphanPHR' ? '38em' : '70em';
    }
  },

  methods: {
    openPaymentHistoryReportDialog() {
      this.showPaymentHistoryReportInputForm = true;
    },
    handlePHRDialogClose(phrInput) {
      this.showPaymentHistoryReportInputForm = false;

      phrInput['projectId'] = this.projectId;
      this.phrInput = phrInput;

      this.showPaymentHistoryReportTable = true;
    }
  }
};
</script>

<style lang="scss" scoped></style>
