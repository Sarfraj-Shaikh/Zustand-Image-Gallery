import { create } from "zustand";
import { persist } from "zustand/middleware";

const useGallery = create(persist((set) => ({

    images: [],
    addImage: (data) => set((state) => ({
        images: [...state.images, data],
    })),
    deleteAll: (data) => set((state) => ({
        images: [],
    })),
    deleteImage: (id) => set((state) => ({
        images: state.images.filter((img) => img.id !== id),
    })),

}), { name: "myGallery" }));

export default useGallery;