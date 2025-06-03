import React from "react";

import Notification from "../../components/Notification";
import ReportBugForm from "../../components/ReportBugForm";

function ReportBug(){
    return(
        <div className="content">
            <Notification/>
            <ReportBugForm/>
        </div>
    )
}
export default ReportBug;