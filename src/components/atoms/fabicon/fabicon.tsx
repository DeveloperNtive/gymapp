'use client';

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import './fabicon.scss';

export default function FloatingActionButtons({ onClick }: { onClick: () => void }) {
    return (
        <Box className="floating-action-buttons" sx={{ '& > :not(style)': { m: 1 } }}>
            <Fab color='primary' variant="extended" onClick={onClick}>
                <AddIcon sx={{ mr: 1 }} />
                Crear Rutina
            </Fab>
        </Box>
    );
}
