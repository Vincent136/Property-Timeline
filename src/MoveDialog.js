import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';


export default function  MoveDialog({open, closeDialog}) {
    return (
    <Dialog
        open={open}
        onClose={closeDialog}
    >
        <DialogTitle>Are you sure?</DialogTitle>
        <Button onClick={closeDialog}>Yes</Button>
        <Button onClick={closeDialog}>No</Button>
    </Dialog>
    )
}