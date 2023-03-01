import { DialogContentText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


export default function  DetailDialog({open, closeDialog, items}) {
    return (
    <Dialog
        open={open}
        onClose={closeDialog}
    >
        <DialogTitle>Guest Booking Details</DialogTitle>
        
        <DialogContentText>{items.guest_name}</DialogContentText>
        {/* <DialogContentText>{items.check_in_date.toString()}</DialogContentText>
        <DialogContentText>{items.check_out_date.toString()}</DialogContentText> */}
        <DialogContentText>{items.unit_name}</DialogContentText>

        <Button onClick={closeDialog}>Close</Button>
    </Dialog>
    )
}