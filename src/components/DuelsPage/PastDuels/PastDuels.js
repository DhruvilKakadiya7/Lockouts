import React, { useEffect, useMemo, useState } from 'react'
import { TableLayout } from './TableLayout';
import { useNavigate } from 'react-router-dom';
import DataBase from '../../../DataBase/DataBase';

export const PastDuels = ({
    pastDuels,
    loading
}) => {
    return (
        <>
            {loading ? <></> :
                <TableLayout
                    pastDuels={pastDuels}
                />
            }
        </>

    )
}
