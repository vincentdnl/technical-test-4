import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useRef } from "react";
import { HiX } from "react-icons/hi";

export default function Modal({ isOpen, children, onClose, className }) {
  const cancelButtonRef = useRef();

  if (!isOpen) return <Fragment />;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-20" initialFocus={cancelButtonRef} open={isOpen} onClose={onClose}>
        <div className="min-h-screen px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <div className={`z-10 bg-white rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-screen overflow-y-auto ${className}`}>
              <div className="absolute cursor-pointer top-5 right-5">
                <HiX className="text-xl text-gray-500 transition-colors hover:text-red-500" onClick={onClose} />
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
