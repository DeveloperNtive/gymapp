"use client";

import "./rest-stopwatch-modal.scss";

import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function formatMmSs(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export type RestStopwatchModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RestStopwatchModal({
  open,
  onClose,
}: RestStopwatchModalProps) {
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!open) {
      setElapsedSec(0);
      return;
    }
    setElapsedSec(0);
    const id = window.setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="rest-stopwatch-modal"
      aria-labelledby="rest-stopwatch-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        component="div"
        className="rest-stopwatch-modal__title-row"
        id="rest-stopwatch-title"
      >
        <Typography variant="h6" component="span" className="rest-stopwatch-modal__title">
          Descanso
        </Typography>
        <IconButton
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="rest-stopwatch-modal__content">
        <Typography
          className="rest-stopwatch-modal__clock"
          variant="h2"
          component="p"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatMmSs(elapsedSec)}
        </Typography>
        <Button
          type="button"
          variant="contained"
          disableElevation
          fullWidth
          className="rest-stopwatch-modal__cta"
          onClick={onClose}
        >
          Siguiente set
        </Button>
      </DialogContent>
    </Dialog>
  );
}
