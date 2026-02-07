"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 rounded-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="float-right text-red-500"
          onClick={onClose}
        >
          X
        </button>

        {children}
      </div>
    </div>
  );
}
