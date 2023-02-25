import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


export default function  DetailDialog({open, closeDialog}) {
    return (
    <Dialog
        open={open}
        onClose={closeDialog}
    >
        <DialogTitle>Guest Booking Details</DialogTitle>
        <Button onClick={closeDialog}>Close</Button>
    </Dialog>
    )
}