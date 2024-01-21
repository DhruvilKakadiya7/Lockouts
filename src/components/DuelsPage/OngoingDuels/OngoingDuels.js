import React, { useEffect, useMemo, useState } from 'react'
import { TableLayout } from '../OngoingDuels/TableLayout';
import { useNavigate } from 'react-router-dom';
import DataBase from '../../../DataBase/DataBase';

export const OngoingDuels = ({
    ongoingDuels,
    loading
}) => {
    return (
        <>
            {loading ? <></> :
                <TableLayout
                    ongoingDuels={ongoingDuels}
                />
            }
        </>

    )
}
