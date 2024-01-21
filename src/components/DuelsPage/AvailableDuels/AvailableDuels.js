import React, { useEffect, useMemo, useState } from 'react'
import { TableLayout } from './TableLayout';
import { useNavigate } from 'react-router-dom';
import DataBase from '../../../DataBase/DataBase';

export const AvailableDuels = ({
    availableDuels,
    loading
}) => {
    return (
        <>
            {loading ? <></> :
                <TableLayout
                    availableDuels={availableDuels}
                />
            }
        </>

    )
}
