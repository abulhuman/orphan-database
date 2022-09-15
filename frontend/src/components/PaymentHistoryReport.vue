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
  </div>
</template>

<script>
import axios from 'axios';
import PaymentHistoryReportInputForm from './PaymentHistoryReportInputForm';
export default {
  components: {
    PaymentHistoryReportInputForm
  },

  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showPaymentHistoryReportInputForm: false
    };
  },

  methods: {
    openPaymentHistoryReportDialog() {
      this.showPaymentHistoryReportInputForm = true;
    },
    handlePHRDialogClose(phrInput) {
      this.showPaymentHistoryReportInputForm = false;
      console.log(phrInput);
    }
  }
};
</script>

<style lang="scss" scoped></style>
