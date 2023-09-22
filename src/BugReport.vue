<template>
    <div class="bug-report-modal-container">
        <b-modal
            id="bug-report-modal"
            centered
            :hide-footer="true"
            dialog-class="bug-report-modal-dialog"
            @hidden="onHidden"
        >
            <template
                #modal-title
            >
                <div class="text-center font-weight-bold pt-2">
                    Report an issue
                </div>
            </template>

            <b-row class="mb-3">
                <b-col
                    cols="3"
                >
                    <label class="font-weight-bold mt-2 pt-1">Priority</label>
                </b-col>
                <b-col>
                    <b-form-select
                        v-model="bug.priority"
                        :options="options"
                        size="lg"
                        class="text-primary border-0"
                    ></b-form-select>
                </b-col>
            </b-row>

            <b-row class="mb-3">
                <b-col>
                    <b-form-input
                        v-model.trim="$v.bug.title.$model"
                        :class="{ 'is-invalid': $v.bug.title.$error }"
                        placeholder="Title"
                    >
                    </b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <b-form-textarea
                        v-model.trim="$v.bug.current.$model"
                        placeholder="Current/Issue:"
                        rows="4"
                        max-rows="6"
                        class="mb-3"
                        :class="{ 'is-invalid': $v.bug.current.$error }"
                    ></b-form-textarea>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <b-form-textarea
                        v-model.trim="$v.bug.expected.$model"
                        placeholder="Expected"
                        rows="4"
                        max-rows="6"
                        class="mb-3"
                        :class="{ 'is-invalid': $v.bug.expected.$error }"
                    ></b-form-textarea>
                </b-col>
            </b-row>

            <b-row class="mb-3">
                <b-col>
                    <label>Screen shot</label>
                </b-col>
                <div class="w-100"></div>
                <b-col
                    v-for="(screenshot, index) in screenshots"
                    :key="index"
                    cols="3"
                    class="position-relative"
                >
                    <b-icon
                        icon="x-circle"
                        variant="secondary"
                        class="delete-screenshot position-absolute cursor-pointer"
                        @click="deleteScreenShot(index)"
                    ></b-icon>

                    <b-img
                        class="screenshot w-100"
                        :src="screenshot"
                    />
                </b-col>
                <b-col
                    cols="3"
                >
                    <b-icon
                        v-if="bug.files.length === 0"
                        icon="plus-circle-fill"
                        variant="secondary"
                        style="width: 32px; height: 32px;"
                        @click="showFileChooser"
                    ></b-icon>

                    <input
                        ref="fileInput"
                        type="file"
                        name="image"
                        accept="image/*"
                        style="display:none;"
                        @change="setImage"
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col
                    cols="12"
                    class="text-center"
                >
                    <b-button
                        size="lg"
                        class="button-blue"
                        block
                        @click="submit()"
                    >
                        Submit
                    </b-button>
                </b-col>
            </b-row>
        </b-modal>
    </div>
</template>

<script>
import _ from "lodash";
import {required} from "vuelidate/lib/validators";

export default {
    name: "BugCreateModal",
    props: {
        reporter: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            saving: null,
            bug: {
                title: null,
                priority: "normal",
                current: null,
                expected: null,
                files: []
            },
            options: [
                {
                    value: null,
                    text: "Select"
                },
                {
                    value: "high",
                    text: "high"
                },
                {
                    value: "normal",
                    text: "normal"
                }
            ],
            screenshots: []
        };
    },
    created() {
    },
    mounted() {
        this.takeScreenshot();
        this.open();
    },
    validations: {
        bug: {
            title: {
                required
            },
            expected: {
                required
            },
            current: {
                required
            }
        }
    },
    methods: {
        reset() {
            this.bug = {
                title: null,
                priority: "normal",
                current: null,
                expected: null,
                files: []
            };
        },
        onHidden() {
            this.$emit("close-modal");
        },
        open() {
            this.reset();
            this.$bvModal.show("bug-report-modal");
        },
        close() {
            this.reset();
            this.$bvModal.hide("bug-report-modal");
        },
        showFileChooser() {
            this.$refs.fileInput.click();
        },
        setImage(e) {
            const file = e.target.files[0];

            if (file.type.indexOf("image/") === -1) {
                return;
            }

            this.bug.files.push(file);
            this.screenshots.push(URL.createObjectURL(file));
        },
        deleteScreenShot(index) {
            this.bug.files.splice(index, 1);
            this.screenshots.splice(index, 1);
        },
        async takeScreenshot() {
            await this.$html2canvas(document.body, { type: "dataURL" })
                .then((screenshot) => {
                    this.bug.files.push(this.dataURItoBlob(screenshot));
                    this.screenshots.push(screenshot);
                });
        },
        submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return false;
            }

            let data = {
                title: this.bug.title,
                priority: this.bug.priority,
                current: this.bug.current,
                expected: this.bug.expected,
                reporter: this.reporter
            };

            const file = _.first(this.bug.files);

            if (file) {
                data.file = {
                    blob: file,
                    name: new Date().getTime()
                };
            }

            this.$pvBugtracker.reprotBug(data).then(() => this.$emit("close-modal"));
        },
        dataURItoBlob(dataURL) {
            let binary = atob(dataURL.split(",")[1]);
            let array = [];

            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }

            return new Blob([new Uint8Array(array)], {type: dataURL.match(/^data:(.*);/)[1]});
        }
    }
};
</script>
<style lang="scss" scoped>
    #bug-report-modal {
        .modal-body {
            background: #F6F7F7 !important;
            border-radius: 5px;
        }
    }

    .header {
       display: flex;
    }

    .delete-screenshot {
        right: 5px;
    }
</style>
