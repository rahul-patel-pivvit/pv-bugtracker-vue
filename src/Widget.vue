<template>
    <div>
        <div
            class="d-flex justify-content-center rounded-circle bug-logo"
        >
            <b-img
                :src="bugLogo"
                width="50px"
                height="55px"
                class="cursor-pointer"
                @click="initBug()"
            ></b-img>
        </div>

        <bug-report
            v-if="showBugReport"
            :reporter="bugReporter"
            @close-modal="closeModal()"
        ></bug-report>
    </div>
</template>
<script>
import _ from "lodash";
import BugReport from "./BugReport";
export default {
    components: {
        BugReport
    },
    props: {
        reporter: {
            type: Object,
            required: true
        },
        bugLogo: {
            type: String,
            required: true
        }

    },
    data() {
        return {
            showBugReport: false
        };
    },
    computed: {
        bugReporter() {
            const data = _.pick(this.reporter, ["name", "email"]);

            if (!data.name) {
                data.name = this.reporter.fullName || _.join(_.pick(this.reporter, ["first_name", "last_name"]), " ");
            }

            return data;
        }
    },
    methods: {
        initBug() {
            this.showBugReport = true;
        },
        closeModal() {
            this.showBugReport = false;
        }
    }
};
</script>


<style lang="scss" scoped>
.bug-logo {
    background-color: #59CCF3;
    height: 55px;
    width: 55px;
    z-index: 3;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

    img {
        padding: 14px;
    }
}
</style>
