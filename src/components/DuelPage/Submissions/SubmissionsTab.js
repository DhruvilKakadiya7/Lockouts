import React, { useEffect, useState } from 'react'
import DataBase, { getUID } from '../../../DataBase/DataBase';
import { TableLayout } from './TableLayout';

export const SubmissionsTab = ({
    statusOfDuel,
    duelId,
    isVisitor,
    problems,
    refresh,
    onRefresh,
}) => {
    const [loading, setLoading] = useState(true);
    let pre = []
    const [submissionData, setSubmissionData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            let data = await DataBase.getSubmissions(duelId);
            // console.log("subData2: ", data);
            if (!data) {
                data = []
            }
            
            // console.log("probs: ", problems);
            const uid = getUID();
            data = data.filter((obj) => obj.playerUid == uid)
            for (let i = 0; i < data.length; i++) {
                let currTime = new Date(data[i].submissionTime);
                let diff = currTime.toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
                data[i]['when'] = `${diff}`;
                data[i]['problem'] = problems[data[i].problemNumber]?.name;
                // console.log(data[i].status);
                const doc = new DOMParser().parseFromString(data[i].status.trim(), 'text/html');
                data[i]['verdict'] = doc.body.textContent || "";
            }
            data.reverse();
            while (data.length < 10) {
                const tempData = {
                    when: 'xxx',
                    problem: 'xxx',
                    verdict: 'xxx'
                }
                data.push(tempData);
            }
            // console.log("subData: ", data);
            setSubmissionData(data);
            // console.log(submissionData);
            setLoading(false);
        }
        if (refresh) {
            setLoading(true);
            getData();
            onRefresh();
        }
    }, [refresh, statusOfDuel, submissionData])
    return (
        <>
            {loading ?
                <></> :
                <TableLayout
                    submissionData={submissionData}
                    problems={problems}
                    isVisitor={isVisitor}
                    statusOfDuel={statusOfDuel}
                />
            }
        </>
    )
}
