"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  dealIds: string[];
  onComplete: () => void;
}

export function AssignDialog({ open, onClose, dealIds, onComplete }: Props) {
  const [rep, setRep] = useState("");

  async function submit() {
    if (!rep) return;
    await fetch("/api/territories/assign", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ dealIds, newRep: rep }),
    });
    onComplete();
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6 space-y-4">
              <Dialog.Title className="text-lg font-medium">
                Reassign {dealIds.length} deal
                {dealIds.length > 1 && "s"}
              </Dialog.Title>

              <input
                type="text"
                placeholder="New rep name…"
                className="w-full rounded border px-3 py-2"
                value={rep}
                onChange={(e) => setRep(e.target.value)}
              />

              <div className="flex justify-end space-x-3 pt-2">
                <button className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button
                  className="btn-primary disabled:opacity-30"
                  disabled={!rep}
                  onClick={submit}
                >
                  Save
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

