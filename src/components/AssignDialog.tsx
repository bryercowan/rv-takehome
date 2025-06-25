"use client";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { Fragment } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AssignDialogProps {
  open: boolean;
  onClose: () => void;
  dealIds: string[];
  onComplete: () => void;
}

type FormValues = { rep: string };


export default function AssignDialog({ open, onClose, dealIds, onComplete }: AssignDialogProps) {
  const qc = useQueryClient();
  const { register, handleSubmit, formState, reset } = useForm<{ rep: string }>({
    defaultValues: { rep: "" },
  });

  async function onSubmit(values: { rep: string }) {
    toast.promise(
      fetch("/api/territories/assign", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dealIds, newRep: values.rep }),
      }),
      {
        loading: "Reassigning…",
        success: `Reassigned ${dealIds.length} deal${dealIds.length > 1 ? "s" : ""}`,
        error: "Failed to reassign",
      }
    ).then(() => {
      qc.invalidateQueries({ queryKey: ["deals"] });
      qc.invalidateQueries({ queryKey: ["territories"] });
      onComplete();
      reset();
    });
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-sm rounded bg-white shadow-md p-6 space-y-4 !text-black">
              <DialogTitle className="text-lg font-medium text-grey-900">
                Reassign {dealIds.length} deal{dealIds.length > 1 && "s"}
              </DialogTitle>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  {...register("rep", { required: true })}
                  placeholder="New rep name…"
                  className="w-full rounded border px-3 py-2"
                />
                {formState.errors.rep && (
                  <p className="text-sm text-red-600">Rep name is required</p>
                )}

                <div className="flex justify-end space-x-3 pt-1">
                  <button type="button" className="btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary disabled:opacity-30"
                    disabled={!dealIds.length || formState.isSubmitting}
                  >
                    Save
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
