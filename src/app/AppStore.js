import { create } from 'zustand'

// const useBearStore = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
// }))

export const useCell = create((set)=>({
  alignValue: 'left',
  fontSizeVal: '14px',
  setAlignValue: (value) => set((state)=>({alignValue: value})),
  setFontSize: (value) => set((state)=>({fontSizeVal: value}))
}))

