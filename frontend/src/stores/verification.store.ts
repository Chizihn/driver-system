import { create } from "zustand";
import type { Driver, Document, VerificationResult } from "@/types";

interface VerificationState {
  currentDriver: Driver | null;
  currentDocument: Document | null;
  verificationResult: VerificationResult | null;
  setCurrentDriver: (driver: Driver | null) => void;
  setCurrentDocument: (document: Document | null) => void;
  setVerificationResult: (result: VerificationResult | null) => void;
  clearVerification: () => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  currentDriver: null,
  currentDocument: null,
  verificationResult: null,
  setCurrentDriver: (driver) => set({ currentDriver: driver }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  setVerificationResult: (result) => set({ verificationResult: result }),
  clearVerification: () =>
    set({
      currentDriver: null,
      currentDocument: null,
      verificationResult: null,
    }),
}));
