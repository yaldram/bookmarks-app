import { useState } from "react";

export function useModal(initialState = false) {
  const [isModalOpen, setIsModalOpen] = useState(initialState);

  const toggleModal = () => {
    setIsModalOpen((modalState) => !modalState);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    toggleModal,
  };
}
