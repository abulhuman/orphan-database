<template>
  <div style="margin-top: 6.5rem">
    <AppNavBar :user="headUser" />
    <!-- the value property make it not behave diffrently than the showSidebar property -->
    <v-navigation-drawer
      v-model="showSidebar"
      :value="showSidebar"
      stateless
      hide-overlay
      dark
      fixed
      style="
        min-height: 83.5vh;
        max-height: 90.5vh;
        margin-top: 4rem;
        width: 20%;
      "
      color="indigo lighten-1"
    >
      <v-list nav>
        <!-- Registeration tab -->
        <v-list-group
          active-class="indigo lighten-4"
          :value="true"
          no-action
          prepend-icon="mdi-book-plus-multiple"
        >
          <template v-slot:activator>
            <v-list-item-content style="margin-left: -24px">
              <v-list-item-title>Registration</v-list-item-title>
            </v-list-item-content>
          </template>
          <!-- Project Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="top left"
              style="margin-top: 3%; margin-left: 25%; height: 200px"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showProjectRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Project</v-list-item-title>
                </v-list-item>
              </template>

              <!-- Project Registration Card-->
              <v-card v-if="showProject" max-width="700">
                <v-form
                  ref="createProjectForm"
                  v-model="validCreateProject"
                  lazy-validation
                >
                  <v-row class="pt-5">
                    <!-- Project start date -->
                    <v-col cols="12" md="6" sm="4">
                      <v-responsive max-width="" class="mx-10 mb-n4">
                        <v-menu
                          ref="projectStartDateMenu"
                          v-model="projectStartDateMenu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="projectStartDate"
                              label="Start date"
                              prepend-icon="mdi-calendar"
                              readonly
                              :rules="requiredRule"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="projectStartDate"
                            :active-picker.sync="projectStartDateActivePicker"
                            :min="
                              new Date(
                                Date.now() -
                                  new Date().getTimezoneOffset() * 60000
                              )
                                .toISOString()
                                .substr(0, 10)
                            "
                            max="2070-01-01"
                            @change="projectStartDateSave"
                          ></v-date-picker>
                        </v-menu>
                      </v-responsive>
                    </v-col>
                    <!-- Project Number -->
                    <v-col cols="12" md="6" sm="4">
                      <v-responsive max-width="" class="mx-10 mb-n4 ml-n5">
                        <v-text-field
                          v-model="projectNumber"
                          label="Number*"
                          type="number"
                          :rules="requiredRule"
                        ></v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Project duration in years -->
                    <v-col cols="12" md="6" sm="4">
                      <v-responsive max-width="" class="mx-10 mb-n4">
                        <v-text-field
                          v-model="projectDurationInYears"
                          label="Duration*"
                          type="number"
                          :rules="requiredRule"
                          hint="duration of the project in years"
                        ></v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Project maximum number of orphans -->
                    <v-col cols="12" md="6" sm="4">
                      <v-responsive max-width="" class="mx-10 mb-n4 ml-n5">
                        <v-text-field
                          v-model="projectMaxBeneficiaries"
                          label="Maximum beneficiaries*"
                          type="number"
                          :rules="requiredRule"
                        ></v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Project total budget -->
                    <v-col cols="12" md="6" sm="4">
                      <v-responsive max-width="" class="mx-10 mb-n4">
                        <v-text-field
                          v-model="projectTotalBudget"
                          label="Total budget*"
                          type="number"
                          :rules="requiredRule"
                        ></v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Project admin cost -->
                    <v-col cols="12" md="6" sm="4">
                      <v-responsive max-width="" class="mx-10 mb-n4 ml-n5">
                        <v-text-field
                          v-model="projectAdministrativeCost"
                          label="Administrative cost*"
                          type="number"
                          :rules="requiredRule"
                        ></v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Project location/village -->
                    <v-col cols="12" md="6" sm="6">
                      <v-responsive max-width="" class="mx-10 mb-n4">
                        <v-select
                          v-model="projectLocation"
                          :items="allDistricts"
                          :item-text="villageText_Value"
                          :item-value="villageText_Value"
                          :menu-props="{
                            top: true,
                            offsetY: true
                          }"
                          :rules="requiredRule"
                          label="Locations*"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <!-- Project coordinator -->
                    <v-col cols="12" md="6" sm="6">
                      <v-responsive max-width="" class="mx-10 mb-n4 ml-n5">
                        <v-select
                          v-model="projectCoordinator"
                          :items="coordinatorsOptions"
                          :item-text="coordinatorText_Value"
                          :item-value="coordinatorText_Value"
                          :menu-props="{
                            top: true,
                            offsetY: true
                          }"
                          :rules="requiredRule"
                          label="Coordinator*"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <!-- Project proposal insertion -->
                    <v-col cols="12" md="12" sm="12">
                      <v-responsive max-width="" class="mx-10 mb-n4">
                        <v-file-input
                          v-model="projectProposalFile"
                          accept=".pdf,.doc"
                          label="Project proposal"
                          :rules="requiredRule"
                          @change="toggleProjectProposalInput($event)"
                        >
                          <template v-slot:append>
                            <v-tooltip top>
                              <template v-slot:activator="{ on, attrs }">
                                <v-icon
                                  class="ml-auto"
                                  v-bind="attrs"
                                  v-on="on"
                                  @click="toggleProjectProposalDialog"
                                >
                                  mdi-file-eye-outline
                                </v-icon>
                              </template>
                              <span>Preview</span>
                            </v-tooltip>

                            <!-- preview image popup -->
                            <v-dialog v-model="projectProposalDialog">
                              <v-container>
                                <v-row>
                                  <!-- <v-col>what</v-col> -->
                                  <v-spacer></v-spacer>
                                  <v-col class="mr-n12" sm="1">
                                    <v-icon
                                      dark
                                      @click="toggleProjectProposalDialog"
                                    >
                                      mdi-close
                                    </v-icon>
                                  </v-col>
                                </v-row>

                                <v-img
                                  height="82vh"
                                  :src="projectProposalPreview"
                                  contain
                                  alt="Project Proposal Document"
                                ></v-img>
                              </v-container>
                            </v-dialog>
                          </template>
                        </v-file-input>
                      </v-responsive>
                    </v-col>
                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="createProjectCancel"
                        >Cancel</v-btn
                      >
                      <v-btn
                        class="mr-10"
                        @click="createProjectSave"
                        :disabled="!validCreateProject"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>

          <!-- Coordinator Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="top left"
              style="margin-top: 3%; margin-left: 5%; height: 200px"
              min-width="430"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showCoordinatorRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Coordinator</v-list-item-title>
                </v-list-item>
              </template>

              <!-- Coordinator Registration Card-->
              <v-card v-if="showCoordinator" max-width="430" max-height="500">
                <v-form
                  ref="coordinatorForm"
                  v-model="validCoordinator"
                  lazy-validation
                >
                  <v-row>
                    <!-- Coordinator Name -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mb-n7 mt-5">
                        <v-text-field
                          v-model="coordinatorName"
                          label="Name"
                          :rules="personalNameRules"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Coordinator Email -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mb-n7">
                        <v-text-field
                          v-model="coordinatorEmail"
                          label="Email"
                          type="email"
                          :rules="emailRules"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Coordinator Password -->
                    <!-- <v-col cols="12">
                    <v-responsive max-width="" class="mx-10">
                      <v-text-field
                        v-model="coordinatorPassword"
                        label="Password"
                        type="password"
                        :rules="passwordRules"
                      >
                      </v-text-field>
                    </v-responsive>
                  </v-col> -->
                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="coordinatorCancel"
                        >Cancel</v-btn
                      >
                      <v-btn
                        class="mr-10"
                        @click="coordinatorSave"
                        :disabled="!validCoordinator"
                        >Save</v-btn
                      >
                      <!-- <v-btn class="mr-10" @click="coordinatorSave">Save</v-btn> -->
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>

          <!-- Donor Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="top left"
              style="margin-top: 3%; margin-left: 25%"
              min-width="430"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showDonorRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Donor</v-list-item-title>
                </v-list-item>
              </template>
              <!-- Donor Registration card-->
              <v-card v-if="showDonor" max-width="430">
                <v-form ref="donorForm" v-model="validDonor" lazy-validation>
                  <v-row>
                    <!-- Donor Company Name -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mb-n7 mt-5">
                        <v-text-field
                          v-model="donorName"
                          label="Company Name"
                          :rules="nameRules"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Donor Email -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mb-n7">
                        <v-text-field
                          v-model="donorEmail"
                          label="Email"
                          type="email"
                          :rules="emailRules"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Donor Password -->
                    <!-- <v-col cols="12">
                    <v-responsive max-width="" class="mx-10">
                      <v-text-field
                        v-model="donorPassword"
                        label="Password"
                        type="password"
                      >
                      </v-text-field>
                    </v-responsive>
                  </v-col> -->
                    <!-- Donor Coordinator -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10">
                        <v-select
                          v-model="donorCoordinator"
                          :items="coordinatorsOptions"
                          :item-text="coordinatorText_Value"
                          :item-value="coordinatorText_Value"
                          :menu-props="{ bottom: true, offsetY: true }"
                          label="Coordinator"
                          :rules="requiredRule"
                        ></v-select>
                      </v-responsive>
                    </v-col>

                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="donorCancel">Cancel</v-btn>
                      <v-btn
                        class="mr-10"
                        @click="donorSave"
                        :disabled="!validDonor"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>

          <!-- Region Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="top left"
              style="margin-top: 3%; margin-left: 25%"
              min-width="430"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showRegionRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Region</v-list-item-title>
                </v-list-item>
              </template>
              <!-- Region Registration Card-->
              <v-card v-if="showRegion" max-width="430">
                <v-form ref="regionForm" v-model="validRegion" lazy-validation>
                  <v-row>
                    <!-- Region Name -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-5">
                        <v-text-field
                          v-model="regionName"
                          label="Region Name"
                          :rules="nameRules"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="regionCancel">Cancel</v-btn>
                      <v-btn
                        class="mr-10"
                        @click="regionSave"
                        :disabled="!validRegion"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>

          <!-- Zone Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="top left"
              style="margin-top: 3%; margin-left: 25%"
              min-width="430"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showZoneRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Zone</v-list-item-title>
                </v-list-item>
              </template>
              <!-- Zone Registration Card-->
              <v-card v-if="showZone" max-width="430">
                <v-form ref="zoneForm" v-model="validZone" lazy-validation>
                  <v-row>
                    <!-- Zone Name -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-5">
                        <v-text-field
                          v-model="zoneName"
                          label="Zone Name"
                          :rules="nameRules"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Zone Region -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-n7">
                        <v-select
                          v-model="zoneRegion"
                          :items="regionOptions"
                          :item-text="regionText_Value"
                          :item-value="regionText_Value"
                          :menu-props="{ bottom: true, offsetY: true }"
                          :rules="requiredRule"
                          label="Region"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="zoneCancel">Cancel</v-btn>
                      <v-btn
                        class="mr-10"
                        @click="zoneSave"
                        :disabled="!validZone"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>

          <!-- District Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="bottom left"
              style="margin-top: 3%; margin-left: 25%"
              min-width="430"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showDistrictRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>District</v-list-item-title>
                </v-list-item>
              </template>
              <!-- District Registration Card-->
              <v-card v-if="showDistrict" max-width="430">
                <v-form
                  ref="districtForm"
                  v-model="validDistrict"
                  lazy-validation
                >
                  <v-row>
                    <!-- District Name -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-5">
                        <v-text-field
                          v-model="districtName"
                          label="District Name"
                          :rules="nameRules"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- District Region -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-n7">
                        <v-select
                          v-model="districtRegion"
                          :items="regionOptions"
                          :item-text="regionText_Value"
                          :item-value="regionText_Value"
                          :menu-props="{ bottom: true, offsetY: true }"
                          :rules="requiredRule"
                          label="Region"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <!-- District Zone -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-n7">
                        <v-select
                          v-model="districtZone"
                          :items="zoneOptions"
                          :item-text="zoneText_Value"
                          :item-value="zoneText_Value"
                          :menu-props="{ bottom: true, offsetY: true }"
                          :rules="requiredRule"
                          label="Zone"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="districtCancel">Cancel</v-btn>
                      <v-btn
                        class="mr-10"
                        @click="districtSave"
                        :disabled="!validDistrict"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>

          <!-- Peasant Association Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="bottom left"
              style="margin-top: 3%; margin-left: 25%"
              min-width="430"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showPeasantAssociationRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title> Village</v-list-item-title>
                </v-list-item>
              </template>
              <!-- Peasant Association Registration Card-->
              <v-card v-if="showPeasantAssociation" max-width="430">
                <v-form
                  ref="villageForm"
                  v-model="validVillage"
                  lazy-validation
                >
                  <v-row>
                    <!-- Peasant Association Name -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-5">
                        <v-text-field
                          v-model="villageName"
                          :rules="nameRules"
                          label="Village Name"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Peasant Association District -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mt-n7">
                        <v-select
                          v-model="villageDistrict"
                          :items="districts"
                          :item-text="districtText_Value"
                          :item-value="districtText_Value"
                          :menu-props="{ bottom: true, offsetY: true }"
                          label="District"
                          clearable
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="villageCancel">Cancel</v-btn>
                      <v-btn
                        class="mr-10"
                        @click="villageSave"
                        :disabled="!validVillage"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>

          <!-- Social Worker Registration -->
          <v-list-item class="pl-4">
            <v-menu
              transition="scale-transition"
              origin="bottom left"
              style="margin-top: 3%; margin-left: 25%"
              min-width="430"
              nudge-right="360%"
              nudge-bottom="24%"
              :close-on-content-click="sideMenu"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  @click="showSocialWorkerRegistration"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-book-plus</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Social Worker</v-list-item-title>
                </v-list-item>
              </template>
              <!-- Social Worker Registration Card-->
              <v-card v-if="showSocialWorker" max-width="430">
                <v-form
                  ref="socialWorkerForm"
                  v-model="validSocialWorker"
                  lazy-validation
                >
                  <v-row>
                    <!-- Social Worker Full Name -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mb-n7 mt-5">
                        <v-text-field
                          v-model="socialWorkerFullName"
                          :rules="personalNameRules"
                          label="Full Name"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Social Worker Gender -->
                    <v-col cols="12" sm="6" align="left">
                      <v-responsive max-width="150px" class="mb-n7 ml-10">
                        <v-select
                          v-model="socialWorkerGender"
                          :items="genderOptions"
                          :rules="requiredRule"
                          :menu-props="{ bottom: true, offsetY: true }"
                          label="Gender"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <!-- Social Worker Birth Date -->
                    <v-col cols="12" sm="6" align="left">
                      <v-responsive
                        max-width="300px"
                        class="mb-n7 mr-10 ml-10 ml-sm-0"
                      >
                        <v-menu
                          ref="menu"
                          v-model="socialWorkerBirthDateMenu"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="socialWorkerBirthDate"
                              label="Birthday date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            ref="picker"
                            v-model="socialWorkerBirthDate"
                            :rules="requiredRule"
                            no-title
                            scrollable
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1950-01-01"
                            @change="socialWorkerBirthdateSave"
                          >
                          </v-date-picker>
                        </v-menu>
                      </v-responsive>
                    </v-col>
                    <!-- Social Worker Email -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mb-n7">
                        <v-text-field
                          v-model="socialWorkerEmail"
                          :rules="emailRules"
                          label="Email"
                          type="email"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Social Worker Phone Number -->
                    <v-col cols="12">
                      <v-responsive max-width="" class="mx-10 mb-n7">
                        <v-text-field
                          v-model="socialWorkerPhoneNumber"
                          :rules="phoneNumberRules"
                          label="Phone Number"
                        >
                        </v-text-field>
                      </v-responsive>
                    </v-col>
                    <!-- Social Worker District -->
                    <v-col cols="12">
                      <v-responsive max-width="430px" class="mx-10 mb-n7">
                        <v-select
                          v-model="socialWorkerDistrict"
                          :items="districts"
                          :item-text="districtText_Value"
                          :item-value="districtText_Value"
                          :menu-props="{ bottom: true, offsetY: true }"
                          label="District"
                          clearable
                          :disabled="socialWorkerDistrictDisabled"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <!-- Social Worker Peasant Association -->
                    <v-col cols="12">
                      <v-responsive max-width="430px" class="mx-10">
                        <v-select
                          v-model="socialWorkerVillages"
                          multiple
                          :items="socialWorkerVillageOptions"
                          :item-text="villageText_Value"
                          :item-value="villageText_Value"
                          :menu-props="{ bottom: true, offsetY: true }"
                          label="Villages"
                          clearable
                          :disabled="socialWorkerVillageDisabled"
                        ></v-select>
                      </v-responsive>
                    </v-col>
                    <v-col align="right" class="mb-5">
                      <v-btn class="mr-5" @click="socialWorkerCancel"
                        >Cancel</v-btn
                      >
                      <v-btn
                        class="mr-10"
                        @click="socialWorkerSave"
                        :disabled="!validSocialWorker"
                        >Save</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card>
            </v-menu>
          </v-list-item>
        </v-list-group>
        <!-- Viewing -->
        <v-list-group
          active-class="indigo lighten-4"
          :value="false"
          no-action
          prepend-icon="mdi-book-plus-multiple"
        >
          <template v-slot:activator>
            <v-list-item-content style="margin-left: -24px">
              <v-list-item-title>Views</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item class="pl-4" selectable @click="toogleRegionsTable">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Regions </v-list-item-content>
          </v-list-item>
          <v-list-item class="pl-4" selectable @click="toogleZoneTable">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Zones </v-list-item-content>
          </v-list-item>
          <v-list-item class="pl-4" selectable @click="toogleDistrictTable">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Districts </v-list-item-content>
          </v-list-item>
          <v-list-item class="pl-4" selectable @click="toogleVillageTable">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Village </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <!-- Users -->
        <v-list-group
          active-class="indigo lighten-4"
          :value="false"
          no-action
          prepend-icon="mdi-book-plus-multiple"
        >
          <template v-slot:activator>
            <v-list-item-content style="margin-left: -24px">
              <v-list-item-title>Users</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item class="pl-4" selectable @click="toogleDonorTree">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Donors </v-list-item-content>
          </v-list-item>

          <v-list-item class="pl-4" selectable @click="toogleCoordinatorTree">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Coordinators </v-list-item-content>
          </v-list-item>

          <v-list-item class="pl-4" selectable @click="toogleSocialWorkerTree">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content> Social Workers </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-container>
      <!-- Info Dialog -->
      <template>
        <v-dialog
          v-model="infoDialog"
          persistent
          max-width="750px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">
                  {{ infoDialogOwner }} account {{ infoDialogType }} for
                  {{ infoDialogOwnerName }}
                </h3>
              </div>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <div class="text-h6">
                Email:
                <span v-html="infoDialogOwnerEmail" class="text-body-1" />
              </div>
              <div class="text-h6">
                Password:
                <span
                  v-html="infoDialogOwnerPassword"
                  class="font-weight-black black--text"
                />
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn text color="error" @click="infoDialog = false"
                >Close</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- Views -->
      <template>
        <!-- Districts -->
        <!-- Table Card -->
        <!-- District Table -->
        <v-row
          v-if="showDistrictTable"
          justify="start"
          no-gutters
          style="margin-left: 25%; margin-top: -3%"
        >
          <v-col cols="12">
            <v-card elevation="16" max-width="170vh">
              <v-sheet
                id="scrolling-techniques-3"
                class="overflow-y-auto"
                max-height="83vh"
              >
                <v-data-table
                  :headers="districtHeaders"
                  :items="districtTable"
                  item-key="id"
                  :search="searchDistrictTable"
                  append-icon="mdi-magnify"
                  :custom-filter="searchDistrictTableFilter"
                  :loading="districtTableLoading"
                  loading-text="Loading District Table... Please wait"
                  multi-sort
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-row style="margin: 0px">
                      <!-- Filter/Search Selection -->
                      <!-- TODO: # add close icon and function to remove from selection -->
                      <!--       # add tooltip maybe -->
                      <v-col cols="12" sm="7" class="ml-md-auto mx-sm-auto">
                        <v-responsive
                          min-width="300"
                          max-width="300"
                          class="mx-xs-auto ml-sm-auto mt-sm-2"
                        >
                          <v-select
                            v-model="districtTableFilterValue"
                            hint="select field/s to filter explicity"
                            :items="districtTableFilterItems"
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
                                @click:close="removeSelectedDistrict(item)"
                                v-if="index === 0"
                              >
                                <span>{{ item }}</span>
                              </v-chip>
                              <span
                                v-if="index === 1"
                                class="grey--text caption"
                              >
                                (+{{ filterValue.length - 1 }} others)
                              </span>
                            </template>
                          </v-select>
                        </v-responsive>
                      </v-col>
                      <!-- Search Input -->
                      <!-- TODO: # add search icon and close icon -->
                      <v-col
                        cols="12"
                        sm="6"
                        md="5"
                        offset-md="0"
                        class="mx-sm-auto"
                      >
                        <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                          <v-text-field
                            v-model="searchDistrictTable"
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
                    </v-row>
                  </template>
                  <template v-slot:[`item.id`]="{ item }">
                    {{ getDistrictTableId(item) }}
                  </template>
                  <template v-slot:[`item.districtName`]="{ item }">
                    {{ getDistrictTableDistrictName(item) }}
                  </template>
                  <template v-slot:[`item.region`]="{ item }">
                    {{ getDistrictTableRegion(item) }}
                  </template>
                  <template v-slot:[`item.zone`]="{ item }">
                    {{ getDistrictTableZone(item) }}
                  </template>
                  <template v-slot:[`item.numberOfPAs`]="{ item }">
                    {{ getDistrictTableNumberOfVillage(item) }}
                  </template>
                  <template v-slot:[`item.numberOfSocialWorkers`]="{ item }">
                    {{ getDistrictTableNumberOfSocialWorkers(item) }}
                  </template>
                </v-data-table>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
        <!-- Region Table -->
        <v-row
          v-if="showRegionTable"
          justify="start"
          no-gutters
          style="margin-left: 25%; margin-top: -3%"
        >
          <v-col cols="12">
            <v-card elevation="16" max-width="170vh">
              <v-sheet
                id="scrolling-techniques-3"
                class="overflow-y-auto"
                max-height="83vh"
              >
                <v-data-table
                  :headers="regionHeaders"
                  :items="regionTable"
                  item-key="id"
                  :search="searchRegionTable"
                  append-icon="mdi-magnify"
                  :custom-filter="searchRegionTableFilter"
                  :loading="regionTableLoading"
                  loading-text="Loading Region Table... Please wait"
                  multi-sort
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-row style="margin: 0px">
                      <!-- Filter/Search Selection -->
                      <!-- TODO: # add close icon and function to remove from selection -->
                      <!--       # add tooltip maybe -->
                      <v-col cols="12" sm="7" class="ml-md-auto mx-sm-auto">
                        <v-responsive
                          min-width="300"
                          max-width="300"
                          class="mx-xs-auto ml-sm-auto mt-sm-2"
                        >
                          <v-select
                            v-model="regionTableFilterValue"
                            hint="select field/s to filter explicity"
                            :items="regionTableFilterItems"
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
                                @click:close="removeSelectedRegion(item)"
                                v-if="index === 0"
                              >
                                <span>{{ item }}</span>
                              </v-chip>
                              <span
                                v-if="index === 1"
                                class="grey--text caption"
                              >
                                (+{{ filterValue.length - 1 }} others)
                              </span>
                            </template>
                          </v-select>
                        </v-responsive>
                      </v-col>
                      <!-- Search Input -->
                      <!-- TODO: # add search icon and close icon -->
                      <v-col
                        cols="12"
                        sm="6"
                        md="5"
                        offset-md="0"
                        class="mx-sm-auto"
                      >
                        <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                          <v-text-field
                            v-model="searchRegionTable"
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
                    </v-row>
                  </template>
                  <template v-slot:[`item.id`]="{ item }">
                    {{ getRegionTableId(item) }}
                  </template>
                  <template v-slot:[`item.regionName`]="{ item }">
                    {{ getRegionTableRegionName(item) }}
                  </template>
                  <template v-slot:[`item.numberOfZones`]="{ item }">
                    {{ getRegionTableNumberOfZones(item) }}
                  </template>
                  <template v-slot:[`item.numberOfDistricts`]="{ item }">
                    {{ getRegionTableNumberOfDistricts(item) }}
                  </template>
                </v-data-table>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
        <!-- Zone Table -->
        <v-row
          v-if="showZoneTable"
          justify="start"
          no-gutters
          style="margin-left: 25%; margin-top: -3%"
        >
          <v-col cols="12">
            <v-card elevation="16" max-width="170vh">
              <v-sheet
                id="scrolling-techniques-3"
                class="overflow-y-auto"
                max-height="83vh"
              >
                <v-data-table
                  :headers="zoneHeaders"
                  :items="zoneTable"
                  item-key="id"
                  :search="searchZoneTable"
                  append-icon="mdi-magnify"
                  :custom-filter="searchZoneTableFilter"
                  :loading="zoneTableLoading"
                  loading-text="Loading Zone Table... Please wait"
                  multi-sort
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-row style="margin: 0px">
                      <!-- Filter/Search Selection -->
                      <!-- TODO: # add close icon and function to remove from selection -->
                      <!--       # add tooltip maybe -->
                      <v-col cols="12" sm="7" class="ml-md-auto mx-sm-auto">
                        <v-responsive
                          min-width="300"
                          max-width="300"
                          class="mx-xs-auto ml-sm-auto mt-sm-2"
                        >
                          <v-select
                            v-model="zoneTableFilterValue"
                            hint="select field/s to filter explicity"
                            :items="zoneTableFilterItems"
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
                                @click:close="removeSelectedZone(item)"
                                v-if="index === 0"
                              >
                                <span>{{ item }}</span>
                              </v-chip>
                              <span
                                v-if="index === 1"
                                class="grey--text caption"
                              >
                                (+{{ filterValue.length - 1 }} others)
                              </span>
                            </template>
                          </v-select>
                        </v-responsive>
                      </v-col>
                      <!-- Search Input -->
                      <!-- TODO: # add search icon and close icon -->
                      <v-col
                        cols="12"
                        sm="6"
                        md="5"
                        offset-md="0"
                        class="mx-sm-auto"
                      >
                        <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                          <v-text-field
                            v-model="searchZoneTable"
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
                    </v-row>
                  </template>
                  <template v-slot:[`item.id`]="{ item }">
                    {{ getZoneTableId(item) }}
                  </template>
                  <template v-slot:[`item.zoneName`]="{ item }">
                    {{ getZoneTableZoneName(item) }}
                  </template>
                  <template v-slot:[`item.region`]="{ item }">
                    {{ getZoneTableRegion(item) }}
                  </template>
                  <template v-slot:[`item.numberOfDistricts`]="{ item }">
                    {{ getZoneTableNumberOfDistricts(item) }}
                  </template>
                </v-data-table>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
        <!-- Village Table -->
        <v-row
          v-if="showVillageTable"
          justify="start"
          no-gutters
          style="margin-left: 25%; margin-top: -3%"
        >
          <v-col cols="12">
            <v-card elevation="16" max-width="170vh">
              <v-sheet
                id="scrolling-techniques-3"
                class="overflow-y-auto"
                max-height="83vh"
              >
                <v-data-table
                  :headers="villageHeaders"
                  :items="villageTable"
                  item-key="id"
                  :search="searchVillageTable"
                  append-icon="mdi-magnify"
                  :custom-filter="searchVillageTableFilter"
                  :loading="villageTableLoading"
                  loading-text="Loading Village Table... Please wait"
                  multi-sort
                  class="elevation-1"
                >
                  <template v-slot:top>
                    <v-row style="margin: 0px">
                      <!-- Filter/Search Selection -->
                      <!-- TODO: # add close icon and function to remove from selection -->
                      <!--       # add tooltip maybe -->
                      <v-col cols="12" sm="7" class="ml-md-auto mx-sm-auto">
                        <v-responsive
                          min-width="300"
                          max-width="300"
                          class="mx-xs-auto ml-sm-auto mt-sm-2"
                        >
                          <v-select
                            v-model="villageTableFilterValue"
                            hint="select field/s to filter explicity"
                            :items="villageTableFilterItems"
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
                                @click:close="removeSelectedVillage(item)"
                                v-if="index === 0"
                              >
                                <span>{{ item }}</span>
                              </v-chip>
                              <span
                                v-if="index === 1"
                                class="grey--text caption"
                              >
                                (+{{ filterValue.length - 1 }} others)
                              </span>
                            </template>
                          </v-select>
                        </v-responsive>
                      </v-col>
                      <!-- Search Input -->
                      <!-- TODO: # add search icon and close icon -->
                      <v-col
                        cols="12"
                        sm="6"
                        md="5"
                        offset-md="0"
                        class="mx-sm-auto"
                      >
                        <v-responsive max-width="300" class="ml-sm-3 mt-sm-4">
                          <v-text-field
                            v-model="searchVillageTable"
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
                    </v-row>
                  </template>
                  <template v-slot:[`item.id`]="{ item }">
                    {{ getVillageTableId(item) }}
                  </template>
                  <template v-slot:[`item.villageName`]="{ item }">
                    {{ getVillageTableVillageName(item) }}
                  </template>
                  <template v-slot:[`item.district`]="{ item }">
                    {{ getVillageTableDistrict(item) }}
                  </template>
                  <template v-slot:[`item.socialWorker`]="{ item }">
                    {{ getVillageTableSocialWorker(item) }}
                  </template>
                  <template v-slot:[`item.numberOfOrphans`]="{ item }">
                    {{ getVillageTableNumberOfOrphans(item) }}
                  </template>
                </v-data-table>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <!-- #TODO: make all users in to one card with different treeViews -->
      <!-- Users -->
      <template>
        <!-- Donors -->
        <v-card
          v-if="showDonorTree"
          min-width="400"
          max-width="70%"
          style="margin-left: 25%"
        >
          <!-- <v-card-title class="indigo white--text headline">
          Donor Directory
        </v-card-title> -->
          <v-row class="pa-4" justify="space-between">
            <v-col cols="5">
              <v-sheet class="overflow-y-auto" max-height="70vh">
                <v-treeview
                  :active.sync="activeDonorTree"
                  :items="donorItems"
                  :load-children="fetchDonors"
                  color="warning"
                  activatable
                  open-all
                  transition
                >
                  <template v-slot:prepend="{ item }">
                    <v-icon v-if="!item.children"> mdi-account </v-icon>
                    <span> {{ item.nameInitials }} </span>
                  </template>
                </v-treeview>
              </v-sheet>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col
              class="d-flex text-center"
              style="max-height: 65vh; overflow: auto"
            >
              <v-scroll-y-transition mode="out-in" style="max-height: 65vh">
                <div
                  v-if="!selectedDonor"
                  class="title grey--text text--lighten-1 font-weight-light"
                  style="align-self: center"
                >
                  Select a Coordinator
                </div>
                <v-card
                  v-else
                  :key="selectedDonor.id"
                  class="pt-0 mx-auto"
                  flat
                  max-width="400"
                >
                  <v-card-text>
                    <v-avatar color="indigo" size="50">
                      <span class="white--text headline">{{
                        selectedDonor.nameInitials
                      }}</span>
                    </v-avatar>
                    <h3 class="headline mb-2">
                      {{ selectedDonor.companyName }}
                    </h3>
                    <!-- <div class="blue--text mb-2">
                    {{ selectedDonor.nameInitials }}
                  </div> -->
                    <div class="blue--text subheading font-weight-bold">
                      <span>{{ selectedDonor.user.email }}</span>
                      <v-dialog
                        max-width="400px"
                        v-model="donorPasswordResetConfirmationDialog"
                      >
                        <template v-slot:activator="{ on, attrs }"
                          ><v-btn
                            small
                            text
                            class="ml-3"
                            color="error"
                            v-on="on"
                            v-bind="attrs"
                            >Reset password</v-btn
                          ></template
                        >
                        <v-card>
                          <v-card-title primary-title>
                            Confirmation
                          </v-card-title>
                          <v-card-text>
                            Are you sure you want to reset password for the
                            account
                            <span
                              class="blue--text subheading font-weight-bold"
                              >{{ selectedDonor.user.email }}</span
                            >?
                          </v-card-text>
                          <v-divider></v-divider>
                          <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                              color="secondary"
                              text
                              @click="
                                donorPasswordResetConfirmationDialog = false
                              "
                              >cancel</v-btn
                            >
                            <v-btn
                              color="error"
                              @click="resetPassword(selectedDonor)"
                              >RESET</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-row class="text-left" tag="v-card-text">
                    <v-col class="text-right" tag="strong" cols="6">
                      Coordinators:
                    </v-col>
                    <v-col cols="6">{{
                      selectedDonor.coordinators.length
                    }}</v-col>
                    <v-col class="text-right" tag="strong" cols="6">
                      Number of Support Plans:
                    </v-col>
                    <v-col cols="6">{{
                      selectedDonor.supportPlans.length
                    }}</v-col>
                  </v-row>
                </v-card>
              </v-scroll-y-transition>
            </v-col>
          </v-row>
        </v-card>
        <!-- Coordinators -->
        <v-card
          v-if="showCoordinatorTree"
          min-width="400"
          max-width="70%"
          max-height="80vh"
          style="margin-left: 25%"
        >
          <!-- <v-card-title class="indigo white--text headline">
          Coordinator Directory
        </v-card-title> -->
          <v-row class="pa-4" justify="space-between">
            <v-col cols="5">
              <v-sheet class="overflow-y-auto" max-height="70vh">
                <v-treeview
                  :active.sync="activeCoordinatorTree"
                  :items="coordinatorItems"
                  :load-children="fetchCoordinators"
                  color="warning"
                  activatable
                  open-all
                  transition
                >
                  <template v-slot:prepend="{ item }">
                    <v-icon v-if="!item.children"> mdi-account </v-icon>
                    <span v-if="!item.children">
                      {{
                        `${item.firstName} ${item.middleName} ${item.lastName}`
                      }}
                    </span>
                  </template>
                </v-treeview>
              </v-sheet>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col
              class="d-flex text-center"
              style="max-height: 65vh; overflow: auto"
            >
              <v-scroll-y-transition mode="out-in" style="max-height: 65vh">
                <div
                  v-if="!selectedCoordinator"
                  class="title grey--text text--lighten-1 font-weight-light"
                  style="align-self: center"
                >
                  Select a Coordinator
                </div>
                <v-card
                  v-else
                  :key="selectedCoordinator.id"
                  class="pt-0 mx-auto"
                  flat
                  max-width="400"
                >
                  <v-card-text>
                    <v-avatar color="indigo" size="50">
                      <span class="white--text headline">{{
                        selectedCoordinator.firstName.substr(0, 1) +
                          selectedCoordinator.middleName.substr(0, 1)
                      }}</span>
                    </v-avatar>
                    <h3 class="headline mb-2">
                      {{
                        selectedCoordinator.firstName +
                          selectedCoordinator.middleName +
                          selectedCoordinator.lastName
                      }}
                    </h3>
                    <div class="blue--text subheading font-weight-bold">
                      <span>{{ selectedCoordinator.user.email }}</span>
                      <v-dialog
                        max-width="400px"
                        v-model="coordinatorPasswordResetConfirmationDialog"
                      >
                        <template v-slot:activator="{ on, attrs }"
                          ><v-btn
                            small
                            text
                            class="ml-3"
                            color="error"
                            v-on="on"
                            v-bind="attrs"
                            >Reset password</v-btn
                          ></template
                        >
                        <v-card>
                          <v-card-title primary-title>
                            Confirmation
                          </v-card-title>
                          <v-card-text>
                            Are you sure you want to reset password for the
                            account
                            <span
                              class="blue--text subheading font-weight-bold"
                              >{{ selectedCoordinator.user.email }}</span
                            >?
                          </v-card-text>
                          <v-divider></v-divider>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="secondary"
                              text
                              @click="
                                coordinatorPasswordResetConfirmationDialog = false
                              "
                              >cancel</v-btn
                            >
                            <v-btn
                              color="error"
                              @click="resetPassword(selectedCoordinator)"
                              >RESET</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-row class="text-left" tag="v-card-text">
                    <v-col class="text-right" tag="strong" cols="6">
                      Number of Donors:
                    </v-col>
                    <v-col cols="6">{{
                      selectedCoordinator.donors.length
                    }}</v-col>
                  </v-row>
                </v-card>
              </v-scroll-y-transition>
            </v-col>
          </v-row>
        </v-card>
        <!-- SocialWorkers -->
        <v-card
          v-if="showSocialWorkerTree"
          min-width="400"
          max-width="70%"
          style="margin-left: 25%"
        >
          <!-- <v-card-title class="indigo white--text headline">
          SocialWorker Directory
        </v-card-title> -->
          <v-row class="pa-4" justify="space-between">
            <v-col cols="5">
              <v-sheet class="overflow-y-auto" max-height="70vh">
                <v-treeview
                  :active.sync="activeSocialWorkerTree"
                  :items="socialWorkerItems"
                  :load-children="fetchSocialWorkers"
                  color="warning"
                  :open-all="true"
                  activatable
                  transition
                >
                  <template v-slot:prepend="{ item }">
                    <v-icon v-if="!item.children"> mdi-account </v-icon>
                    <span v-if="!item.children">
                      {{
                        `${item.firstName} ${item.middleName} ${item.lastName}`
                      }}
                    </span>
                  </template>
                </v-treeview>
              </v-sheet>
            </v-col>

            <v-divider vertical></v-divider>

            <v-col
              class="d-flex text-center"
              style="max-height: 65vh; overflow: auto"
            >
              <v-scroll-y-transition mode="out-in" style="max-height: 65vh">
                <div
                  v-if="!selectedSocialWorker"
                  class="title grey--text text--lighten-1 font-weight-light"
                  style="align-self: center"
                >
                  Select a SocialWorker
                </div>
                <v-card
                  v-else
                  :key="selectedSocialWorker.id"
                  class="pt-0 mx-auto"
                  flat
                  max-width="400"
                >
                  <v-card-text>
                    <v-avatar color="indigo" size="50">
                      <span class="white--text headline">{{
                        selectedSocialWorker.firstName.substr(0, 1) +
                          selectedSocialWorker.middleName.substr(0, 1)
                      }}</span>
                    </v-avatar>
                    <h3 class="headline mb-2">
                      {{
                        selectedSocialWorker.firstName +
                          ' ' +
                          selectedSocialWorker.middleName +
                          ' ' +
                          selectedSocialWorker.lastName
                      }}
                    </h3>
                    <div
                      v-if="selectedSocialWorker.user != null"
                      class="blue--text subheading font-weight-bold"
                    >
                      <span>{{ selectedSocialWorker.user.email }}</span>
                      <v-dialog
                        max-width="400px"
                        v-model="socialWorkerPasswordResetConfirmationDialog"
                      >
                        <template v-slot:activator="{ on, attrs }"
                          ><v-btn
                            small
                            text
                            class="ml-3"
                            color="error"
                            v-on="on"
                            v-bind="attrs"
                            >Reset password</v-btn
                          ></template
                        >
                        <v-card>
                          <v-card-title primary-title>
                            Confirmation
                          </v-card-title>
                          <v-card-text>
                            Are you sure you want to reset password for the
                            account
                            <span
                              class="blue--text subheading font-weight-bold"
                              >{{ selectedSocialWorker.user.email }}</span
                            >?
                          </v-card-text>
                          <v-divider></v-divider>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="secondary"
                              text
                              @click="
                                socialWorkerPasswordResetConfirmationDialog = false
                              "
                              >cancel</v-btn
                            >
                            <v-btn
                              color="error"
                              @click="resetPassword(selectedSocialWorker)"
                              >RESET</v-btn
                            >
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-row class="text-left" tag="v-card-text">
                    <template v-if="selectedSocialWorker.gender">
                      <v-col class="text-right" tag="strong" cols="6">
                        Gender:
                      </v-col>
                      <v-col cols="6">{{ selectedSocialWorker.gender }}</v-col>
                    </template>
                    <v-col class="text-right" tag="strong" cols="6">
                      Age:
                    </v-col>
                    <v-col cols="6">{{
                      calculateAge(selectedSocialWorker.dateOfBirth)
                    }}</v-col>
                    <v-col class="text-right" tag="strong" cols="6">
                      Mobile Number:
                    </v-col>
                    <v-col cols="6">{{
                      selectedSocialWorker.mobileNumber
                    }}</v-col>
                    <template v-if="selectedSocialWorker.districts != null">
                      <v-col class="text-right" tag="strong" cols="6">
                        Districts:
                      </v-col>
                      <v-col cols="6">{{
                        selectedSocialWorker.districts.length
                      }}</v-col>
                    </template>
                    <template v-if="selectedSocialWorker.villages != null">
                      <v-col class="text-right" tag="strong" cols="6">
                        Districts:
                      </v-col>
                      <v-col cols="6">{{
                        selectedSocialWorker.villages.length
                      }}</v-col>
                    </template>
                    <template v-if="selectedSocialWorker.orphans != null">
                      <v-col class="text-right" tag="strong" cols="6">
                        Number of Orphans:
                      </v-col>
                      <v-col cols="6">
                        {{ selectedSocialWorker.orphans.length }}
                      </v-col>
                    </template>
                  </v-row>
                </v-card>
              </v-scroll-y-transition>
            </v-col>
          </v-row>
        </v-card>
      </template>

      <!-- Account Maintainence -->
      <template
        v-if="
          !showRegionTable &&
            !showZoneTable &&
            !showDistrictTable &&
            !showVillageTable &&
            !showDonorTree &&
            !showCoordinatorTree &&
            !showSocialWorkerTree
        "
      >
        <v-card
          style="margin-left: 12rem;"
          elevation="0"
          min-height="81vh"
          max-height="81vh"
          color="grey lighten-2"
          max-width="1000"
        >
          <v-row class="px-3">
            <v-col cols="6">
              <v-card col="6" max-height="77vh" min-height="77vh">
                <v-card-title primary-title>
                  Pending Requests
                </v-card-title>
                <v-divider></v-divider>
                <v-tabs
                  v-model="allAccountMaintainencesTab"
                  color="primary"
                  slider-color="primary"
                  fixed-tabs
                  icons-and-text
                >
                  <v-tab>
                    Registration
                    <v-badge
                      class="mt-3"
                      color="red"
                      :value="
                        filteredAccountMaintainences('register', 'pending')
                          .length
                      "
                      :content="
                        filteredAccountMaintainences('register', 'pending')
                          .length
                      "
                    >
                      <v-icon>mdi-account</v-icon>
                    </v-badge>
                  </v-tab>
                  <v-tab>
                    Password Recovery
                    <v-badge
                      class="mt-3"
                      color="red"
                      :value="
                        filteredAccountMaintainences(
                          'passwordRecovery',
                          'pending'
                        ).length
                      "
                      :content="
                        filteredAccountMaintainences(
                          'passwordRecovery',
                          'pending'
                        ).length
                      "
                    >
                      <v-icon>mdi-key</v-icon></v-badge
                    >
                  </v-tab>
                </v-tabs>
                <v-tabs-items v-model="allAccountMaintainencesTab">
                  <v-tab-item>
                    <v-list max-height="54vh" style="overflow-y: auto">
                      <v-list-item
                        v-for="(item, index) in filteredAccountMaintainences(
                          'register',
                          'pending'
                        )"
                        :key="index"
                      >
                        <v-list-item-icon
                          ><v-icon>mdi-account</v-icon></v-list-item-icon
                        >
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="
                              `${item.firstName} ${item.middleName} ${item.lastName} - ${item.role}`
                            "
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="`${item.email} - ${item.mobileNumber}`"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-icon class="mx-0"
                            ><v-icon
                              color="success"
                              @click="approveRequest(item)"
                              >mdi-check-circle</v-icon
                            >
                            <v-icon
                              class="ml-3"
                              color="red lighten-2"
                              @click="rejectRequest(item)"
                              >mdi-close-circle</v-icon
                            ></v-list-item-icon
                          >
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-tab-item>
                  <v-tab-item
                    ><v-list max-height="54vh" style="overflow-y: auto">
                      <v-list-item
                        v-for="(item, index) in filteredAccountMaintainences(
                          'passwordRecovery',
                          'pending'
                        )"
                        :key="index"
                      >
                        <v-list-item-icon
                          ><v-icon>mdi-key</v-icon></v-list-item-icon
                        >
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="
                              `${item.firstName} ${item.middleName} ${item.lastName} - ${item.role}`
                            "
                          ></v-list-item-title>
                          <v-list-item-subtitle
                            v-html="`${item.email} - ${item.mobileNumber}`"
                          ></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-icon class="mx-0"
                            ><v-icon
                              color="success"
                              @click="approveRequest(item)"
                              >mdi-check-circle</v-icon
                            >
                            <v-icon
                              class="ml-3"
                              color="red lighten-2"
                              @click="rejectRequest(item)"
                              >mdi-close-circle</v-icon
                            ></v-list-item-icon
                          >
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-tab-item>
                </v-tabs-items>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card
                cols="6"
                elevation="2"
                max-height="77vh"
                min-height="77vh"
              >
                <v-card-title primary-title>
                  Approved / Rejected Requests
                </v-card-title>
                <v-divider></v-divider>
                <v-list max-height="64vh" style="overflow-y: auto">
                  <v-list-item
                    v-for="(item, index) in filteredAccountMaintainences(
                      'er',
                      'ed'
                    )"
                    :key="index"
                  >
                    <v-list-item-icon
                      ><v-icon
                        >mdi-{{
                          item.type == 'register' ? 'account' : 'key'
                        }}</v-icon
                      ></v-list-item-icon
                    >
                    <v-list-item-content>
                      <v-list-item-title
                        v-html="
                          `${item.firstName} ${item.middleName} ${item.lastName} - ${item.role}`
                        "
                      ></v-list-item-title>
                      <v-list-item-subtitle
                        v-html="`${item.email} - ${item.mobileNumber}`"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                    <v-chip
                      small
                      :class="
                        item.status === 'approved'
                          ? 'success darken-1'
                          : 'red darken-2 white--text'
                      "
                      v-html="
                        item.status === 'approved' ? 'Approved' : 'Rejected'
                      "
                    ></v-chip>
                  </v-list-item>
                </v-list> </v-card
            ></v-col> </v-row
        ></v-card>
      </template>
    </v-container>
  </div>
