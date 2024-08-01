import { create } from 'zustand';

const useConversation = create((set) => ({

    TicketId: '',
    setTicketId: (id) => set({ TicketId: id }),
    resetTicketId: () => set({ TicketId: '' }), // Add this function

  amountT: 0.0,
  setAmountT: (amountT) => set({ amountT }),
}));
export default useConversation;
