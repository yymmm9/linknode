import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LinkCreationState {
  destination?: string;
  customDomain?: string;
  shortLink?: string;
  tags?: string[];
}

export const LinkCreationStore = {
  setLinkData(data: LinkCreationState) {
    try {
      localStorage.setItem('link-creation-state', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save link creation state', error);
    }
  },

  getLinkData(): LinkCreationState {
    try {
      const storedData = localStorage.getItem('link-creation-state');
      return storedData ? JSON.parse(storedData) : {};
    } catch (error) {
      console.error('Failed to retrieve link creation state', error);
      return {};
    }
  },

  clearLinkData() {
    try {
      localStorage.removeItem('link-creation-state');
    } catch (error) {
      console.error('Failed to clear link creation state', error);
    }
  }
};