</template>

<style scoped>
.v-menu__content {
  position: absolute;
  display: inline-block;
  max-width: 80%;
  overflow-y: hidden;
  overflow-x: hidden;
  contain: content;
  will-change: transform;
  box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
    0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
  border-radius: 4px;
}
</style>

<script>
import axios from 'axios';
import AppNavBar from '@/components/AppNavBar';
import { calculateAge } from '@/utils/utils';
import { mapMutations } from 'vuex';

export default {
  components: {
    AppNavBar
  },
  data: () => ({
    infoDialog: false,
    infoDialogType: 'created',
    infoDialogOwner: null,
    infoDialogOwnerName: null,
    infoDialogOwnerEmail: null,
    infoDialogOwnerPassword: null,
    donorPasswordResetConfirmationDialog: false,
    coordinatorPasswordResetConfirmationDialog: false,
    socialWorkerPasswordResetConfirmationDialog: false,
    allAccountMaintainences: [],
    allAccountMaintainencesTab: null,
    showSidebar: true,
    sideMenu: false,
    sheet: false,
    group: null,
    benched: 10,
    validCreateProject: false,
    validCoordinator: false,
    validDonor: false,
    validRegion: false,
    validZone: false,
    validDistrict: false,
    validVillage: false,
    validSocialWorker: false,
    personalNameRules: [
      (v) => !!v || 'Name is required',
      (v) =>
        /^[A-z]([A-z/]+) ([A-z/]+) ([A-z/]+)$/gi.test(v) ||
        'Name must include father and grandfather name'
    ],
    nameRules: [
      (v) => !!v || 'Name is required',
      (v) => /^[A-z]([A-z/ ]+)*$/.test(v) || 'Name must be valid'
    ],
    requiredRule: [(v) => !!v || 'Item is required'],
    emailRules: [
      (v) => !!v || 'Email is required',
      (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        'Email must be valid'
    ],
    phoneNumberRules: [
      (v) => !!v || 'Phone Number is required',
      (v) => /^09[0-9]{8}$/.test(v) || 'Phone Number must be in 0945234576'
    ],
    showProject: false,
    showCoordinator: false,
    showDonor: false,
    showRegion: false,
    showZone: false,
    showDistrict: false,
    showPeasantAssociation: false,
    showSocialWorker: false,
    projectStartDateActivePicker: null,
    projectStartDate: null,
    projectStartDateMenu: false,
    projectNumber: null,
    projectDurationInYears: null,
    projectMaxBeneficiaries: null,
    projectTotalBudget: null,
    projectAdministrativeCost: null,
    projectProposalDialog: false,
    projectLocation: null,
    projectCoordinator: null,
    projectProposalFile: null,
    projectProposalPreview: null,
    coordinatorName: '',
    coordinatorEmail: '',
    coordinatorPassword: '',
    donorName: '',
    donorEmail: '',
    donorPassword: '',
    donorCoordinator: '',
    coordinatorsOptions: [],
    regionName: '',
    zoneName: '',
    zoneRegion: '',
    regionOptions: [],
    districtName: '',
    districtRegion: '',
    districtZone: '',
    zoneOptions: [],
    districtCoordinator: '',
    districtCoordinatorsOptions: [],
    districtDonors: [],
    villageName: '',
    villageDistrict: '',
    districts: [],
    coordinators: [
      'Adem Mohammed Ali',
      'Frost Abdela Belachew',
      'Biggy Abel Wendosen'
    ],
    socialWorkerFullName: '',
    socialWorkerGender: '',
    genderOptions: ['Male', 'Female'],
    socialWorkerEmail: '',
    socialWorkerBirthDate: '',
    socialWorkerBirthDateMenu: false,
    socialWorkerPhoneNumber: '',
    socialWorkerDistrict: '',
    socialWorkerDistricts: [],
    socialWorkerVillages: [],
    socialWorkerVillageOptions: [],
    socialWorkerDistrictDisabled: false,
    socialWorkerVillageDisabled: false,
    villages: [],
    allDistricts: [],
    showDonorTree: false,
    showCoordinatorTree: false,
    showSocialWorkerTree: false,
    // table View
    showDistrictTable: false,
    showRegionTable: false,
    showZoneTable: false,
    showVillageTable: false,
    // table loaders
    districtTableLoading: true,
    regionTableLoading: true,
    zoneTableLoading: true,
    villageTableLoading: true,
    // used in filter selection items
    searchDistrictTable: '',
    searchRegionTable: '',
    searchZoneTable: '',
    searchVillageTable: '',
    filterItems: [
      'Id',
      'District Name',
      'Region',
      'Gender',
      'Zone',
      'Peasant Associations'
    ],
    filterValue: [],
    regionTableFilterItems: [
      'Id',
      'Region Name',
      'Number of Zones',
      'Number of Districts'
    ],
    regionTableFilterValue: [],
    zoneTableFilterItems: ['Id', 'Zone Name', 'Region', 'Number of Districts'],
    zoneTableFilterValue: [],
    districtTableFilterItems: [
      'Id',
      'District Name',
      'Region',
      'Zone',
      'Number of PAs',
      'Number of Social Workers'
    ],
    districtTableFilterValue: [],
    villageTableFilterItems: [
      'Id',
      'Village Name',
      'District',
      'SocialWorker',
      'Number of Orphans'
    ],
    villageTableFilterValue: [],
    // used for filter selection
    // table headers if that wasn't clear enough LOL
    districtHeaders: [
      { text: 'Id', value: 'id' },
      {
        text: 'District Name',
        align: 'start',
        value: 'districtName'
      },
      {
        text: 'Region',
        value: 'region'
      },
      {
        text: 'Zone',
        value: 'zone'
      },
      {
        text: 'Number of PAs',
        value: 'numberOfPAs'
      },
      {
        text: 'Number of Social Workers',
        value: 'numberOfSocialWorkers'
      }
    ],
    regionHeaders: [
      { text: 'Id', value: 'id' },
      {
        text: 'Region Name',
        align: 'start',
        value: 'regionName'
      },
      {
        text: 'Number of Zones',
        value: 'numberOfZones'
      },
      {
        text: 'Number of Districts',
        value: 'numberOfDistricts'
      }
    ],
    zoneHeaders: [
      { text: 'Id', value: 'id' },
      {
        text: 'Zone Name',
        align: 'Start',
        value: 'zoneName'
      },
      {
        text: 'Region',
        value: 'region'
      },
      {
        text: 'Number of Districts',
        value: 'numberOfDistricts'
      }
    ],
    villageHeaders: [
      { text: 'Id', value: 'id' },
      {
        text: 'Village Name',
        align: 'Start',
        value: 'villageName'
      },
      {
        text: 'District',
        value: 'district'
      },
      {
        text: 'SocialWorker',
        value: 'socialWorker'
      },
      {
        text: 'Number of Orphans',
        value: 'numberOfOrphans'
      }
    ],
    head: {},
    headUser: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      role: ''
    },
    // table rows/items
    regionTable: [],
    districtTable: [],
    zoneTable: [],
    villageTable: [],
    // tree View
    activeDonorTree: [],
    donorsTree: [],
    activeCoordinatorTree: [],
    coordinatorsTree: [],
    activeSocialWorkerTree: [],
    socialWorkersTree: []
  }),
  created() {
    this.initializeHead();
    this.initializeAccountMaintainenceLists();
    // table
    this.initializeDistrictTable();
    this.initializeRegionTable();
    this.initializeZoneTable();
    this.initializeVillageTable();
    this.initializeCoordinatorSelect();
    this.initializeRegionSelect();
    this.initializeZoneSelect();
    this.initializeDistrictSelect();
    this.initializeVillageSelect();
    this.initializeAllDistricts();
  },
  computed: {
    // temporary filter for the notification panel
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1); // I don't know what this is doing exactly
    },
    length() {
      return 7000;
    },
    // used in donor tree view
    donorItems() {
      return [
        {
          id: 1,
          name: 'Donors',
          children: this.donorsTree
        }
      ];
    },
    selectedDonor() {
      if (!this.activeDonorTree.length) return undefined;

      const id = this.activeDonorTree[0];

      return this.donorsTree.find((donor) => donor.id === id);
    },
    coordinatorItems() {
      return [
        {
          id: 2,
          name: 'Coordinators',
          children: this.coordinatorsTree
        }
      ];
    },
    selectedCoordinator() {
      if (!this.activeCoordinatorTree.length) return undefined;

      const id = this.activeCoordinatorTree[0];

      return this.coordinatorsTree.find((coordinator) => coordinator.id === id);
    },
    socialWorkerItems() {
      return [
        {
          id: 3,
          name: 'SocialWorkers',
          children: this.socialWorkersTree
        }
      ];
    },
    selectedSocialWorker() {
      if (!this.activeSocialWorkerTree.length) return undefined;

      const id = this.activeSocialWorkerTree[0];

      return this.socialWorkersTree.find(
        (socialWorker) => socialWorker.id === id
      );
    },
    calcAge(dateOfBirth) {
      return (
        new Date().getUTCFullYear() -
        new Date(Date.parse(dateOfBirth.toString())).getUTCFullYear()
      );
    }
  },
  watch: {
    socialWorkerBirthDateMenu(val) {
      // console.log(this.$refs.picker);
      // console.log(
      //   val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"))
      // );
      // Changes the active picker from the default "DATE" to "YEAR"
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
    // #TODO - fix the bug in region selection changes which comes from changing the regoion frequently
    districtRegion(val) {
      if (val) {
        const region = this.regionOptions.filter(
          (region) => region.name === val
        );
        const regionId = parseInt(region[0].id);
        console.log('regionId', regionId);
        console.log('zoneOptions', this.zoneOptions);
        this.zoneOptions = this.zoneOptions.filter((zone) => {
          if (zone.region !== null) {
            return parseInt(zone.region.id) === regionId;
          }
        });
      }
    },
    socialWorkerDistrict(val) {
      this.socialWorkerVillageOptions.length = 0;

      if (val !== null) {
        this.socialWorkerVillageDisabled = true;
        this.socialWorkerDistrictDisabled = false;

        const district = this.districts.filter(
          (district) => district.name === val
        );

        if (district !== undefined) {
          // make this thing happen when the menu is triggered
          this.socialWorkerVillageOptions = this.villageTable.filter(
            (village) => {
              // remove one negative to make it village without districts
              return !!village.district;
              // return !!village;
            }
          );
        }
      } else {
        // this.socialWorkerDistrictDisabled = true;
        this.socialWorkerVillageDisabled = false;
      }
    },
    socialWorkerVillages(val) {
      console.log('villages', val);
      if (val.length !== 0) {
        this.socialWorkerDistrictDisabled = true;
        this.socialWorkerVillageDisabled = false;
      } else {
        // this.socialWorkerVillageDisabled = true;
        this.socialWorkerDistrictDisabled = false;
      }
    },
    projectStartDateMenu(val) {
      val && setTimeout(() => (this.projectStartDateActivePicker = 'YEAR'));
    }
  },
  methods: {
    ...mapMutations([
      'SET_SNACKBAR',
      'SET_SNACKBAR_COLOR',
      'SET_SNACKBAR_TEXT'
    ]),
    initializeHead() {
      axios
        .post('/graphql/', {
          query: `query head($id: ID!) {
                  head(id: $id) {
                    id
                    firstName
                    middleName
                    lastName
                    user {
                      id
                      email
                      role
                    }
                  }
                }`,
          variables: {
            id: this.$route.params.id
          }
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);

          return res.data.data.head;
        })
        .then((head) => {
          this.head = Object.assign({}, head);
          this.headUser = Object.assign(this.headUser, head.user);
          for (const property in this.headUser) {
            if (Object.hasOwnProperty.call(this.head, property)) {
              this.headUser[property] = head[property];
            }
          }
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          return console.error(err);
        });
    },
    calculateAge,
    resetPassword(item) {
      (async () => {
        const newPassword =
          item.user.role === 'Donor'
            ? `${item.companyName}${item.user.email.split('@')[0]}`
            : `${item.lastName}${item.user.email.split('@')[0]}`;
        const query = `
          mutation ($id: ID! $password: String){
            updateUser(id: $id password: $password){
              id
              password
            }
          }
        `;
        const queryOptions = {
          query,
          variables: {
            id: item.user.id,
            password: newPassword
          }
        };
        try {
          const resetPassword = await axios.post('/graphql', queryOptions);
          if (resetPassword.data.errors?.length)
            throw new Error(resetPassword.data.errors[0].message.message);
        } catch (error) {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(error);
        }
        this.donorPasswordResetConfirmationDialog = false;
        this.coordinatorPasswordResetConfirmationDialog = false;
        this.socialWorkerPasswordResetConfirmationDialog = false;
        this.infoDialogType = 'password reset';
        this.infoDialogOwner = item.user.role;
        this.infoDialogOwnerName =
          item.user.role == 'Donor'
            ? item.nameInitials
            : `${item.firstName} ${item.lastName}`;
        this.infoDialogOwnerEmail = item.user.email;
        this.infoDialogOwnerPassword = newPassword;

        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully reset the password for ${this.infoDialogOwnerName}`
        );

        this.infoDialog = true;
      })();
    },
    filteredAccountMaintainences(type, status) {
      return this.allAccountMaintainences.filter(
        (item) => item.type.includes(type) && item.status.includes(status)
      );
    },
    initializeAccountMaintainenceLists() {
      (async () => {
        try {
          const allAccountMaintainences = await axios.post('/graphql', {
            query: `
          query allAccountMaintainences {
            allAccountMaintainences {
              id
              type
              status
              role
              firstName
              middleName
              lastName
              email
              mobileNumber
              }
            }
          `
          });
          if (allAccountMaintainences.data.errors?.length) {
            throw new Error(
              allAccountMaintainences.data.errors[0].message.message
            );
          }
          this.allAccountMaintainences =
            allAccountMaintainences.data.data.allAccountMaintainences;
        } catch (error) {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(error);
        }
      })();
    },
    approveRequest(item) {
      (async () => {
        const queryOptions = {
          query: `
            mutation approveRequest($id: ID!) {
                        updateAccountMaintainence(id: $id status: approved){
                          id
                          }
                        }
                        `,
          variables: {
            id: item.id
          }
        };
        try {
          const approveRequestRes = await axios.post('/graphql', queryOptions);

          if (approveRequestRes.data.errors?.length) {
            throw new Error(approveRequestRes.data.errors[0].message.message);
          }
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('success');
          this.SET_SNACKBAR_TEXT('You have successfully approved the request.');
        } catch (error) {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(error);
        }
        this.initializeAccountMaintainenceLists();
      })();
    },
    rejectRequest(item) {
      (async () => {
        const queryOptions = {
          query: `
            mutation rejectRequest($id: ID!) {
                        updateAccountMaintainence(id: $id status: rejected){
                          id
                          }
                        }
                        `,
          variables: {
            id: item.id
          }
        };
        try {
          const rejectRequestRes = await axios.post('/graphql', queryOptions);

          if (rejectRequestRes.data.errors?.length) {
            throw new Error(rejectRequestRes.data.errors[0].message.message);
          }
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('success');
          this.SET_SNACKBAR_TEXT('You have successfully rejected the request.');
        } catch (error) {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(error);
        }
        this.initializeAccountMaintainenceLists();
      })();
    },
    socialWorkerBirthdateSave(date) {
      // console.log(this.$refs.menu);
      this.$refs.menu.save(date);
    },
    showProjectRegistration() {
      this.showProject = true;
      this.showCoordinator = false;
      this.showDonor = false;
      this.showRegion = false;
      this.showZone = false;
      this.showSocialWorker = false;
      this.showDistrict = false;
      this.showPeasantAssociation = false;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    showCoordinatorRegistration() {
      this.showProject = false;
      this.showCoordinator = true;
      this.showDonor = false;
      this.showRegion = false;
      this.showZone = false;
      this.showSocialWorker = false;
      this.showDistrict = false;
      this.showPeasantAssociation = false;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    showDonorRegistration() {
      this.showProject = false;
      this.showCoordinator = false;
      this.showDonor = true;
      this.showRegion = false;
      this.showZone = false;
      this.showSocialWorker = false;
      this.showDistrict = false;
      this.showPeasantAssociation = false;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    showRegionRegistration() {
      this.showProject = false;
      this.showCoordinator = false;
      this.showDonor = false;
      this.showRegion = true;
      this.showZone = false;
      this.showSocialWorker = false;
      this.showDistrict = false;
      this.showPeasantAssociation = false;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    showZoneRegistration() {
      this.showProject = false;
      this.showCoordinator = false;
      this.showDonor = false;
      this.showRegion = false;
      this.showZone = true;
      this.showSocialWorker = false;
      this.showDistrict = false;
      this.showPeasantAssociation = false;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    showSocialWorkerRegistration() {
      this.showProject = false;
      this.showCoordinator = false;
      this.showDonor = false;
      this.showRegion = false;
      this.showZone = false;
      this.showSocialWorker = true;
      this.showDistrict = false;
      this.showPeasantAssociation = false;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    showDistrictRegistration() {
      this.showProject = false;
      this.showCoordinator = false;
      this.showDonor = false;
      this.showRegion = false;
      this.showZone = false;
      this.showSocialWorker = false;
      this.showDistrict = true;
      this.showPeasantAssociation = false;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    showPeasantAssociationRegistration() {
      this.showProject = false;
      this.showCoordinator = false;
      this.showDonor = false;
      this.showRegion = false;
      this.showZone = false;
      this.showSocialWorker = false;
      this.showDistrict = false;
      this.showPeasantAssociation = true;
      // table
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // show menu
      this.sideMenu = false;
    },
    initializeCoordinatorSelect() {
      axios
        .post('/graphql', {
          query: `query {
                  allCoordinators {
                    id
                    firstName
                    middleName
                    lastName
                  }
                }`
        })
        .then((res) => {
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message.message);
          }
          return res.data.data.allCoordinators;
        })
        .then((res) => this.coordinatorsOptions.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    initializeRegionSelect() {
      axios
        .post('/graphql', {
          query: `query {
                  allRegions {
                    id
                    name
                  }
                }`
        })
        .then((res) => {
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message.message);
          }
          return res.data.data.allRegions;
        })
        .then((res) => this.regionOptions.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    initializeZoneSelect() {
      axios
        .post('/graphql/', {
          query: `query {
                    allZones {
                      id
                      name
                      region {
                        id
                      }
                    }
                  }`
        })
        .then((res) => {
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message.message);
          }
          return res.data.data.allZones;
        })
        .then((res) => this.zoneOptions.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    initializeDistrictSelect() {
      axios
        .post('/graphql/', {
          query: `query {
                  allDistricts {
                    id
                    name
                    villages {
                      id
                      name
                    }
                  }
                }`
        })
        .then((res) => {
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message.message);
          }
          return res.data.data.allDistricts;
        })
        .then((res) => this.districts.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    initializeVillageSelect() {
      axios
        .post('/graphql/', {
          query: `query {
                  allVillages {
                    id
                    name
                  }
                }`
        })
        .then((res) => {
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message.message);
          }
          return res.data.data.allVillages;
        })
        .then((res) => this.villages.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    initializeAllDistricts() {
      return axios
        .post('/graphql/', {
          query: `query {
                    allDistricts {
                      id
                      name
                      villages {
                        id
                        name
                      }
                    }
                  }`
        })
        .then((res) => res.data.data.allDistricts)
        .then((allDistricts) => (this.allDistricts = [...allDistricts]))
        .catch((err) => console.warn(err));
    },
    // selet text and values
    coordinatorText_Value(item) {
      return `${item.firstName} ${item.middleName} ${item.lastName}`;
    },
    regionText_Value(item) {
      return `${item.name}`;
    },
    zoneText_Value(item) {
      return `${item.name}`;
    },
    donorText_Value(item) {
      return `${item.nameInitials}`;
    },
    districtText_Value(item) {
      return `${item.name}`;
    },
    villageText_Value(item) {
      return `${item.name}`;
    },
    toggleProjectProposalInput() {
      if (this.projectProposalFile) {
        this.projectProposalPreview = URL.createObjectURL(
          this.projectProposalFile
        );
        console.log('Preview', this.projectProposalPreview);
      }
    },
    // menu save and cancel

    async registerUser(role, email, pwd) {
      return await axios
        .post('/graphql', {
          query: `mutation register ($role: userRoles!, $email: String!, $password: String!) {
                      register (
                        role: $role
                        email: $email
                        password: $password
                      ) {
                        user {
                          id 
                          role
                          password
                        }
                      }
                    }`,
          variables: {
            role: String(role),
            email: String(email),
            password: String(pwd)
          }
        })
        .then((res) => {
          if (res.data.errors?.length) {
            throw new Error(res.data.errors[0].message.message);
          }
          return res.data.data.register.user;
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          if (String(err).startsWith('Error: Unique'))
            this.SET_SNACKBAR_TEXT(
              'There is another account with that email. Try using another email.'
            );
          else
            this.SET_SNACKBAR_TEXT(
              'Server error. Reload the page and try again.'
            );
          console.error(err);
        });
    },
    async createCoordinator(firstName, middleName, lastName, userId) {
      return await axios
        .post('/graphql/', {
          query: `mutation createCoordinator ($firstName: String!, $middleName: String!, $lastName: String!, $userId: ID!) {
                  createCoordinator (
                    firstName: $firstName
                    middleName: $middleName
                    lastName: $lastName
                    userId: $userId
                  ) {
                    id
                    firstName
                    middleName
                    lastName
                    user{
                      id 
                      role
                      email
                    }
                  }
                }`,
          variables: {
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            userId: parseInt(userId)
          }
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.createCoordinator;
        })
        .then((res) => console.log(res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async createDonor(companyName, nameInitials, userId, coordinatorId) {
      return await axios
        .post('/graphql/', {
          query: `mutation createDonor (
                  $companyName: String!, 
                  $nameInitials: String!, 
                  $userId: ID!, 
                  $coordinators: [ID]
                  ) {
                  createDonor(
                    companyName: $companyName
                    nameInitials: $nameInitials
                    userId: $userId
                    coordinators: $coordinators
                  ) {
                    id
                    companyName
                    nameInitials
                    user{
                      id
                      role
                      email
                    }
                  }
                }`,
          variables: {
            companyName: companyName,
            nameInitials: nameInitials,
            userId: userId,
            coordinators: coordinatorId
          }
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.createDonor;
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async createRegion(regionName) {
      return await axios
        .post('/graphql/', {
          query: `mutation createRegion($regionName: String!) {
                  createRegion(
                    name: $regionName
                  ) {
                    id
                    name
                  }
                }`,
          variables: {
            regionName: regionName
          }
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.createRegion;
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async createZone(zoneName, regionId) {
      return await axios
        .post('/graphql/', {
          query: `mutation createZone($zoneName: String!, $regionId: ID!) {
                  createZone(name: $zoneName, regionId: $regionId) {
                    id
                    name
                    region {
                      name
                    }
                  }
                }`,
          variables: {
            zoneName: zoneName,
            regionId: regionId
          }
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.createZone;
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async createDistrict(districtName, zoneId) {
      return await axios
        .post('/graphql/', {
          query: `mutation createDistrict(
                    $districtName: String!
                    $zoneId: ID!
                  ) {
                    createDistrict(
                      name: $districtName
                      zoneId: $zoneId
                    ) {
                      id
                      name
                      zone {
                        region {
                          name
                        }
                      }
                    }
                  }`,
          variables: {
            districtName: districtName,
            zoneId: zoneId
          }
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.createDistrict;
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async createVillage(villageName, districtId) {
      let variables = null;

      if (districtId === undefined) {
        variables = {
          villageName
        };
      } else {
        variables = {
          villageName,
          districtId
        };
      }
      return await axios
        .post('/graphql/', {
          query: `mutation createVillage(
                    $villageName: String
                    $districtId: ID
                  ) {
                    createVillage(
                      name: $villageName
                      districtId: $districtId
                    ) {
                      id
                      name
                    }
                  }`,
          variables: variables
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.createVillage;
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async createSocialWorker(
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      mobileNumber,
      startDate,
      userId,
      districtIds,
      villageIds
    ) {
      return await axios
        .post('/graphql/', {
          query: `mutation createSocialWorker(
                    $firstName: String!
                    $middleName: String!
                    $lastName: String!
                    $gender: socialWorkerGender
                    $dateOfBirth: DateTime
                    $mobileNumber: String!
                    $startDate: DateTime
                    $userId: ID!
                    $districts: [ID]
                    $villages: [ID]
                  ) {
                    createSocialWorker(
                      firstName: $firstName
                      middleName: $middleName
                      lastName: $lastName
                      gender: $gender
                      dateOfBirth: $dateOfBirth
                      mobileNumber: $mobileNumber
                      startDate: $startDate
                      userId: $userId
                      districts: $districts
                      villages: $villages
                    ) {
                      id
                      firstName
                      middleName
                      lastName
                      user {
                        id
                        role
                      }
                      districts {
                        id
                      }
                    }
                  }`,
          variables: {
            firstName: String(firstName),
            middleName: String(middleName),
            lastName: String(lastName),
            gender: String(gender),
            dateOfBirth: String(dateOfBirth),
            mobileNumber: String(mobileNumber),
            startDate: String(startDate),
            userId: userId,
            districts: districtIds,
            villages: villageIds
          }
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.createSocialWorker;
        })
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },

    async createProjectSave() {
      if (this.$refs.createProjectForm.validate()) {
        const startDate = new Date(this.projectStartDate).toISOString();

        let tempDate = new Date(startDate);
        const endDate = new Date(
          tempDate.setFullYear(
            tempDate.getFullYear() + parseInt(this.projectDurationInYears)
          )
        ).toISOString();

        // check if the entered number is dublicate by using allProjects
        // even better make it auto increment automatically
        // projectNumber

        const selectedDistrict = this.allDistricts
          .filter((district) => {
            return district.name === this.projectLocation;
          })
          .map((district) => district.id);

        let locations = this.allDistricts.map((district) => {
          if ((district.id = selectedDistrict[0])) {
            return district.villages;
          }
        });

        locations = locations.map((villages) =>
          villages.map((village) => village.id)
        )[0];

        const coordinators = this.coordinatorsOptions
          .filter((coordinator) => {
            return (
              coordinator.firstName +
                ' ' +
                coordinator.middleName +
                ' ' +
                coordinator.lastName ===
              this.projectCoordinator
            );
          })
          .map((coordinator) => coordinator.id);

        console.log(coordinators);

        // const coordinatorId = parseInt(coordinator[0].id);
        // const projectProposalUrl = 'qwertyuiop';

        const projectProposalFormData = new FormData();
        projectProposalFormData.append(
          'projectDocument',
          this.projectProposalFile,
          this.projectProposalFile.name
        );

        const projectProposalUrl = await axios
          .post(`/public/images/projectDocument/`, projectProposalFormData)
          .then((res) => res.data)
          .catch((err) => console.warn(err));

        const project = await this.createProject(
          this.projectNumber,
          startDate,
          endDate,
          parseInt(this.projectMaxBeneficiaries),
          parseInt(this.projectDurationInYears),
          locations,
          parseFloat(this.projectTotalBudget),
          parseFloat(this.projectAdministrativeCost),
          coordinators
        );

        await this.createProjectDocuments(
          projectProposalUrl,
          'proposal',
          project.id
        );

        this.$refs.createProjectForm.reset();
        this.createProjectDialog = false;
      }
    },

    createProject(
      number,
      startDate,
      endDate,
      maximumNumberOfBeneficiaries,
      durationInYears,
      location,
      grandTotalBudget,
      administrativeCost,
      coordinators
    ) {
      return axios
        .post('/graphql/', {
          query: `mutation createProject (
                  $number: String!
                  $startDate: DateTime
                  $endDate: DateTime
                  $maximumNumberOfBeneficiaries: Int!
                  $durationInYears: Int!
                  $location: [ID]!
                  $grandTotalBudget: Float!
                  $administrativeCost: Float!
                  $coordinators: [ID]
                ) {
                  createProject (
                    number: $number
                    startDate: $startDate
                    endDate: $endDate
                    maximumNumberOfBeneficiaries: $maximumNumberOfBeneficiaries
                    durationInYears: $durationInYears
                    location: $location
                    grandTotalBudget: $grandTotalBudget
                    administrativeCost: $administrativeCost
                    coordinators: $coordinators
                  ) {
                    id
                  }
                }`,
          variables: {
            number: number,
            startDate: startDate,
            endDate: endDate,
            maximumNumberOfBeneficiaries: maximumNumberOfBeneficiaries,
            durationInYears: durationInYears,
            location: location,
            grandTotalBudget: grandTotalBudget,
            administrativeCost: administrativeCost,
            coordinators: coordinators
          }
        })
        .then((res) => res.data.data.createProject)
        .catch((err) => console.warn(err));
    },

    async createProjectDocuments(documentUrl, documentType, projectId) {
      return axios
        .post('/graphql/', {
          query: `mutation createProjectDocument (
                  $documentUrl: String!
                  $documentType: projectDocumentType!
                  $projectId: ID!
                ) {
                  createProjectDocument (
                    documentUrl: $documentUrl
                    documentType: $documentType
                    projectId: $projectId
                  ) {
                    id
                    documentType
                  }
                }`,
          variables: {
            documentUrl: documentUrl,
            documentType: documentType,
            projectId: projectId
          }
        })
        .then((res) => res.data.data.createProjectDocuments)
        .catch((err) => console.warn(err));
    },

    createProjectCancel() {
      this.$refs.createProjectForm.reset();
      this.createProjectDialog = false;
    },

    async coordinatorSave() {
      // console.log(this.$refs.coordinatorForm.$children[0]);
      if (this.$refs.coordinatorForm.validate()) {
        const names = this.coordinatorName.split(' ');
        const firstName = names[0];
        const middleName = names[1];
        const lastName = names[2];
        const password = `${lastName}${this.coordinatorEmail.split('@')[0]}`;
        const user = await this.registerUser(
          'Coordinator',
          this.coordinatorEmail,
          password
        );
        const userId = parseInt(user.id);
        // const coordinator =
        await this.createCoordinator(firstName, middleName, lastName, userId);
        // console.log("coordinator", coordinator);
        this.infoDialogOwner = 'Coordinator';
        this.infoDialogOwnerName = `${firstName} ${middleName} ${lastName}`;
        this.infoDialogOwnerEmail = this.coordinatorEmail;
        this.infoDialogOwnerPassword = password;
        this.$refs.coordinatorForm.reset();
        this.infoDialog = true;
        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully created a ${this.infoDialogOwner} account.`
        );
        this.initializeCoordinatorSelect();
      }
    },
    coordinatorCancel() {
      this.sideMenu = true;
      this.$refs.coordinatorForm.reset();
    },
    async donorSave() {
      if (this.$refs.donorForm.validate()) {
        let nameInitials = '';
        let splitName = this.donorName.trim().split(' ');
        if (splitName.length === 1) {
          nameInitials =
            splitName[0].slice(0, 1).toUpperCase() +
            splitName[0].slice(splitName[0].length - 1).toUpperCase();
        } else {
          for (const namePart of splitName) {
            nameInitials += namePart.slice(0, 1).toUpperCase();
          }
        }
        const coordinator = this.coordinatorsOptions.filter((coordinator) => {
          return (
            coordinator.firstName +
              ' ' +
              coordinator.middleName +
              ' ' +
              coordinator.lastName ===
            this.donorCoordinator
          );
        });
        const coordinatorId = parseInt(coordinator[0].id);
        const password = `${this.donorName}${this.donorEmail.split('@')[0]}`;
        const user = await this.registerUser(
          'Donor',
          this.donorEmail,
          password
        );
        const userId = parseInt(user.id);
        await this.createDonor(
          this.donorName,
          nameInitials,
          userId,
          coordinatorId
        );
        this.infoDialogOwner = 'Donor';
        this.infoDialogOwnerName = this.donorName;
        this.infoDialogOwnerEmail = this.donorEmail;
        this.infoDialogOwnerPassword = password;
        this.$refs.donorForm.reset();
        this.infoDialog = true;
        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully created a ${this.infoDialogOwner} account.`
        );
      }
    },
    donorCancel() {
      this.sideMenu = true;
      this.$refs.donorForm.reset();
    },
    async regionSave() {
      if (this.$refs.regionForm.validate()) {
        const region = await this.createRegion(this.regionName);
        this.$refs.regionForm.reset();
        this.showRegion = false;
        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully created ${region.name} region.`
        );
        this.initializeRegionTable();
      }
    },
    regionCancel() {
      this.sideMenu = true;
      this.$refs.regionForm.reset();
    },
    async zoneSave() {
      if (this.$refs.zoneForm.validate()) {
        const region = this.regionOptions.filter(
          (region) => region.name === this.zoneRegion
        );
        const regionId = region[0].id;
        const zone = await this.createZone(this.zoneName, regionId);
        this.$refs.zoneForm.reset();
        this.showZone = false;
        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully created ${zone.name} zone.`
        );
        this.initializeZoneTable();
      }
    },
    zoneCancel() {
      this.sideMenu = true;
      this.$refs.zoneForm.reset();
    },
    async districtSave() {
      if (this.$refs.districtForm.validate()) {
        const zone = this.zoneOptions.filter(
          (zone) => zone.name === this.districtZone
        );
        const zoneId = zone[0].id;

        const district = await this.createDistrict(this.districtName, zoneId);
        this.$refs.districtForm.reset();
        this.showDistrict = false;
        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully created ${district.name} district.`
        );
        this.initializeDistrictTable();
      }
    },
    districtCancel() {
      this.sideMenu = true;
      this.$refs.districtForm.reset();
    },
    async villageSave() {
      if (this.$refs.villageForm.validate()) {
        let districtId = undefined;
        if (this.villageDistrict) {
          const district = this.districts.filter(
            (district) => district.name === this.villageDistrict
          );
          districtId = district[0].id;
        }

        const village = await this.createVillage(this.villageName, districtId);
        this.$refs.villageForm.reset();
        this.showPeasantAssociation = false;
        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully created ${village.name} village.`
        );
        this.initializeVillageTable();
      }
    },
    villageCancel() {
      this.sideMenu = true;
      this.$refs.villageForm.reset();
    },
    async socialWorkerSave() {
      if (this.$refs.socialWorkerForm.validate()) {
        const nameSplit = this.socialWorkerFullName.split(' ');
        const firstName = nameSplit[0];
        const middleName = nameSplit[1];
        const lastName = nameSplit[2];
        const password = `${lastName}${this.socialWorkerEmail.split('@')[0]}`;
        const user = await this.registerUser(
          'SocialWorker',
          this.socialWorkerEmail,
          password
        );
        const userId = parseInt(user.id);
        const gender = this.socialWorkerGender.slice(0, 1).toUpperCase();
        const socialWorkerBirthDate = new Date(
          Date.parse(this.socialWorkerBirthDate)
        ).toISOString();
        const socialWorkerStartDate = new Date().toISOString();

        const district = this.districts.filter(
          (district) => district.name === this.socialWorkerDistrict
        );
        const districtIds = district.map((val) => parseInt(val.id));

        const villages = this.socialWorkerVillageOptions.filter((village) => {
          for (const vlg of this.socialWorkerVillages) {
            return vlg === village.name;
          }
        });
        const villageIds = villages.map((val) => val.id);
        console.log(this.socialWorkerVillages);
        console.log(villageIds);

        await this.createSocialWorker(
          firstName,
          middleName,
          lastName,
          gender,
          socialWorkerBirthDate,
          this.socialWorkerPhoneNumber,
          socialWorkerStartDate,
          userId,
          districtIds,
          villageIds
        );
        this.infoDialogOwner = 'Social Worker';
        this.infoDialogOwnerName = `${firstName} ${middleName} ${lastName}`;
        this.infoDialogOwnerEmail = this.socialWorkerEmail;
        this.infoDialogOwnerPassword = password;
        this.$refs.socialWorkerForm.reset();
        this.infoDialog = true;
        this.showSocialWorker = false;
        this.SET_SNACKBAR(true);
        this.SET_SNACKBAR_COLOR('success');
        this.SET_SNACKBAR_TEXT(
          `You have successfully created a ${this.infoDialogOwner} account.`
        );
      }
    },
    socialWorkerCancel() {
      this.sideMenu = true;
      this.$refs.socialWorkerForm.reset();
    },

    // used in table view
    initializeDistrictTable() {
      if (this.districtTable.length > 0) this.districtTable.length = 0;
      axios
        .post('/graphql/', {
          query: `query {
                    allDistricts {
                      id
                      name
                      zone {
                        name
                        region{
                          name
                        }
                      }
                      villages {
                        name
                      }
                      socialWorkers {
                        id
                      }
                    }
                  }`
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.allDistricts;
        })
        .then((res) => this.districtTable.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    initializeRegionTable() {
      if (this.regionTable.length > 0) this.regionTable.length = 0;
      return (
        axios
          .post(
            '/graphql/',
            {
              query: `query {
                  allRegions {
                    id
                    name
                    zones {
                      id
                      districts {
                        id
                      }
                    }
                  }
                }`
            }
            // {
            //   withCredentials: true,
            // }
          )
          // .then((res) => console.log(res))
          .then((res) => {
            if (res.data.errors?.length)
              throw new Error(res.data.errors[0].message.message);
            return res.data.data.allRegions;
          })
          .then((res) => this.regionTable.push(...res))
          .catch((err) => {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR('error');
            this.SET_SNACKBAR_TEXT(
              'Server error. Reload the page and try again.'
            );
            console.error(err);
          })
      );
    },
    initializeZoneTable() {
      if (this.zoneTable.length > 0) this.zoneTable.length = 0;
      return axios
        .post('/graphql/', {
          query: `query {
                  allZones {
                    id
                    name
                    region {
                      name
                    }
                    districts {
                      name
                    }
                  }
                }`
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.allZones;
        })
        .then((res) => this.zoneTable.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    initializeVillageTable() {
      if (this.villageTable.length > 0) this.villageTable.length = 0;
      return (
        axios
          .post('/graphql', {
            query: `query {
                  allVillages {
                    id
                    name
                    district {
                      name
                    }
                    socialWorker{
                      id
                      firstName
                      middleName
                      lastName
                    }
                    orphans {
                      id
                    }
                  }
                }`
          })
          // .then(res => console.log("villages", res))
          .then((res) => {
            if (res.data.errors?.length)
              throw new Error(res.data.errors[0].message.message);
            return res.data.data.allVillages;
          })
          .then((res) => this.villageTable.push(...res))
          .catch((err) => {
            this.SET_SNACKBAR(true);
            this.SET_SNACKBAR_COLOR('error');
            this.SET_SNACKBAR_TEXT(
              'Server error. Reload the page and try again.'
            );
            console.error(err);
          })
      );
    },

    // district table
    getDistrictTableId(item) {
      return item.id;
    },
    getDistrictTableDistrictName(item) {
      return item.name;
    },
    getDistrictTableRegion(item) {
      return item.zone.region.name;
    },
    getDistrictTableZone(item) {
      return item.zone.name;
    },
    getDistrictTableNumberOfVillage(item) {
      return item.villages.length;
    },
    getDistrictTableNumberOfSocialWorkers(item) {
      return item.socialWorkers.length;
    },
    // region table
    getRegionTableId(item) {
      return item.id;
    },
    getRegionTableRegionName(item) {
      return item.name;
    },
    getRegionTableNumberOfZones(item) {
      return item.zones.length;
    },
    getRegionTableNumberOfDistricts(item) {
      let numberOfDistricts = 0;
      for (const zone of item.zones) {
        numberOfDistricts += zone.districts.length;
      }
      return numberOfDistricts;
    },
    // zone table
    getZoneTableId(item) {
      return item.id;
    },
    getZoneTableZoneName(item) {
      return item.name;
    },
    getZoneTableRegion(item) {
      if (item.region === null) return '';
      return item.region.name;
    },
    getZoneTableNumberOfDistricts(item) {
      return item.districts.length;
    },
    // village table
    getVillageTableId(item) {
      return item.id;
    },
    getVillageTableVillageName(item) {
      return item.name;
    },
    getVillageTableDistrict(item) {
      if (item.district === null) return '';
      return item.district.name;
    },
    getVillageTableSocialWorker(item) {
      if (item.socialWorker === null) return 'N/A';
      return (
        item.socialWorker.firstName +
        ' ' +
        item.socialWorker.middleName +
        ' ' +
        item.socialWorker.lastName
      );
    },
    getVillageTableNumberOfOrphans(item) {
      return item.orphans.length;
    },
    projectStartDateSave(date) {
      this.$refs.projectStartDateMenu.save(date);
    },
    toggleProjectProposalDialog() {
      this.projectProposalDialog = !this.projectProposalDialog;
    },
    // custom search function based on selected columns
    // TODO: do MultipleFilter
    searchRegionTableFilter(value, search, item) {
      console.log(value);
      if (search.length > 0) {
        if (this.regionTableFilterValue.length > 0) {
          for (const filterVal of this.regionTableFilterValue) {
            if (filterVal === this.regionHeaders[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.regionHeaders[1].text) {
              return (
                item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.regionHeaders[2].text) {
              return parseInt(item.zones.length) === parseInt(search);
            } else if (filterVal === this.regionHeaders[3].text) {
              let numberOfDistricts = 0;
              for (const zone of item.zones) {
                numberOfDistricts += zone.districts.length;
              }
              return parseInt(numberOfDistricts) === parseInt(search);
            }
          }
        } else {
          return (
            item.name != null &&
            typeof item.name === 'string' &&
            item.name
              .toString()
              .toLowerCase()
              .indexOf(search.toLowerCase()) !== -1
          );
        }
      }
    },
    searchZoneTableFilter(value, search, item) {
      console.log(item);
      if (search.length > 0) {
        if (this.zoneTableFilterValue.length > 0) {
          for (const filterVal of this.zoneTableFilterValue) {
            if (filterVal === this.zoneHeaders[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.zoneHeaders[1].text) {
              return (
                item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.zoneHeaders[2].text) {
              return (
                item.region.name.toLowerCase().indexOf(search.toLowerCase()) !==
                -1
              );
            } else if (filterVal === this.zoneHeaders[3].text) {
              return parseInt(item.districts.length) === parseInt(search);
              // TODO # fix it to be visible as stacked avatars
            }
          }
        } else {
          return (
            item.name != null &&
            typeof item.name === 'string' &&
            item.name
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
    },
    searchDistrictTableFilter(value, search, item) {
      console.log('Value: ' + value);
      if (search.length > 0) {
        if (this.districtTableFilterValue.length > 0) {
          for (const filterVal of this.districtTableFilterValue) {
            if (filterVal === this.districtHeaders[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.districtHeaders[1].text) {
              return (
                item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.districtHeaders[2].text) {
              return (
                item.zone.region.name
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.districtHeaders[3].text) {
              return (
                item.zone.name.toLowerCase().indexOf(search.toLowerCase()) !==
                -1
              );
            } else if (filterVal === this.districtHeaders[4].text) {
              return parseInt(item.villages.length) === parseInt(search);
            } else if (filterVal === this.districtHeaders[5].text) {
              return parseInt(item.socialWorkers.length) === parseInt(search);
            }
            // else if (filterVal === this.districtHeaders[6].text) {
            //   let coordinatorName = `${item.coordinator.firstName} ${item.coordinator.middleName} ${item.coordinator.lastName}`;
            //   return (
            //     coordinatorName.toLowerCase().indexOf(search.toLowerCase()) !==
            //     -1
            //   );
            // }
          }
        } else {
          return (
            item.name != null &&
            typeof item.name === 'string' &&
            item.name
              .toString()
              .toLowerCase()
              .indexOf(search.toLowerCase()) !== -1
          );
        }
      }
    },
    searchVillageTableFilter(value, search, item) {
      console.log(item);
      // console.log(this.filterValue);
      if (search.length > 0) {
        if (this.villageTableFilterValue.length > 0) {
          for (const filterVal of this.villageTableFilterValue) {
            if (filterVal === this.villageHeaders[0].text) {
              return item.id.indexOf(search) !== -1;
            } else if (filterVal === this.villageHeaders[1].text) {
              return (
                item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
              );
            } else if (filterVal === this.villageHeaders[2].text) {
              return (
                item.district.name
                  .toLowerCase()
                  .indexOf(search.toLowerCase()) !== -1
              );
            }
            // TODO # fix it to be visible as stacked avatars
            else if (filterVal === this.villageHeaders[5].text) {
              let socialWorkerName = `${item.socialWorker.firstName} ${item.socialWorker.middleName} ${item.socialWorker.lastName}`;
              return (
                socialWorkerName.toLowerCase().indexOf(search.toLowerCase()) !==
                -1
              );
            } else if (filterVal === this.villageHeaders[6].text) {
              return parseInt(item.orphans.length) === parseInt(search);
            }
          }
        } else {
          return (
            item.name != null &&
            typeof item.name === 'string' &&
            item.name
              .toString()
              .toLowerCase()
              .indexOf(search) !== -1
          );
        }
      }
    },
    toogleRegionsTable() {
      if (this.showRegionTable === false) {
        this.regionTableLoading = false;
      } else {
        this.regionTableLoading = true;
      }
      this.showRegionTable = !this.showRegionTable;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
    },
    toogleDistrictTable() {
      if (this.showDistrictTable === false) {
        this.districtTableLoading = false;
      } else {
        this.districtTableLoading = true;
      }
      this.showDistrictTable = !this.showDistrictTable;
      this.showRegionTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
    },
    toogleZoneTable() {
      if (this.showZoneTable === false) {
        this.zoneTableLoading = false;
      } else {
        this.zoneTableLoading = true;
      }
      this.showZoneTable = !this.showZoneTable;
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showVillageTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
    },
    toogleVillageTable() {
      if (this.showVillageTable === false) {
        this.villageTableLoading = false;
      } else {
        this.villageTableLoading = true;
      }
      this.showVillageTable = !this.showVillageTable;
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      // tree Views
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
    },
    // used in donor tree view
    toogleDonorTree() {
      this.showDonorTree = !this.showDonorTree;
      this.showCoordinatorTree = false;
      this.showSocialWorkerTree = false;
      // tables
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
    },
    toogleCoordinatorTree() {
      this.showCoordinatorTree = !this.showCoordinatorTree;
      this.showDonorTree = false;
      this.showSocialWorkerTree = false;
      // tables
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
    },
    toogleSocialWorkerTree() {
      this.showSocialWorkerTree = !this.showSocialWorkerTree;
      this.showDonorTree = false;
      this.showCoordinatorTree = false;
      // tables
      this.showRegionTable = false;
      this.showDistrictTable = false;
      this.showZoneTable = false;
      this.showVillageTable = false;
    },
    async fetchDonors(item) {
      return axios
        .post('/graphql/', {
          query: `query {
                getAllDonors {
                  id
                  companyName
                  nameInitials
                  coordinators {
                    firstName
                    middleName
                    lastName
                  }
                  user {
                    id
                    email
                    role
                  }
                  orphans {
                    id
                    firstName
                  }
                  supportPlans {
                    id
                    startDate
                  }
                }
              }`
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.getAllDonors;
        })
        .then((res) => item.children.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async fetchCoordinators(item) {
      return axios
        .post('/graphql/', {
          query: `query {
                  allCoordinators {
                    id
                    firstName
                    middleName
                    lastName
                    user {
                      id
                      email
                      role
                    }
                    donors {
                      id
                      nameInitials
                    }
                  }
                }`
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.allCoordinators;
        })
        .then((res) => item.children.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    async fetchSocialWorkers(item) {
      return axios
        .post('/graphql/', {
          query: `query {
                  allSocialWorkers {
                    id
                    firstName
                    middleName
                    lastName
                    gender
                    dateOfBirth
                    mobileNumber
                    startDate
                    endDate
                    user {
                      id
                      email
                      role
                    }
                    districts {
                      name
                    }
                    orphans {
                      id
                    }
                  }
                }`
        })
        .then((res) => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          return res.data.data.allSocialWorkers;
        })
        .then((res) => item.children.push(...res))
        .catch((err) => {
          this.SET_SNACKBAR(true);
          this.SET_SNACKBAR_COLOR('error');
          this.SET_SNACKBAR_TEXT(
            'Server error. Reload the page and try again.'
          );
          console.error(err);
        });
    },
    removeSelectedRegion(item) {
      this.regionTableFilterValue.splice(
        this.regionTableFilterValue.indexOf(item),
        1
      );
      this.regionTableFilterValue = [...this.regionTableFilterValue];
    },
    removeSelectedZone(item) {
      this.zoneTableFilterValue.splice(
        this.zoneTableFilterValue.indexOf(item),
        1
      );
      this.zoneTableFilterValue = [...this.zoneTableFilterValue];
    },
    removeSelectedDistrict(item) {
      this.districtTableFilterValue.splice(
        this.districtTableFilterValue.indexOf(item),
        1
      );
      this.districtTableFilterValue = [...this.districtTableFilterValue];
    },
    removeSelectedVillage(item) {
      this.villageTableFilterValue.splice(
        this.villageTableFilterValue.indexOf(item),
        1
      );
      this.villageTableFilterValue = [...this.villageTableFilterValue];
    },
    test() {}
  }
};
</script>
