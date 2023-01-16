<template>
  <div class="mt-16">
    <v-data-table
      :headers="supportPlanHeaders"
      :items="supportPlans"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top="{ items }">
        <v-col class="d-flex justify-end">
          <v-icon class="mr-2" color="red" @click="closeSupportPlanTable">
            mdi-window-close
          </v-icon>
        </v-col>
        <v-col class="d-flex justify-start">
          <v-btn @click="openCreateSupportPlanDialog(items)"
            >Create SupportPlan</v-btn
          >
        </v-col>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              large
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              @click="openPaymentDialog(item)"
            >
              <!-- mdi-hand-coin-outline -->
              mdi-cash-multiple
            </v-icon>
          </template>
          <span>Group Payments</span>
        </v-tooltip>

        <v-dialog v-model="showEditDialog" width="560px">
          <v-card>
            <v-card-title class="justify-center">
              {{
                `Are you sure you want to generate a new 
              Support Plan?`
              }}
            </v-card-title>
            <v-card-text class="text-center">
              This will overright the priviously generated Support Plan.
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn class="primary" @click="gotoSetInitDateDialog">Yes</v-btn>
              <v-btn class="error" @click="cancelEditDialog">NO</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:item.supportPeriod="{ item }">
        {{
          `${new Date(item.endDate).getFullYear() -
            new Date(item.startDate).getFullYear()} years`
        }}
      </template>
      <!-- <template v-slot:item.projectName="{ item }">
        {{ getProjectName(item) }}
      </template> -->
    </v-data-table>

    <!-- Create Support Plan dialog-->
    <template>
      <v-dialog v-model="createSupportPlanDialog" persistent max-width="60%">
        <v-card>
          <v-card-title>
            <span class="text-h5">Create SupportPlan</span>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="createSupportPlanForm"
              v-model="validCreateSupportPlan"
              lazy-validation
            >
              <v-row>
                <!-- start date -->
                <v-col class="" cols="12" sm="6" md="6" lg="2">
                  <v-menu
                    ref="supportPlanStartDateMenu"
                    v-model="supportPlanStartDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="supportPlanStartDate"
                        label="Start date"
                        prepend-icon="mdi-calendar"
                        readonly
                        :rules="[rules.required]"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="supportPlanStartDate"
                      :active-picker.sync="supportPlanStartDateActivePicker"
                      :min="
                        new Date(
                          Date.now() - new Date().getTimezoneOffset() * 60000
                        )
                          .toISOString()
                          .substr(0, 10)
                      "
                      max="2070-01-01"
                      @change="supportPlanStartDateSave"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- period in months -->
                <v-col class="" cols="12" sm="6" md="6" lg="2">
                  <v-text-field
                    v-model="supportPlanPeriodInYears"
                    label="Period*"
                    type="number"
                    :rules="[rules.required]"
                    hint="duration of the support plan in years"
                  ></v-text-field>
                </v-col>
                <!-- payment interval -->
                <v-col class="" cols="12" sm="6" md="4" lg="3">
                  <v-select
                    v-model="supportPlanPaymentInterval"
                    :items="paymentIntervals"
                    :menu-props="{
                      top: true,
                      offsetY: true
                    }"
                    label="Payment interval*"
                    :rules="[rules.required]"
                    hint="payment interval in months"
                  ></v-select>
                </v-col>
                <!-- admin fee percentage -->
                <v-col class="" cols="12" sm="6" md="4" lg="2">
                  <v-select
                    v-model="supportPlanAdminFeePercent"
                    :items="percent"
                    :menu-props="{
                      top: true,
                      offsetY: true
                    }"
                    label="Admin Fee %*"
                    :rules="[rules.required]"
                    hint="admin fee in percent"
                  ></v-select>
                </v-col>
                <!-- donors -->
                <v-col class="" cols="12" sm="6" md="4" lg="2">
                  <v-select
                    v-model="supportPlanDonor"
                    :items="donors"
                    :item-text="donorText_Value"
                    :item-value="donorText_Value"
                    :menu-props="{
                      top: true,
                      offsetY: true
                    }"
                    :rules="[rules.required]"
                    label="Donors*"
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <small>*indicates required field</small>
          </v-card-text>
          <v-divider></v-divider>
          <!-- Orphans table -->
          <v-card-text>
            <v-data-table
              v-model="selectedNewVillageOrphans"
              :headers="villageOrphanHeaders"
              :items="newVillageOrphans"
              item-key="id"
              :single-select="newVillageOrphanSingleSelect"
              show-select
            >
              <template v-slot:top>
                <v-switch
                  v-model="newVillageOrphanSingleSelect"
                  label="Single select"
                  class="pt-3 "
                ></v-switch>
              </template>
              <template v-slot:item.fullName="{ item }">
                {{ orphanFullName(item) }}
              </template>
              <template v-slot:item.age="{ item }">
                {{ orphanCalcAge(item) }}
              </template>
              <template v-slot:item.sponsorshipStatus="{ item }">
                {{ orphanCalcSponsorshipStatus(item) }}
              </template>
            </v-data-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="createSupportPlanDialog = false"
            >
              Close
            </v-btn>
            <!-- add a snack bar that indicated the operation did not complete if selectedNewVillageOrphans.length === 0 -->
            <v-btn
              color="blue darken-1"
              text
              :disabled="
                !validCreateSupportPlan ||
                  selectedNewVillageOrphans.length === 0
              "
              @click="createSupportPlanSave"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <!-- Create Payment for single support plan-->
    <v-dialog v-model="createPaymentDialog" width="54%">
      <v-card>
        <v-card-title class="justify-center">
          Create Payment
        </v-card-title>

        <v-card-text>
          <v-form ref="createPaymentForm" v-model="validCreatePaymentForm">
            <v-row>
              <!-- start date field -->
              <v-col cols="12" sm="6">
                <v-menu
                  ref="paymentStartDatemenu"
                  v-model="paymentStartDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="paymentStartDate"
                      label="Start date*"
                      prepend-icon="mdi-calendar"
                      hint="start of support plan"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="paymentStartDatepicker"
                    v-model="paymentStartDate"
                    no-title
                    scrollable
                    :min="new Date().toISOString().substr(0, 10)"
                    @change="paymentStartDateSave"
                  >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <!-- duration field -->
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="paymentDuration"
                  type="number"
                  label="Duration*"
                  hint="payment duration in months"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <!-- payment currencies -->
              <v-col cols="8" class="mx-auto pb-0">
                <v-select
                  v-model="paymentCurrencies"
                  :items="paymentCurrenciesOptions"
                  :menu-props="{
                    top: true,
                    offsetY: true
                  }"
                  lable="Payment currencies*"
                  solo
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="12" class="pt-0">
                <v-divider></v-divider>
              </v-col>
              <!-- if payment is sent in birr -->
              <template v-if="paymentCurrencies === 1">
                <v-col cols="12" md="6" sm="4">
                  <v-text-field
                    v-model="paymentInBirr"
                    type="number"
                    label="Payment in Birr*"
                    hint="payment amount in birr"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </template>
              <!-- if payment under goes one convertions -->
              <template v-if="paymentCurrencies === 2">
                <!-- payment in primary foreign currency -->
                <v-col cols="12" md="6" sm="4">
                  <v-text-field
                    v-model="paymentInPrimaryFC"
                    type="number"
                    label="Payment in primaryFC*"
                    hint="payment amount in primary foreign currency"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <!-- primary foreign currency -->
                <v-col cols="12" md="6" sm="4">
                  <v-select
                    v-model="primaryFC"
                    :items="currencyOptions"
                    :item-text="paymentCurrencyText_Value"
                    :item-value="paymentCurrencyText_Value"
                    label="Primary FC*"
                    hint="primary foreign currency"
                    :rules="[rules.required]"
                    clearable
                  ></v-select>
                </v-col>
                <!-- primary foreign currency exchange rate-->
                <v-col cols="12" md="6" sm="4">
                  <v-text-field
                    v-model="primaryExchangeRate"
                    type="number"
                    label="Primary FC exchange rate*"
                    hint="primary foreign currency exchange rate"
                    :rules="[rules.required]"
                    clearable
                  ></v-text-field>
                </v-col>
              </template>
              <!-- if payment under goes two convertions -->
              <template v-if="paymentCurrencies === 3">
                <!-- payment in primary foreign currency -->
                <v-col cols="12" md="6" sm="4">
                  <v-text-field
                    v-model="paymentInPrimaryFC"
                    type="number"
                    label="Payment in primaryFC*"
                    hint="payment amount in primary foreign currency"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <!-- primary foreign currency -->
                <v-col cols="12" md="6" sm="4">
                  <v-select
                    v-model="primaryFC"
                    :items="currencyOptions"
                    :item-text="paymentCurrencyText_Value"
                    :item-value="paymentCurrencyText_Value"
                    label="Primary FC*"
                    hint="primary foreign currency"
                    :rules="[rules.required]"
                    clearable
                  ></v-select>
                </v-col>
                <!-- payment in secondary foreign currency -->
                <v-col cols="12" md="6" sm="4">
                  <v-text-field
                    v-model="paymentInSecondaryFC"
                    type="number"
                    label="Payment in secondaryFC*"
                    hint="payment amount in secondary foreign currency"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <!-- secondary foreign currency -->
                <v-col cols="12" md="6" sm="4">
                  <v-select
                    v-model="secondaryFC"
                    :items="currencyOptions"
                    :item-text="paymentCurrencyText_Value"
                    :item-value="paymentCurrencyText_Value"
                    label="Secondary FC*"
                    hint="secondary foreign currency"
                    :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <!-- secondary foreign currency exchange rate-->
                <v-col cols="12" md="6" sm="4">
                  <v-text-field
                    v-model="secondaryExchangeRate"
                    type="number"
                    label="Secondary FC exchange rate*"
                    hint="secondary foreign currency exchange rate"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </template>
              <template
                v-if="
                  paymentCurrencies !== 1 &&
                    paymentCurrencies !== 2 &&
                    paymentCurrencies !== 3
                "
              >
                <v-col cols="12">
                  Select the number of currencies
                </v-col>
              </template>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn text class="red--text" @click="cancleCreatePaymentDialog"
            >Cancel</v-btn
          >
          <v-btn
            text
            class="primary--text"
            @click="confirmCreatePaymentDialog"
            :disabled="!validCreatePaymentForm"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Payment table dialog -->
    <v-dialog v-model="paymentDialog" width="90%" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="11" class="text-center">
              <span class="ml-16"> Payment ID </span>
            </v-col>
            <v-col cols="1">
              <v-icon class="ml-5" @click="closePaymentDialog"
                >mdi-close</v-icon
              >
            </v-col>
          </v-row>
          <!-- <span class="ml-auto"></span>
          <v-spacer></v-spacer> -->
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="supportPlanPaymentHeaders"
            :items="supportPlanPayments"
          >
            <template v-slot:top="{ items }">
              <v-row class="mt-1 mb-4">
                <v-spacer></v-spacer>
                <v-btn
                  class="primary mr-10"
                  @click="openCreatePaymentDialog(items)"
                  >Create Payment</v-btn
                >
              </v-row>
            </template>
            <template v-slot:item.paymentPeriodInMonths="{ item }">
              {{ `${item.paymentPeriodInMonths} months` }}
            </template>
            <template v-slot:item.actions="{ item }">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="ml-n3"
                    large
                    v-bind="attrs"
                    v-on="on"
                    @click="openIndividualPaymentEditDialog(item)"
                  >
                    <!-- mdi-clipboard-text-outline -->
                    mdi-cash-plus
                  </v-icon>
                </template>
                <span>Edit Individual Payments</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="ml-2"
                    large
                    v-bind="attrs"
                    v-on="on"
                    @click="openIndividualPaymentDialog(item)"
                  >
                    mdi-cash-check
                    <!-- mdi-clipboard-text-outline -->
                  </v-icon>
                </template>
                <span>View Individual Payments</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Individual payment edit table dialog -->
    <v-dialog v-model="individualPaymentDialog" width="90%" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="11" class="text-center">
              <span class="ml-16"> Individual Payment ID </span>
            </v-col>
            <v-col cols="1">
              <v-icon class="ml-5" @click="closeIndividualPaymentDialog"
                >mdi-close</v-icon
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="individualPaymentHeaders"
            :items="individualPayments"
            fixed-header
            max-height="60vh"
          >
            <template v-slot:top="{ items }">
              <v-row class="mt-1 mb-4">
                <v-spacer></v-spacer>
                <span
                  v-if="totalAndSummationConflict"
                  class="pt-3 red--text text--darken-4"
                  >{{ totalAndSummationConflictMsg }}</span
                >
                <v-spacer></v-spacer>
                <v-btn
                  class="primary mr-10"
                  @click="individualPaymentSave(items)"
                >
                  <v-icon>mdi-content-save-outline</v-icon>Save</v-btn
                >
              </v-row>
              <!-- social worker dialog -->
              <v-dialog
                v-model="showAssignSocialWorkerDialog"
                width="40%"
                persistent
              >
                <v-card>
                  <v-card-title class="justify-center">
                    Assign Social Worker for the Sponsored Orphans
                  </v-card-title>
                  <!-- socialWorker field -->
                  <v-form
                    ref="assignSocialWorkerForm"
                    v-model="validAssignSocialWorkerForm"
                  >
                    <v-row no-gutters class="justify-center">
                      <v-col cols="9">
                        <v-select
                          v-model="orphanSocialWorker"
                          hint="select social worker for sponsored orphans"
                          :items="orphanSocialWorkerOptions"
                          :menu-props="{ bottom: true, offsetY: true }"
                          solo
                          :rules="[rules.required]"
                          persistent-hint
                          placeholder="SocialWorker"
                        >
                        </v-select>
                      </v-col>
                    </v-row>
                  </v-form>
                  <v-card-actions class="justify-end">
                    <v-btn
                      text
                      class="red--text"
                      @click="cancelAssignSocialWorker"
                      >Cancel</v-btn
                    >
                    <v-btn
                      text
                      class="primary--text"
                      @click="confirmAssignSocialWorker"
                      :disabled="!validAssignSocialWorkerForm"
                      >Confirm</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>

            <template v-slot:item.depositInPrimaryForeignCurrency="props">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <!-- this can be done better by getting the divs parent and changeing its style -->
                  <div
                    v-bind="attrs"
                    v-on="on"
                    :style="{
                      'background-color': totalAndSummationConflictColor,
                      color: totalAndSummationConflictTextColor
                    }"
                  >
                    <v-edit-dialog
                      :return-value.sync="
                        props.item.depositInPrimaryForeignCurrency
                      "
                      large
                      persistent
                      @save="savePrimaryForeignCurrencyChange(props.item)"
                      @cancel="cancelPrimaryForeignCurrencyChange"
                      class="text--red"
                    >
                      {{ props.item.depositInPrimaryForeignCurrency }}
                      <template v-slot:input>
                        Update Deposit in PrimaryFC
                        <v-text-field
                          v-model="props.item.depositInPrimaryForeignCurrency"
                          label="Edit"
                          single-line
                          counter
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </div>
                </template>
                <span>Edit</span>
              </v-tooltip>
            </template>
            <template v-slot:item.id="{ item }">
              {{ individualOrphanId(item) }}
            </template>
            <template v-slot:item.orphanFullName="{ item }">
              {{ individualOrphanFullName(item) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ calcAge(item) }}
            </template>
            <template v-slot:item.gender="{ item }">
              {{ individualOrphanGender(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ individualGuardianFullName(item) }}
            </template>
            <template v-slot:item.accountNumber="{ item }">
              {{ individualOrphanAccountNumber(item) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Individual payment table dialog -->
    <v-dialog v-model="fetchedIndividualPaymentDialog" width="90%" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="11" class="text-center">
              <span class="ml-16"> Individual Payment ID </span>
            </v-col>
            <v-col cols="1">
              <v-icon class="ml-5" @click="closeFetchedIndividualPaymentDialog"
                >mdi-close</v-icon
              >
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="individualPaymentHeaders"
            :items="fetchedIndividualPayments"
            fixed-header
            height="60vh"
          >
            <template v-slot:top="{ items }">
              <v-row class="mt-1 mb-4">
                <v-spacer></v-spacer>
                <v-btn
                  class="primary mr-10"
                  @click="downloadPaymentSheet(items)"
                >
                  <!-- mdi-download-lock-outline -->
                  <v-icon>mdi-download-outline</v-icon> Download</v-btn
                >
              </v-row>
            </template>
            <template v-slot:item.id="{ item }">
              {{ individualOrphanId(item) }}
            </template>
            <template v-slot:item.orphanFullName="{ item }">
              {{ individualOrphanFullName(item) }}
            </template>
            <template v-slot:item.age="{ item }">
              {{ calcAge(item) }}
            </template>
            <template v-slot:item.gender="{ item }">
              {{ individualOrphanGender(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ individualGuardianFullName(item) }}
            </template>
            <template v-slot:item.accountNumber="{ item }">
              {{ individualOrphanAccountNumber(item) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- InitDate ExchangeRate Dialog -->
    <v-dialog v-model="showSetInitDateDialog" width="40%" persistent>
      <v-card>
        <v-card-title class="justify-center">
          Set Init Date & Exchange Rate
        </v-card-title>
        <v-form ref="setInitDateForm" v-model="validSetInitDateForm">
          <v-row no-gutters>
            <!-- exchange rate field -->
            <v-col cols="6">
              <v-responsive
                min-width="150"
                max-width="150"
                class="pl-0 mx-auto"
              >
                <v-text-field
                  v-model="exchangeRate"
                  type="number"
                  label="Exchange Rate*"
                  hint="exchange rate of foreign currency to Birr"
                  :rules="[rules.required]"
                ></v-text-field>
              </v-responsive>
            </v-col>
            <!-- init date field -->
            <v-col cols="6" class="ml-n5">
              <v-menu
                ref="initDatemenu"
                v-model="initDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-responsive
                    min-width="170"
                    max-width="170"
                    class="pl-0 mx-auto"
                  >
                    <v-text-field
                      v-model="initDate"
                      label="InitDate*"
                      prepend-icon="mdi-calendar"
                      hint="start of support plan"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-responsive>
                </template>
                <v-date-picker
                  ref="initDatepicker"
                  v-model="initDate"
                  no-title
                  scrollable
                  :max="new Date().toISOString().substr(0, 10)"
                  @change="initDateSave"
                >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>

        <v-card-actions class="justify-end">
          <v-btn text class="red--text" @click="cancelSetInitDateExchangeRate"
            >Cancel</v-btn
          >
          <v-btn
            text
            class="primary--text"
            @click="confirmSetInitDateExchangeRate"
            :disabled="!validSetInitDateForm"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- support plan orphans dialog -->
    <v-dialog v-model="showSupportPlanOrphansDialog" width="90%" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <v-col cols="11" class="text-center">
              <span class="ml-16"> Support Plan Id </span>
            </v-col>
            <v-col cols="1">
              <v-icon class="ml-5" @click="closeSupportPlanOrphanDialog"
                >mdi-close</v-icon
              >
            </v-col>
          </v-row>
          <!-- <span class="ml-auto"></span>
          <v-spacer></v-spacer> -->
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="supportPlanOrphanHeaders"
            :items="supportPlanOrphans"
          >
            <template v-slot:top="{ items }">
              <v-row class="mt-1 mb-4">
                <v-spacer></v-spacer>
                <v-btn
                  class="primary mr-10"
                  @click="downloadPaymentSheet(items)"
                  >Download</v-btn
                >
              </v-row>
            </template>
            <template v-slot:item.orphanFullName="{ item }">
              {{ orphanFullName(item) }}
            </template>
            <template v-slot:item.guardianFullName="{ item }">
              {{ guardianFullName(item) }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import XLSX from 'xlsx';
import XLSXStyle from 'cptable-fixed-xlsx-style';
// import XLSXStyle from 'xlsx-style';
import { saveAs } from 'file-saver';

export default {
  props: {
    projectId: {
      type: String
    }
  },

  data: () => ({
    supportPlans: [],
    supportPlanHeaders: [
      {
        text: 'Id',
        align: 'start',
        value: 'id'
      },
      { text: 'Name', value: 'name' },
      { text: 'Period of Support', value: 'supportPeriod' },
      { text: 'Donor', value: 'donor.nameInitials' },
      { text: 'Number of Orphans', value: 'orphans.length' },
      { text: 'Admin Fee%', value: 'adminFeePercentage' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    rules: {
      required: (value) => !!value || 'Required.'
    },
    showSetInitDateDialog: false,
    showAssignSocialWorkerDialog: false,
    showEditDialog: false,
    validSetInitDateForm: false,
    validAssignSocialWorkerForm: false,
    exchangeRate: '',
    initDateMenu: false,
    initDate: '',
    selectedSupportPlan: null,
    showSupportPlanOrphansDialog: false,
    // --------------------
    createSupportPlanDialog: false,
    validCreateSupportPlan: false,
    supportPlanStartDateActivePicker: null,
    supportPlanStartDate: null,
    supportPlanStartDateMenu: false,
    percent: [],
    paymentIntervals: [],
    supportPlanPeriodInYears: null,
    supportPlanPaymentInterval: null,
    supportPlanAdminFeePercent: null,
    supportPlanDonor: null,
    newVillageOrphans: [],
    villageOrphanHeaders: [
      { text: 'Id', align: 'start', value: 'id' },
      { text: 'Orphan Name', value: 'fullName' },
      { text: 'Age', value: 'age' },
      { text: 'Gender', value: 'gender' },
      {
        text: 'Sponsorship Status',
        value: 'sponsorshipStatus'
      },
      { text: 'Account No', value: 'accountNumber' }
    ],
    selectedNewVillageOrphans: [],
    newVillageOrphanSingleSelect: false,
    donors: [],
    // ..................
    createPaymentDialog: false,
    validCreatePaymentForm: false,
    paymentStartDateMenu: false,
    paymentStartDate: '',
    paymentDuration: null,
    paymentCurrencies: null,
    paymentCurrenciesOptions: [1, 2, 3],
    paymentInBirr: null,
    paymentInPrimaryFC: null,
    primaryFC: null,
    primaryExchangeRate: null,
    paymentInSecondaryFC: null,
    secondaryFC: null,
    secondaryExchangeRate: null,
    currencyOptions: [
      { name: 'Australian dollar', acronym: 'AUD', symbol: 'A$' },
      { name: 'Brazilian real', acronym: 'BRL', symbol: 'R$' },
      { name: 'Canadian dollar', acronym: 'CAD', symbol: 'C$' },
      { name: 'Chilean peso', acronym: 'CLP', symbol: 'CLP$' },
      { name: 'Colombian peso', acronym: 'COP', symbol: 'COL$' },
      { name: 'Czech koruna', acronym: 'CZK', symbol: 'Kč' },
      { name: 'Danish krone', acronym: 'DKK', symbol: 'kr' },
      { name: 'Euro', acronym: 'EUR', symbol: '€' },
      { name: 'Hong Kong dollar', acronym: 'HKD', symbol: 'HK$' },
      { name: 'Hungarian forint', acronym: 'HUF', symbol: 'Ft' },
      { name: 'Indian rupee', acronym: 'INR', symbol: '₹' },
      { name: 'Indonesian rupiah', acronym: 'IDR', symbol: 'Rp' },
      { name: 'Israeli new shekel', acronym: 'ILS', symbol: '₪' },
      { name: 'Japanese yen', acronym: 'JPY', symbol: '¥' },
      { name: 'Malaysian ringgit', acronym: 'MYR', symbol: 'RM' },
      { name: 'Mexican peso', acronym: 'MXN', symbol: '$' },
      { name: 'New Taiwan dollar', acronym: 'TWD', symbol: 'NT$' },
      { name: 'New Zealand dollar', acronym: 'NZD', symbol: 'NZ$' },
      { name: 'Norwegian krone', acronym: 'NOK', symbol: 'kr' },
      { name: 'Philippine peso', acronym: 'PHP', symbol: '₱' },
      { name: 'Polish złoty', acronym: 'PLN', symbol: 'zł' },
      { name: 'Pound sterling	', acronym: 'GBP', symbol: '£' },
      { name: 'Renminbi', acronym: 'CNY', symbol: '元 / ¥' },
      { name: 'Romanian leu', acronym: 'RON', symbol: 'L' },
      { name: 'Russian ruble', acronym: 'RUB', symbol: '₽' },
      { name: 'Saudi riyal', acronym: 'SAR', symbol: '﷼' },
      { name: 'Singapore dollar', acronym: 'SGD', symbol: 'S$' },
      { name: 'South African rand', acronym: 'ZAR', symbol: 'R' },
      { name: 'South Korean won', acronym: 'KRW', symbol: '₩' },
      { name: 'Swedish krona', acronym: 'SEK', symbol: 'kr' },
      { name: 'Swiss franc', acronym: 'CHF', symbol: 'CHF' },
      { name: 'Thai baht', acronym: 'THB', symbol: '฿' },
      { name: 'Turkish lira', acronym: 'TRY', symbol: '₺' },
      { name: 'UAE dirham', acronym: 'AED', symbol: 'د.إ' },
      { name: 'United States dollar', acronym: 'USD', symbol: 'US$' }
    ],
    selectedPayment: null,
    paymentDialog: null,
    supportPlanPayments: [],
    supportPlanPaymentHeaders: [
      { text: 'Id', align: 'start', value: 'id' },
      { text: 'Period', value: 'paymentPeriodInMonths' },
      { text: 'Primary FC', value: 'primaryForeignCurrency' },
      {
        text: 'Payment In Primary FC',
        value: 'paymentInPrimaryForeignCurrency'
      },
      { text: 'Primary Exchange Rate', value: 'primaryExchangeRate' },
      { text: 'Secondary FC', value: 'secondaryForeignCurrency' },
      {
        text: 'Payment In Secondary FC',
        value: 'paymentInSecondaryForeignCurrency'
      },
      { text: 'Secondary Exchange Rate', value: 'secondaryExchangeRate' },
      {
        text: 'Gross Payment In Birr',
        value: 'grossPaymentInDomesticCurrency'
      },
      { text: 'Admin Fee In Birr', value: 'adminFeeInDomesticCurrency' },
      { text: 'NetPayment In Birr', value: 'netPaymentInDomesticCurrency' },
      { text: 'Actions', value: 'actions', sortable: false, width: 105 }
    ],
    individualPaymentDialog: false,
    individualPayments: [],
    individualPaymentHeaders: [
      { text: 'Id', align: 'start', value: 'id' },
      { text: 'Orphan Name', value: 'orphanFullName' },
      { text: 'Age', value: 'age' },
      { text: 'Gender', value: 'gender' },
      { text: 'Guardian Name', value: 'guardianFullName' },
      { text: 'Account Number', value: 'accountNumber' },
      { text: 'Period', value: 'payment.paymentPeriodInMonths' },
      {
        text: 'Deposit In Primary FC',
        value: 'depositInPrimaryForeignCurrency'
      },
      {
        text: 'Deposit In Secondary FC',
        value: 'depositInSecondaryForeignCurrency'
      },
      {
        text: 'Gross Deposit In Birr',
        value: 'grossDepositInDomesticCurrency'
      },
      {
        text: 'Admin Fee In Birr',
        value: 'adminFeeInDomesticCurrency'
      },
      {
        text: 'NetPayment In Birr',
        value: 'netDepositInDomesticCurrency'
      }
    ],
    editableIndividualTable: false,
    editIndividualPayment: {
      orphan: {
        id: null,
        firstName: null,
        father: {
          firstName: null,
          lastName: null
        },
        dateOfBirth: null,
        gender: null,
        accountNumber: null,
        guardian: {
          firstName: null,
          middleName: null,
          lastName: null
        }
      },
      payment: {
        paymentPeriodInMonths: null
      },
      depositInPrimaryForeignCurrency: null,
      depositInSecondaryForeignCurrency: null,
      grossDepositInDomesticCurrency: null,
      adminFeeInDomesticCurrency: null,
      netDepositInDomesticCurrency: null
    },
    totalAndSummationConflict: false,
    totalAndSummationConflictMsg: null,
    totalAndSummationConflictColor: null,
    totalAndSummationConflictTextColor: null,
    fetchedIndividualPaymentDialog: false,
    fetchedIndividualPayments: [],
    selectedIndividualPayments: [],
    supportPlanOrphans: [],
    supportPlanOrphanHeaders: [
      { text: 'Id', align: 'start', value: 'id' },
      { text: 'Orphan Name', value: 'orphanFullName' },
      { text: 'Guardian Name', value: 'guardianFullName' },
      { text: 'Account No', value: 'accountNumber' },
      { text: 'Period', value: 'supportPlan.supportPeriod' },
      { text: 'Total Fund in FC', value: 'supportPlan.individualFund_fc' },
      { text: 'Total Fund in Birr', value: 'supportPlan.individualFund_brr' },
      { text: 'Admin. Fee', value: 'supportPlan.adminFee_brr' },
      { text: 'Net Payment', value: 'supportPlan.netPayment_brr' }
    ],
    supportPlanInitDate: null,
    supportPlanTermDate: null,
    orphanSocialWorker: null,
    orphanSocialWorkerOptions: [],
    villageIds: [],
    socialWorkers: []
  }),

  computed: {
    // supportPeriod(item) {
    //   return item;
    // },
  },

  watch: {
    // 'individualPayments'(val) {
    //   console.log("val", val);
    // },

    // individualPayments: {
    //   handler(individualPayments) {
    //     let sumOfPrimaryForeignCurrencies = 0;
    //     for (const individualPayment of individualPayments) {
    //       sumOfPrimaryForeignCurrencies += parseFloat(
    //         individualPayment.depositInPrimaryForeignCurrency
    //       );
    //     }
    //     console.log(
    //       `sumOfPrimaryForeignCurrencies`,
    //       sumOfPrimaryForeignCurrencies
    //     );
    //     console.log(
    //       `selectedPayment`,
    //       this.selectedPayment.paymentInPrimaryForeignCurrency
    //     );
    //   },
    //   deep: true,
    // },

    supportPlanStartDateMenu(val) {
      val && setTimeout(() => (this.supportPlanStartDateActivePicker = 'YEAR'));
    },
    initDateMenu(val) {
      // Changes the active picker from the default "DATE" to "YEAR"
      val &&
        setTimeout(() => (this.$refs.initDatepicker.activePicker = 'YEAR'));
    },
    showSupportPlanOrphansDialog(val) {
      // to update exchangeRate of each support plan until subscription is done on the server side.
      if (val) this.initialize();
    }
  },

  created() {
    this.initialize();
    this.initializeProjects();
    this.percentGenerator();
    this.paymentIntervalGenerator();
    this.getDonorsByCoordinatorId(this.$route.params.id);
  },

  methods: {
    save() {
      console.log('saved');
    },
    initialize() {
      axios
        .post('/graphql/', {
          query: `query getSupportPlansByProjectId ($projectId: ID!) {
                    getSupportPlansByProjectId (projectId: $projectId) {
                      id
                      name
                      adminFeePercentage
                      paymentInterval
                      startDate
                      endDate
                      totalFund
                      donor{
                        id
                        nameInitials
                        companyName
                      }
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        guardian {
                          id
                          firstName
                          middleName
                          lastName
                        }
                        dateOfBirth
                        gender
                        accountNumber
                        village {
                          id
                          name
                          socialWorker {
                            id
                            firstName
                            middleName
                            lastName
                          }
                        }
                      }
                      project {
                        id
                        number
                        location {
                          id
                          name
                          orphans {
                            id
                            firstName
                            father {
                              firstName
                              lastName
                            }
                            dateOfBirth
                            gender
                            accountNumber
                          }
                        }
                      }
                    }
                  }`,
          variables: {
            projectId: this.projectId
          }
        })
        .then((res) => res.data.data.getSupportPlansByProjectId)
        .then((supportPlans) => {
          this.supportPlans = [...supportPlans];
          console.log(supportPlans);

          // copies the support plans which are not null
          // this.supportPlans = coordinator.donors
          //   .map((val) => val.supportPlans)
          //   .reduce((accSupportPlan, supportPlan) => supportPlan && accSupportPlan.concat(supportPlan), []);
        })
        .catch((err) => console.warn(err));
    },

    updateSupportPlan(
      supportPlanId,
      exchangeRate,
      individualFund_brr,
      adminFee_brr,
      netPayment_brr,
      initDate,
      termDate
    ) {
      return axios
        .post('/graphql', {
          query: `mutation updateSupportPlan(
                    $id: ID!
                    $exchangeRate: Float
                    $individualFund_brr: Float
                    $adminFee_brr: Float
                    $netPayment_brr: Float
                    $initDate: DateTime
                    $termDate: DateTime
                  ) {
                    updateSupportPlan(
                      id: $id
                      exchangeRate: $exchangeRate
                      individualFund_brr: $individualFund_brr
                      adminFee_brr: $adminFee_brr
                      netPayment_brr: $netPayment_brr
                      initDate: $initDate
                      termDate: $termDate
                    ) {
                      id
                      donor {
                        nameInitials
                      }
                      initDate
                      termDate
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        supportPlan {
                          id
                          created_at
                          collectiveFund_fc
                          individualFund_fc
                          foreignCurrency
                          supportPeriod
                          exchangeRate
                          individualFund_brr
                          adminFee_brr
                          netPayment_brr
                          initDate
                          termDate
                        }
                        accountNumber
                        guardian {
                          id
                          firstName
                          middleName
                          lastName
                        }
                        village {
                          id
                          name
                          socialWorker {
                            id
                          }
                          district {
                            name
                            zone {
                              name
                            }
                          }
                        }
                      }
                    }
                  }`,
          variables: {
            id: parseInt(supportPlanId),
            exchangeRate: parseFloat(exchangeRate),
            individualFund_brr: parseFloat(individualFund_brr),
            adminFee_brr: parseFloat(adminFee_brr),
            netPayment_brr: parseFloat(netPayment_brr),
            initDate: initDate,
            termDate: termDate
          }
        })
        .then((res) => res.data.data.updateSupportPlan)
        .catch((err) => console.warn(err));
    },

    createSponsorshipStatus(orphanId, status) {
      return axios
        .post('/graphql', {
          query: `mutation createSponsorshipStatus(
                  $status: sponsorshipStatus
                  $date: DateTime!
                  $orphanId: ID!
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
            orphanId: orphanId
          }
        })
        .then((res) => res.data.data.createSponsorshipStatus)
        .catch((err) => console.warn(err));
    },

    openSetInitDateDialog(item) {
      this.selectedSupportPlan = item;
      if (!item.exchangeRate) this.showSetInitDateDialog = true;
      else this.showEditDialog = true;
    },

    getDonorsByCoordinatorId(coordinatorId) {
      return axios
        .post('/graphql/', {
          query: `query getDonorsByCoordinatorId($coordinatorId: ID!) {
                  getDonorsByCoordinatorId(coordinatorId: $coordinatorId) {
                    id
                    companyName
                    nameInitials
                    orphans {
                      id
                    }
                  }
                }`,
          variables: {
            coordinatorId
          }
        })
        .then((res) => res.data.data.getDonorsByCoordinatorId)
        .then((donors) => (this.donors = [...donors]))
        .catch((err) => console.warn(err));
    },

    initializeProjects() {
      axios
        .post('/graphql/', {
          query: `query getProjectsByCoordinatorId ($coordinatorId: ID!) {
                  getProjectsByCoordinatorId(coordinatorId: $coordinatorId) {
                    id
                    number
                    startDate
                    endDate
                    status
                    maximumNumberOfBeneficiaries
                    durationInYears
                    grandTotalBudget
                    administrativeCost
                    supportPlans {
                      id
                      donor {
                        id
                        nameInitials
                      }
                    }
                    location {
                      id
                      name
                      orphans {
                        id
                        firstName
                        father {
                          firstName
                          lastName
                        }
                        dateOfBirth
                        gender
                        accountNumber
                      }
                    }
                  }
                }`,
          variables: {
            coordinatorId: this.$route.params.id
          }
        })
        .then((res) => res.data.data.getProjectsByCoordinatorId)
        .then((projects) => (this.projects = [...projects]))
        .catch((err) => console.warn(err));
    },

    createSupportPlan(
      name,
      adminFeePercentage,
      paymentInterval,
      startDate,
      endDate,
      donorId,
      projectId,
      orphans
    ) {
      return axios
        .post('/graphql/', {
          query: `mutation createSupportPlan (
                  $name: String!
                  $adminFeePercentage: Float!
                  $paymentInterval: String!
                  $startDate: DateTime
                  $endDate: DateTime
                  $donorId: ID
                  $projectId: ID
                  $orphans: [ID]
                  ) {
                  createSupportPlan (
                    name: $name
                    adminFeePercentage: $adminFeePercentage
                    paymentInterval: $paymentInterval
                    startDate: $startDate
                    endDate: $endDate
                    donorId: $donorId
                    projectId: $projectId
                    orphans: $orphans
                  ) {
                    id
                    orphans {
                      id
                    }
                  }
                }`,
          variables: {
            name,
            adminFeePercentage,
            paymentInterval,
            startDate,
            endDate,
            donorId,
            projectId,
            orphans
          }
        })
        .then((res) => res.data.data.createSupportPlan)
        .catch((err) => console.warn(err));
    },

    async createSupportPlanSave() {
      if (
        this.$refs.createSupportPlanForm.validate() &&
        this.selectedNewVillageOrphans.length > 0
      ) {
        // replace this with getProjectByProjectId when the function is finished
        const project = this.projects.filter(
          (project) => project.id === this.projectId
        )[0];

        console.log('project', project);

        const donor = this.donors.filter(
          (donor) => donor.nameInitials === this.supportPlanDonor
        )[0];

        const name = `${donor.nameInitials}-${project.number}`;
        const startDate = new Date(this.supportPlanStartDate).toISOString();

        let tempDate = new Date(startDate);
        const endDate = new Date(
          tempDate.setFullYear(
            tempDate.getFullYear() + parseInt(this.supportPlanPeriodInYears)
          )
        ).toISOString();

        const orphanIds = this.selectedNewVillageOrphans.map(
          (orphan) => orphan.id
        );

        const registeredSupportPlan = await this.createSupportPlan(
          name,
          parseFloat(this.supportPlanAdminFeePercent),
          String(this.supportPlanPaymentInterval),
          startDate,
          endDate,
          donor.id,
          this.projectId,
          orphanIds
        );

        for (const orphan of registeredSupportPlan.orphans) {
          const sponsorshipStatus = await this.createSponsorshipStatus(
            orphan.id,
            'processing'
          );
          console.log('SponsorshipStatus: ', sponsorshipStatus);
        }

        // this.supportPlans.push(supportPlan);
        this.initialize();

        this.$refs.createSupportPlanForm.reset();
        this.createSupportPlanDialog = false;
        // this.showSupportPlanTable = false;
      }
    },

    cancelSupportPlan() {
      this.$refs.supportPlanForm.reset();
      this.createSupportPlanDialog = false;
    },

    supportPlanStartDateSave(date) {
      // Why does this.$refs.supportPlanStartDateMenu give an array??!
      this.$refs.supportPlanStartDateMenu.save(date);
    },

    percentGenerator() {
      for (let i = 1; i <= 30; i++) {
        this.percent.push(i);
      }
    },

    paymentIntervalGenerator() {
      for (let i = 1; i <= 12; i++) {
        this.paymentIntervals.push(i);
      }
    },

    donorText_Value(item) {
      return item.nameInitials;
    },

    async openCreateSupportPlanDialog(items) {
      console.log('item', items);

      const projectOrphans = await this.getOrphansByProjectId(this.projectId);

      const orphansToBeFiltered = projectOrphans.map((orphan) => ({
        orphan: orphan,
        lastStatusChangeDate: new Date(
          orphan.sponsorshipStatuses.reduce(
            (lastSponsorshipStatusChangeDate, sponsorshipStatus) =>
              Math.max(
                lastSponsorshipStatusChangeDate,
                new Date(sponsorshipStatus.date).getTime()
              ),
            0
          )
        ).toISOString()
      }));

      this.newVillageOrphans = orphansToBeFiltered
        .filter((orphanObj) => {
          const lastSponsorshipStatus = orphanObj.orphan.sponsorshipStatuses.filter(
            (sponsorshipStatus) =>
              String(sponsorshipStatus.date) ===
              String(orphanObj.lastStatusChangeDate)
          );
          return lastSponsorshipStatus[0].status === 'new';
        })
        .map((orphanObj) => orphanObj.orphan);

      console.log(this.newVillageOrphans);

      this.createSupportPlanDialog = true;
    },

    getOrphansByProjectId(projectId) {
      return axios
        .post('graphql', {
          query: `query getOrphansByProjectId($projectId: ID!) {
                  getOrphansByProjectId(projectId: $projectId) {
                    id
                    firstName
                    father {
                      firstName
                      lastName
                    }
                    dateOfBirth
                    gender
                    accountNumber
                    guardian {
                      id
                      firstName
                      middleName
                      lastName
                    }
                    individualPayments {
                      id
                      created_at
                      depositInPrimaryForeignCurrency
                      depositInSecondaryForeignCurrency
                      grossDepositInDomesticCurrency
                      adminFeeInDomesticCurrency
                      netDepositInDomesticCurrency
                    }
                    village {
                      id
                      name
                      socialWorker {
                        id
                        firstName
                        middleName
                        lastName
                      }
                    }
                    sponsorshipStatuses {
                      id
                      date
                      status
                    }
                  }
                }`,
          variables: {
            projectId
          }
        })
        .then((res) => res.data.data.getOrphansByProjectId)
        .catch((err) => console.warn(err));
    },

    openCreatePaymentDialog() {
      this.createPaymentDialog = true;
    },

    getPaymentsBySupportPlanId(supportPlanId) {
      return axios
        .post('/graphql/', {
          query: `query getPaymentsBySupportPlanId($supportPlanId: ID!) {
                  getPaymentsBySupportPlanId(supportPlanId: $supportPlanId) {
                    id
                    startDate
                    endDate
                    paymentPeriodInMonths
                    primaryForeignCurrency
                    paymentInPrimaryForeignCurrency
                    primaryExchangeRate
                    secondaryForeignCurrency
                    paymentInSecondaryForeignCurrency
                    secondaryExchangeRate
                    grossPaymentInDomesticCurrency
                    adminFeeInDomesticCurrency
                    netPaymentInDomesticCurrency
                  }
                }`,
          variables: {
            supportPlanId
          }
        })
        .then((res) => res.data.data.getPaymentsBySupportPlanId)
        .catch((err) => console.warn(err));
    },

    async openPaymentDialog(item) {
      this.selectedSupportPlan = item;
      this.supportPlanPayments = await this.getPaymentsBySupportPlanId(item.id);
      this.paymentDialog = true;
    },

    openIndividualPaymentEditDialog(item) {
      this.selectedPayment = item;
      this.editableIndividualTable = true;
      this.individualPayments.length = 0;
      for (const orphan of this.selectedSupportPlan.orphans) {
        this.editIndividualPayment.orphan = JSON.parse(JSON.stringify(orphan));

        this.individualPayments.push(
          JSON.parse(JSON.stringify(this.editIndividualPayment))
        );
      }

      // divide and assign the args to the individual payment then make every individual payment field editable in the table

      const length = this.individualPayments.length;
      for (const individualPayment of this.individualPayments) {
        individualPayment.depositInPrimaryForeignCurrency =
          item.paymentInPrimaryForeignCurrency / length;
        individualPayment.depositInSecondaryForeignCurrency =
          item.paymentInSecondaryForeignCurrency / length;
        individualPayment.grossDepositInDomesticCurrency =
          item.grossPaymentInDomesticCurrency / length;
        individualPayment.adminFeeInDomesticCurrency =
          item.adminFeeInDomesticCurrency / length;
        individualPayment.netDepositInDomesticCurrency =
          item.netPaymentInDomesticCurrency / length;
        individualPayment.payment.paymentPeriodInMonths =
          item.paymentPeriodInMonths;
      }

      this.individualPaymentDialog = true;
    },

    savePrimaryForeignCurrencyChange(item) {
      console.log(item, "I'm saved");
    },

    cancelPrimaryForeignCurrencyChange() {
      console.log("I'm canelled");
    },

    createIndividualPayment(
      depositInPrimaryForeignCurrency,
      depositInSecondaryForeignCurrency,
      grossDepositInDomesticCurrency,
      adminFeeInDomesticCurrency,
      netDepositInDomesticCurrency,
      orphanId,
      paymentId
    ) {
      return axios
        .post('/graphql/', {
          query: `mutation createIndividualPayment(
                  $depositInPrimaryForeignCurrency: Float
                  $depositInSecondaryForeignCurrency: Float
                  $grossDepositInDomesticCurrency: Float!
                  $adminFeeInDomesticCurrency: Float!
                  $netDepositInDomesticCurrency: Float!
                  $orphanId: ID!
                  $paymentId: ID!
                ) {
                  createIndividualPayment(
                    depositInPrimaryForeignCurrency: $depositInPrimaryForeignCurrency
                    depositInSecondaryForeignCurrency: $depositInSecondaryForeignCurrency
                    grossDepositInDomesticCurrency: $grossDepositInDomesticCurrency
                    adminFeeInDomesticCurrency: $adminFeeInDomesticCurrency
                    netDepositInDomesticCurrency: $netDepositInDomesticCurrency
                    orphanId: $orphanId
                    paymentId: $paymentId
                  ) {
                    id
                  }
                }`,
          variables: {
            depositInPrimaryForeignCurrency,
            depositInSecondaryForeignCurrency,
            grossDepositInDomesticCurrency,
            adminFeeInDomesticCurrency,
            netDepositInDomesticCurrency,
            orphanId,
            paymentId
          }
        })
        .then((res) => res.data.data.createIndividualPayment)
        .catch((err) => console.warn(err));
    },

    async individualPaymentSave(items) {
      let summationOfDepositInFC = null;

      for (const individualPayment of this.individualPayments) {
        summationOfDepositInFC += parseFloat(
          individualPayment.depositInPrimaryForeignCurrency
        );
      }

      if (
        summationOfDepositInFC ===
        parseFloat(this.selectedPayment.paymentInPrimaryForeignCurrency)
      ) {
        this.totalAndSummationConflict = false;
        this.totalAndSummationConflictColor = 'white';
        this.totalAndSummationConflictTextColor = 'black';

        this.selectedIndividualPayments = [...items];

        for (const individualPayment of this.selectedIndividualPayments) {
          if (this.villageIds.length === 0) {
            this.socialWorkers = [];
            this.orphanSocialWorkerOptions = [];
          }
          if (
            this.villageIds.indexOf(individualPayment.orphan.village.id) === -1
          ) {
            this.villageIds.push(individualPayment.orphan.village.id);
            // social workers for later social worker selction after orphan is sponsered
            this.socialWorkers.push(
              individualPayment.orphan.village.socialWorker
            );
            this.orphanSocialWorkerOptions.push(
              `${individualPayment.orphan.village.socialWorker.firstName} ${individualPayment.orphan.village.socialWorker.middleName} ${individualPayment.orphan.village.socialWorker.lastName}`
            );
          }
        }

        this.showAssignSocialWorkerDialog = true;
      } else {
        this.totalAndSummationConflict = true;
        this.totalAndSummationConflictColor = 'red';
        this.totalAndSummationConflictTextColor = 'white';

        let totalAndSummationDifference = 0;
        if (
          summationOfDepositInFC >
          parseFloat(this.selectedPayment.paymentInPrimaryForeignCurrency)
        ) {
          totalAndSummationDifference =
            summationOfDepositInFC -
            parseFloat(this.selectedPayment.paymentInPrimaryForeignCurrency);

          this.totalAndSummationConflictMsg = `There is an extra ${totalAndSummationDifference} fc from the total amount`;
        } else {
          totalAndSummationDifference =
            parseFloat(this.selectedPayment.paymentInPrimaryForeignCurrency) -
            summationOfDepositInFC;

          this.totalAndSummationConflictMsg = `There is ${totalAndSummationDifference} fc missing from the total amount`;
        }
      }
    },

    getIndividualPaymentsByPaymentId(paymentId) {
      return axios
        .post('/graphql/', {
          query: `query getIndividualPaymentByPaymentId($paymentId: ID!) {
                  getIndividualPaymentsByPaymentId(paymentId: $paymentId) {
                    id
                    depositInPrimaryForeignCurrency
                    depositInSecondaryForeignCurrency
                    grossDepositInDomesticCurrency
                    adminFeeInDomesticCurrency
                    netDepositInDomesticCurrency
                    orphan {
                      id
                      firstName
                      father {
                        firstName
                        lastName
                      }
                      dateOfBirth
                      gender
                      accountNumber
                      guardian {
                        firstName
                        middleName
                        lastName
                      }
                      village {
                        id
                        name
                        district {
                          id
                          name
                          zone {
                            id
                            name
                          }
                        }
                      }
                    }
                    payment {
                      id
                      startDate
                      endDate
                      paymentPeriodInMonths
                      supportPlan {
                        id
                        donor {
                          id
                          nameInitials
                        }
                        project {
                          id
                          number
                        }
                      }
                    }
                  }
                }`,
          variables: {
            paymentId
          }
        })
        .then((res) => res.data.data.getIndividualPaymentsByPaymentId)
        .catch((err) => console.warn(err));
    },

    async openIndividualPaymentDialog(item) {
      this.fetchedIndividualPaymentDialog = true;
      this.fetchedIndividualPayments = await this.getIndividualPaymentsByPaymentId(
        item.id
      );
    },

    closeFetchedIndividualPaymentDialog() {
      this.fetchedIndividualPaymentDialog = false;
    },

    priviewSupportPlan(item) {
      console.log('priviewSupportPlan', item);

      // axios
      //   .post("/graphql", {
      //     query: `query supportPlan($id: ID!) {
      //             supportPlan(id: $id) {
      //               id
      //               donor {
      //                 nameInitials
      //               }
      //               initDate
      //               termDate
      //               orphans {
      //                 id
      //                 firstName
      //                 father {
      //                   firstName
      //                   lastName
      //                 }
      //                 supportPlan {
      //                   id
      //                   created_at
      //                   collectiveFund_fc
      //                   individualFund_fc
      //                   foreignCurrency
      //                   supportPeriod
      //                   exchangeRate
      //                   individualFund_brr
      //                   adminFee_brr
      //                   netPayment_brr
      //                   initDate
      //                   termDate
      //                 }
      //                 accountNumber
      //                 guardian {
      //                   id
      //                   firstName
      //                   middleName
      //                   lastName
      //                 }
      //                 village {
      //                   name
      //                   district {
      //                     name
      //                     zone {
      //                       name
      //                     }
      //                   }
      //                 }
      //               }
      //             }
      //           }`,
      //     variables: {
      //       id: item.id,
      //     },
      //   })
      //   .then((res) => res.data.data.supportPlan)
      //   .then((supportPlan) => {
      //     this.supportPlanOrphans = supportPlan.orphans;
      //     this.supportPlanDonor = supportPlan.donor.nameInitials;
      //     this.supportPlanInitDate = supportPlan.initDate;
      //     this.supportPlanTermDate = supportPlan.termDate;
      //   })
      //   .catch((err) => console.warn(err));
      this.showSupportPlanOrphansDialog = true;
    },

    gotoSetInitDateDialog() {
      this.showEditDialog = false;
      this.showSetInitDateDialog = true;
    },

    cancelEditDialog() {
      this.showEditDialog = false;
    },

    initDateSave(date) {
      this.$refs.initDatemenu.save(date);
    },

    paymentStartDateSave(date) {
      this.$refs.paymentStartDatemenu.save(date);
    },

    cancelSetInitDateExchangeRate() {
      this.setInitDateClose();
      this.setInitDateReset();
    },

    confirmSetInitDateExchangeRate() {
      if (this.$refs.setInitDateForm.validate()) {
        for (const orphan of this.selectedSupportPlan.orphans) {
          if (this.villageIds.length === 0) {
            this.socialWorkers = [];
            this.orphanSocialWorkerOptions = [];
          }
          if (this.villageIds.indexOf(orphan.village.id) === -1) {
            this.villageIds.push(orphan.village.id);
            this.socialWorkers.push(orphan.village.socialWorker);
            this.orphanSocialWorkerOptions.push(
              `${orphan.village.socialWorker.firstName} ${orphan.village.socialWorker.middleName} ${orphan.village.socialWorker.lastName}`
            );
          }
        }
        this.setInitDateClose();

        this.showAssignSocialWorkerDialog = true;
      } else {
        // handle error and show some kind of notification
      }
    },

    createPayment(
      startDate,
      endDate,
      paymentPeriodInMonths,
      paymentInPrimaryForeignCurrency,
      primaryForeignCurrency,
      primaryExchangeRate,
      paymentInSecondaryForeignCurrency,
      secondaryForeignCurrency,
      secondaryExchangeRate,
      grossPaymentInDomesticCurrency,
      adminFeeInDomesticCurrency,
      netPaymentInDomesticCurrency,
      supportPlanId
    ) {
      const variables = {
        startDate,
        endDate,
        paymentPeriodInMonths,
        paymentInPrimaryForeignCurrency:
          paymentInPrimaryForeignCurrency || null,
        primaryForeignCurrency: primaryForeignCurrency || null,
        primaryExchangeRate: primaryExchangeRate || null,
        paymentInSecondaryForeignCurrency:
          paymentInSecondaryForeignCurrency || null,
        secondaryForeignCurrency: secondaryForeignCurrency || null,
        secondaryExchangeRate: secondaryExchangeRate || null,
        grossPaymentInDomesticCurrency,
        adminFeeInDomesticCurrency,
        netPaymentInDomesticCurrency,
        supportPlanId
      };

      return axios
        .post('/graphql/', {
          query: `mutation createPayment(
                  $endDate: DateTime
                  $startDate: DateTime
                  $paymentInPrimaryForeignCurrency: Float
                  $primaryForeignCurrency: String
                  $primaryExchangeRate: Float
                  $paymentInSecondaryForeignCurrency: Float
                  $secondaryForeignCurrency: String
                  $secondaryExchangeRate: Float
                  $grossPaymentInDomesticCurrency: Float
                  $adminFeeInDomesticCurrency: Float
                  $netPaymentInDomesticCurrency: Float
                  $paymentPeriodInMonths: Int
                  $supportPlanId: ID!
                ) {
                  createPayment(
                    endDate: $endDate
                    startDate: $startDate
                    paymentInPrimaryForeignCurrency: $paymentInPrimaryForeignCurrency
                    primaryForeignCurrency: $primaryForeignCurrency
                    primaryExchangeRate: $primaryExchangeRate
                    paymentInSecondaryForeignCurrency: $paymentInSecondaryForeignCurrency
                    secondaryForeignCurrency: $secondaryForeignCurrency
                    secondaryExchangeRate: $secondaryExchangeRate
                    grossPaymentInDomesticCurrency: $grossPaymentInDomesticCurrency
                    adminFeeInDomesticCurrency: $adminFeeInDomesticCurrency
                    netPaymentInDomesticCurrency: $netPaymentInDomesticCurrency
                    paymentPeriodInMonths: $paymentPeriodInMonths
                    supportPlanId: $supportPlanId
                  ) {
                    id
                    startDate
                    endDate
                    paymentPeriodInMonths
                    primaryForeignCurrency
                    paymentInPrimaryForeignCurrency
                    primaryExchangeRate
                    secondaryForeignCurrency
                    paymentInSecondaryForeignCurrency
                    secondaryExchangeRate
                    grossPaymentInDomesticCurrency
                    adminFeeInDomesticCurrency
                    netPaymentInDomesticCurrency
                    supportPlan {
                      orphans {
                        id
                      }
                    }
                  }
                }`,
          variables
        })
        .then((res) => res.data.data.createPayment)
        .catch((err) => console.warn(err));
    },

    async confirmCreatePaymentDialog() {
      if (this.$refs.createPaymentForm.validate()) {
        const startDate = new Date(this.paymentStartDate).toISOString();
        const tempDate = new Date(this.paymentStartDate).setMonth(
          new Date(this.paymentStartDate).getMonth() +
            parseInt(this.paymentDuration)
        );
        const endDate = new Date(tempDate).toISOString();
        const paymentPeriodInMonths = this.paymentDuration;

        let paymentInPrimaryForeignCurrency = NaN;
        let primaryForeignCurrency = NaN;
        let primaryExchangeRate = NaN;
        let paymentInSecondaryForeignCurrency = NaN;
        let secondaryForeignCurrency = NaN;
        let secondaryExchangeRate = NaN;
        let grossPaymentInDomesticCurrency = NaN;

        if (this.paymentCurrencies === 1) {
          grossPaymentInDomesticCurrency = this.paymentInBirr;
        } else if (
          this.paymentCurrencies === 2 ||
          this.paymentCurrencies === 3
        ) {
          paymentInPrimaryForeignCurrency = this.paymentInPrimaryFC;
          primaryForeignCurrency = this.primaryFC;

          if (this.paymentCurrencies === 2) {
            primaryExchangeRate = this.primaryExchangeRate;

            grossPaymentInDomesticCurrency =
              paymentInPrimaryForeignCurrency * primaryExchangeRate;
          } else {
            primaryExchangeRate =
              this.paymentInSecondaryFC / this.paymentInPrimaryFC;

            paymentInSecondaryForeignCurrency = this.paymentInSecondaryFC;
            secondaryForeignCurrency = this.secondaryFC;
            secondaryExchangeRate = this.secondaryExchangeRate;

            grossPaymentInDomesticCurrency =
              paymentInSecondaryForeignCurrency * secondaryExchangeRate;
          }
        }

        const adminFeeInDomesticCurrency =
          grossPaymentInDomesticCurrency *
          (this.selectedSupportPlan?.adminFeePercentage / 100);
        const netPaymentInDomesticCurrency =
          grossPaymentInDomesticCurrency - adminFeeInDomesticCurrency;

        const supportPlanId = this.selectedSupportPlan?.id;

        const payment = await this.createPayment(
          startDate,
          endDate,
          parseInt(paymentPeriodInMonths),
          parseFloat(paymentInPrimaryForeignCurrency),
          primaryForeignCurrency,
          parseFloat(primaryExchangeRate),
          parseFloat(paymentInSecondaryForeignCurrency),
          secondaryForeignCurrency,
          parseFloat(secondaryExchangeRate),
          parseFloat(grossPaymentInDomesticCurrency),
          parseFloat(adminFeeInDomesticCurrency),
          parseFloat(netPaymentInDomesticCurrency),
          supportPlanId
        );

        for (const orphan of payment.supportPlan.orphans) {
          const sponsorshipStatus = await this.createSponsorshipStatus(
            orphan.id,
            'pending'
          );
          console.log('sponsorshipStatus', sponsorshipStatus);
        }

        this.supportPlanPayments.push(payment);
        this.$refs.createPaymentForm.reset();
        this.createPaymentDialog = false;
      }
    },

    cancleCreatePaymentDialog() {
      this.$refs.createPaymentForm.reset();
      this.createPaymentDialog = false;
    },

    setInitDateClose() {
      this.showSetInitDateDialog = false;
    },

    setInitDateReset() {
      this.$refs.setInitDateForm.reset();
    },

    closeSupportPlanTable() {
      this.$emit('closeSupportPlanTable', false);
    },

    cancelAssignSocialWorker() {
      this.setInitDateReset();
      this.assignSocialWorkerClose();
      this.assignSocialWorkerReset();
    },

    async confirmAssignSocialWorker() {
      if (this.$refs.assignSocialWorkerForm.validate()) {
        let updatedIndividualPayment = null;
        let depositInPFC = null;
        let depositInSFC = null;
        let grossDepositInDC = null;
        let adminFeeInDC = null;
        let netDepositInDC = null;

        for (const individualPayment of this.selectedIndividualPayments) {
          if (this.selectedPayment.paymentInPrimaryForeignCurrency === null) {
            console.log('1');
            depositInPFC = 0;
            depositInSFC = 0;
            grossDepositInDC = individualPayment.grossDepositInDomesticCurrency;
          } else {
            depositInPFC = individualPayment.depositInPrimaryForeignCurrency;

            if (
              this.selectedPayment.paymentInSecondaryForeignCurrency === null
            ) {
              console.log('2');
              depositInSFC = 0;
              grossDepositInDC =
                depositInPFC * this.selectedPayment.primaryExchangeRate;
            } else {
              console.log('3');
              depositInSFC =
                depositInPFC * this.selectedPayment.primaryExchangeRate;
              grossDepositInDC =
                depositInSFC * this.selectedPayment.secondaryExchangeRate;
            }
          }

          adminFeeInDC =
            grossDepositInDC *
            (this.selectedPayment.adminFeeInDomesticCurrency /
              this.selectedPayment.grossPaymentInDomesticCurrency);

          netDepositInDC = grossDepositInDC - adminFeeInDC;

          individualPayment.depositInPrimaryForeignCurrency = depositInPFC;
          individualPayment.depositInSecondaryForeignCurrency = depositInSFC;
          individualPayment.grossDepositInDomesticCurrency = grossDepositInDC;
          individualPayment.adminFeeInDomesticCurrency = adminFeeInDC;
          individualPayment.netDepositInDomesticCurrency = netDepositInDC;

          updatedIndividualPayment = await this.createIndividualPayment(
            parseFloat(depositInPFC),
            parseFloat(depositInSFC),
            parseFloat(grossDepositInDC),
            parseFloat(adminFeeInDC),
            parseFloat(netDepositInDC),
            individualPayment.orphan.id,
            this.selectedPayment.id
          );

          console.log('updatedIndividualPayment: ', updatedIndividualPayment);

          const sponsorshipStatus = await this.createSponsorshipStatus(
            individualPayment.orphan.id,
            'active'
          );
          console.log(`sponsorshipStatus`, sponsorshipStatus);

          const socialWorker = this.socialWorkers.filter(
            (socialWorker) =>
              this.orphanSocialWorker ===
              `${socialWorker.firstName} ${socialWorker.middleName} ${socialWorker.lastName}`
          )[0];

          const assignedSocialWorker = await this.updateOrphan(
            individualPayment.orphan.id,
            socialWorker.id
          );
          console.log(
            `assignedSocialWorker`,
            assignedSocialWorker.socialWorker
          );
        }

        this.assignSocialWorkerClose();
        this.assignSocialWorkerReset();
      }
    },

    assignSocialWorkerClose() {
      this.showAssignSocialWorkerDialog = false;
    },

    assignSocialWorkerReset() {
      this.$refs.assignSocialWorkerForm.reset();
    },

    paymentCurrencyText_Value(item) {
      return item.name;
    },

    updateOrphan(orphanId, socialWorkerId) {
      let query = `mutation updateOrphan(
        $id: ID!
        $socialWorkerId: ID
      ) {
        updateOrphan(
          id: $id
          socialWorkerId: $socialWorkerId
        ) {
          id
          socialWorker {
            id
            firstName
            middleName
            lastName
          }
        }
      }`;

      let variables = {
        id: orphanId,
        socialWorkerId: socialWorkerId
      };

      return axios
        .post('/graphql/', {
          query: query,
          variables: variables
        })
        .then((res) => res.data.data.updateOrphan)
        .catch((err) => console.warn(err));
    },

    individualOrphanId(item) {
      return item.orphan.id;
    },

    individualOrphanGender(item) {
      return item.orphan.gender;
    },

    individualOrphanFullName(item) {
      return (
        `${item.orphan.firstName
          .substr(0, 1)
          .toUpperCase()}${item.orphan.firstName.substr(1)}` +
        ` ${item.orphan.father.firstName
          .substr(0, 1)
          .toUpperCase()}${item.orphan.father.firstName.substr(1)}` +
        ` ${item.orphan.father.lastName
          .substr(0, 1)
          .toUpperCase()}${item.orphan.father.lastName.substr(1)}`
      );
    },

    calcAge(item) {
      return (
        new Date().getUTCFullYear() -
        new Date(
          Date.parse(item.orphan.dateOfBirth.toString())
        ).getUTCFullYear()
      );
    },

    orphanCalcAge(item) {
      return (
        new Date().getUTCFullYear() -
        new Date(Date.parse(item.dateOfBirth.toString())).getUTCFullYear()
      );
    },

    orphanCalcSponsorshipStatus(item) {
      return item.sponsorshipStatuses[item.sponsorshipStatuses.length - 1]
        .status;
    },

    individualGuardianFullName(item) {
      if (!item.orphan.guardian) {
        return 'N/A';
      } else {
        return (
          `${item.orphan.guardian.firstName
            .substr(0, 1)
            .toUpperCase()}${item.orphan.guardian.firstName.substr(1)}` +
          ` ${item.orphan.guardian.middleName
            .substr(0, 1)
            .toUpperCase()}${item.orphan.guardian.middleName.substr(1)}` +
          ` ${item.orphan.guardian.lastName
            .substr(0, 1)
            .toUpperCase()}${item.orphan.guardian.lastName.substr(1)}`
        );
      }
    },

    individualOrphanAccountNumber(item) {
      return item.orphan.accountNumber;
    },

    getProjectName(item) {
      return `project-${item.project.number}`;
    },

    orphanFullName(item) {
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

    guardianFullName(item) {
      if (!item.guardian) {
        return 'N/A';
      } else {
        return (
          `${item.guardian.firstName
            .substr(0, 1)
            .toUpperCase()}${item.guardian.firstName.substr(1)}` +
          ` ${item.guardian.middleName
            .substr(0, 1)
            .toUpperCase()}${item.guardian.middleName.substr(1)}` +
          ` ${item.guardian.lastName
            .substr(0, 1)
            .toUpperCase()}${item.guardian.lastName.substr(1)}`
        );
      }
    },

    downloadPaymentSheet(individualPayments) {
      const projectNo =
          individualPayments[0].payment.supportPlan.project.number,
        agencyName =
          individualPayments[0].payment.supportPlan.donor.nameInitials,
        zoneName = individualPayments[0].orphan.village.district.zone.name,
        districtName = individualPayments[0].orphan.village.district.name,
        villageName = individualPayments[0].orphan.village.name,
        startDate = new Date(
          individualPayments[0].payment.startDate
        ).toDateString(),
        endDate = new Date(
          individualPayments[0].payment.endDate
        ).toDateString();

      let jsonExportData = [
        [
          'Charity and Development Association (CDA)',
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Payment Sheet For Orphans Project ${projectNo}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Funding Agency: ${agencyName}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          'Cooperative Bank of Oromia Adaba Branch',
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Payment Period From ${startDate} - ${endDate}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Zone: ${zoneName}`,
          null,
          `District: ${districtName}`,
          null,
          `Village: ${villageName}`,
          null,
          'Date___________',
          null
        ],
        [
          'Orphan Name',
          'Guardian Name',
          'Account No',
          'Period',
          'Total Fund in PFC',
          'Total Fund in SFC',
          'Total Fund in Birr',
          'Admin. Fee',
          'Net Payment'
        ]
      ];

      const exoprtTableData = individualPayments.map((individualPayment) => {
        let modifiedIndividualPaymentsArray = [];

        if (Object.hasOwnProperty.call(individualPayment, 'orphan')) {
          if (Object.hasOwnProperty.call(individualPayment.orphan, 'father')) {
            modifiedIndividualPaymentsArray[0] = `${individualPayment.orphan.firstName} ${individualPayment.orphan.father?.firstName} ${individualPayment.orphan.father?.lastName}`;
          }
          if (
            Object.hasOwnProperty.call(individualPayment.orphan, 'guardian')
          ) {
            modifiedIndividualPaymentsArray[1] = `${individualPayment.orphan.guardian?.firstName} ${individualPayment.orphan.guardian?.middleName} ${individualPayment.orphan.guardian?.lastName}`;
          }
          if (
            Object.hasOwnProperty.call(
              individualPayment.orphan,
              'accountNumber'
            )
          ) {
            modifiedIndividualPaymentsArray[2] =
              individualPayment.orphan.accountNumber;
          }
          if (Object.hasOwnProperty.call(individualPayment, 'payment')) {
            modifiedIndividualPaymentsArray[3] =
              individualPayment.payment.paymentPeriodInMonths;
          }

          modifiedIndividualPaymentsArray[4] =
            individualPayment.depositInPrimaryForeignCurrency;
          modifiedIndividualPaymentsArray[5] =
            individualPayment.depositInSecondaryForeignCurrency;
          modifiedIndividualPaymentsArray[6] =
            individualPayment.grossDepositInDomesticCurrency;
          modifiedIndividualPaymentsArray[7] =
            individualPayment.adminFeeInDomesticCurrency;
          modifiedIndividualPaymentsArray[8] =
            individualPayment.netDepositInDomesticCurrency;
        }
        return modifiedIndividualPaymentsArray;
      });

      jsonExportData.push(...exoprtTableData);

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.aoa_to_sheet(jsonExportData);

      // handle merge
      workSheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 8 } },
        // { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
        { s: { r: 5, c: 2 }, e: { r: 5, c: 3 } },
        { s: { r: 5, c: 4 }, e: { r: 5, c: 5 } },
        { s: { r: 5, c: 6 }, e: { r: 5, c: 8 } }
      ];

      // sets the width of colns
      workSheet['!cols'] = [
        { wpx: 150 }, // A
        { wpx: 150 }, // B
        { wpx: 100 }, // C
        { wpx: 40 }, // D
        { wpx: 100 }, // E
        { wpx: 100 }, // F
        { wpx: 100 }, // G
        { wpx: 100 }, // H
        { wpx: 100 } // I
      ];

      // sets the first 5 rows bold and centered
      for (let i = 1; i <= 5; i++) {
        workSheet[`A${i}`].s = {
          font: {
            bold: true
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          }
        };
      }

      // sets the 6th row elments to bold
      for (let i = 0; i <= 6; i += 2) {
        const char = String.fromCharCode(65 + i);
        workSheet[`${char}6`].s = {
          font: {
            bold: true
          }
        };
      }

      // sets border to the table
      for (const key in workSheet) {
        const flag = key.localeCompare('A8', undefined, { numeric: true });
        if (flag < 0 || key === 'C6' || key === 'E6' || key === 'G6') continue;
        workSheet[key].s = {
          alignment: {
            horizontal: 'center',
            wrapText: true
          },
          border: {
            top: {
              style: 'thin',
              color: '000000'
            },
            bottom: {
              style: 'thin',
              color: '000000'
            },
            left: {
              style: 'thin',
              color: '000000'
            },
            right: {
              style: 'thin',
              color: '000000'
            }
          }
        };
      }

      // sets the 7th row to bold and text-wrap
      for (let i = 0; i <= 8; i++) {
        const char = String.fromCharCode(65 + i);
        workSheet[`${char}7`].s = {
          font: {
            bold: true
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true
          },
          border: {
            top: {
              style: 'thin',
              color: '000000'
            },
            bottom: {
              style: 'thin',
              color: '000000'
            },
            left: {
              style: 'thin',
              color: '000000'
            },
            right: {
              style: 'thin',
              color: '000000'
            }
          }
        };
      }

      // sets the text rotaion of D7 cell
      Object.assign(workSheet['D7'].s, {
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          textRotation: 90
        }
      });

      // sets the text rotaion of G6 cell
      Object.assign(workSheet['E6'].s, {
        alignment: {
          horizontal: 'right'
        }
      });

      // sets the text rotaion of G6 cell
      Object.assign(workSheet['G6'].s, {
        alignment: {
          horizontal: 'right'
        }
      });

      // creates an output buffer
      function s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        } else {
          const buf = new Array(s.length);
          for (let i = 0; i !== s.length; ++i) {
            buf[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        }
      }

      XLSX.utils.book_append_sheet(workBook, workSheet, 'Orphan Payment Sheet');

      // XLSX.writeFile(workBook, "orphanTest.xlsx");
      const wbOut = XLSXStyle.write(workBook, {
        bookSST: false,
        type: 'binary'
      });

      saveAs(new Blob([s2ab(wbOut)], { type: '' }), 'OrphanPaymentSheet.xlsx');
    },

    downloadPaymentSheetOld(supportedOrphans) {
      // console.log(supportedOrphans);
      const projectNo = 7,
        agencyName = this.supportPlanDonor,
        initDate = new Date(this.supportPlanInitDate).toDateString(),
        termDate = new Date(this.supportPlanTermDate).toDateString(),
        zoneName = supportedOrphans[0].village.district.zone.name,
        districtName = supportedOrphans[0].village.district.name,
        villageName = supportedOrphans[0].village.name;

      let jsonExportData = [
        [
          'Charity and Development Association (CDA)',
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Payment Sheet For Orphans Project ${projectNo}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Funding Agency: ${agencyName}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          'Cooperative Bank of Oromia Adaba Branch',
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Payment Period From ${initDate} - ${termDate}`,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        ],
        [
          `Zone: ${zoneName}`,
          null,
          `District: ${districtName}`,
          null,
          `Village: ${villageName}`,
          null,
          'Date___________',
          null
        ],
        [
          'Orphan Name',
          'Guardian Name',
          'Account No',
          'Period',
          'Total Fund in GBP',
          'Total Fund in Birr',
          'Admin. Fee',
          'Net Payment'
        ]
      ];

      const modifiedSupportPlanOrphans = supportedOrphans.map((orphan) => {
        let modifiedOrphansArray = [];
        if (Object.hasOwnProperty.call(orphan, 'father')) {
          modifiedOrphansArray[0] = `${orphan.firstName} ${orphan.father?.firstName} ${orphan.father?.lastName}`;
        }
        if (Object.hasOwnProperty.call(orphan, 'guardian')) {
          modifiedOrphansArray[1] = `${orphan.guardian?.firstName} ${orphan.guardian?.middleName} ${orphan.guardian?.lastName}`;
        }
        if (Object.hasOwnProperty.call(orphan, 'accountNumber')) {
          modifiedOrphansArray[2] = orphan.accountNumber;
        }
        if (Object.hasOwnProperty.call(orphan, 'supportPlan')) {
          modifiedOrphansArray[3] = orphan.supportPlan.supportPeriod;
          modifiedOrphansArray[4] = orphan.supportPlan.individualFund_fc;
          modifiedOrphansArray[5] = orphan.supportPlan.individualFund_brr;
          modifiedOrphansArray[6] = orphan.supportPlan.adminFee_brr;
          modifiedOrphansArray[7] = orphan.supportPlan.netPayment_brr;
        }
        return modifiedOrphansArray;
      });

      jsonExportData.push(...modifiedSupportPlanOrphans);

      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.aoa_to_sheet(jsonExportData);

      // handle merge
      workSheet['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } },
        // { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } },
        { s: { r: 5, c: 2 }, e: { r: 5, c: 3 } },
        { s: { r: 5, c: 4 }, e: { r: 5, c: 5 } },
        { s: { r: 5, c: 6 }, e: { r: 5, c: 7 } }
      ];

      // sets the width of colns
      workSheet['!cols'] = [
        { wpx: 150 },
        { wpx: 150 },
        { wpx: 100 },
        { wpx: 40 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 70 },
        { wpx: 70 }
      ];

      // sets the first 5 rows bold and centered
      for (let i = 1; i <= 5; i++) {
        workSheet[`A${i}`].s = {
          font: {
            bold: true
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center'
          }
        };
      }

      // sets the 6th row elments to bold
      for (let i = 0; i <= 6; i += 2) {
        const char = String.fromCharCode(65 + i);
        workSheet[`${char}6`].s = {
          font: {
            bold: true
          }
        };
      }

      // sets border to the table
      for (const key in workSheet) {
        const flag = key.localeCompare('A8', undefined, { numeric: true });
        if (flag < 0 || key === 'C6' || key === 'E6' || key === 'G6') continue;
        workSheet[key].s = {
          alignment: {
            horizontal: 'center',
            wrapText: true
          },
          border: {
            top: {
              style: 'thin',
              color: '000000'
            },
            bottom: {
              style: 'thin',
              color: '000000'
            },
            left: {
              style: 'thin',
              color: '000000'
            },
            right: {
              style: 'thin',
              color: '000000'
            }
          }
        };
      }

      // sets the 7th row to bold and text-wrap
      for (let i = 0; i <= 7; i++) {
        const char = String.fromCharCode(65 + i);
        workSheet[`${char}7`].s = {
          font: {
            bold: true
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: true
          },
          border: {
            top: {
              style: 'thin',
              color: '000000'
            },
            bottom: {
              style: 'thin',
              color: '000000'
            },
            left: {
              style: 'thin',
              color: '000000'
            },
            right: {
              style: 'thin',
              color: '000000'
            }
          }
        };
      }

      // sets the text rotaion of D7 cell
      Object.assign(workSheet['D7'].s, {
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          textRotation: 90
        }
      });

      // creates an output buffer
      function s2ab(s) {
        if (typeof ArrayBuffer !== 'undefined') {
          const buf = new ArrayBuffer(s.length);
          const view = new Uint8Array(buf);
          for (let i = 0; i !== s.length; ++i) {
            view[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        } else {
          const buf = new Array(s.length);
          for (let i = 0; i !== s.length; ++i) {
            buf[i] = s.charCodeAt(i) & 0xff;
          }
          return buf;
        }
      }

      XLSX.utils.book_append_sheet(workBook, workSheet, 'Orphan Payment Sheet');

      // XLSX.writeFile(workBook, "orphanTest.xlsx");
      const wbOut = XLSXStyle.write(workBook, {
        bookSST: false,
        type: 'binary'
      });

      saveAs(new Blob([s2ab(wbOut)], { type: '' }), 'OrphanPaymentSheet.xlsx');

      // console.log(jsonExportData);
    },

    closeSupportPlanOrphanDialog() {
      this.showSupportPlanOrphansDialog = false;
    },

    closePaymentDialog() {
      this.paymentDialog = false;
    },

    closeIndividualPaymentDialog() {
      this.individualPaymentDialog = false;
    }
  }
};
</script>
