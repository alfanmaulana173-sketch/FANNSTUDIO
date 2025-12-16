import React from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImagesSelected: (images: ImageFile[]) => void;
  maxImages?: number;
  currentImages: ImageFile[];
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImagesSelected, 
  maxImages = 1, 
  currentImages,
  label = "Upload Input"
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);
      const remainingSlots = maxImages - currentImages.length;
      const filesToProcess = filesArray.slice(0, remainingSlots);

      if (filesToProcess.length === 0) return;

      const newImages: ImageFile[] = [];
      let processedCount = 0;

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push({
            file,
            preview: reader.result as string,
            base64: reader.result as string,
            mimeType: file.type
          });
          processedCount++;
          if (processedCount === filesToProcess.length) {
            onImagesSelected([...currentImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const updated = currentImages.filter((_, i) => i !== index);
    onImagesSelected(updated);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentImages.map((img, idx) => (
          <div key={idx} className="relative group cyber-border border border-cyber-gray overflow-hidden aspect-square bg-cyber-dark">
            <img src={img.preview} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 flex items-center justify-center font-bold z-10 hover:bg-red-500"
            >
              ×
            </button>
            <div className="absolute inset-0 bg-cyber-cyan/10 pointer-events-none"></div>
          </div>
        ))}
        
        {currentImages.length < maxImages && (
          <label className="relative flex flex-col items-center justify-center aspect-square border-2 border-dashed border-cyber-gray hover:border-cyber-cyan cursor-pointer group bg-cyber-dark/50 transition-colors">
            <div className="text-4xl text-cyber-gray group-hover:text-cyber-cyan mb-2">+</div>
            <span className="text-xs text-cyber-gray group-hover:text-cyber-cyan font-body uppercase tracking-widest text-center px-2">
              {label}<br/>({currentImages.length}/{maxImages})
            </span>
            <input 
              type="file" 
              accept="image/*" 
              multiple={maxImages > 1}
              onChange={handleFileChange}
              className="hidden" 
            />
          </label>
        )}
      </div>
    </div>
  );
};
